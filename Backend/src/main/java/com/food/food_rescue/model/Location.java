package com.food.food_rescue.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    private String type = "Point";
    private double[] coordinates; // [longitude, latitude]

    public Location(double longitude, double latitude) {
        this.type = "Point";
        this.coordinates = new double[]{longitude, latitude};
    }
}
