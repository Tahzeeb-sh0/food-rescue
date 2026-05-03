package com.food.food_rescue.dto;

import com.food.food_rescue.model.Role;
import com.food.food_rescue.model.User;
import lombok.Data;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

@Data
public class UserResponse {
    private String id;
    private String name;
    private String phone;
    private Role role;
    private GeoJsonPoint location;

    public static UserResponse from(User user) {
        UserResponse r = new UserResponse();
        r.setId(user.getId());
        r.setName(user.getName());
        r.setPhone(user.getPhone());
        r.setRole(user.getRole());
        r.setLocation(user.getLocation());
        return r;
    }
}
