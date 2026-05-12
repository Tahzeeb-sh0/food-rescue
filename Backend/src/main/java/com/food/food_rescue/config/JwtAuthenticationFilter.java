package com.food.food_rescue.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Extracts the Bearer JWT from the Authorization header, validates it,
 * and populates the Spring Security context with the authenticated principal.
 *
 * If the token is missing or invalid, the filter chain continues without
 * setting authentication — Spring Security's access rules then reject the
 * request with 401 (for protected endpoints) or allow it (for public ones).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.isValid(token)) {
                String userId = jwtUtil.extractUserId(token);
                String role   = jwtUtil.extractRole(token);

                // Build a Spring Security authority from the role stored in the token
                String authority = "ROLE_" + role; // e.g. ROLE_DONOR, ROLE_NGO
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                List.of(new SimpleGrantedAuthority(authority)));

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
            // Invalid token — leave SecurityContext empty; downstream rules return 401
        }

        filterChain.doFilter(request, response);
    }
}
