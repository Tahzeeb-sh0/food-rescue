# Food Rescue — Frontend Interview Q&A

All questions are directly about this project.

---

## Project Overview

**Q: What is the frontend of this project built with?**
React 19, Vite, Tailwind CSS v4, and React Router v7. Real-time features use STOMP over SockJS.

**Q: What is the purpose of the frontend?**
It provides two dashboards — one for Donors to post surplus food, and one for NGOs to find and claim nearby donations. It also has public pages like Home, Impact, Leaderboard, and How It Works.

**Q: How is the frontend started?**
Run `npm run dev` inside the `Frontend/` folder. Vite serves it on `http://localhost:5173`.

---

## Entry Point & App Setup

**Q: What does `main.jsx` do?**
It mounts the React app. It wraps everything in `StrictMode`, `BrowserRouter` for routing, and `Auth0Provider` for future OAuth support, then renders `App.jsx`.

**Q: What does `App.jsx` do?**
It just renders the `Router` component. All route definitions live in `Router.jsx`.

**Q: Why is `Auth0Provider` in `main.jsx` if Auth0 isn't actively used?**
It's scaffolded for future social/OAuth login. The current login flow uses phone + password via the custom backend API.

---

## Routing

**Q: How are routes organized in this project?**
All routes are defined in `Router.jsx` under a single `<Layout>` parent route. Protected dashboard routes are wrapped in `<ProtectedRoute>`.

**Q: What are the two separate login flows?**
Donors use `/donor/login` and `/donor/register`. NGOs use `/ngo/login` and `/ngo/register`. They hit the same backend endpoint but the role is set differently.

**Q: How does `ProtectedRoute` work?**
It reads the user from `localStorage`. If no user is found, it redirects to the correct login page based on the URL path. If the user has the wrong role (e.g., a donor visiting `/ngo/dashboard`), it redirects them to their own dashboard.

**Q: What happens after login — how does the user get to their dashboard?**
After a successful login API call, the user object is saved to `localStorage` and `navigate('/donor/dashboard')` or `navigate('/ngo/dashboard')` is called based on the role.

---

## Donor Dashboard

**Q: What can a donor do on their dashboard?**
Post new food donations, view active donations and their status, see the 6-digit handover code when an NGO claims their donation, cancel available donations, rate the NGO after a completed pickup, and view past donation history.

**Q: How does posting a donation work?**
The donor fills in the title, description, estimated meals, and optional photo. On submit, the browser's Geolocation API captures the current coordinates. These are sent in a POST request to `/api/donations` along with the form data.

**Q: What happens if the donor denies location access?**
The geolocation error callback fires, `isSubmitting` is set back to false, and an error message is shown: "Location access was denied. Please allow location access to post a donation."

**Q: How does the photo upload work?**
The donor selects an image file. If it's under 5MB, `URL.createObjectURL()` creates a preview. On submit, `FileReader` converts it to a base64 data URL which is sent as `photoUrl` in the request body.

**Q: How does the donor see real-time status updates without refreshing?**
The dashboard subscribes to WebSocket topics on mount. When an NGO claims the donation, the `/topic/donations/claimed` event updates the donation card status from "Searching NGOs..." to "NGO Claimed" instantly.

**Q: What are the 4 KPI cards on the donor dashboard?**
Meals Diverted (sum of capacity from completed donations), CO2 Saved in kg (meals × 0.5), Active Transfers (count of non-completed donations), and Completed (count of completed donations).

**Q: How does the rating system work for donors?**
After a donation is completed, a `RatingModal` appears. The donor picks 1–5 stars and an optional comment. This is posted to `/api/ratings`. Rated donation IDs are saved in `localStorage` so the modal doesn't appear again after a refresh.

---

## NGO Dashboard

**Q: What can an NGO do on their dashboard?**
Browse available nearby food donations, claim one, coordinate with the donor via in-app chat, enter the 6-digit confirmation code to complete the pickup, and view their history and rating.

**Q: How does the NGO see nearby donations?**
On mount, the dashboard fetches from `/api/donations/nearby` using the NGO's stored location coordinates and a default radius of 10 km.

**Q: How does the radius slider work?**
Moving the slider calls `handleRadiusChange`, which updates the `radius` state and fires a new fetch to `/api/donations/nearby` with the new `radiusKm` value. It's a server-side query, not client-side filtering, because the geospatial calculation runs in MongoDB.

**Q: How does the NGO get alerted about new donations in real time?**
The dashboard subscribes to `/topic/donations/new`. When a new donation arrives, it's added to the grid and a toast alert (`DonationAlert`) pops up in the bottom-right corner. A browser push notification is also fired if permission was granted.

**Q: What is the toast alert stack?**
Up to 4 `DonationAlert` components stacked in the bottom-right corner. Each auto-dismisses after 8 seconds. The NGO can also click "Claim Now" directly from the toast.

**Q: How does claiming a donation work?**
The NGO clicks "Claim Now". A POST is sent to `/api/donations/{id}/claim` with the NGO's ID. If successful, the `activeClaim` state is set and the dashboard switches to the pickup view. If another NGO already claimed it, an error message is shown.

**Q: What is the pickup countdown timer?**
The `PickupCountdown` component calculates a 90-minute deadline from `claimedAt`. It updates every second using `setInterval`. When under 15 minutes remaining, the text turns red.

**Q: How does completing a pickup work?**
The NGO enters the 6-digit code they got from the donor into the input field and clicks "Confirm Pickup". A POST is sent to `/api/donations/{id}/complete`. If the code matches, the donation status becomes COMPLETED and a success screen is shown.

**Q: What are the 4 KPI cards on the NGO dashboard?**
Meals Delivered (sum of capacity from completed pickups), Available Nearby (count of donations in the current radius), Completed Pickups (total completed), and Your Rating (average star rating from donors).

**Q: How does the NGO dashboard restore an active claim after a page refresh?**
On mount, it fetches the NGO's donation history from `/api/donations/ngo/{id}`. If any donation has `status === 'CLAIMED'`, it sets that as `activeClaim`, restoring the pickup view automatically.

**Q: What is the search and filter bar?**
The NGO can filter donations by food name (text search), minimum meal count, and sort by newest, most meals, or fewest meals. All filtering is done client-side on the `donations` state array — no extra API calls.

**Q: What are the two view modes on the NGO dashboard?**
Grid view (default) shows donation cards. Map view shows a visual map with animated pins for nearby donations. The toggle is in the top-right of the donations section.

---

## Real-time (WebSocket)

**Q: How is the WebSocket connection set up?**
```js
const socket = new SockJS('http://localhost:8080/ws');
const client = Stomp.over(() => socket);
client.connect({}, () => { /* subscribe to topics */ });
```

**Q: How is the WebSocket connection cleaned up?**
The `useEffect` returns a cleanup function: `return () => { if (client.connected) client.disconnect(); }`. This runs when the component unmounts, preventing memory leaks.

**Q: How does the ChatBox connect to the right conversation?**
The `donationId` prop is used as the topic: `/topic/chat/{donationId}`. The `useEffect` has `donationId` in its dependency array, so if the donation changes, the component disconnects from the old topic and connects to the new one.

**Q: How are duplicate chat messages prevented?**
Before adding a new message to state, it checks if a message with the same `id` already exists. If it does, the state is returned unchanged. This is needed because the sender's own message comes back through the WebSocket broadcast.

**Q: How do browser push notifications work for new donations?**
When the `/topic/donations/new` event fires, the code calls `new Notification('🍱 New Food Available!', { body: ..., tag: donation.id })`. The `tag` field prevents duplicate browser notifications for the same donation. This works even when the browser tab is in the background.

---

## Components

**Q: What does `DashboardLayout` provide?**
A sidebar with navigation links, a sticky top header with a "Connected" status indicator and notification bell, and a scrollable main content area. It's role-aware — sidebar labels change for NGO vs Donor.

**Q: What does `DonationDetailModal` show?**
A modal with the donation photo, title, description, capacity, status badge, and a timeline showing when it was posted, claimed, and completed. If the donation is CLAIMED and the viewer is the donor, it shows the 6-digit handover code. If the viewer is an NGO and the donation is AVAILABLE, it shows a "Claim" button.

**Q: What does `NotificationCenter` do?**
It's the bell icon in the dashboard header. It subscribes to WebSocket events and stores notifications in `localStorage` (max 50). It shows an unread count badge. Clicking the bell opens a dropdown list of recent notifications with timestamps.

**Q: What does `MapView` show?**
A dark-themed map with animated grid lines and pulsing scan circles. It shows mock pins for nearby donations or NGOs. Real map integration (Mapbox/Leaflet) would replace this in production.

---

## State Management

**Q: Where is the logged-in user stored?**
In `localStorage` under the key `"user"` as a JSON string. It contains the user's id, name, role, and location — never the password.

**Q: How do components access the logged-in user?**
On mount with `const savedUser = localStorage.getItem('user'); if (savedUser) setUser(JSON.parse(savedUser));`

**Q: Does this project use Redux or any global state library?**
No. Local `useState` and `localStorage` are sufficient for this project's scope.

**Q: How is the notification list persisted across page refreshes?**
The `NotificationCenter` reads from and writes to `localStorage` on every update. The list is capped at 50 items.

---

## Styling

**Q: What CSS framework is used?**
Tailwind CSS v4, integrated via the `@tailwindcss/vite` plugin — no separate PostCSS config needed.

**Q: How is the sidebar hidden on mobile?**
It uses Tailwind's `-translate-x-full` class by default and `translate-x-0` when `sidebarOpen` is true. A dark overlay with `backdrop-blur` covers the rest of the screen. Clicking the overlay closes the sidebar.

**Q: What is `structured-card`?**
A custom CSS class in `index.css` that applies consistent card styling (border, rounded corners, background) used across both dashboards.

**Q: What icon library is used?**
`lucide-react` — used for all icons throughout the UI (Leaf, MapPin, CheckCircle, Bell, etc.).

---

## API & Data Fetching

**Q: What library is used for HTTP requests?**
The native browser `fetch` API. No Axios or other library.

**Q: How is the leaderboard data fetched?**
`LeaderboardPage` first fetches all NGOs from `/api/users/ngos`, then for each NGO it fetches their donations and average rating in parallel using `Promise.allSettled`. Results are sorted by total meals delivered.

**Q: How does the Impact page get its stats?**
It fetches from `/api/stats/impact` on mount and displays total meals rescued, active NGOs, and CO2 diverted. If the fetch fails, it shows dashes instead of crashing.

**Q: How does the NGO dashboard fetch its average rating?**
On mount: `fetch('http://localhost:8080/api/ratings/ngo/{id}/average')`. The result is stored in `avgRating` state and displayed in the KPI card.

---

## Auth & Security

**Q: How does login work?**
The login form sends a POST to `/api/users/login` with phone and password. On success, the server returns the user object (no password). It's saved to `localStorage` and the user is redirected to their dashboard.

**Q: How does logout work?**
`localStorage.removeItem('user')` is called and `navigate('/')` sends the user to the home page.

**Q: What is the known security limitation of the current auth approach?**
The user object in `localStorage` has no expiry and no token. Anyone with access to the browser's localStorage can read it. The improvement would be to issue a JWT on login, store it in an `httpOnly` cookie, and send it as a `Bearer` token on every API request.
