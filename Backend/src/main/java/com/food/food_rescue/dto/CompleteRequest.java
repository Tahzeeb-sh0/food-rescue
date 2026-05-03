package com.food.food_rescue.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CompleteRequest {

    @NotBlank(message = "NGO ID is required")
    private String ngoId;

    @NotBlank(message = "Confirmation code is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Confirmation code must be 6 digits")
    private String confirmationCode;
}
