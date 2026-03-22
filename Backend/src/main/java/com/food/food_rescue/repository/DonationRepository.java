package com.food.food_rescue.repository;

import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.DonationStatus;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByStatus(DonationStatus status);
    
    // Find available donations near a given point
    List<Donation> findByStatusAndPickupLocationNear(DonationStatus status, Point location, Distance distance);
    
    List<Donation> findByDonorId(String donorId);
    
    List<Donation> findByClaimedByNgoId(String ngoId);
}
