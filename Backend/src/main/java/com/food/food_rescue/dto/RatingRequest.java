package com.food.food_rescue.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RatingRequest {

    @NotBlank(message = "Donation ID is required")
    private String donationId;

    @NotBlank(message = "Donor ID is required")
    private String donorId;

    @NotBlank(message = "NGO ID is required")
    private String ngoId;

    @Min(1) @Max(5)
    private int score;

    @Size(max = 500)
    private String comment;
}
