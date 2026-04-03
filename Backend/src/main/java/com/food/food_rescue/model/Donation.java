package com.food.food_rescue.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {
    @Id
    private String id;
    
    private String donorId;
    
    private String title;
    private String photoUrl;
    private int capacity; // e.g., "100 people"
    
    @GeoSpatialIndexed(type = org.springframework.data.mongodb.core.index.GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint pickupLocation;
    
    private DonationStatus status;
    
    private String claimedByNgoId; // The NGO who claimed it
    private String confirmationCode; // Code for NGO to confirm pickup with donor
    
    private LocalDateTime createdAt;
    private LocalDateTime claimedAt;
    private LocalDateTime completedAt;
    
    @Version
    private Long version; // Optimistic locking to handle concurrent claims
}
