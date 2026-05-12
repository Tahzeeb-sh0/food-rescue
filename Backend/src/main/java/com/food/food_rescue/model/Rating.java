package com.food.food_rescue.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

// Unique index prevents a donor from rating the same donation twice,
// even under concurrent requests.
@Document(collection = "ratings")
@CompoundIndex(name = "unique_donation_rating", def = "{'donationId': 1, 'donorId': 1}", unique = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {
    @Id
    private String id;

    private String donationId;
    private String donorId;
    private String ngoId;

    private int score; // 1 to 5
    private String comment;

    private LocalDateTime createdAt;
}
