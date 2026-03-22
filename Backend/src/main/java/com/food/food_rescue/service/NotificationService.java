package com.food.food_rescue.service;

import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    // private static final String TWILIO_ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    // private static final String TWILIO_AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");
    // private static final String TWILIO_PHONE_NUMBER = System.getenv("TWILIO_PHONE_NUMBER");

    // public NotificationService() {
    //    Twilio.init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    // }

    public void sendPushAndSmsToNgos(Donation donation, List<User> nearbyNgos) {
        // Implement the SMS broadcast logic here natively for when the Twilio API keys are configured.
        for (User ngo : nearbyNgos) {
            System.out.println("--> [SMS MOCK] Sending SMS to NGO " + ngo.getName() + " at " + ngo.getPhone());
            System.out.println("    Message: 'URGENT: New food rescue available nearby! Claim it quickly. Capacity: " + donation.getCapacity() + " people.'");

            // Actual Twilio implementation (uncomment when keys are provided):
            /*
            Message.creator(
                new com.twilio.type.PhoneNumber(ngo.getPhone()),
                new com.twilio.type.PhoneNumber(TWILIO_PHONE_NUMBER),
                "URGENT: New food rescue available nearby! Claim it quickly. Capacity: " + donation.getCapacity() + " people."
            ).create();
            */

             // Mocking Push Notification via Firebase Cloud Messaging (FCM)
             System.out.println("--> [PUSH MOCK] Firing FCM Push Notification to device token: " + ngo.getPushToken() + "...");
        }
    }
}
