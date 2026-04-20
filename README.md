# LeadCRM — Real Estate Lead Management System

A full-stack mini CRM built for managing real estate leads. Designed as a production-quality assignment demonstrating clean architecture, strong TypeScript usage, and a polished UI.

---

## Tech Stack

| Layer       | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| Monorepo    | npm workspaces                                                             |
| Frontend    | React 18, Vite, TypeScript, React Router v6, Tailwind CSS, shadcn/ui      |
| State       | TanStack Query v5                                                          |
| Forms       | React Hook Form + Zod                                                      |
| HTTP        | Axios                                                                      |
| Charts      | Recharts                                                                   |
| Icons       | Lucide React                                                               |
| Toasts      | Sonner                                                                     |
| Backend     | Node.js, Express, TypeScript                                               |
| Database    | MongoDB + Mongoose                                                         |
| Validation  | Zod (shared between frontend and backend)                                  |
| Middleware  | helmet, cors, morgan, express-rate-limit                                   |
| Shared Pkg  | Common types, enums, Zod schemas                                           |

---

## Project Structure

```
lead-management-crm/
├── apps/
│   ├── client/                  # React + Vite frontend
│   │   └── src/
│   │       ├── api/             # Axios API functions
│   │       ├── components/ui/   # shadcn/ui components
│   │       ├── constants/       # Enums, colors, labels
│   │       ├── features/
│   │       │   ├── dashboard/   # MetricCard, StatusChart, SourceChart
│   │       │   └── leads/       # LeadTable, LeadFilters, LeadForm, StatusBadge
│   │       ├── layouts/         # MainLayout (sidebar nav)
│   │       ├── lib/             # cn utility, formatters
│   │       ├── pages/           # DashboardPage, LeadsPage, AddLeadPage, LeadDetailPage, NotFoundPage
│   │       └── routes/          # React Router config
│   └── server/                  # Express backend
│       └── src/
│           ├── config/          # env config
│           ├── controllers/     # lead, note, dashboard controllers
│           ├── middlewares/     # errorHandler, notFound, validate
│           ├── models/          # Lead.model.ts, Note.model.ts
│           ├── routes/          # lead.routes.ts, dashboard.routes.ts
│           ├── services/        # lead, note, dashboard services
│           ├── types/           # Express request types
│           └── utils/           # apiResponse helper
└── packages/
    └── shared/                  # Common TypeScript types, enums, Zod schemas
        └── src/
            ├── enums.ts
            ├── types.ts
            ├── schemas.ts
            └── index.ts
```

---

## Setup Instructions

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally on port 27017 (or a MongoDB Atlas URI)

### 1. Clone / navigate to the project

```bash
cd lead-management-crm
```

### 2. Install all dependencies

```bash
npm install
```

This installs dependencies for all workspaces (root, shared, server, client) in one command.

### 3. Configure environment variables

**Server** — create `apps/server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead-crm
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Client** — create `apps/client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> Both `.env` files are already created from the `.env.example` templates if you ran the setup script. Just edit the values as needed.

### 4. Run in development

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
npm run dev:server
```

**Terminal 2 — Frontend:**
```bash
npm run dev:client
```

Or run both concurrently from the root:
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

---

## Available Scripts

| Command             | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Run server + client concurrently         |
| `npm run dev:server`| Run only the backend                     |
| `npm run dev:client`| Run only the frontend                    |
| `npm run build`     | Build all packages for production        |

---

## Environment Variables

### `apps/server/.env`

| Variable      | Default                                | Description                    |
|---------------|----------------------------------------|--------------------------------|
| `PORT`        | `5000`                                 | Express server port            |
| `MONGODB_URI` | `mongodb://localhost:27017/lead-crm`   | MongoDB connection string      |
| `NODE_ENV`    | `development`                          | Environment                    |
| `CORS_ORIGIN` | `http://localhost:5173`                | Allowed CORS origin            |

### `apps/client/.env`

| Variable       | Default                  | Description                    |
|----------------|--------------------------|--------------------------------|
| `VITE_API_URL` | `http://localhost:5000`  | Backend API base URL           |

> **Note:** When using the Vite dev proxy (default), the client proxies `/api` requests to `http://localhost:5000`, so `VITE_API_URL` can be left empty or set to `http://localhost:5000`.

---

## Features Implemented

### Lead Management
- ✅ Create a lead (name, phone, email, budget, location, property type, source)
- ✅ List all leads in a sortable, filterable, paginated table
- ✅ Search leads by name or phone (partial, case-insensitive)
- ✅ Filter by lead source and status
- ✅ Sort by date (newest/oldest) or budget (high/low)
- ✅ View full lead detail page
- ✅ Update lead status (New → Contacted → Site Visit → Closed / Lost)
- ✅ Delete a lead (with confirmation dialog)
- ✅ Add timestamped notes to a lead
- ✅ Notes displayed newest first

### Dashboard
- ✅ Total leads count
- ✅ Conversion rate (Closed / Total × 100)
- ✅ Active leads (New + Contacted)
- ✅ Site visit count
- ✅ Status breakdown mini-cards
- ✅ Status distribution pie chart
- ✅ Leads by source bar chart
- ✅ Auto-refreshes every 30 seconds

### UX States
- ✅ Loading skeletons on all data-fetching screens
- ✅ Empty state with messaging
- ✅ Error state with retry option
- ✅ Disabled submit buttons during pending mutations
- ✅ Inline Zod validation errors on forms
- ✅ Toast notifications for success and failure
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Mobile sidebar with overlay

### API
- ✅ `POST /api/leads`
- ✅ `GET /api/leads` (with search, source, status, sortBy, sortOrder, page, limit)
- ✅ `GET /api/leads/:id`
- ✅ `PUT /api/leads/:id`
- ✅ `DELETE /api/leads/:id`
- ✅ `PATCH /api/leads/:id/status`
- ✅ `POST /api/leads/:id/notes`
- ✅ `GET /api/leads/:id/notes`
- ✅ `GET /api/dashboard/summary`
- ✅ `GET /health`

---

## Assumptions Made

1. **No authentication** — the app is for a single internal admin user. Auth is intentionally out of scope.
2. **Phone uniqueness** — phone number is used as a natural unique identifier for leads to prevent duplicates.
3. **Email optional** — email can be omitted; if provided, it must be a valid format.
4. **Budget in INR** — budget is stored as a plain number (rupees). Display uses `₹`, with automatic lakh/crore formatting.
5. **Conversion rate** = Closed leads / Total leads × 100. Returns `0` when total is 0 (no division by zero).
6. **Notes immutable** — notes cannot be edited or deleted once added (by design, for audit trail purposes).
7. **Pagination** — default page size is 10. Pagination state resets when filters change.
8. **Search** — partial match on both name and phone, case-insensitive, using regex.
9. **Status flow** — any status can transition to any other (no enforced linear flow), giving the admin flexibility.
10. **Shared types** — the `@crm/shared` package is resolved via TypeScript path aliases and Vite aliases at build time. No separate build step is needed for development.

---

## Edge Cases Handled

- Duplicate phone on create → 409 Conflict with clear error message
- Invalid MongoDB ObjectId → 400 Bad Request
- Lead not found → 404 Not Found
- Negative/zero budget → Zod validation error
- Empty/whitespace-only fields → Zod trim + min(1) validation
- Invalid enum values → Zod nativeEnum validation
- Empty note submission → Zod validation error
- Division by zero in conversion rate → explicitly handled
- Dashboard with zero leads → all counts return 0, charts show "No data" state
- No search results → empty state with helpful message
- Pagination with filters → page resets to 1 on filter change
- API/network error → error state component with retry button
- Delete non-existent lead → 404 from service
- Rate limiting → 200 requests per 15 minutes per IP

---

## Future Improvements

- [ ] Lead edit page (PUT /api/leads/:id via frontend form)
- [ ] CSV export of leads
- [ ] Bulk status update
- [ ] Lead assignment to agents
- [ ] Follow-up date/reminder system
- [ ] Email notifications
- [ ] Authentication (JWT or session-based)
- [ ] Activity log/audit trail per lead
- [ ] Advanced analytics (monthly trend chart, funnel view)
- [ ] Dark mode toggle
- [ ] Unit and integration tests (Vitest + Supertest)
#   C R M _ L E A D S  
 