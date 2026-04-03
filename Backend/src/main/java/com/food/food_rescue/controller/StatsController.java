package com.food.food_rescue.controller;

import com.food.food_rescue.dto.ImpactStats;
import com.food.food_rescue.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/impact")
    public ImpactStats getImpactStats() {
        return statsService.getImpactStats();
    }
}
