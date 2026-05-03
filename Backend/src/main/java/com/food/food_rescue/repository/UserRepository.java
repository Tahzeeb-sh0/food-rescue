package com.food.food_rescue.repository;

import com.food.food_rescue.model.User;
import com.food.food_rescue.model.Role;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    List<User> findByRole(Role role);
    Optional<User> findByPhone(String phone);
    long countByRole(Role role);

    // Find NGOs near a given point within a certain distance
    List<User> findByRoleAndLocationNear(Role role, Point location, Distance distance);
}
