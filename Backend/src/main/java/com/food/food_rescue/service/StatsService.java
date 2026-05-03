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
        // Use count query instead of loading all documents into memory
        long totalMeals = 0;
        Long sumResult = donationRepository.sumCapacityByStatus(DonationStatus.COMPLETED.name());
        if (sumResult != null) {
            totalMeals = sumResult;
        }

        long activeNgos = userRepository.countByRole(Role.NGO);

        // ~0.5 kg CO2 saved per meal diverted from landfill (WRAP estimate)
        double co2DivertedTons = totalMeals * 0.5 / 1000.0;

        return ImpactStats.builder()
                .totalMeals(totalMeals)
                .activeNgos(activeNgos)
                .co2DivertedTons(Math.round(co2DivertedTons * 10.0) / 10.0)
                .build();
    }
}
