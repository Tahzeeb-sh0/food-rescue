# Project Abstract

## FOOD RESCUE — AI-POWERED FOOD DONATION AND REDISTRIBUTION PLATFORM

**Institution:** Maharashtra Institute of Technology, Chhatrapati Sambhajinagar
**Programme:** Bachelor of Vocation (AI & Robotics)
**University:** Dr. Babasaheb Ambedkar Marathwada University, Chhatrapati Sambhajinagar (M.S.)
**Academic Year:** 2025–26

---

### Problem Statement

Food waste and food insecurity represent two sides of the same global crisis. According to the Food and Agriculture Organization (FAO) of the United Nations, approximately 1.3 billion tonnes of food is wasted every year, while over 800 million people suffer from hunger. In India alone, nearly 40% of food produced never reaches the consumer. The core challenge is not a shortage of surplus food — it is the absence of a fast, reliable, and accountable channel to connect food donors with organizations that can redistribute it before it spoils. Existing approaches rely on manual coordination through phone calls and messaging groups, which are slow, unscalable, and leave no digital record of impact.

---

### Objectives

This project designs, implements, and audits Food Rescue — a full-stack web application that automates the discovery, matching, and coordination of food donations between donors (restaurants, households, event organizers) and NGOs. The system aims to:

1. Reduce the time between a donation being posted and an NGO being notified to under one minute.
2. Enforce a secure, role-based donation lifecycle from posting through pickup verification.
3. Provide quantitative impact tracking (meals rescued, CO₂ diverted, active NGOs).
4. Demonstrate production-grade software correctness through formal security auditing and property-based testing.

---

### System Design and Technology

The backend is implemented in Java using Spring Boot 4.0 with MongoDB as the primary database. MongoDB's native GeoJSON support and 2dsphere indexing enable sub-millisecond geospatial radius queries, allowing the system to identify NGOs within a configurable pickup radius (default 10 km) and notify them instantly. Real-time communication is achieved through WebSocket using the STOMP protocol over SockJS, enabling live push notifications to NGO dashboards without polling. The frontend is a single-page application built with React 19 and Vite, styled with Tailwind CSS, and is fully responsive across mobile and desktop browsers. Security is enforced through JWT-based stateless authentication, BCrypt password hashing, and role-based access control (DONOR / NGO) at the service layer.

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | Spring Boot | 4.0.2 |
| Database | MongoDB | 7.x |
| Frontend Framework | React + Vite | 19.2 / 7.2 |
| Styling | Tailwind CSS | 4.1 |
| Real-Time | STOMP over WebSocket | — |
| Language | Java | 21 (LTS) |

---

### Methodology

The development followed a specification-driven methodology. Domain modeling identified five core entities (User, Donation, Rating, ChatMessage, Contact) and a four-state donation lifecycle (AVAILABLE → CLAIMED → COMPLETED / DELETED). A comprehensive security and reliability audit of the initial implementation identified 15 issues across six categories: authentication, authorization, data integrity, concurrency, scalability, and reliability.

Each issue was formally specified using bug condition pseudocode — a technique adapted from property-based testing methodology — which provides a precise, executable definition of both the defect and the expected fix. Fixes were validated using property-based tests written in JUnit 5:

- **Exploration tests** confirm that bugs are detectable on unfixed code.
- **Preservation tests** confirm that fixes do not introduce regressions.

---

### Results

All 15 identified bugs were successfully fixed, achieving 100% fix coverage. Key fixes include:

- Wiring a JWT authentication filter into the Spring Security filter chain.
- Enforcing server-side ownership verification for all donation operations.
- Implementing OTP-based password reset.
- Adding optimistic locking with retry logic for concurrent claim handling.
- Introducing a compound unique index to prevent duplicate ratings.

**Performance benchmarks:**

| Metric | Result |
|--------|--------|
| Geospatial query (10,000 docs, 10 km radius) | < 5 ms |
| WebSocket broadcast latency (50 connections) | < 50 ms |
| API response time (non-auth endpoints) | < 20 ms |
| First Contentful Paint (frontend) | ~0.8 s |
| Gzipped bundle size | ~180 KB |

---

### Impact and Contribution

The platform tracks three measurable impact metrics: total meals rescued, CO₂ diverted from landfill (0.5 kg per meal, per WRAP estimates), and active NGO count. A modest deployment of 100 donations per month averaging 50 meals each would rescue 5,000 meals and divert 2.5 tonnes of CO₂ monthly.

Beyond the application itself, this project contributes:

- A formal security audit methodology using bug condition pseudocode.
- A property-based testing framework for Spring Boot / MongoDB applications.
- A reference architecture for geospatial, real-time, role-based web applications.

---

**Keywords:** Food Rescue, Food Waste Redistribution, Spring Boot, MongoDB, Geospatial Indexing, WebSocket, STOMP, React, JWT Authentication, Property-Based Testing, Security Audit, Bug Condition Pseudocode, Role-Based Access Control, Real-Time Notification.
