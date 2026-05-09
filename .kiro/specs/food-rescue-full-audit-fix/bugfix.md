# Bugfix Requirements Document

## Introduction

This document covers a comprehensive audit of the Food Rescue full-stack application (Spring Boot + MongoDB backend, React/Vite frontend). The audit identified 15 issues ranging from critical security vulnerabilities to medium-priority reliability gaps. The bugs span authentication enforcement, password reset security, geospatial data handling, donation ownership authorization, race conditions, WebSocket configuration, pagination, rate limiting, error handling, expiry notifications, duplicate rating prevention, hardcoded URLs, notification stubs, unused credentials, and brittle exception handling.

---

## Bug Analysis

### Current Behavior (Defect)

**Section 1 — JWT Authentication / Authorization**

1.1 WHEN any unauthenticated request is made to protected endpoints (e.g. POST /api/donations, POST /api/donations/{id}/claim) THEN the system permits the request because SecurityConfig has no JWT filter wired in and the frontend never sends an Authorization header

1.2 WHEN a user claims a donation or completes a pickup THEN the system accepts the ngoId / donorId values directly from the request body without verifying they match an authenticated principal

**Section 2 — Password Reset Flow**

2.1 WHEN POST /api/users/forgot-password is called THEN the system logs the event but never generates or stores an OTP, so no code is ever sent to the user

2.2 WHEN POST /api/users/reset-password is called with a valid phone number and a new password THEN the system resets the password without validating any OTP, allowing anyone who knows a phone number to take over that account

2.3 WHEN the frontend ForgotPasswordPage reaches step 2 (OTP entry) THEN the system advances to step 3 on any button click without sending the entered code to the backend for verification

**Section 3 — Geolocation Format Mismatch**

3.1 WHEN a donor submits a new donation and the browser provides coordinates THEN the system stores the GeoJsonPoint correctly (GeoJSON [longitude, latitude] order is respected by the constructor), however the frontend also sends raw `longitude` / `latitude` fields in the body which are passed directly — if the field names were ever swapped the geo-index would silently store wrong coordinates

3.2 WHEN a user registers and provides their location THEN the system constructs GeoJsonPoint(longitude, latitude) from request fields named `longitude` and `latitude`; if the frontend ever sends them in the wrong order the stored point is silently incorrect and geo-queries return wrong results

**Section 4 — Donation Ownership Validation**

4.1 WHEN DELETE /api/donations/{id}?donorId=X is called THEN the system checks that X matches the stored donorId but X comes from a query parameter that any client can set to any value — no authentication token is verified

4.2 WHEN PATCH /api/donations/{id}?donorId=X is called THEN the system applies the same unverified donorId check, allowing any user to edit another user's donation by supplying the target donor's ID

**Section 5 — Race Condition in Claim Logic**

5.1 WHEN two NGOs simultaneously call POST /api/donations/{id}/claim for the same donation THEN the system may allow both to succeed because the status check and save are not wrapped in a transaction with optimistic-locking retry, so both threads can read AVAILABLE before either write commits

**Section 6 — WebSocket CORS Hardcoded**

6.1 WHEN the application is deployed to any origin other than http://localhost:5173 THEN the system rejects WebSocket upgrade requests because WebSocketConfig.registerStompEndpoints hardcodes that single origin

**Section 7 — No Pagination on Donation Lists**

7.1 WHEN GET /api/donations/donor/{donorId} is called THEN the system returns all donations for that donor as an unbounded list

7.2 WHEN GET /api/donations/ngo/{ngoId} is called THEN the system returns all claimed donations for that NGO as an unbounded list

**Section 8 — No Rate Limiting**

8.1 WHEN POST /api/users/forgot-password is called repeatedly THEN the system processes every request without throttling, enabling enumeration of registered phone numbers and OTP brute-force once OTPs are implemented

8.2 WHEN POST /api/donations/{id}/complete is called repeatedly with different confirmation codes THEN the system validates each attempt without limiting request frequency, making the 6-digit code (1 000 000 combinations) susceptible to brute-force

**Section 9 — Incomplete Error Handling**

9.1 WHEN an API call fails in the frontend THEN the system often silently swallows the error (catch blocks with no user feedback) or shows a generic message with no retry affordance

9.2 WHEN GlobalExceptionHandler maps a RuntimeException to an HTTP status THEN the system uses string matching on the exception message (e.g. `msg.contains("not found")`) which breaks if the message text changes

**Section 10 — No Donation Expiry Notification**

10.1 WHEN DonationExpiryService expires and deletes a donation THEN the system broadcasts a WebSocket cancellation event to NGO dashboards but does not notify the donor whose donation was removed

**Section 11 — Rating Duplicate Prevention Weak**

11.1 WHEN two concurrent POST /api/ratings requests arrive for the same donationId THEN the system may insert both ratings because the duplicate check (findByDonationId) and the save are not atomic, and there is no unique database index on donationId

**Section 12 — Hardcoded API URL in Frontend**

12.1 WHEN any frontend component makes an API call THEN the system uses the hardcoded string `http://localhost:8080` as the base URL, causing all API calls to fail in any non-local environment

**Section 13 — Notification Service Not Implemented**

13.1 WHEN a new donation is created and nearby NGOs are found THEN the system only logs mock messages instead of sending real SMS or push notifications, so NGOs receive no out-of-band alerts

**Section 14 — Auth0 Credentials Present but Unused**

14.1 WHEN the frontend application loads THEN the system has VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID defined in .env but no Auth0 SDK is imported or used anywhere, leaving live credentials exposed in the repository with no purpose

**Section 15 — No Custom Exception Classes**

15.1 WHEN a service throws a RuntimeException to signal a domain error (e.g. "Donation not found", "already claimed") THEN the system relies on GlobalExceptionHandler string-matching the message to determine the HTTP status code, which is fragile and breaks on any message wording change

---

### Expected Behavior (Correct)

**Section 1 — JWT Authentication / Authorization**

2.1 WHEN a request is made to any protected endpoint THEN the system SHALL reject it with HTTP 401 if no valid JWT is present in the Authorization header

2.2 WHEN a user performs an action on a resource (claim, complete, cancel, edit) THEN the system SHALL verify the authenticated principal's ID matches the required role/ownership before processing the request

**Section 2 — Password Reset Flow**

2.3 WHEN POST /api/users/forgot-password is called with a registered phone THEN the system SHALL generate a time-limited OTP, store it (hashed) against the user record, and deliver it via SMS

2.4 WHEN POST /api/users/reset-password is called THEN the system SHALL validate the submitted OTP against the stored value and expiry before updating the password, and SHALL reject the request with HTTP 400 if the OTP is missing, incorrect, or expired

2.5 WHEN the frontend ForgotPasswordPage submits the OTP at step 2 THEN the system SHALL send the code to a backend verification endpoint and only advance to step 3 on a successful response

**Section 3 — Geolocation Format Mismatch**

2.6 WHEN a donation or user registration is submitted with location data THEN the system SHALL validate that longitude is in [-180, 180] and latitude is in [-90, 90] before persisting, and SHALL return HTTP 400 with a descriptive error if the values are out of range or swapped

**Section 4 — Donation Ownership Validation**

2.7 WHEN DELETE /api/donations/{id} is called THEN the system SHALL extract the donor identity from the authenticated JWT principal rather than from a query parameter

2.8 WHEN PATCH /api/donations/{id} is called THEN the system SHALL extract the donor identity from the authenticated JWT principal rather than from a query parameter

**Section 5 — Race Condition in Claim Logic**

2.9 WHEN two concurrent claim requests arrive for the same donation THEN the system SHALL guarantee that at most one succeeds by using a @Transactional method with optimistic-locking retry, ensuring the second request receives HTTP 409

**Section 6 — WebSocket CORS Hardcoded**

2.10 WHEN the WebSocket endpoint is configured THEN the system SHALL read the allowed origin(s) from an environment variable (e.g. ALLOWED_ORIGINS) so that the same build works in development and production

**Section 7 — No Pagination on Donation Lists**

2.11 WHEN GET /api/donations/donor/{donorId} is called THEN the system SHALL accept optional `page` and `size` query parameters and return a paginated response

2.12 WHEN GET /api/donations/ngo/{ngoId} is called THEN the system SHALL accept optional `page` and `size` query parameters and return a paginated response

**Section 8 — No Rate Limiting**

2.13 WHEN POST /api/users/forgot-password is called more than a configurable threshold of times from the same IP within a time window THEN the system SHALL return HTTP 429

2.14 WHEN POST /api/donations/{id}/complete is called more than a configurable threshold of times for the same donation within a time window THEN the system SHALL return HTTP 429

**Section 9 — Incomplete Error Handling**

2.15 WHEN an API call fails in the frontend THEN the system SHALL display a user-visible error message and, where appropriate, offer a retry action

2.16 WHEN GlobalExceptionHandler maps a domain error to an HTTP status THEN the system SHALL use typed custom exception classes rather than string matching to determine the correct status code

**Section 10 — No Donation Expiry Notification**

2.17 WHEN DonationExpiryService expires a donation THEN the system SHALL notify the donor (via in-app WebSocket message and, when configured, SMS) that their donation was automatically removed due to no claim within the expiry window

**Section 11 — Rating Duplicate Prevention Weak**

2.18 WHEN POST /api/ratings is called THEN the system SHALL enforce uniqueness on (donationId, donorId, ngoId) at the database level via a compound unique index, and SHALL return HTTP 409 if a duplicate is attempted

**Section 12 — Hardcoded API URL in Frontend**

2.19 WHEN any frontend component makes an API call THEN the system SHALL construct the base URL from the VITE_API_BASE_URL environment variable, defaulting to http://localhost:8080 only in local development

**Section 13 — Notification Service Not Implemented**

2.20 WHEN a new donation is created and nearby NGOs are found THEN the system SHALL send real SMS notifications via Twilio (when TWILIO_* credentials are configured) and real push notifications via FCM (when FCM credentials are configured), falling back to log-only when credentials are absent

**Section 14 — Auth0 Credentials Present but Unused**

2.21 WHEN Auth0 integration is not implemented THEN the system SHALL remove VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID from .env and from the repository, or SHALL implement Auth0 authentication using those credentials

**Section 15 — No Custom Exception Classes**

2.22 WHEN a service needs to signal a domain error THEN the system SHALL throw a typed custom exception (e.g. DonationNotFoundException, AlreadyClaimedException, UnauthorizedException) and GlobalExceptionHandler SHALL map each type to the correct HTTP status without string matching

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a valid authenticated donor submits a new donation with correct coordinates THEN the system SHALL CONTINUE TO create the donation, assign AVAILABLE status, generate a confirmation code, broadcast via WebSocket, and notify nearby NGOs

3.2 WHEN a valid authenticated NGO claims an available donation THEN the system SHALL CONTINUE TO set status to CLAIMED, record claimedByNgoId and claimedAt, and broadcast the claim event via WebSocket

3.3 WHEN a valid authenticated NGO submits the correct confirmation code for a claimed donation THEN the system SHALL CONTINUE TO set status to COMPLETED, record completedAt, and broadcast the completion event via WebSocket

3.4 WHEN a valid authenticated donor cancels an AVAILABLE donation they own THEN the system SHALL CONTINUE TO delete the donation and broadcast the cancellation event via WebSocket

3.5 WHEN DonationExpiryService runs its scheduled job THEN the system SHALL CONTINUE TO expire AVAILABLE donations older than 4 hours and broadcast cancellation events to NGO dashboards

3.6 WHEN a user registers with a unique phone number THEN the system SHALL CONTINUE TO hash the password, store the user, and return a UserResponse without the password field

3.7 WHEN a user logs in with correct credentials THEN the system SHALL CONTINUE TO return a UserResponse (now also including a JWT)

3.8 WHEN GET /api/donations/nearby is called with valid coordinates and radius THEN the system SHALL CONTINUE TO return AVAILABLE donations within the specified radius using the geo-spatial index

3.9 WHEN GET /api/stats and GET /api/leaderboard are called without authentication THEN the system SHALL CONTINUE TO return public statistics and leaderboard data

3.10 WHEN a donor submits a rating for a completed donation THEN the system SHALL CONTINUE TO persist the rating and make it available via GET /api/ratings/ngo/{ngoId}

3.11 WHEN the frontend connects to the WebSocket endpoint THEN the system SHALL CONTINUE TO deliver real-time donation events (new, claimed, cancelled, completed) to subscribed clients

3.12 WHEN a user changes their password via PATCH /api/users/{id}/password with the correct current password THEN the system SHALL CONTINUE TO update the password and return a success response

---

## Bug Condition Pseudocode

### Bug 1 — Missing JWT Enforcement

```pascal
FUNCTION isBugCondition_NoAuth(request)
  INPUT: request of type HttpRequest
  OUTPUT: boolean
  RETURN request.path NOT IN publicEndpoints
         AND request.headers["Authorization"] IS NULL
END FUNCTION

// Fix Checking
FOR ALL request WHERE isBugCondition_NoAuth(request) DO
  response ← securedEndpoint'(request)
  ASSERT response.status = 401
END FOR

// Preservation Checking
FOR ALL request WHERE NOT isBugCondition_NoAuth(request) DO
  ASSERT F(request) = F'(request)
END FOR
```

### Bug 2 — Password Reset Without OTP

```pascal
FUNCTION isBugCondition_ResetNoOtp(request)
  INPUT: request of type ResetPasswordRequest
  OUTPUT: boolean
  RETURN request.otp IS NULL OR request.otp = ""
END FUNCTION

// Fix Checking
FOR ALL request WHERE isBugCondition_ResetNoOtp(request) DO
  response ← resetPassword'(request)
  ASSERT response.status = 400
END FOR

// Preservation Checking
FOR ALL request WHERE NOT isBugCondition_ResetNoOtp(request) DO
  ASSERT F(request) = F'(request)
END FOR
```

### Bug 5 — Race Condition in Claim

```pascal
FUNCTION isBugCondition_ConcurrentClaim(donationId, requests)
  INPUT: donationId String, requests List<ClaimRequest>
  OUTPUT: boolean
  RETURN requests.size > 1 AND all requests arrive before any write commits
END FUNCTION

// Fix Checking
FOR ALL (donationId, requests) WHERE isBugCondition_ConcurrentClaim(donationId, requests) DO
  results ← concurrentClaim'(donationId, requests)
  ASSERT results.filter(r => r.status = 200).size <= 1
  ASSERT results.filter(r => r.status = 409).size >= requests.size - 1
END FOR
```

### Bug 11 — Duplicate Rating

```pascal
FUNCTION isBugCondition_DuplicateRating(donationId, donorId, ngoId)
  INPUT: donationId, donorId, ngoId Strings
  OUTPUT: boolean
  RETURN ratingRepository.existsByDonationIdAndDonorIdAndNgoId(donationId, donorId, ngoId)
END FUNCTION

// Fix Checking
FOR ALL (donationId, donorId, ngoId) WHERE isBugCondition_DuplicateRating(donationId, donorId, ngoId) DO
  response ← submitRating'(donationId, donorId, ngoId)
  ASSERT response.status = 409
END FOR
```
