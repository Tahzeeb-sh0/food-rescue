package com.food.food_rescue.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DonationRequest {

    @NotBlank(message = "Donor ID is required")
    private String donorId;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    private String photoUrl;

    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 100000, message = "Capacity value is unreasonably large")
    private int capacity;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0")
    private Double longitude;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0")
    private Double latitude;
}
