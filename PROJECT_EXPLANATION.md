# Food Rescue Platform — Project Explanation

## What is this project?

Food Rescue is a full-stack web application that connects **food donors** (restaurants, bakeries, caterers, etc.) with **NGOs** (non-governmental organizations) to rescue surplus food before it goes to waste. Donors post available food, nearby NGOs claim it in real time, and a secure handover code confirms the pickup.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7 |
| Real-time | STOMP over WebSocket (SockJS + @stomp/stompjs) |
| Backend | Spring Boot 4, Java 21 |
| Database | MongoDB (with geospatial indexing) |
| Security | Spring Security, BCrypt password hashing |
| Build | Gradle (backend), Vite (frontend) |

---

## Architecture Overview

```
Browser (React SPA)
      │
      ├── REST API calls ──────────────► Spring Boot REST Controllers
      │                                         │
      └── WebSocket (STOMP/SockJS) ────────────►│
                                                 │
                                          MongoDB (Atlas / local)
```

The frontend is a single-page application. The backend exposes a REST API and a WebSocket endpoint. MongoDB stores users, donations, ratings, chat messages, and contact submissions.

---

## Core Domain

### User Roles
- **DONOR** — businesses or individuals with surplus food
- **NGO** — organizations that collect and distribute food to those in need

### Donation Lifecycle
```
AVAILABLE → CLAIMED → COMPLETED
              ↓
           CANCELLED (donor cancels or auto-expires after 4 hours)
```

### Key Models
- `User` — name, phone, hashed password, role, GeoJSON location
- `Donation` — title, description, capacity (meals), pickup location, status, confirmation code, timestamps
- `Rating` — NGO rating left by donor after a completed pickup (1–5 stars + comment)
- `ChatMessage` — real-time chat tied to a specific donation

---

## Key Features

### 1. Donor Dashboard
- Post a new food donation with title, description, estimated meals, optional photo, and live GPS location
- View active donations and their status (searching NGOs / NGO claimed)
- See a secure 6-digit handover code to share with the NGO at pickup
- Cancel available donations
- Rate the NGO after a completed pickup
- Real-time status updates via WebSocket (no page refresh needed)
- KPI cards: total meals diverted, CO₂ saved, active transfers, completed donations

### 2. NGO Dashboard
- Browse available food donations nearby (configurable radius: 5–50 km)
- Grid view or interactive map view
- Search and filter by food name, minimum meals, sort order
- Real-time toast alerts + browser push notifications when new food is posted
- Claim a donation with one click (optimistic locking prevents double-claims)
- 90-minute pickup countdown timer after claiming
- Enter the donor's confirmation code to complete the pickup
- In-app chat with the donor during an active pickup
- KPI cards: meals delivered, available nearby, completed pickups, average rating

### 3. Real-time System (WebSocket)
Four broadcast topics keep all connected clients in sync:
- `/topic/donations/new` — new donation posted
- `/topic/donations/claimed` — donation claimed by an NGO
- `/topic/donations/completed` — pickup confirmed
- `/topic/donations/cancelled` — donation cancelled or auto-expired

### 4. Geospatial Search
MongoDB's `2dsphere` index on `pickupLocation` enables efficient radius queries. NGOs see only donations within their chosen radius. When a donation is created, the backend also finds NGOs within 10 km and triggers push/SMS notifications.

### 5. Donation Auto-Expiry
A scheduled job runs every 15 minutes. Any `AVAILABLE` donation older than 4 hours is automatically deleted and a cancellation event is broadcast so NGO dashboards remove the card instantly.

### 6. Leaderboard & Impact Stats
- Public leaderboard ranks NGOs by total meals rescued (with CO₂ savings calculated at 0.5 kg per meal)
- Global impact stats endpoint aggregates platform-wide numbers for the public homepage

### 7. Authentication
- Phone-number + password login (no email required)
- Passwords hashed with BCrypt
- Stateless session (no server-side sessions or JWT — the user object is stored in `localStorage` on the client)
- Role-based protected routes on the frontend (`ProtectedRoute` component)
- Spring Security permits public endpoints (register, login, stats, leaderboard, WebSocket) and requires authentication for everything else

### 8. Additional Pages
The frontend includes a full set of public-facing pages: Home, How It Works, Impact, Leaderboard, About, Contact, Network, Careers, Help Center, API Docs, Press, Safety, Compliance, and legal pages (Privacy Policy, Terms of Service, Cookie Policy).

---

## Project Structure

```
/
├── Backend/                  Spring Boot application
│   └── src/main/java/com/food/food_rescue/
│       ├── config/           Security, WebSocket, CORS config
│       ├── controller/       REST endpoints (User, Donation, Chat, Leaderboard, Stats, Rating, Contact)
│       ├── dto/              Request/response data transfer objects
│       ├── model/            MongoDB documents (User, Donation, Rating, ChatMessage, etc.)
│       ├── repository/       Spring Data MongoDB repositories
│       └── service/          Business logic (DonationService, DonationExpiryService, StatsService, NotificationService)
│
└── Frontend/                 React SPA
    └── src/
        ├── components/       Reusable UI (ChatBox, MapView, DonationDetailModal, NotificationCenter, layout)
        ├── pages/            All page components (DonorDashboard, NgoDashboard, HomePage, etc.)
        └── routes/           React Router configuration
```

---

## Interesting Technical Decisions

| Decision | Reason |
|---|---|
| MongoDB with GeoJSON | Native geospatial queries for radius-based donation discovery |
| Optimistic locking (`@Version`) on Donation | Prevents two NGOs from claiming the same donation simultaneously |
| STOMP over SockJS | Provides WebSocket with automatic fallback for environments that block WebSocket |
| `SecureRandom` for confirmation codes | Cryptographically secure 6-digit codes for handover verification |
| Scheduled expiry job | Keeps the donation feed clean without requiring donors to manually close listings |
| BCrypt password hashing | Industry-standard one-way hashing; raw passwords are never stored |
| Anti-enumeration on forgot-password | Always returns the same response regardless of whether the phone number exists |

---

## How a Typical Flow Works

1. A bakery (Donor) logs in, clicks "New Donation", fills in the form, and submits. The browser captures their GPS coordinates.
2. The backend saves the donation, broadcasts it on `/topic/donations/new`, and notifies nearby NGOs via push/SMS.
3. An NGO sees the toast alert on their dashboard, clicks "Claim Now".
4. The backend sets the donation to `CLAIMED` using optimistic locking and broadcasts the update.
5. The NGO drives to the pickup location. The donor shares the 6-digit code.
6. The NGO enters the code in the dashboard. The backend verifies it and marks the donation `COMPLETED`.
7. The donor is prompted to rate the NGO (1–5 stars).
8. The NGO's leaderboard score and meal count update automatically.


---

# Frontend Interview Questions & Answers

---

## React & Component Architecture

**Q: What version of React are you using and what new features does it bring?**

React 19. The main additions relevant here are improved `use()` hook support, better async transitions, and compiler-level optimizations. The project uses `createRoot` from `react-dom/client` (introduced in React 18) and wraps the app in `StrictMode` to catch side-effect issues during development.

---

**Q: How is the app structured at the top level?**

`main.jsx` mounts the app inside `StrictMode`, wraps it with `BrowserRouter` for client-side routing, and wraps everything in `Auth0Provider` for optional OAuth support. `App.jsx` simply renders the `Router` component, which defines all routes using React Router v7's `<Routes>` and `<Route>` declarative API.

---

**Q: How do you handle protected routes?**

There's a `ProtectedRoute` component that reads the user object from `localStorage`. If no user is found, it redirects to the appropriate login page (donor or NGO) using React Router's `<Navigate>` and passes the original location in `state` so the user can be redirected back after login. If a user is logged in but has the wrong role (e.g., a donor trying to access `/ngo/dashboard`), they're redirected to their own dashboard instead.

```jsx
// ProtectedRoute checks role and redirects accordingly
if (requiredRole && user.role !== requiredRole) {
  const redirectPath = user.role === 'NGO' ? '/ngo/dashboard' : '/donor/dashboard';
  return <Navigate to={redirectPath} replace />;
}
```

---

**Q: How is state managed across the app?**

The project uses local component state with `useState` and `useEffect` — no global state library like Redux or Zustand. User session data is persisted in `localStorage` and read on component mount. This is intentional for a project of this scope; adding a global store would be the next step if the app grew more complex.

---

**Q: How do you avoid prop drilling in the dashboard layouts?**

The `DashboardLayout` component wraps all dashboard pages and provides the sidebar, header, and navigation. It reads the user from `localStorage` directly rather than receiving it as a prop, which avoids threading user data through multiple layers. Child pages are rendered via the `children` prop.

---

## Real-time & WebSocket

**Q: How does real-time communication work on the frontend?**

The app uses STOMP over SockJS. SockJS provides a WebSocket connection with automatic fallback (long-polling, etc.) for environments that block WebSocket. The STOMP protocol adds message routing on top of the raw socket.

Each dashboard component connects on mount and subscribes to relevant topics:

```js
const socket = new SockJS('http://localhost:8080/ws');
const client = Stomp.over(() => socket);
client.connect({}, () => {
  client.subscribe('/topic/donations/new', (msg) => { ... });
});
```

The connection is cleaned up in the `useEffect` return function to prevent memory leaks.

---

**Q: What topics does the NGO dashboard subscribe to?**

- `/topic/donations/new` — adds the new donation card to the grid and triggers a toast alert
- `/topic/donations/claimed` — removes the donation from the available grid (someone else claimed it)
- `/topic/donations/cancelled` — removes a cancelled or auto-expired donation
- `/topic/donations/completed` — updates the active claim view when the pickup is confirmed

---

**Q: How does the ChatBox component handle real-time messaging?**

On mount (or when `donationId` changes), it:
1. Fetches the full message history from the REST API
2. Opens a new STOMP connection and subscribes to `/topic/chat/{donationId}`
3. Deduplicates incoming messages by checking if the `id` already exists in state

Sending a message uses `stompClient.send()` rather than a REST call, so it's delivered instantly to all subscribers. The `useEffect` dependency on `donationId` ensures the component resets and reconnects when switching between donations.

---

**Q: How do you prevent duplicate messages in the chat?**

```js
setMessages(prev => {
  if (prev.find(m => m.id === message.id)) return prev;
  return [...prev, message];
});
```

The sender's own message comes back through the WebSocket subscription (the server broadcasts to all subscribers including the sender), so this deduplication check prevents it from appearing twice.

---

**Q: How do browser push notifications work in the NGO dashboard?**

On mount, the app requests `Notification.permission`. If granted, when a new donation WebSocket event arrives, it fires a `new Notification(...)` with the donation title and meal count. The `tag` field is set to the donation ID, which prevents duplicate browser notifications for the same donation. This works even when the browser tab is in the background.

---

## State & Side Effects

**Q: How does the NGO dashboard handle the active claim state?**

When the page loads, it fetches the NGO's donation history and looks for any donation with `status === 'CLAIMED'`. If found, it sets that as `activeClaim`. This means if the user refreshes mid-pickup, the active claim view is restored automatically. The WebSocket subscription also updates `activeClaim` when a completion event arrives.

---

**Q: How does the donor dashboard track which donations have been rated?**

Rated donation IDs are stored in `localStorage` under the key `ratedDonations`. On mount, the state is initialized from localStorage:

```js
const [ratedIds, setRatedIds] = useState(() => {
  try { return JSON.parse(localStorage.getItem('ratedDonations') || '[]'); } catch { return []; }
});
```

After a successful rating submission, the new ID is appended and saved back. This prevents the rating prompt from appearing again after a page refresh.

---

**Q: How does the pickup countdown timer work?**

The `PickupCountdown` component takes `claimedAt` as a prop, calculates a 90-minute deadline, and uses `setInterval` to update the remaining time every second. When under 15 minutes, it switches to red text. The interval is cleared in the `useEffect` cleanup to avoid memory leaks.

---

**Q: How do you handle geolocation for posting a donation?**

The form submission calls `navigator.geolocation.getCurrentPosition()`. The coordinates are sent directly in the POST body to the backend. If the user denies location access, a clear error message is shown. The `isSubmitting` flag is set before the geolocation call and cleared in both the success and error callbacks.

---

## Performance & UX

**Q: How do you handle loading and error states?**

Every data-fetching operation has three states: loading (shows a spinner), error (shows a retry button with a descriptive message), and success (renders the data). The pattern is consistent across all pages — `isLoading`, `fetchError`, and the data state variable.

---

**Q: How does the notification center persist notifications across page refreshes?**

The `NotificationCenter` component reads from and writes to `localStorage` under the key `app_notifications`. It caps the stored list at 50 items. The `timeAgo` helper formats timestamps relative to the current time. Clicking a notification marks it as read; there's also a "clear all" button.

---

**Q: How does the search and filter work on the NGO dashboard?**

It's entirely client-side — no extra API calls. The `filteredDonations` array is derived from the `donations` state using `.filter()` and `.sort()` on every render:

```js
const filteredDonations = donations
  .filter(d => {
    const matchesSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCapacity = !minCapacity || d.capacity >= parseInt(minCapacity);
    return matchesSearch && matchesCapacity;
  })
  .sort((a, b) => { ... });
```

This is fine for the expected data volume. For thousands of records, memoizing with `useMemo` would be the next step.

---

**Q: How does the radius slider work?**

The slider calls `handleRadiusChange` on every change, which updates the `radius` state and triggers a new API call to `/api/donations/nearby` with the updated `radiusKm` parameter. This re-fetches from the server rather than filtering client-side, because the geospatial query needs to run on the database.

---

## Routing & Navigation

**Q: How many routes does the app have and how are they organized?**

All routes are defined in `Router.jsx` under a single `<Layout>` parent route, which provides the shared header and footer. Protected routes are wrapped in `<ProtectedRoute>` with an optional `requiredRole` prop. There are separate auth flows for donors (`/donor/login`, `/donor/register`) and NGOs (`/ngo/login`, `/ngo/register`).

---

**Q: How does the DashboardLayout differ from the main Layout?**

`Layout` (used for public pages) renders the marketing header and footer. `DashboardLayout` renders a sidebar with navigation links, a sticky top header with a "Connected" status indicator, and a notification bell. It's role-aware — the sidebar labels and links change depending on whether `role` is `"NGO"` or `"DONOR"`.

---

## Styling

**Q: What CSS framework are you using and how?**

Tailwind CSS v4 via the `@tailwindcss/vite` plugin. All styling is done with utility classes directly in JSX. There are no separate CSS modules. Custom design tokens (like `primary-700`, `accent-500`) are defined in the Tailwind config. The `structured-card` class is a custom component class defined in `index.css`.

---

**Q: How do you handle responsive design?**

Tailwind's responsive prefixes (`md:`, `lg:`, `sm:`) are used throughout. For example, the donation form switches from a stacked layout to a side-by-side layout at `md:` breakpoint. The sidebar is hidden on mobile and toggled with a hamburger button, using a fixed overlay with `backdrop-blur` for the mobile drawer effect.

---

## Auth & Security

**Q: How is authentication handled on the frontend?**

After a successful login, the server returns a `UserResponse` object (id, name, role, location — no password). This is stored in `localStorage` as a JSON string. All subsequent API calls include the user's `id` in the request body or URL params. There's no JWT or session cookie — the backend currently uses Spring Security with stateless sessions but doesn't enforce token-based auth on most endpoints.

**Note for interview:** This is a known limitation. The next step would be to issue a JWT on login, store it in an `httpOnly` cookie or memory, and send it as a `Bearer` token on every request. The `ProtectedRoute` component would then validate the token's expiry client-side.

---

**Q: What happens if `localStorage` is corrupted?**

`ProtectedRoute` wraps the `JSON.parse` call in a try/catch. If parsing fails, it removes the corrupted item and treats the user as logged out, redirecting to the login page. The same pattern is used in `DashboardLayout` and the dashboard pages.
