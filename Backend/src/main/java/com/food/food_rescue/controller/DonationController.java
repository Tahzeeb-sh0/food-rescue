package com.food.food_rescue.controller;

import com.food.food_rescue.dto.ClaimRequest;
import com.food.food_rescue.dto.CompleteRequest;
import com.food.food_rescue.dto.DonationRequest;
import com.food.food_rescue.dto.UpdateDonationRequest;
import com.food.food_rescue.model.Donation;
import com.food.food_rescue.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<Donation> createDonation(@Valid @RequestBody DonationRequest request,
                                                    Authentication auth) {
        // Use the authenticated principal's id — ignore any donorId in the request body
        String donorId = auth.getName();
        Donation donation = Donation.builder()
                .donorId(donorId)
                .title(request.getTitle())
                .description(request.getDescription())
                .photoUrl(request.getPhotoUrl())
                .capacity(request.getCapacity())
                .pickupLocation(new GeoJsonPoint(request.getLongitude(), request.getLatitude()))
                .build();
        return ResponseEntity.ok(donationService.createDonation(donation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable String id) {
        return donationService.getDonationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Donation>> getNearbyDonations(
            @RequestParam double lon,
            @RequestParam double lat,
            @RequestParam(defaultValue = "5.0") double radiusKm) {
        return ResponseEntity.ok(donationService.getNearbyDonations(lon, lat, radiusKm));
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<Donation> claimDonation(@PathVariable String id,
                                                   @Valid @RequestBody ClaimRequest request,
                                                   Authentication auth) {
        // Verify the authenticated principal matches the ngoId in the request
        String principalId = auth.getName();
        if (!principalId.equals(request.getNgoId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(donationService.claimDonation(id, principalId));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Donation> completePickup(@PathVariable String id,
                                                    @Valid @RequestBody CompleteRequest request,
                                                    Authentication auth) {
        // Verify the authenticated principal is the claiming NGO
        String principalId = auth.getName();
        if (!principalId.equals(request.getNgoId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(donationService.completePickup(id, principalId, request.getConfirmationCode()));
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<Donation>> getDonationsByDonor(@PathVariable String donorId) {
        return ResponseEntity.ok(donationService.getDonationsByDonor(donorId));
    }

    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<Donation>> getClaimsByNgo(@PathVariable String ngoId) {
        return ResponseEntity.ok(donationService.getClaimsByNgo(ngoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelDonation(@PathVariable String id,
                                               Authentication auth) {
        // Extract donorId from JWT principal — not from query param
        donationService.cancelDonation(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Donation> updateDonation(@PathVariable String id,
                                                    @Valid @RequestBody UpdateDonationRequest request,
                                                    Authentication auth) {
        // Extract donorId from JWT principal — not from query param
        return ResponseEntity.ok(donationService.updateDonation(
                id, auth.getName(), request.getTitle(), request.getDescription(), request.getCapacity()));
    }
}
