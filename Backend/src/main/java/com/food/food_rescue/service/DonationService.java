package com.food.food_rescue.service;

import com.food.food_rescue.model.User;
import com.food.food_rescue.repository.UserRepository;
import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.DonationStatus;
import com.food.food_rescue.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DonationService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DonationService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    public Donation createDonation(Donation donation) {
        donation.setStatus(DonationStatus.AVAILABLE);
        donation.setCreatedAt(LocalDateTime.now());
        donation.setConfirmationCode(generateConfirmationCode());
        Donation savedDonation = donationRepository.save(donation);
        
        // Notify nearby NGOs using WebSocket (Real-time UI)
        messagingTemplate.convertAndSend("/topic/donations/new", savedDonation);
        
        // Find NGOs within 10km to send SMS/Push
        if (donation.getPickupLocation() != null) {
            Point point = new Point(donation.getPickupLocation().getX(), donation.getPickupLocation().getY());
            Distance distance = new Distance(10, Metrics.KILOMETERS);
            List<User> nearbyNgos = userRepository.findByRoleAndLocationNear(com.food.food_rescue.model.Role.NGO, point, distance);
            
            // Trigger Push/SMS Notifications
            notificationService.sendPushAndSmsToNgos(savedDonation, nearbyNgos);
        }

        return savedDonation;
    }

    public List<Donation> getNearbyDonations(double lon, double lat, double radiusKm) {
        Point location = new Point(lon, lat);
        Distance distance = new Distance(radiusKm, Metrics.KILOMETERS);
        return donationRepository.findByStatusAndPickupLocationNear(DonationStatus.AVAILABLE, location, distance);
    }

    public Donation claimDonation(String donationId, String ngoId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new RuntimeException("Donation is already claimed or not available");
        }

        donation.setStatus(DonationStatus.CLAIMED);
        donation.setClaimedByNgoId(ngoId);
        donation.setClaimedAt(LocalDateTime.now());

        // Optimistic locking handles the race condition here
        Donation savedDonation = donationRepository.save(donation);
        
        // Broadcast the claim status
        messagingTemplate.convertAndSend("/topic/donations/claimed", savedDonation);

        return savedDonation;
    }

    public Donation completePickup(String donationId, String ngoId, String confirmationCode) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (donation.getStatus() != DonationStatus.CLAIMED) {
            throw new RuntimeException("Donation is not in CLAIMED state");
        }
        
        if (!ngoId.equals(donation.getClaimedByNgoId())) {
            throw new RuntimeException("Only the claiming NGO can complete the pickup");
        }

        if (!confirmationCode.equals(donation.getConfirmationCode())) {
            throw new RuntimeException("Invalid confirmation code");
        }

        donation.setStatus(DonationStatus.COMPLETED);
        donation.setCompletedAt(LocalDateTime.now());
        Donation savedDonation = donationRepository.save(donation);
        
        messagingTemplate.convertAndSend("/topic/donations/completed", savedDonation);
        
        return savedDonation;
    }

    public Optional<Donation> getDonationById(String donationId) {
        return donationRepository.findById(donationId);
    }

    public List<Donation> getDonationsByDonor(String donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    public List<Donation> getClaimsByNgo(String ngoId) {
        return donationRepository.findByClaimedByNgoId(ngoId);
    }

    public void cancelDonation(String donationId, String donorId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (!donorId.equals(donation.getDonorId())) {
            throw new RuntimeException("Only the donor can cancel this donation");
        }

        if (donation.getStatus() == DonationStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed donation");
        }

        donationRepository.delete(donation);
        messagingTemplate.convertAndSend("/topic/donations/cancelled", donationId);
    }

    private String generateConfirmationCode() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }
}
