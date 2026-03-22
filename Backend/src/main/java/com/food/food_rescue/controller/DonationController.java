package com.food.food_rescue.controller;

import com.food.food_rescue.dto.ClaimRequest;
import com.food.food_rescue.dto.CompleteRequest;
import com.food.food_rescue.model.Donation;
import com.food.food_rescue.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Allow Vite frontend
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        return ResponseEntity.ok(donationService.createDonation(donation));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Donation>> getNearbyDonations(
            @RequestParam double lon,
            @RequestParam double lat,
            @RequestParam(defaultValue = "5.0") double radiusKm) {
        return ResponseEntity.ok(donationService.getNearbyDonations(lon, lat, radiusKm));
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<Donation> claimDonation(@PathVariable String id, @RequestBody ClaimRequest request) {
        try {
            Donation claimedDonation = donationService.claimDonation(id, request.getNgoId());
            return ResponseEntity.ok(claimedDonation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Simple error handling wrapper for now
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Donation> completePickup(@PathVariable String id, @RequestBody CompleteRequest request) {
        try {
            Donation completedDonation = donationService.completePickup(id, request.getNgoId(), request.getConfirmationCode());
            return ResponseEntity.ok(completedDonation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
