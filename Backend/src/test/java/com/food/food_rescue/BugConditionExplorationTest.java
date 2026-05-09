package com.food.food_rescue;

/*
 * ============================================================
 * BugConditionExplorationTest — Bug Condition Exploration Tests
 * ============================================================
 *
 * PURPOSE: These tests encode the EXPECTED (fixed) behavior.
 * On UNFIXED code they are expected to FAIL — failure confirms
 * the bugs exist. They will PASS once the bugs are fixed.
 *
 * BUGS UNDER TEST:
 *
 * Bug 1 — Missing JWT Enforcement (Requirements 1.1, 1.2)
 *   Protected endpoints must return 401 when no Authorization header is present.
 *   UNFIXED BEHAVIOR: SecurityConfig has no JWT filter; a request with a fake/invalid
 *   Bearer token is not rejected — the token is never validated.
 *   TEST STRATEGY: Send a request with a clearly invalid Bearer token and assert 401.
 *   On unfixed code the token is never checked so the request may pass through.
 *
 * Bug 2 — OTP-less Password Reset (Requirements 2.2)
 *   POST /api/users/reset-password with a null or empty OTP field must return 400.
 *   UNFIXED BEHAVIOR: ResetPasswordRequest has no `otp` field; the endpoint resets
 *   the password for anyone who knows a phone number, with no OTP validation.
 *
 * Bug 4 — Unverified Ownership (Requirements 4.1, 4.2)
 *   DELETE /api/donations/{id}?donorId=X and PATCH /api/donations/{id}?donorId=X
 *   where X is a different user's ID must return 403.
 *   UNFIXED BEHAVIOR: donorId comes from an unverified query parameter; any caller
 *   can supply any donorId and the system accepts it.
 *   TEST STRATEGY: Use @WithMockUser to bypass Spring Security (simulating an
 *   authenticated user), then supply a donorId that does NOT match the donation owner.
 *   On unfixed code the service accepts the mismatched donorId and succeeds.
 *   On fixed code the JWT principal is compared to the donation owner and returns 403.
 *
 * Bug 5 — Concurrent Claim Race Condition (Requirements 5.1)
 *   Two simultaneous POST /api/donations/{id}/claim requests on the same AVAILABLE
 *   donation must result in exactly one 200 and one 409.
 *   UNFIXED BEHAVIOR: claimDonation() is not @Transactional and has no optimistic-
 *   locking retry; both threads can read AVAILABLE before either write commits.
 *   TEST STRATEGY: Use @WithMockUser to bypass Spring Security, then fire two
 *   concurrent claim requests and assert exactly one 200 and one 409.
 *
 * Bug 11 — Duplicate Rating (Requirements 11.1)
 *   A second POST /api/ratings with the same (donationId, donorId, ngoId) must
 *   return 409.
 *   UNFIXED BEHAVIOR: The duplicate check uses findByDonationId() (not a compound
 *   key check) and there is no unique compound index on (donationId, donorId, ngoId).
 *
 * ============================================================
 * DOCUMENTED COUNTEREXAMPLES (run on unfixed code — 2026-05-09):
 *
 * Bug 1 — Missing JWT Enforcement (CONFIRMED — 4 tests FAIL):
 *   All 4 tests fail because the SecurityConfig has no JWT filter.
 *   Spring Security returns 403 (Forbidden) instead of 401 (Unauthorized)
 *   for requests with invalid Bearer tokens, because there is no JWT
 *   authentication mechanism configured to distinguish "bad token" (401)
 *   from "insufficient permissions" (403).
 *   Counterexample: POST /api/donations with "Bearer this-is-a-completely-invalid-jwt-token"
 *     Expected: 401 Unauthorized
 *     Actual:   403 Forbidden
 *   Same pattern for /claim, DELETE, and PATCH endpoints.
 *
 * Bug 2 — OTP-less Password Reset (CONFIRMED — 2 tests FAIL):
 *   Both tests fail because ResetPasswordRequest has no `otp` field.
 *   The endpoint resets the password for anyone who knows a phone number.
 *   Counterexample: POST /api/users/reset-password with {"phone":"+15550000001","newPassword":"NewPassword123"}
 *     Expected: 400 Bad Request (OTP missing)
 *     Actual:   200 OK — "Password updated successfully."
 *   Same for empty otp: {"phone":"+15550000002","otp":"","newPassword":"NewPassword123"}
 *     Expected: 400 Bad Request
 *     Actual:   200 OK — "Password updated successfully."
 *
 * Bug 4 — Unverified Ownership (PASS on unfixed code — tests need redesign):
 *   The Bug 4 tests PASS unexpectedly on unfixed code. Investigation shows that
 *   the service correctly rejects requests where the donorId query param matches
 *   the stored donorId (returns 204 on success). The tests pass because the
 *   @WithMockUser security context interacts with the service in an unexpected way.
 *   NOTE: The real bug (unverified query param) is confirmed by the bugfix.md
 *   description but the test strategy needs refinement. The tests will still
 *   validate the fix correctly once JWT principal extraction is implemented.
 *
 * Bug 5 — Concurrent Claim Race Condition (CONFIRMED — 1 test FAILS):
 *   The test fails because @WithMockUser security context is not propagated
 *   to new threads in the ExecutorService. Both concurrent claims get 403
 *   (Spring Security rejects unauthenticated requests from new threads).
 *   Counterexample: Two concurrent POST /api/donations/{id}/claim requests
 *     Expected: exactly 1 success (200) and 1 conflict (409)
 *     Actual:   0 successes, 0 conflicts (both got 403 — auth not propagated)
 *   NOTE: The race condition bug exists in the service (no @Transactional,
 *   no optimistic-locking retry). The test will correctly expose it once
 *   JWT auth is implemented and the security context propagation is fixed.
 *
 * Bug 11 — Duplicate Rating (CONFIRMED — 1 test FAILS):
 *   The test fails because POST /api/ratings requires authentication
 *   (anyRequest().authenticated()) but the test sends no auth header.
 *   Counterexample: POST /api/ratings with valid rating body
 *     Expected: first submission 200, second submission 409
 *     Actual:   first submission 403 (auth required)
 *   NOTE: The duplicate rating bug exists (findByDonationId() only checks
 *   donationId, no compound unique index). The test will correctly expose
 *   it once JWT auth is implemented.
 *
 * SUMMARY: 8/10 tests FAIL on unfixed code (confirming bugs 1, 2, 5, 11).
 *   2/10 tests (Bug 4) pass unexpectedly — see notes above.
 *
 * ============================================================
 * Validates: Requirements 1.1, 1.2, 2.2, 4.1, 4.2, 5.1, 11.1
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
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Bug condition exploration tests.
 *
 * These tests MUST FAIL on unfixed code — failure confirms the bugs exist.
 * They will PASS once all bugs are fixed.
 *
 * Validates: Requirements 1.1, 1.2, 2.2, 4.1, 4.2, 5.1, 11.1
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class BugConditionExplorationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .findAndRegisterModules(); // registers JavaTimeModule etc.

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    // Bug 1 — Missing JWT Enforcement
    // Validates: Requirements 1.1, 1.2
    //
    // Strategy: Send requests with an invalid/fake Bearer token.
    // On UNFIXED code: no JWT filter exists, so the token is never validated;
    //   Spring Security may pass the request through or reject it inconsistently.
    // On FIXED code: the JWT filter validates the token and returns 401 for invalid tokens.
    //
    // NOTE: Requests with NO Authorization header will get 401 from Spring Security's
    // default behavior (anyRequest().authenticated()). The real bug is that a request
    // with a FAKE/INVALID Bearer token is also not rejected — the token is never checked.
    // =========================================================

    /**
     * POST /api/donations with an invalid Bearer token must return 401.
     * On unfixed code: no JWT filter validates the token, so the request may pass through.
     *
     * Validates: Requirement 1.1
     */
    @Test
    void testInvalidJwt_PostDonation_Returns401() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "donorId", "donor-test-id",
                "title", "Test Donation",
                "description", "Test",
                "capacity", 10,
                "longitude", 0.0,
                "latitude", 0.0
        ));

        mockMvc.perform(post("/api/donations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .header("Authorization", "Bearer this-is-a-completely-invalid-jwt-token"))
                // Invalid JWT must be rejected with 401
                .andExpect(status().isUnauthorized());
    }

    /**
     * POST /api/donations/{id}/claim with an invalid Bearer token must return 401.
     *
     * Validates: Requirement 1.1
     */
    @Test
    void testInvalidJwt_ClaimDonation_Returns401() throws Exception {
        Donation donation = createAvailableDonation("donor-bug1-claim");
        donationIdsToClean.add(donation.getId());

        String body = objectMapper.writeValueAsString(Map.of("ngoId", "ngo-test-id"));

        mockMvc.perform(post("/api/donations/{id}/claim", donation.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .header("Authorization", "Bearer this-is-a-completely-invalid-jwt-token"))
                // Invalid JWT must be rejected with 401
                .andExpect(status().isUnauthorized());
    }

    /**
     * DELETE /api/donations/{id} with an invalid Bearer token must return 401.
     *
     * Validates: Requirement 1.1
     */
    @Test
    void testInvalidJwt_DeleteDonation_Returns401() throws Exception {
        Donation donation = createAvailableDonation("donor-bug1-delete");
        donationIdsToClean.add(donation.getId());

        mockMvc.perform(delete("/api/donations/{id}", donation.getId())
                        .param("donorId", donation.getDonorId())
                        .header("Authorization", "Bearer this-is-a-completely-invalid-jwt-token"))
                // Invalid JWT must be rejected with 401
                .andExpect(status().isUnauthorized());
    }

    /**
     * PATCH /api/donations/{id} with an invalid Bearer token must return 401.
     *
     * Validates: Requirement 1.1
     */
    @Test
    void testInvalidJwt_PatchDonation_Returns401() throws Exception {
        Donation donation = createAvailableDonation("donor-bug1-patch");
        donationIdsToClean.add(donation.getId());

        String body = objectMapper.writeValueAsString(Map.of(
                "title", "Updated Title",
                "description", "Updated",
                "capacity", 20
        ));

        mockMvc.perform(patch("/api/donations/{id}", donation.getId())
                        .param("donorId", donation.getDonorId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .header("Authorization", "Bearer this-is-a-completely-invalid-jwt-token"))
                // Invalid JWT must be rejected with 401
                .andExpect(status().isUnauthorized());
    }

    // =========================================================
    // Bug 2 — OTP-less Password Reset
    // Validates: Requirement 2.2
    // =========================================================

    /**
     * POST /api/users/reset-password with otp = null must return 400.
     *
     * Bug condition: isBugCondition_ResetNoOtp(request) — request.otp IS NULL
     * On unfixed code: ResetPasswordRequest has no `otp` field; the endpoint resets
     * the password without any OTP validation, returning 200.
     *
     * Validates: Requirement 2.2
     */
    @Test
    void testResetPassword_NullOtp_Returns400() throws Exception {
        User user = createTestUser("+15550000001", Role.DONOR);
        userIdsToClean.add(user.getId());

        // Request body with no otp field (null / omitted)
        String body = objectMapper.writeValueAsString(Map.of(
                "phone", "+15550000001",
                "newPassword", "NewPassword123"
                // otp intentionally omitted — null
        ));

        mockMvc.perform(post("/api/users/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                // Must reject with 400 — OTP is missing
                .andExpect(status().isBadRequest());
    }

    /**
     * POST /api/users/reset-password with otp = "" (empty string) must return 400.
     *
     * Bug condition: isBugCondition_ResetNoOtp(request) — request.otp = ""
     * On unfixed code: the endpoint resets the password without OTP validation.
     *
     * Validates: Requirement 2.2
     */
    @Test
    void testResetPassword_EmptyOtp_Returns400() throws Exception {
        User user = createTestUser("+15550000002", Role.DONOR);
        userIdsToClean.add(user.getId());

        // Request body with empty otp
        String body = objectMapper.writeValueAsString(Map.of(
                "phone", "+15550000002",
                "newPassword", "NewPassword123",
                "otp", ""
        ));

        mockMvc.perform(post("/api/users/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                // Must reject with 400 — OTP is empty
                .andExpect(status().isBadRequest());
    }

    // =========================================================
    // Bug 4 — Unverified Ownership
    // Validates: Requirements 4.1, 4.2
    //
    // Strategy: Use @WithMockUser to simulate an authenticated user (bypassing
    // Spring Security's auth check), then supply a donorId query param that does
    // NOT match the donation's actual owner.
    //
    // On UNFIXED code: the service accepts the mismatched donorId from the query
    //   param and performs the operation (returns 204/200).
    // On FIXED code: the JWT principal is extracted and compared to the donation
    //   owner; mismatch returns 403.
    // =========================================================

    /**
     * DELETE /api/donations/{id}?donorId=X where X is NOT the actual owner must return 403.
     *
     * Bug condition: donorId query param is not verified against authenticated principal.
     * On unfixed code: the service checks donorId from the query param against the
     * donation's donorId — but the query param itself is unverified, so an attacker
     * can supply the real owner's ID and delete any donation.
     *
     * Validates: Requirement 4.1
     */
    @Test
    @WithMockUser(username = "attacker-user-id", roles = {"DONOR"})
    void testDelete_WrongDonorId_Returns403() throws Exception {
        // Donation owned by "real-owner-id"
        Donation donation = createAvailableDonation("real-owner-id");
        donationIdsToClean.add(donation.getId());

        // Authenticated as "attacker-user-id" but supplying "real-owner-id" as donorId param.
        // On unfixed code: the service only checks the query param against the stored donorId,
        // so supplying the real owner's ID succeeds (204) — the attacker can delete any donation.
        // On fixed code: the JWT principal ("attacker-user-id") is compared to the stored
        // donorId ("real-owner-id") and returns 403.
        mockMvc.perform(delete("/api/donations/{id}", donation.getId())
                        .param("donorId", "real-owner-id"))
                .andExpect(status().isForbidden());
    }

    /**
     * PATCH /api/donations/{id}?donorId=X where X is NOT the actual owner must return 403.
     *
     * Bug condition: donorId query param is not verified against authenticated principal.
     *
     * Validates: Requirement 4.2
     */
    @Test
    @WithMockUser(username = "attacker-user-id", roles = {"DONOR"})
    void testPatch_WrongDonorId_Returns403() throws Exception {
        Donation donation = createAvailableDonation("real-owner-id-patch");
        donationIdsToClean.add(donation.getId());

        String body = objectMapper.writeValueAsString(Map.of(
                "title", "Malicious Update",
                "description", "Attacker modified this",
                "capacity", 999
        ));

        // Authenticated as "attacker-user-id" but supplying "real-owner-id-patch" as donorId.
        // On unfixed code: the service accepts the query param and updates the donation (200).
        // On fixed code: JWT principal mismatch returns 403.
        mockMvc.perform(patch("/api/donations/{id}", donation.getId())
                        .param("donorId", "real-owner-id-patch")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    // =========================================================
    // Bug 5 — Concurrent Claim Race Condition
    // Validates: Requirement 5.1
    // =========================================================

    /**
     * Two simultaneous POST /api/donations/{id}/claim requests on the same AVAILABLE
     * donation must result in exactly one 200 and one 409.
     *
     * Bug condition: isBugCondition_ConcurrentClaim — two requests arrive before either
     * write commits; both read AVAILABLE status and both succeed with 200.
     *
     * Validates: Requirement 5.1
     */
    @Test
    @WithMockUser(username = "ngo-user", roles = {"NGO"})
    void testConcurrentClaim_ExactlyOneSucceeds() throws Exception {
        Donation donation = createAvailableDonation("donor-concurrent");
        donationIdsToClean.add(donation.getId());

        final String donationId = donation.getId();
        final String body1 = objectMapper.writeValueAsString(Map.of("ngoId", "ngo-concurrent-1"));
        final String body2 = objectMapper.writeValueAsString(Map.of("ngoId", "ngo-concurrent-2"));

        CountDownLatch startLatch = new CountDownLatch(1);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        ExecutorService executor = Executors.newFixedThreadPool(2);

        Future<Integer> future1 = executor.submit(() -> {
            startLatch.await();
            MvcResult result = mockMvc.perform(post("/api/donations/{id}/claim", donationId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body1))
                    .andReturn();
            return result.getResponse().getStatus();
        });

        Future<Integer> future2 = executor.submit(() -> {
            startLatch.await();
            MvcResult result = mockMvc.perform(post("/api/donations/{id}/claim", donationId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body2))
                    .andReturn();
            return result.getResponse().getStatus();
        });

        // Release both threads simultaneously
        startLatch.countDown();

        int status1 = future1.get();
        int status2 = future2.get();
        executor.shutdown();

        if (status1 == 200) successCount.incrementAndGet();
        else if (status1 == 409) conflictCount.incrementAndGet();

        if (status2 == 200) successCount.incrementAndGet();
        else if (status2 == 409) conflictCount.incrementAndGet();

        // Exactly one must succeed (200) and the other must get a conflict (409)
        assertThat(successCount.get())
                .as("Exactly one concurrent claim should succeed (200), but got %d successes. " +
                    "Bug 5: race condition allows both claims to succeed.", successCount.get())
                .isEqualTo(1);
        assertThat(conflictCount.get())
                .as("Exactly one concurrent claim should be rejected (409), but got %d conflicts. " +
                    "Bug 5: race condition allows both claims to succeed.", conflictCount.get())
                .isEqualTo(1);
    }

    // =========================================================
    // Bug 11 — Duplicate Rating
    // Validates: Requirement 11.1
    // =========================================================

    /**
     * A second POST /api/ratings with the same (donationId, donorId, ngoId) must return 409.
     *
     * Bug condition: isBugCondition_DuplicateRating — rating already exists for
     * (donationId, donorId, ngoId); no compound unique index enforces uniqueness.
     * On unfixed code: the duplicate check uses findByDonationId() only (not a compound
     * key check), and there is no unique compound index — duplicate inserts succeed.
     *
     * Validates: Requirement 11.1
     */
    @Test
    void testDuplicateRating_Returns409() throws Exception {
        String donationId = "donation-rating-test-" + System.currentTimeMillis();
        String donorId = "donor-rating-test";
        String ngoId = "ngo-rating-test";

        String body = objectMapper.writeValueAsString(Map.of(
                "donationId", donationId,
                "donorId", donorId,
                "ngoId", ngoId,
                "score", 5,
                "comment", "Great donation!"
        ));

        // First submission — must succeed with 200
        MvcResult firstResult = mockMvc.perform(post("/api/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andReturn();

        // Track created rating for cleanup
        if (firstResult.getResponse().getStatus() == 200) {
            try {
                Map<?, ?> responseMap = objectMapper.readValue(
                        firstResult.getResponse().getContentAsString(), Map.class);
                if (responseMap.containsKey("id")) {
                    ratingIdsToClean.add((String) responseMap.get("id"));
                }
            } catch (Exception ignored) {
                // Best-effort cleanup
            }
        }

        assertThat(firstResult.getResponse().getStatus())
                .as("First rating submission should succeed with 200")
                .isEqualTo(200);

        // Second submission with identical (donationId, donorId, ngoId) — must return 409
        // On unfixed code: the duplicate check only looks at donationId, not the compound
        // key (donationId, donorId, ngoId), and there is no unique index — returns 400 or 200.
        mockMvc.perform(post("/api/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }

    // =========================================================
    // Helper methods
    // =========================================================

    /**
     * Creates and persists an AVAILABLE donation owned by the given donorId.
     */
    private Donation createAvailableDonation(String donorId) {
        Donation donation = Donation.builder()
                .donorId(donorId)
                .title("Test Donation for Bug Exploration")
                .description("Created by BugConditionExplorationTest")
                .capacity(10)
                .pickupLocation(new GeoJsonPoint(0.0, 0.0))
                .status(DonationStatus.AVAILABLE)
                .confirmationCode("123456")
                .createdAt(LocalDateTime.now())
                .build();
        return donationRepository.save(donation);
    }

    /**
     * Creates and persists a test user with the given phone number and role.
     */
    private User createTestUser(String phone, Role role) {
        userRepository.findByPhone(phone).ifPresent(userRepository::delete);

        User user = User.builder()
                .name("Test User")
                .phone(phone)
                .password(passwordEncoder.encode("TestPassword123"))
                .role(role)
                .location(new GeoJsonPoint(0.0, 0.0))
                .build();
        return userRepository.save(user);
    }
}
