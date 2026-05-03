package com.food.food_rescue.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateDonationRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200)
    private String title;

    @Size(max = 500)
    private String description;

    @Min(1) @Max(100000)
    private int capacity;
}
