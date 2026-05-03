package com.food.food_rescue.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    // Bio and website are stored client-side only for now (no DB column)
    // but we accept them so the frontend can send a single request
    @Size(max = 500)
    private String bio;

    @Size(max = 200)
    private String website;
}
