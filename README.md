# 🏥 MedAxis - Digital Operation Logbook

> **Centered Around Better Care**

A modern, mobile-first SaaS platform for Orthopedic Surgeons to register surgical cases in under 60 seconds.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional, for database)

### 1. Start Database

**With Docker (recommended):**
```bash
docker-compose up -d
```

**Or use an existing PostgreSQL instance.**

### 2. Backend Setup

```bash
cd server
cp .env.example .env  # Edit DATABASE_URL if needed
npx prisma db push
npm run seed
npm run dev
```

Backend runs on http://localhost:5000

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on http://localhost:3005

### Demo Credentials
- **Email:** demo@medaxis.com
- **Password:** demo1234

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Ant Design 6
- React Query (@tanstack/react-query)
- React Router
- React Hook Form + Zod
- Zustand
- SCSS
- i18next (English + Arabic)

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (file uploads)
- Repository Pattern

## Features

- 🩺 **6-Step Operation Wizard** - Create operations in under 60 seconds
- 👤 **Patient Management** - Search, create, full history
- 📊 **Dashboard** - Stats, trends, monthly charts
- 👨‍⚕️ **Medical Team** - Multi-doctor support
- 🏥 **Hospital Management** - Recent hospitals auto-selected
- 🏷️ **Specialties** - Specialty and area-of-expertise hierarchy
- 💰 **Cost Tracking** - Payment methods, status, auto-calculation
- 📁 **Clinical Files** - Before/after images, X-rays, MRI, CT, labs and documents
- 📋 **Timeline** - Automatic activity tracking
- 🔍 **Global Search** - Search across all entities
- 🌙 **Dark Mode** - Light/dark theme toggle
- 🌐 **RTL Support** - English and Arabic
- 📱 **Mobile First** - Touch-friendly, single column, sticky actions

## Shared Design System

The frontend uses a reusable Ant Design 6 component layer under `client/src/components/common/`.

Core primitives:

- `PageHeader` — consistent page title, metadata, back action and responsive actions
- `StatusTag` — semantic status presentation
- `InfoCard` — standard information sections
- `EmptyState` — consistent empty states with optional actions
- `DataCard` — compact label/value metadata blocks
- `PhoneLink` — universal `tel:` action for phone numbers
- `DateTimeTag` — consistent date/time tag presentation
- `MoneyInput` — mobile-safe monetary input with stable currency suffix and comma formatting
- `FileCard` — reusable clinical/document file preview card
- `StaffCard` — reusable doctor/nurse/team member card
- `SectionHeader` — consistent section title/description/action layout
- `ConfirmAction` — standardized destructive confirmation action

The design system follows the project's mobile-first, RTL/LTR, light/dark, accessible and Ant Design 6 principles. See `docs/DESIGN_SYSTEM.md` for usage guidance.

## Project Structure

```
medaxis/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components + shared design system
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── stores/         # Zustand stores
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   ├── i18n/           # Translations (en/ar)
│   │   ├── styles/         # SCSS variables/mixins/global
│   │   └── utils/          # Helpers & constants
│   └── vite.config.ts
├── server/                 # Express API
├── docs/                   # Product and design documentation
├── docker-compose.yml      # PostgreSQL
└── README.md
```

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Patients
- GET/POST /api/patients
- GET/PUT/DELETE /api/patients/:id
- GET /api/patients/search?q=

### Operations
- GET/POST /api/operations
- GET/PUT/DELETE /api/operations/:id
- PATCH /api/operations/:id/status
- PUT /api/operations/:id/cost
- POST /api/operations/:id/files
- DELETE /api/operations/:id/files/:fileId
- GET /api/operations/:id/timeline

### Doctors
- GET/POST /api/doctors
- GET/PUT/DELETE /api/doctors/:id
- GET /api/doctors/active

### Hospitals
- GET/POST /api/hospitals
- GET/PUT/DELETE /api/hospitals/:id
- GET /api/hospitals/active

### Specialties
- GET/POST /api/specialties
- GET/PUT/DELETE /api/specialties/:id

### Dashboard
- GET /api/dashboard/stats
- GET /api/dashboard/recent-operations
- GET /api/dashboard/specialty-distribution
- GET /api/dashboard/monthly-trends
- GET /api/dashboard/revenue

### Search
- GET /api/search?q=&type=

### Export
- GET /api/export/operations?format=csv|json
