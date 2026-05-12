package com.food.food_rescue.service;

import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Notification dispatch service.
 *
 * Currently uses log-based mocks for SMS (Twilio) and push (FCM).
 * Replace the mock blocks with real SDK calls once credentials are configured.
 *
 * Fixes applied:
 *  - Null-guard on pushToken before attempting push dispatch.
 *  - Log messages include donation title and NGO phone for traceability.
 *  - Skipped NGOs (no push token) are counted and reported in a summary log.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void sendPushAndSmsToNgos(Donation donation, List<User> nearbyNgos) {
        if (nearbyNgos == null || nearbyNgos.isEmpty()) {
            log.info("[NOTIFY] No nearby NGOs found for donation id={} title='{}'",
                    donation.getId(), donation.getTitle());
            return;
        }

        int smsSent = 0;
        int pushSent = 0;
        int pushSkipped = 0;

        for (User ngo : nearbyNgos) {
            // ── SMS ──────────────────────────────────────────────────────────
            // Replace with Twilio MessageCreator when TWILIO_* env vars are set.
            if (ngo.getPhone() != null && !ngo.getPhone().isBlank()) {
                log.info("[SMS MOCK] To NGO id={} phone={} | Donation: '{}' ({})",
                        ngo.getId(), ngo.getPhone(), donation.getTitle(), donation.getId());
                smsSent++;
            } else {
                log.warn("[SMS SKIP] NGO id={} has no phone number registered", ngo.getId());
            }

            // ── Push notification ────────────────────────────────────────────
            // Replace with FCM Admin SDK send() when GOOGLE_APPLICATION_CREDENTIALS is set.
            // Guard: only attempt push if the NGO has a registered device token.
            if (ngo.getPushToken() != null && !ngo.getPushToken().isBlank()) {
                log.info("[PUSH MOCK] To NGO id={} token={}... | Donation: '{}' ({})",
                        ngo.getId(),
                        ngo.getPushToken().substring(0, Math.min(8, ngo.getPushToken().length())),
                        donation.getTitle(), donation.getId());
                pushSent++;
            } else {
                log.debug("[PUSH SKIP] NGO id={} has no push token — skipping FCM dispatch", ngo.getId());
                pushSkipped++;
            }
        }

        log.info("[NOTIFY SUMMARY] donation='{}' | SMS sent={} | Push sent={} | Push skipped (no token)={}",
                donation.getTitle(), smsSent, pushSent, pushSkipped);
    }
}
