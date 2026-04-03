package com.food.food_rescue.service;

import com.food.food_rescue.dto.ImpactStats;
import com.food.food_rescue.model.DonationStatus;
import com.food.food_rescue.model.Role;
import com.food.food_rescue.repository.DonationRepository;
import com.food.food_rescue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public ImpactStats getImpactStats() {
        long completedDonations = donationRepository.findAll().stream()
                .filter(d -> d.getStatus() == DonationStatus.COMPLETED)
                .count();

        // Assume each donation capacity represents meals
        long totalMeals = donationRepository.findAll().stream()
                .filter(d -> d.getStatus() == DonationStatus.COMPLETED)
                .mapToLong(d -> d.getCapacity())
                .sum();

        long activeNgos = userRepository.findByRole(Role.NGO).size();

        // 1 ton of CO2 is roughly diverted per 500 meals (simplified metric for NGO context)
        double co2DivertedTons = (totalMeals / 500.0);

        return ImpactStats.builder()
                .totalMeals(totalMeals)
                .activeNgos(activeNgos)
                .co2DivertedTons(Math.round(co2DivertedTons * 10.0) / 10.0) // 1 decimal place
                .build();
    }
}
