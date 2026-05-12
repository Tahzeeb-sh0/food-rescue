package com.food.food_rescue.repository;

import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.DonationStatus;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByStatus(DonationStatus status);

    // Used by DonationExpiryService — filters at DB level, avoids full collection scan
    List<Donation> findByStatusAndCreatedAtBefore(DonationStatus status, LocalDateTime cutoff);

    List<Donation> findByStatusAndPickupLocationNear(DonationStatus status, Point location, Distance distance);

    List<Donation> findByDonorId(String donorId);

    List<Donation> findByClaimedByNgoId(String ngoId);

    long countByStatus(DonationStatus status);

    @Aggregation(pipeline = {
        "{ $match: { status: ?0 } }",
        "{ $group: { _id: null, total: { $sum: '$capacity' } } }"
    })
    Long sumCapacityByStatus(String status);
}
