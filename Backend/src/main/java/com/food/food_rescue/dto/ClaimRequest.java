package com.food.food_rescue.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClaimRequest {

    @NotBlank(message = "NGO ID is required")
    private String ngoId;
}
