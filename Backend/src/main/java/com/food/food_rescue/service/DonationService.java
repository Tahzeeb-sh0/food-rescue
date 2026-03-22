package com.food.food_rescue.service;

import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.DonationStatus;
import com.food.food_rescue.model.Location;
import com.food.food_rescue.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    public Donation createDonation(Donation donation) {
        donation.setStatus(DonationStatus.AVAILABLE);
        donation.setCreatedAt(LocalDateTime.now());
        donation.setConfirmationCode(generateConfirmationCode());
        Donation savedDonation = donationRepository.save(donation);
        
        // Notify nearby NGOs using WebSocket (Real-time UI)
        messagingTemplate.convertAndSend("/topic/donations/new", savedDonation);
        
        // Trigger Push/SMS Notifications to nearby NGOs via Twilio/FCM mapping
        // (In a real scenario, we would pull the nearby NGO list from UserRepository)
        notificationService.sendPushAndSmsToNgos(savedDonation, java.util.List.of());

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
        // If two threads execute this simultaneously, the second one will throw OptimisticLockingFailureException
        Donation savedDonation = donationRepository.save(donation);
        
        // Broadcast the claim status to `/topic/donations/claimed` so everyone's UI updates
        messagingTemplate.convertAndSend("/topic/donations/claimed", savedDonation);

        return savedDonation;
    }

    public Donation completePickup(String donationId, String ngoId, String confirmationCode) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (donation.getStatus() != DonationStatus.CLAIMED) {
            throw new RuntimeException("Donation is not in CLAIMED state");
        }
        
        if (!donation.getClaimedByNgoId().equals(ngoId)) {
            throw new RuntimeException("Only the claiming NGO can complete the pickup");
        }

        if (!donation.getConfirmationCode().equals(confirmationCode)) {
            throw new RuntimeException("Invalid confirmation code");
        }

        donation.setStatus(DonationStatus.COMPLETED);
        donation.setCompletedAt(LocalDateTime.now());
        Donation savedDonation = donationRepository.save(donation);
        
        messagingTemplate.convertAndSend("/topic/donations/completed", savedDonation);
        
        return savedDonation;
    }

    private String generateConfirmationCode() {
        // Generates a simple 6-digit code
        return String.format("%06d", (int)(Math.random() * 1000000));
    }
}
