package com.food.food_rescue.service;

import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void sendPushAndSmsToNgos(Donation donation, List<User> nearbyNgos) {
        for (User ngo : nearbyNgos) {
            // SMS mock — replace with Twilio when keys are configured
            log.info("[SMS MOCK] Sending SMS to NGO id={}", ngo.getId());

            // Push notification mock — replace with FCM when configured
            log.info("[PUSH MOCK] Firing FCM push to NGO id={}", ngo.getId());
        }
    }
}
