package com.food.food_rescue.controller;

import com.food.food_rescue.dto.ContactRequest;
import com.food.food_rescue.model.Contact;
import com.food.food_rescue.repository.ContactRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactRepository contactRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody ContactRequest request) {
        Contact contact = Contact.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .submittedAt(LocalDateTime.now())
                .build();

        contactRepository.save(contact);
        log.info("Contact form submitted from email={}", request.getEmail());

        return ResponseEntity.ok(Map.of("message", "Your message has been received. We'll get back to you within 24 hours."));
    }
}
