package com.food.food_rescue.service;

import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.DonationStatus;
import com.food.food_rescue.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Automatically expires AVAILABLE donations that have not been claimed
 * within the configured window (default: 4 hours).
 *
 * Fix: use findByStatusAndCreatedAtBefore so the cutoff filter runs at the
 * database level (index-backed) instead of loading all AVAILABLE donations
 * into memory and filtering in Java.
 */
@Service
@RequiredArgsConstructor
public class DonationExpiryService {

    private static final Logger log = LoggerFactory.getLogger(DonationExpiryService.class);
    private static final int EXPIRY_HOURS = 4;

    private final DonationRepository donationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Runs every 15 minutes. Finds AVAILABLE donations older than EXPIRY_HOURS
     * and deletes them, broadcasting a cancellation event so connected NGO
     * dashboards remove the card in real time.
     */
    @Scheduled(fixedDelay = 15 * 60 * 1000)
    public void expireOldDonations() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(EXPIRY_HOURS);

        // DB-level filter — avoids loading all AVAILABLE donations into memory
        List<Donation> expired = donationRepository
                .findByStatusAndCreatedAtBefore(DonationStatus.AVAILABLE, cutoff);

        if (expired.isEmpty()) return;

        log.info("Expiring {} unclaimed donation(s) older than {} hours", expired.size(), EXPIRY_HOURS);

        for (Donation d : expired) {
            donationRepository.delete(d);
            // Notify connected clients so the card disappears from NGO dashboards
            messagingTemplate.convertAndSend("/topic/donations/cancelled", d.getId());
            log.info("Expired donation id={} title='{}'", d.getId(), d.getTitle());
        }
    }
}
