package com.food.food_rescue.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\+?[0-9 ()\\-]{7,20}$", message = "Invalid phone number format")
    private String phone;
}
