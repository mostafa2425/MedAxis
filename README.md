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
npm install
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
- Ant Design 5
- React Query (@tanstack/react-query)
- React Router
- React Hook Form + Zod
- Zustand
- SCSS Modules
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
- 🏷️ **15 Orthopedic Specialties** - Knee, Spine, Sports, etc.
- 💰 **Cost Tracking** - Payment methods, status, auto-calculation
- 📁 **File Upload** - Before/after images, X-rays, MRI, PDF
- 📋 **Timeline** - Automatic activity tracking
- 🔍 **Global Search** - Search across all entities
- 🌙 **Dark Mode** - Light/dark theme toggle
- 🌐 **RTL Support** - English and Arabic
- 📱 **Mobile First** - Touch-friendly, single column, sticky actions

## Project Structure

```
medaxis/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── stores/         # Zustand stores
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   ├── i18n/           # Translations (en/ar)
│   │   ├── styles/         # SCSS variables/mixins/global
│   │   └── utils/          # Helpers & constants
│   └── vite.config.ts
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access (Prisma)
│   │   ├── middlewares/    # Auth, error handling, upload
│   │   ├── routes/         # Express routes
│   │   ├── validators/     # Zod schemas
│   │   └── utils/          # Prisma client, helpers
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.ts         # Demo data seeder
├── docker-compose.yml      # PostgreSQL container
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
