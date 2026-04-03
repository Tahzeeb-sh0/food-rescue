package com.food.food_rescue.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImpactStats {
    private long totalMeals;
    private long activeNgos;
    private double co2DivertedTons;
}
