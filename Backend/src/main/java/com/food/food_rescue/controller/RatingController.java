package com.food.food_rescue.controller;

import com.food.food_rescue.dto.RatingRequest;
import com.food.food_rescue.model.Rating;
import com.food.food_rescue.repository.RatingRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingRepository ratingRepository;

    @PostMapping
    public ResponseEntity<Rating> submitRating(@Valid @RequestBody RatingRequest request) {
        // Prevent duplicate ratings for the same donation
        if (ratingRepository.findByDonationId(request.getDonationId()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        Rating rating = Rating.builder()
                .donationId(request.getDonationId())
                .donorId(request.getDonorId())
                .ngoId(request.getNgoId())
                .score(request.getScore())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(ratingRepository.save(rating));
    }

    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<Rating>> getNgoRatings(@PathVariable String ngoId) {
        return ResponseEntity.ok(ratingRepository.findByNgoId(ngoId));
    }

    @GetMapping("/ngo/{ngoId}/average")
    public ResponseEntity<Map<String, Object>> getNgoAverageRating(@PathVariable String ngoId) {
        List<Rating> ratings = ratingRepository.findByNgoId(ngoId);
        if (ratings.isEmpty()) {
            return ResponseEntity.ok(Map.of("average", 0.0, "count", 0));
        }
        double avg = ratings.stream().mapToInt(Rating::getScore).average().orElse(0.0);
        return ResponseEntity.ok(Map.of(
                "average", Math.round(avg * 10.0) / 10.0,
                "count", ratings.size()
        ));
    }
}
