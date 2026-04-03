package com.food.food_rescue.dto;

import com.food.food_rescue.model.Role;
import lombok.Data;

@Data
public class UserRegistrationRequest {
    private String name;
    private String phone;
    private Role role;
    private String password;
    private Double longitude;
    private Double latitude;
}
