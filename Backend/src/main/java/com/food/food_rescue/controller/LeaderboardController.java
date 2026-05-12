package com.food.food_rescue.controller;

import com.food.food_rescue.dto.LeaderboardEntry;
import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.DonationStatus;
import com.food.food_rescue.model.User;
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

        // Group completed donations by NGO id
        Map<String, List<Donation>> byNgo = donationRepository
                .findByStatus(DonationStatus.COMPLETED)
                .stream()
                .filter(d -> d.getClaimedByNgoId() != null)
                .collect(Collectors.groupingBy(Donation::getClaimedByNgoId));

        // Batch-load all NGO users in one query — avoids N+1 findById calls
        Map<String, String> ngoNames = userRepository
                .findAllById(byNgo.keySet())
                .stream()
                .collect(Collectors.toMap(User::getId, User::getName));

        return byNgo.entrySet().stream()
                .map(entry -> {
                    String ngoId = entry.getKey();
                    List<Donation> donations = entry.getValue();
                    long totalMeals = donations.stream().mapToLong(Donation::getCapacity).sum();
                    long pickups = donations.size();
                    double co2Kg = totalMeals * 0.5; // 0.5 kg CO2 per meal (WRAP estimate)
                    String name = ngoNames.getOrDefault(ngoId, "Unknown NGO");
                    return new LeaderboardEntry(ngoId, name, totalMeals, pickups, co2Kg);
                })
                .sorted(Comparator.comparingLong(LeaderboardEntry::getTotalMeals).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
}
