# 🚀 LeadCRM — Real Estate Lead Management System

A modern, full-stack **Mini CRM** built for real estate businesses to capture, track, and convert leads efficiently.

Designed as a **production-grade assignment**, this project showcases clean architecture, scalable backend design, and a polished frontend experience.

🔗 **GitHub Repository:**

---

## ✨ What This Project Solves

Managing real estate leads manually is chaotic. Leads get lost, follow-ups are missed, and conversion drops.

**LeadCRM fixes this by:**

- Centralizing all leads in one place
- Tracking lead lifecycle from **New → Closed**
- Providing insights via a **dashboard**
- Enabling quick actions with a clean UI

---

## 🧠 Key Highlights

- ⚡ Full-stack TypeScript (end-to-end type safety)
- 🧩 Monorepo architecture (scalable & clean)
- 🔁 Real-time-like UX with auto-refresh dashboard
- 📊 Data visualization (charts for insights)
- 🛡️ Strong validation using Zod (frontend + backend)
- 🧱 Production-ready backend structure (controllers, services, middleware)
- 🎯 Clean UI with responsive design

---

## 🏗️ Tech Stack

### 🔹 Frontend

- React 18 + Vite
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (data fetching)
- React Hook Form + Zod
- Recharts (dashboard charts)

### 🔹 Backend

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod validation
- REST APIs

### 🔹 Dev Architecture

- Monorepo (npm workspaces)
- Shared package for types & schemas

---

## 📦 Project Structure (Simplified)

```
apps/
  client/     → React frontend
  server/     → Express backend
packages/
  shared/     → Common types, schemas, enums
```

---

## ⚙️ Features

### 🧾 Lead Management

- Create leads with full details
- Search by name/phone
- Filter by source & status
- Sort by date or budget
- View detailed lead page
- Update lead status
- Add notes/comments
- Delete leads

---

### 📊 Dashboard

- Total Leads
- Conversion Rate
- Leads by Source
- Status Distribution
- Auto-refresh every 30 seconds

---

### 🎯 UX & Quality

- Form validation (Zod)
- Error handling (API + UI)
- Loading skeletons
- Toast notifications
- Responsive design

---

## 🔌 API Overview

```
POST   /api/leads
GET    /api/leads
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id
PATCH  /api/leads/:id/status

POST   /api/leads/:id/notes
GET    /api/leads/:id/notes

GET    /api/dashboard/summary
GET    /health
```

---

## 🛠️ Setup & Installation

### 📌 Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

---

### 1️⃣ Clone the repo

```bash
git clone https://github.com/hetpatel4381/CRM_LEADS.git
cd CRM_LEADS
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Configure Environment Variables

#### 📍 Backend (`apps/server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead-crm
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### 📍 Frontend (`apps/client/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

### 4️⃣ Run the project

#### Run both (recommended)

```bash
npm run dev
```

#### Or separately:

**Backend**

```bash
npm run dev:server
```

**Frontend**

```bash
npm run dev:client
```

---

### 🌐 Access URLs

- Frontend → [http://localhost:5173](http://localhost:5173)
- Backend → [http://localhost:5000](http://localhost:5000)
- Health Check → [http://localhost:5000/health](http://localhost:5000/health)

---

## 🧪 Assumptions

- Single admin user (no authentication)
- Phone number is unique per lead
- Email is optional
- Budget stored in INR
- Notes are immutable (audit trail)

---

## ⚠️ Edge Cases Handled

- Duplicate leads (phone-based)
- Invalid Object IDs
- Empty form inputs
- Invalid enum values
- API/network failures
- Pagination reset on filters
- Zero data dashboard states

---

## 🔮 Future Improvements

- Authentication (JWT)
- Lead assignment to agents
- Follow-up reminders
- CSV export
- Activity logs
- Dark mode
- Testing (unit + integration)

---

## 🎯 Why This Project Matters

This isn’t just CRUD.

It demonstrates:

- Real-world **problem solving**
- Clean **backend architecture**
- Scalable **frontend patterns**
- Strong **developer experience**

---

## 👨‍💻 Author

**Het Patel**

- GitHub: [https://github.com/hetpatel4381](https://github.com/hetpatel4381)
- LinkedIn: [https://linkedin.com/in/het-patel-0407bb1b7](https://linkedin.com/in/het-patel-0407bb1b7)

---

## ⭐ If you like this project

Give it a star ⭐ — it helps more than you think.

---

If you want next level impact, I can:

- Help you turn this into a **killer PPT (10/10 selection chances)**
- Add **system design diagram slide**
- Or craft **interview questions based on your own project**

Just say the word 🚀
