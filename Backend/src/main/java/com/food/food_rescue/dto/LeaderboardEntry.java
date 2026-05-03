package com.food.food_rescue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntry {
    private String ngoId;
    private String ngoName;
    private long totalMeals;
    private long completedPickups;
    private double co2SavedKg;
}
