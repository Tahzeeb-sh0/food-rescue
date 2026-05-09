# Implementation Plan

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Missing JWT Enforcement, Unverified Ownership, OTP-less Password Reset, Concurrent Claim, Duplicate Rating
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior — they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate each bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope each property to the concrete failing case(s) to ensure reproducibility
  - Bug 1 (No JWT): For all requests to protected endpoints (POST /api/donations, POST /api/donations/{id}/claim, DELETE /api/donations/{id}, PATCH /api/donations/{id}) with no Authorization header, assert response.status = 401 — on unfixed code these return 200/other, confirming the bug
  - Bug 2 (OTP-less reset): For all ResetPasswordRequest where otp IS NULL or empty string, assert response.status = 400 — on unfixed code the password is reset without OTP validation
  - Bug 4 (Unverified ownership): For DELETE /api/donations/{id}?donorId=X and PATCH /api/donations/{id}?donorId=X where X is a different user's ID, assert response.status = 403 — on unfixed code the operation succeeds
  - Bug 5 (Concurrent claim): For two simultaneous POST /api/donations/{id}/claim requests on the same AVAILABLE donation, assert exactly one returns 200 and the other returns 409 — on unfixed code both may return 200
  - Bug 11 (Duplicate rating): For a second POST /api/ratings with the same (donationId, donorId, ngoId), assert response.status = 409 — on unfixed code both inserts succeed
  - Run all tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct — it proves the bugs exist)
  - Document counterexamples found to understand root cause
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 2.2, 4.1, 4.2, 5.1, 11.1_

- [-] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Core Donation Lifecycle and Public Endpoints
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: authenticated donor creating a donation returns 200 with AVAILABLE status and confirmation code on unfixed code
  - Observe: authenticated NGO claiming an AVAILABLE donation returns 200 with CLAIMED status on unfixed code
  - Observe: authenticated NGO completing a claimed donation with correct code returns 200 with COMPLETED status on unfixed code
  - Observe: authenticated donor cancelling their own AVAILABLE donation returns 200 on unfixed code
  - Observe: GET /api/stats and GET /api/leaderboard return 200 without authentication on unfixed code
  - Observe: GET /api/donations/nearby with valid coordinates returns AVAILABLE donations on unfixed code
  - Observe: user registration with unique phone returns UserResponse (no password field) on unfixed code
  - Observe: user login with correct credentials returns UserResponse on unfixed code
  - Write property-based tests: for all valid authenticated requests matching the above flows, assert the same outcomes are preserved after the fix
  - Verify tests pass on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12_

- [ ] 3. Fix — JWT Authentication and Authorization Enforcement

  - [ ] 3.1 Implement JWT token generation and filter
    - Create a JwtUtil class that generates and validates JWT tokens (sign with a secret from application.properties)
    - Create a JwtAuthenticationFilter extending OncePerRequestFilter that extracts the Bearer token, validates it, and sets the SecurityContext
    - _Bug_Condition: isBugCondition_NoAuth(request) — request.path NOT IN publicEndpoints AND request.headers["Authorization"] IS NULL_
    - _Expected_Behavior: response.status = 401 for all unauthenticated requests to protected endpoints_
    - _Preservation: Valid authenticated requests to all endpoints continue to function as before (3.1–3.12)_
    - _Requirements: 1.1, 2.1_

  - [ ] 3.2 Wire JWT filter into SecurityConfig
    - Add JwtAuthenticationFilter to the Spring Security filter chain before UsernamePasswordAuthenticationFilter
    - Define public endpoints (login, register, forgot-password, reset-password, GET /api/stats, GET /api/leaderboard, GET /api/donations/nearby, WebSocket handshake) as permitAll
    - Require authentication for all other endpoints
    - _Requirements: 1.1, 2.1_

  - [ ] 3.3 Return JWT in login response
    - Update UserController login endpoint to generate a JWT for the authenticated user and include it in the UserResponse
    - _Requirements: 3.7_

  - [ ] 3.4 Enforce ownership from JWT principal (not query params)
    - Update DELETE /api/donations/{id} to extract donorId from the authenticated JWT principal instead of a query parameter
    - Update PATCH /api/donations/{id} to extract donorId from the authenticated JWT principal instead of a query parameter
    - Update POST /api/donations/{id}/claim to verify the ngoId in the request body matches the authenticated principal
    - Update POST /api/donations/{id}/complete to verify the donorId in the request body matches the authenticated principal
    - _Bug_Condition: isBugCondition_NoAuth — donorId/ngoId taken from unverified request param_
    - _Expected_Behavior: 403 when authenticated principal does not match the required owner_
    - _Preservation: Valid owner operations continue to succeed (3.1–3.4)_
    - _Requirements: 1.2, 2.2, 2.7, 2.8_

  - [ ] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - JWT Enforcement and Ownership Validation
    - **IMPORTANT**: Re-run the SAME tests from task 1 (Bug 1 and Bug 4 cases) — do NOT write new tests
    - **EXPECTED OUTCOME**: Tests PASS (confirms JWT enforcement and ownership bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.7, 2.8_

  - [ ] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Core Donation Lifecycle
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in authenticated flows)

- [ ] 4. Fix — Password Reset OTP Flow

  - [ ] 4.1 Implement OTP generation and storage
    - Generate a cryptographically random 6-digit OTP in UserController.forgotPassword
    - Hash the OTP (BCrypt or SHA-256) and store it alongside an expiry timestamp on the User document
    - Deliver the OTP via NotificationService (SMS stub acceptable; log when Twilio not configured)
    - _Bug_Condition: isBugCondition_ResetNoOtp — request.otp IS NULL or empty_
    - _Expected_Behavior: response.status = 400 when OTP is missing, incorrect, or expired_
    - _Preservation: Registered phone lookup and user record update continue to work (3.6)_
    - _Requirements: 2.1, 2.3_

  - [ ] 4.2 Validate OTP in reset-password endpoint
    - Update UserController.resetPassword to require an `otp` field in ResetPasswordRequest
    - Reject with HTTP 400 if OTP is null/empty, does not match the stored hash, or is past expiry
    - Clear the stored OTP after successful validation
    - _Requirements: 2.2, 2.4_

  - [ ] 4.3 Update frontend ForgotPasswordPage to submit OTP
    - At step 2, POST the entered OTP to a backend verification endpoint before advancing to step 3
    - Show an error message if verification fails; only advance on success
    - _Requirements: 2.5_

  - [ ] 4.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - OTP-less Reset Rejected
    - **IMPORTANT**: Re-run the SAME test from task 1 (Bug 2 case) — do NOT write a new test
    - **EXPECTED OUTCOME**: Test PASSES (confirms reset without OTP is rejected with 400)
    - _Requirements: 2.4_

  - [ ] 4.5 Verify preservation tests still pass
    - **Property 2: Preservation** - User Registration and Login
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in auth flows)

- [ ] 5. Fix — Race Condition in Claim Logic

  - [ ] 5.1 Add optimistic locking and @Transactional to claim method
    - Add a `@Version` field to the Donation document for optimistic locking
    - Annotate DonationService.claimDonation with @Transactional
    - Wrap the status check + save in a retry loop that catches OptimisticLockingFailureException and returns HTTP 409 on conflict
    - _Bug_Condition: isBugCondition_ConcurrentClaim — two requests arrive before either write commits_
    - _Expected_Behavior: exactly one succeeds (200), all others receive 409_
    - _Preservation: Single-threaded claim of an AVAILABLE donation continues to return 200 (3.2)_
    - _Requirements: 5.1, 2.9_

  - [ ] 5.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Concurrent Claim Serialized
    - **IMPORTANT**: Re-run the SAME test from task 1 (Bug 5 case) — do NOT write a new test
    - **EXPECTED OUTCOME**: Test PASSES (at most one 200, rest are 409)
    - _Requirements: 2.9_

  - [ ] 5.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Normal Claim Flow
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - **EXPECTED OUTCOME**: Tests PASS (no regressions in single-threaded claim)

- [ ] 6. Fix — Duplicate Rating Prevention

  - [ ] 6.1 Add compound unique index on Rating collection
    - Add a MongoDB compound unique index on (donationId, donorId, ngoId) in the Rating model using @CompoundIndex
    - Update RatingController / RatingService to catch DuplicateKeyException and return HTTP 409
    - _Bug_Condition: isBugCondition_DuplicateRating — rating already exists for (donationId, donorId, ngoId)_
    - _Expected_Behavior: response.status = 409 on duplicate submission_
    - _Preservation: First rating submission for a donation continues to succeed (3.10)_
    - _Requirements: 11.1, 2.18_

  - [ ] 6.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Duplicate Rating Rejected
    - **IMPORTANT**: Re-run the SAME test from task 1 (Bug 11 case) — do NOT write a new test
    - **EXPECTED OUTCOME**: Test PASSES (second rating returns 409)
    - _Requirements: 2.18_

  - [ ] 6.3 Verify preservation tests still pass
    - **Property 2: Preservation** - First Rating Succeeds
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - **EXPECTED OUTCOME**: Tests PASS (no regressions in rating submission)

- [ ] 7. Fix — Geolocation Validation

  - [ ] 7.1 Add coordinate range validation
    - In DonationService and UserController, validate that longitude is in [-180, 180] and latitude is in [-90, 90] before constructing GeoJsonPoint
    - Return HTTP 400 with a descriptive error message if values are out of range
    - _Requirements: 3.1, 3.2, 2.6_

- [ ] 8. Fix — WebSocket CORS Origin from Environment

  - [ ] 8.1 Read allowed origins from environment variable
    - In WebSocketConfig.registerStompEndpoints, replace the hardcoded `http://localhost:5173` with a value read from the `ALLOWED_ORIGINS` environment variable (comma-separated), defaulting to `http://localhost:5173` for local development
    - _Requirements: 6.1, 2.10_

- [ ] 9. Fix — Pagination on Donation Lists

  - [ ] 9.1 Add pagination to donor and NGO donation endpoints
    - Update DonationRepository to extend PagingAndSortingRepository or add Pageable-based query methods
    - Update GET /api/donations/donor/{donorId} to accept optional `page` (default 0) and `size` (default 20) query parameters and return a Page response
    - Update GET /api/donations/ngo/{ngoId} to accept the same parameters and return a Page response
    - _Requirements: 7.1, 7.2, 2.11, 2.12_

- [ ] 10. Fix — Rate Limiting

  - [ ] 10.1 Add rate limiting to sensitive endpoints
    - Add Bucket4j (or a simple in-memory ConcurrentHashMap token-bucket) rate limiter to POST /api/users/forgot-password (e.g. 5 requests per IP per 15 minutes)
    - Add rate limiting to POST /api/donations/{id}/complete (e.g. 10 attempts per donationId per 15 minutes)
    - Return HTTP 429 when the limit is exceeded
    - _Requirements: 8.1, 8.2, 2.13, 2.14_

- [ ] 11. Fix — Frontend Error Handling

  - [ ] 11.1 Add user-visible error feedback to all API call sites
    - Audit all catch blocks in frontend components; replace silent swallows with toast/alert messages showing the error
    - Where appropriate, add a retry button or guidance
    - _Requirements: 9.1, 2.15_

- [ ] 12. Fix — Custom Exception Classes

  - [ ] 12.1 Create typed domain exception classes
    - Create DonationNotFoundException, AlreadyClaimedException, UnauthorizedException, DuplicateRatingException, InvalidOtpException (and others as needed) extending RuntimeException
    - Update all service methods to throw the appropriate typed exception instead of `new RuntimeException("message")`
    - Update GlobalExceptionHandler to map each exception type to the correct HTTP status using @ExceptionHandler(TypedExceptionClass.class) instead of string matching
    - _Requirements: 9.2, 15.1, 2.16, 2.22_

- [ ] 13. Fix — Donation Expiry Donor Notification

  - [ ] 13.1 Notify donor when their donation expires
    - In DonationExpiryService, after broadcasting the WebSocket cancellation event to NGO dashboards, also send a WebSocket message to the donor's personal topic (e.g. /topic/user/{donorId}) informing them their donation was auto-expired
    - _Requirements: 10.1, 2.17_

- [ ] 14. Fix — Hardcoded API URL in Frontend

  - [ ] 14.1 Replace hardcoded base URL with environment variable
    - Create or update Frontend/.env to define `VITE_API_BASE_URL=http://localhost:8080`
    - Replace all occurrences of the hardcoded string `http://localhost:8080` in frontend source files with `import.meta.env.VITE_API_BASE_URL`
    - _Requirements: 12.1, 2.19_

- [ ] 15. Fix — Auth0 Credentials Cleanup

  - [ ] 15.1 Remove unused Auth0 credentials
    - Remove VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID from Frontend/.env and from the repository
    - If Auth0 integration is desired in future, document it in a comment rather than leaving live credentials
    - _Requirements: 14.1, 2.21_

- [ ] 16. Fix — Notification Service Implementation

  - [ ] 16.1 Implement conditional Twilio SMS and FCM push notifications
    - Update NotificationService to send real SMS via Twilio when TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER are present in the environment
    - Add FCM push notification support when FCM credentials are configured
    - Fall back to log-only when credentials are absent
    - _Requirements: 13.1, 2.20_

- [ ] 17. Checkpoint — Ensure all tests pass
  - Re-run all exploration tests (Property 1) — all must PASS
  - Re-run all preservation tests (Property 2) — all must PASS
  - Run the full backend test suite (`./gradlew test` in Backend/)
  - Run the frontend linter (`npm run lint` in Frontend/)
  - Ensure no regressions across all 15 bug fixes
  - Ask the user if any questions arise
