package com.food.food_rescue.controller;

import com.food.food_rescue.dto.LeaderboardEntry;
import com.food.food_rescue.model.DonationStatus;
import com.food.food_rescue.model.Role;
import com.food.food_rescue.repository.DonationRepository;
import com.food.food_rescue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {

        // Get all completed donations grouped by NGO
        Map<String, List<com.food.food_rescue.model.Donation>> byNgo =
                donationRepository.findByStatus(DonationStatus.COMPLETED)
                        .stream()
                        .filter(d -> d.getClaimedByNgoId() != null)
                        .collect(Collectors.groupingBy(
                                com.food.food_rescue.model.Donation::getClaimedByNgoId));

        // Build leaderboard entries
        return byNgo.entrySet().stream()
                .map(entry -> {
                    String ngoId = entry.getKey();
                    List<com.food.food_rescue.model.Donation> donations = entry.getValue();
                    long totalMeals = donations.stream().mapToLong(d -> d.getCapacity()).sum();
                    long pickups = donations.size();
                    double co2 = totalMeals * 0.5; // 0.5 kg CO2 per meal

                    String name = userRepository.findById(ngoId)
                            .map(com.food.food_rescue.model.User::getName)
                            .orElse("Unknown NGO");

                    return new LeaderboardEntry(ngoId, name, totalMeals, pickups, co2);
                })
                .sorted(Comparator.comparingLong(LeaderboardEntry::getTotalMeals).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
}
