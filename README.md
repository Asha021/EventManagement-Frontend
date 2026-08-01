# Cactus Fashions — Event Management (Frontend)

A React + Vite frontend for browsing, discovering, and registering for fashion
industry events (runway shows, trunk shows, pop-ups, trade shows, workshops,
launch parties). **No backend** — all data is dummy JSON in `src/data/`, with
state persisted to `localStorage` so logins and bookings survive a refresh.

## Tech stack
- React 19 + Vite (JavaScript, no TypeScript, no Next.js)
- React Router DOM (client-side routing)
- Tailwind CSS
- shadcn/ui-style components (hand-built on Radix primitives: dialog, select, tabs)
- lucide-react icons

## Getting started
```bash
npm install
npm run dev
```
Open the printed local URL (usually `http://localhost:5173`).

To build for production:
```bash
npm run build
npm run preview
```

## Demo accounts
| Role  | Email                        | Password    |
|-------|-------------------------------|-------------|
| User  | aisha@example.com             | password123 |
| User  | rohan@example.com             | password123 |
| Admin | admin@cactusfashions.com      | admin123    |

You can also register a new account from `/register` — it's added to the
in-memory dummy user list for the session.

## Folder structure
```
src/
  components/
    ui/         shadcn-style primitives (button, input, card, badge, select, tabs, dialog...)
    layout/     Navbar, Footer
    events/     EventCard, EventThumb, SeatGauge
  layouts/      MainLayout (navbar+footer), AuthLayout (split login/register screen)
  pages/        Home, Events, EventDetails, Login, Register, Dashboard,
                MyBookings, AdminDashboard, EventForm, NotFound
  routes/       ProtectedRoute, AdminRoute (route guards)
  context/      AuthContext (login/register/logout), BookingsContext (register/
                cancel/CRUD events, live seat counts)
  data/         events.js (12 dummy events), users.js (dummy accounts)
  lib/          utils.js (cn, date formatting helpers)
```

## Features implemented
- **Auth (dummy JWT-style):** register, login, logout, protected routes
- **Event listings:** browse, view details, register, cancel registration
- **Discovery:** search by name/organizer/tag, filter by category/date/location,
  browsing state kept in the URL (`?q=&category=&location=&page=`) so back/
  forward navigation preserves filters, "Load more" pagination for large
  collections, live seat availability via a fill-bar gauge
- **User dashboard:** registered events count, upcoming events, past event history
- **My Bookings:** tabbed upcoming/past view with cancel action
- **Admin dashboard:** table of all events with create / edit / delete
  (delete has a confirmation dialog)

## Notes
- All "photos" are generated abstract SVG thumbnails (per-category gradients),
  since there's no backend/image storage — swap `EventThumb` for real `<img>`
  tags once you wire up a backend.
- Capacity/seat counts update live in memory (and persist via localStorage)
  when you register or cancel.
