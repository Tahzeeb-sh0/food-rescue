package com.food.food_rescue.repository;

import com.food.food_rescue.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByNgoId(String ngoId);
    List<Rating> findByDonorId(String donorId);
    Optional<Rating> findByDonationId(String donationId);
}
