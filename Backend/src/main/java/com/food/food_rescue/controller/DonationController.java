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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<Donation> createDonation(@Valid @RequestBody DonationRequest request) {
        Donation donation = Donation.builder()
                .donorId(request.getDonorId())
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
                                                   @Valid @RequestBody ClaimRequest request) {
        return ResponseEntity.ok(donationService.claimDonation(id, request.getNgoId()));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Donation> completePickup(@PathVariable String id,
                                                    @Valid @RequestBody CompleteRequest request) {
        return ResponseEntity.ok(donationService.completePickup(id, request.getNgoId(), request.getConfirmationCode()));
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
                                               @RequestParam String donorId) {
        donationService.cancelDonation(id, donorId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Donation> updateDonation(@PathVariable String id,
                                                    @RequestParam String donorId,
                                                    @Valid @RequestBody UpdateDonationRequest request) {
        return ResponseEntity.ok(donationService.updateDonation(id, donorId, request.getTitle(), request.getDescription(), request.getCapacity()));
    }
}
