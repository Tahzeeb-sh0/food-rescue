package com.food.food_rescue.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration.
 * CORS is handled at the Spring Security level in SecurityConfig
 * to ensure preflight OPTIONS requests pass auth checks correctly.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS configured in SecurityConfig.corsConfigurationSource()
}
