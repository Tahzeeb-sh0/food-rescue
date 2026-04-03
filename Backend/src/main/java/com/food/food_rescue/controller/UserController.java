package com.food.food_rescue.controller;

import com.food.food_rescue.dto.LoginRequest;
import com.food.food_rescue.dto.UserRegistrationRequest;
import com.food.food_rescue.model.User;
import com.food.food_rescue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/ngos")
    public ResponseEntity<List<User>> getAllNgos() {
        return ResponseEntity.ok(userRepository.findByRole(com.food.food_rescue.model.Role.NGO));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRegistrationRequest request) {
        GeoJsonPoint point = new GeoJsonPoint(request.getLongitude(), request.getLatitude());

        User user = User.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .password(request.getPassword())
                .role(request.getRole())
                .location(point)
                .build();

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        return userRepository.findByPhone(request.getPhone())
                .filter(u -> u.getPassword().equals(request.getPassword()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody LoginRequest request) {
        // Mock: In a real app, send OTP/Email here
        return userRepository.findByPhone(request.getPhone())
                .map(u -> ResponseEntity.ok("OTP sent to verified phone number."))
                .orElse(ResponseEntity.status(404).body("Organization not found."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody UserRegistrationRequest request) {
        return userRepository.findByPhone(request.getPhone())
                .map(u -> {
                    u.setPassword(request.getPassword());
                    userRepository.save(u);
                    return ResponseEntity.ok("Password updated successfully.");
                })
                .orElse(ResponseEntity.status(404).body("User not found."));
    }
}
