package com.food.food_rescue.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String phone;
    private String password; // Using phone as unique identifier for now
}
