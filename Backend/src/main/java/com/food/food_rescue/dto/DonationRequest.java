package com.food.food_rescue.dto;

import lombok.Data;

@Data
public class DonationRequest {
    private String donorId;
    private String title;
    private String photoUrl;
    private int capacity;
    private Double longitude;
    private Double latitude;
}
