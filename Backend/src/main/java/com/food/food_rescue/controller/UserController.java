package com.food.food_rescue.controller;

import com.food.food_rescue.dto.ChangePasswordRequest;
import com.food.food_rescue.dto.LoginRequest;
import com.food.food_rescue.dto.ResetPasswordRequest;
import com.food.food_rescue.dto.UpdateProfileRequest;
import com.food.food_rescue.dto.UserRegistrationRequest;
import com.food.food_rescue.dto.UserResponse;
import com.food.food_rescue.model.User;
import com.food.food_rescue.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/ngos")
    public ResponseEntity<List<UserResponse>> getAllNgos() {
        List<UserResponse> ngos = userRepository.findByRole(com.food.food_rescue.model.Role.NGO)
                .stream().map(UserResponse::from).toList();
        return ResponseEntity.ok(ngos);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationRequest request) {
        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            return ResponseEntity.badRequest().body("Phone number already registered.");
        }

        GeoJsonPoint point = new GeoJsonPoint(request.getLongitude(), request.getLatitude());

        User user = User.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .location(point)
                .build();

        User saved = userRepository.save(user);
        log.info("New user registered: role={}", saved.getRole());
        return ResponseEntity.ok(UserResponse.from(saved));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return userRepository.findByPhone(request.getPhone())
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPassword()))
                .map(u -> ResponseEntity.ok(UserResponse.from(u)))
                .orElse(ResponseEntity.status(401).build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable String id,
                                           @Valid @RequestBody UpdateProfileRequest request) {
        return userRepository.findById(id)
                .map(u -> {
                    u.setName(request.getName());
                    userRepository.save(u);
                    return (ResponseEntity<?>) ResponseEntity.ok(UserResponse.from(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<String> changePassword(@PathVariable String id,
                                                  @Valid @RequestBody ChangePasswordRequest request) {
        return userRepository.findById(id)
                .map(u -> {
                    if (!passwordEncoder.matches(request.getCurrentPassword(), u.getPassword())) {
                        return ResponseEntity.status(401).<String>body("Current password is incorrect.");
                    }
                    u.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    userRepository.save(u);
                    log.info("Password changed for user id={}", id);
                    return ResponseEntity.ok("Password updated successfully.");
                })
                .orElse(ResponseEntity.status(404).<String>body("User not found."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody LoginRequest request) {
        // Always return the same message to prevent phone enumeration
        userRepository.findByPhone(request.getPhone()).ifPresent(u ->
            log.info("Password reset requested for user id={}", u.getId())
            // TODO: send OTP via SMS when Twilio is configured
        );
        return ResponseEntity.ok("If that phone number is registered, an OTP has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return userRepository.findByPhone(request.getPhone())
                .map(u -> {
                    u.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    userRepository.save(u);
                    return ResponseEntity.ok("Password updated successfully.");
                })
                .orElse(ResponseEntity.status(404).<String>body("User not found."));
    }
}
