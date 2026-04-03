package com.food.food_rescue.repository;

import com.food.food_rescue.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByDonationIdOrderByTimestampAsc(String donationId);
}
