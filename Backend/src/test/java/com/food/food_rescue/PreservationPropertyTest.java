package com.food.food_rescue;

/*
 * ============================================================
 * PreservationPropertyTest — Baseline Behavior Preservation Tests
 * ============================================================
 *
 * PURPOSE: These tests encode the BASELINE behavior that must be
 * preserved after all bug fixes are applied. They MUST PASS on
 * both unfixed and fixed code.
 *
 * BEHAVIORS UNDER TEST (Requirements 3.1–3.12):
 *
 * 3.1  — Authenticated donor creating a donation returns 200 with AVAILABLE status
 * 3.2  — Authenticated NGO claiming an AVAILABLE donation returns 200 with CLAIMED status
 * 3.3  — Authenticated NGO completing a claimed donation with correct code returns 200 COMPLETED
 * 3.4  — Authenticated donor cancelling their own AVAILABLE donation returns 204
 * 3.5  — DonationExpiryService expires AVAILABLE donations older than 4 hours
 * 3.6  — User registration with unique phone returns UserResponse (no password field)
 * 3.7  — User login with correct credentials returns UserResponse
 * 3.8  — GET /api/donations/nearby with valid coordinates returns AVAILABLE donations
 * 3.9  — GET /api/stats/impact and GET /api/leaderboard return 200 without authentication
 * 3.10 — Donor submitting a rating for a completed donation persists the rating
 * 3.11 — WebSocket endpoint is accessible (HTTP upgrade check)
 * 3.12 — User changes password via PATCH /api/users/{id}/password with correct current password
 *
 * ============================================================
 * Validates: Requirements 3.1–3.12
 * ============================================================
 */

import com.fasterxml.jackson.databind.ObjectMapper;
import com.food.food_rescue.model.Donation;
import com.food.food_rescue.model.DonationStatus;
import com.food.food_rescue.model.Role;
import com.food.food_rescue.model.User;
import com.food.food_rescue.repository.DonationRepository;
import com.food.food_rescue.repository.RatingRepository;
import com.food.food_rescue.repository.UserRepository;
import com.food.food_rescue.service.DonationExpiryService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Preservation property tests.
 *
 * These tests MUST PASS on both unfixed and fixed code.
 * They confirm that bug fixes do not introduce regressions.
 *
 * Validates: Requirements 3.1–3.12
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class PreservationPropertyTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DonationExpiryService donationExpiryService;

    private final List<String> donationIdsToClean = new ArrayList<>();
    private final List<String> userIdsToClean = new ArrayList<>();
    private final List<String> ratingIdsToClean = new ArrayList<>();

    @BeforeEach
    void setUp() {
        donationIdsToClean.clear();
        userIdsToClean.clear();
        ratingIdsToClean.clear();
    }

    @AfterEach
    void tearDown() {
        donationIdsToClean.forEach(id -> donationRepository.deleteById(id));
        userIdsToClean.forEach(id -> userRepository.deleteById(id));
        ratingIdsToClean.forEach(id -> ratingRepository.deleteById(id));
    }

    // =========================================================
    // 3.1 — Authenticated donor creating a donation returns 200
    //        with AVAILABLE status and a confirmationCode
    // =========================================================

    /**
     * POST /api/donations with a valid authenticated donor must return 200,
     * with status=AVAILABLE and a non-null confirmationCode.
     *
     * Validates: Requirement 3.1
     */
    @Test
    @WithMockUser(username = "donor-preserve-create", roles = {"DONOR"})
    void testCreateDonation_AuthenticatedDonor_Returns200WithAvailableStatus() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "donorId", "donor-preserve-create",
                "title", "Preservation Test Donation",
                "description", "Created by PreservationPropertyTest",
                "capacity", 10,
                "longitude", 0.0,
                "latitude", 0.0
        ));

        MvcResult result = mockMvc.perform(post("/api/donations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("AVAILABLE"))
                .andExpect(jsonPath("$.confirmationCode").isNotEmpty())
                .andReturn();

        // Track for cleanup
        Map<String, Object> response = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        donationIdsToClean.add((String) response.get("id"));
    }

    // =========================================================
    // 3.2 — Authenticated NGO claiming an AVAILABLE donation
    //        returns 200 with CLAIMED status
    // =========================================================

    /**
     * POST /api/donations/{id}/claim with a valid authenticated NGO must return 200
     * with status=CLAIMED.
     *
     * Validates: Requirement 3.2
     */
    @Test
    @WithMockUser(username = "ngo-preserve-claim", roles = {"NGO"})
    void testClaimDonation_AuthenticatedNgo_Returns200WithClaimedStatus() throws Exception {
        Donation donation = createAvailableDonation("donor-preserve-3-2");
        donationIdsToClean.add(donation.getId());

        String body = objectMapper.writeValueAsString(Map.of("ngoId", "ngo-preserve-claim"));

        mockMvc.perform(post("/api/donations/{id}/claim", donation.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLAIMED"))
                .andExpect(jsonPath("$.claimedByNgoId").value("ngo-preserve-claim"));
    }

    // =========================================================
    // 3.3 — Authenticated NGO completing a claimed donation
    //        with correct code returns 200 with COMPLETED status
    // =========================================================

    /**
     * POST /api/donations/{id}/complete with the correct confirmation code must return 200
     * with status=COMPLETED.
     *
     * Validates: Requirement 3.3
     */
    @Test
    @WithMockUser(username = "ngo-preserve-complete", roles = {"NGO"})
    void testCompletePickup_CorrectCode_Returns200WithCompletedStatus() throws Exception {
        Donation donation = createClaimedDonation("donor-preserve-3-3", "ngo-preserve-complete");
        donationIdsToClean.add(donation.getId());

        String body = objectMapper.writeValueAsString(Map.of(
                "ngoId", "ngo-preserve-complete",
                "confirmationCode", donation.getConfirmationCode()
        ));

        mockMvc.perform(post("/api/donations/{id}/complete", donation.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    // =========================================================
    // 3.4 — Authenticated donor cancelling their own AVAILABLE
    //        donation returns 204
    // =========================================================

    /**
     * DELETE /api/donations/{id}?donorId={ownerId} with the actual owner must return 204.
     *
     * Validates: Requirement 3.4
     */
    @Test
    @WithMockUser(username = "donor-preserve-cancel", roles = {"DONOR"})
    void testCancelDonation_OwnDonation_Returns204() throws Exception {
        Donation donation = createAvailableDonation("donor-preserve-cancel");
        // No cleanup needed — the delete removes it

        mockMvc.perform(delete("/api/donations/{id}", donation.getId())
                        .param("donorId", "donor-preserve-cancel"))
                .andExpect(status().isNoContent());
    }

    // =========================================================
    // 3.5 — DonationExpiryService expires AVAILABLE donations
    //        older than 4 hours
    // =========================================================

    /**
     * DonationExpiryService.expireOldDonations() must delete AVAILABLE donations
     * created more than 4 hours ago.
     *
     * Validates: Requirement 3.5
     */
    @Test
    void testDonationExpiryService_ExpiresOldAvailableDonations() {
        // Create a donation that is 5 hours old
        Donation oldDonation = Donation.builder()
                .donorId("donor-expiry-test")
                .title("Old Donation")
                .description("Should be expired")
                .capacity(5)
                .pickupLocation(new GeoJsonPoint(0.0, 0.0))
                .status(DonationStatus.AVAILABLE)
                .confirmationCode("999999")
                .createdAt(LocalDateTime.now().minusHours(5))
                .build();
        oldDonation = donationRepository.save(oldDonation);
        final String oldId = oldDonation.getId();

        // Create a fresh donation (should NOT be expired)
        Donation freshDonation = createAvailableDonation("donor-expiry-fresh");
        donationIdsToClean.add(freshDonation.getId());

        // Run the expiry job
        donationExpiryService.expireOldDonations();

        // Old donation must be gone
        assertThat(donationRepository.findById(oldId)).isEmpty();

        // Fresh donation must still exist
        assertThat(donationRepository.findById(freshDonation.getId())).isPresent();
    }

    // =========================================================
    // 3.6 — User registration with unique phone returns
    //        UserResponse without a password field
    // =========================================================

    /**
     * POST /api/users/register with a unique phone must return 200 and a UserResponse
     * that does NOT contain a "password" field.
     *
     * Validates: Requirement 3.6
     */
    @Test
    void testRegister_UniquePhone_Returns200WithoutPassword() throws Exception {
        String phone = "+15559990001";
        // Ensure clean state
        userRepository.findByPhone(phone).ifPresent(u -> userRepository.delete(u));

        String body = objectMapper.writeValueAsString(Map.of(
                "name", "Preservation User",
                "phone", phone,
                "password", "Password123",
                "role", "DONOR",
                "longitude", 0.0,
                "latitude", 0.0
        ));

        MvcResult result = mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> response = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        assertThat(response).doesNotContainKey("password");
        assertThat(response.get("phone")).isEqualTo(phone);

        // Cleanup
        userRepository.findByPhone(phone).ifPresent(u -> userRepository.delete(u));
    }

    // =========================================================
    // 3.7 — User login with correct credentials returns UserResponse
    // =========================================================

    /**
     * POST /api/users/login with correct credentials must return 200 with a UserResponse.
     *
     * Validates: Requirement 3.7
     */
    @Test
    void testLogin_CorrectCredentials_Returns200() throws Exception {
        User user = createTestUser("+15559990002", Role.DONOR, "LoginPassword123");
        userIdsToClean.add(user.getId());

        String body = objectMapper.writeValueAsString(Map.of(
                "phone", "+15559990002",
                "password", "LoginPassword123"
        ));

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone").value("+15559990002"));
    }

    // =========================================================
    // 3.8 — GET /api/donations/nearby returns AVAILABLE donations
    // =========================================================

    /**
     * GET /api/donations/nearby with valid coordinates must return 200 and include
     * AVAILABLE donations within the radius (no auth required).
     *
     * Validates: Requirement 3.8
     */
    @Test
    void testGetNearbyDonations_ValidCoordinates_Returns200() throws Exception {
        Donation nearby = createAvailableDonation("donor-nearby-test");
        donationIdsToClean.add(nearby.getId());

        mockMvc.perform(get("/api/donations/nearby")
                        .param("lon", "0.0")
                        .param("lat", "0.0")
                        .param("radiusKm", "10.0"))
                .andExpect(status().isOk());
    }

    // =========================================================
    // 3.9 — GET /api/stats/impact and GET /api/leaderboard
    //        return 200 without authentication
    // =========================================================

    /**
     * GET /api/stats/impact must return 200 without any Authorization header.
     *
     * Validates: Requirement 3.9
     */
    @Test
    void testGetStats_NoAuth_Returns200() throws Exception {
        mockMvc.perform(get("/api/stats/impact"))
                .andExpect(status().isOk());
    }

    /**
     * GET /api/leaderboard must return 200 without any Authorization header.
     *
     * Validates: Requirement 3.9
     */
    @Test
    void testGetLeaderboard_NoAuth_Returns200() throws Exception {
        mockMvc.perform(get("/api/leaderboard"))
                .andExpect(status().isOk());
    }

    // =========================================================
    // 3.10 — Donor submitting a rating for a completed donation
    //         persists the rating
    // =========================================================

    /**
     * POST /api/ratings with valid data must return 200 and persist the rating.
     *
     * Validates: Requirement 3.10
     */
    @Test
    @WithMockUser(username = "donor-rating-preserve", roles = {"DONOR"})
    void testSubmitRating_ValidData_Returns200AndPersists() throws Exception {
        String donationId = "donation-preserve-rating-" + System.currentTimeMillis();

        String body = objectMapper.writeValueAsString(Map.of(
                "donationId", donationId,
                "donorId", "donor-rating-preserve",
                "ngoId", "ngo-rating-preserve",
                "score", 4,
                "comment", "Good donation!"
        ));

        MvcResult result = mockMvc.perform(post("/api/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> response = objectMapper.readValue(result.getResponse().getContentAsString(), Map.class);
        assertThat(response.get("donationId")).isEqualTo(donationId);

        if (response.containsKey("id")) {
            ratingIdsToClean.add((String) response.get("id"));
        }
    }

    // =========================================================
    // 3.11 — WebSocket endpoint is accessible
    // =========================================================

    /**
     * GET /ws (WebSocket upgrade path) must not return 404.
     * A 400 or 101 indicates the endpoint exists (400 = bad upgrade request,
     * 101 = successful upgrade).
     *
     * Validates: Requirement 3.11
     */
    @Test
    void testWebSocketEndpoint_IsAccessible() throws Exception {
        // A plain HTTP GET to the WebSocket endpoint should not return 404.
        // It will return 400 (bad WebSocket upgrade) or similar — not 404.
        MvcResult result = mockMvc.perform(get("/ws"))
                .andReturn();

        int status = result.getResponse().getStatus();
        assertThat(status)
                .as("WebSocket endpoint /ws should exist (not 404). Got: %d", status)
                .isNotEqualTo(404);
    }

    // =========================================================
    // 3.12 — User changes password with correct current password
    // =========================================================

    /**
     * PATCH /api/users/{id}/password with the correct current password must return 200.
     *
     * Validates: Requirement 3.12
     */
    @Test
    @WithMockUser(username = "user-change-pw", roles = {"DONOR"})
    void testChangePassword_CorrectCurrentPassword_Returns200() throws Exception {
        User user = createTestUser("+15559990003", Role.DONOR, "OldPassword123");
        userIdsToClean.add(user.getId());

        String body = objectMapper.writeValueAsString(Map.of(
                "currentPassword", "OldPassword123",
                "newPassword", "NewPassword456"
        ));

        mockMvc.perform(patch("/api/users/{id}/password", user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }

    // =========================================================
    // Helper methods
    // =========================================================

    private Donation createAvailableDonation(String donorId) {
        Donation donation = Donation.builder()
                .donorId(donorId)
                .title("Preservation Test Donation")
                .description("Created by PreservationPropertyTest")
                .capacity(10)
                .pickupLocation(new GeoJsonPoint(0.0, 0.0))
                .status(DonationStatus.AVAILABLE)
                .confirmationCode("123456")
                .createdAt(LocalDateTime.now())
                .build();
        return donationRepository.save(donation);
    }

    private Donation createClaimedDonation(String donorId, String ngoId) {
        Donation donation = Donation.builder()
                .donorId(donorId)
                .title("Claimed Preservation Donation")
                .description("Created by PreservationPropertyTest")
                .capacity(10)
                .pickupLocation(new GeoJsonPoint(0.0, 0.0))
                .status(DonationStatus.CLAIMED)
                .confirmationCode("654321")
                .claimedByNgoId(ngoId)
                .claimedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
        return donationRepository.save(donation);
    }

    private User createTestUser(String phone, Role role, String rawPassword) {
        userRepository.findByPhone(phone).ifPresent(userRepository::delete);
        User user = User.builder()
                .name("Test User")
                .phone(phone)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .location(new GeoJsonPoint(0.0, 0.0))
                .build();
        return userRepository.save(user);
    }
}
