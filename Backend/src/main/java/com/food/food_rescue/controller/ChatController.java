package com.food.food_rescue.controller;

import com.food.food_rescue.model.ChatMessage;
import com.food.food_rescue.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatRepository chatRepository;

    @MessageMapping("/chat/{donationId}")
    @SendTo("/topic/chat/{donationId}")
    public ChatMessage sendMessage(@DestinationVariable String donationId, ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        return chatRepository.save(message);
    }

    @GetMapping("/api/chat/{donationId}/history")
    @ResponseBody
    public List<ChatMessage> getChatHistory(@PathVariable String donationId) {
        return chatRepository.findByDonationIdOrderByTimestampAsc(donationId);
    }
}
