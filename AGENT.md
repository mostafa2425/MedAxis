# MedAxis — AGENT.md

> **Complete Technical Documentation** — Read this file to fully understand and work on the MedAxis project.

---

## 1. PROJECT OVERVIEW

| Field           | Value                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| **Name**        | MedAxis                                                                      |
| **Tagline**     | Centered Around Better Care                                                   |
| **Description** | A modern, mobile-first SaaS platform for Orthopedic Surgeons to register surgical cases in under 60 seconds. Provides a digital operation logbook with patient management, medical team tracking, cost/billing, file uploads (X-rays, MRI, photos), timeline audit trails, and analytics dashboards. |
| **Version**     | MVP v1.0                                                                     |
| **License**     | ISC                                                                          |

### Full Tech Stack

| Layer          | Technology                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend**   | React 19, TypeScript 6, Vite 8, Ant Design 6, React Router 7, React Query 5, Zustand 5, SCSS Modules, i18next, dayjs |
| **Backend**    | Express 5, TypeScript 7, Prisma 7, JWT (jsonwebtoken + bcryptjs), Multer 2, swagger-ui-express (OpenAPI 3.0) |
| **Database**   | PostgreSQL 16 (via Docker Compose) |
| **Validation** | Zod 4 (server), Zod 3 (client via `@hookform/resolvers/zod`)                                     |
| **Dev Tools**  | tsx (watch mode), oxlint, sass                                                     |
| **Container**  | Docker Compose (PostgreSQL 16-alpine)                                                    |

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Client-Server Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER (Client)                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  React 19 SPA (Vite)                                                     │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌────────────────┐  │ │
│  │  │  Pages       │  │  Components  │  │  Stores    │  │  Services      │  │ │
│  │  │  (Routes)   │  │  (Ant Design)│  │  (Zustand) │  │  (Axios→API)   │  │ │
│  │  └──────┬──────┘  └──────┬───────┘  └──────┬─────┘  └───────┬────────┘  │ │
│  │         │                │                 │                │           │ │
│  │         └────────────────┴─────────┬───────┴────────────────┘           │ │
│  │                                   │ React Query (TanStack)                │ │
│  │                                   ▼                                       │ │
│  │                          ┌─────────────────┐                             │ │
│  │                          │   API Services   │                             │ │
│  │                          │   (Axios Base)   │                             │ │
│  │                          └────────┬────────┘                             │ │
│  └───────────────────────────────────┼──────────────────────────────────────┘ │
└──────────────────────────────────────┼────────────────────────────────────────┘
                                       │ HTTP / REST
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         SERVER (Node.js / Express 5)                          │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Routes (Express Router)                                                  ││
│  │  /api/auth   /api/patients   /api/operations   /api/doctors   ...         ││
│  └─────────────────────────────────┬────────────────────────────────────────┘│
│                                    │                                           │
│  ┌─────────────────────────────────▼────────────────────────────────────────┐│
│  │  Middlewares                                                             ││
│  │  authMiddleware (JWT) ──→ roleMiddleware (RBAC) ──→ upload (Multer)       ││
│  └─────────────────────────────────┬────────────────────────────────────────┘│
│                                    │                                           │
│  ┌─────────────────────────────────▼────────────────────────────────────────┐│
│  │  Controllers (Request Validation + Response Formatting)                   ││
│  │  authCtrl  patientCtrl  operationCtrl  doctorCtrl  dashboardCtrl  ...    ││
│  └─────────────────────────────────┬────────────────────────────────────────┘│
│                                    │                                           │
│  ┌─────────────────────────────────▼────────────────────────────────────────┐│
│  │  Services (Business Logic)                                               ││
│  │  authService  patientService  operationService  dashboardService  ...    ││
│  └─────────────────────────────────┬────────────────────────────────────────┘│
│                                    │                                           │
│  ┌─────────────────────────────────▼────────────────────────────────────────┐│
│  │  Repositories (Data Access Layer — Prisma ORM)                            ││
│  │  userRepo  patientRepo  operationRepo  doctorRepo  hospitalRepo  ...      ││
│  └─────────────────────────────────┬────────────────────────────────────────┘│
│                                    │                                           │
│  ┌─────────────────────────────────▼────────────────────────────────────────┐│
│  │  Prisma Client                                                          ││
│  │  PostgreSQL 16 (via Docker Compose)                                        ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
│  Port: 5000 (serves API + static frontend in production)                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Repository Pattern

Every feature follows the **Controller → Service → Repository → Prisma** layered architecture:

1. **Routes** (`server/src/routes/*.ts`) — Define HTTP endpoints, attach middleware (auth, upload, role check).
2. **Controllers** (`server/src/controllers/*.ts`) — Parse/validate request body via Zod, call service, format response via `sendSuccess()`/`sendPaginated()`.
3. **Services** (`server/src/services/*.ts`) — Contain business logic (ownership checks, side effects like timeline entries, file deletion on disk). Singletons exported as `export const xxxService = new XxxService()`.
4. **Repositories** (`server/src/repositories/*.ts`) — Direct Prisma queries only. No business logic. Singletons exported as `export const xxxRepo = new XxxRepository()`.

### 2.3 Data Flow (Operation Creation)

```
Client POST /api/operations
  → authMiddleware (verify JWT, attach req.user)
  → operationController.create() (Zod validate body)
  → operationService.create() (set defaults, call repo, add timeline entry)
  → operationRepo.create() (Prisma transaction: Operation + MedicalTeam + Cost)
  ← sendSuccess(res, operation, 'Operation created', 201)
```

### 2.4 Authentication Flow (JWT)

1. User submits `email` + `password` to `POST /api/auth/login`.
2. `AuthService.login()` finds user by email, compares password with bcrypt.
3. On success, generates JWT payload: `{ userId, email, role }`, signed with `JWT_SECRET`, expiry `7d`.
4. Client stores JWT in `localStorage.getItem('token')`.
5. Axios request interceptor attaches `Authorization: Bearer <token>` to every request.
6. Server `authMiddleware` extracts token, verifies with `jwt.verify()`, checks user is active, attaches `req.user`.
7. On 401 response, Axios response interceptor clears token and redirects to `/login`.

---

## 3. PROJECT STRUCTURE

```
medaxis/
├── AGENT.md                         # This file — comprehensive project documentation
├── README.md                        # User-facing quick start guide
├── docker-compose.yml               # PostgreSQL 16-alpine (via Docker Compose)
│
├── client/                          # ══ REACT FRONTEND (Vite) ══
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # React 19, Ant Design 6, Vite 8, Zustand 5, etc.
│   ├── tsconfig.json                # TypeScript config (ESM)
│   ├── tsconfig.app.json            # App-specific TS config
│   ├── tsconfig.node.json           # Node-specific TS config (vite.config)
│   ├── vite.config.ts               # Vite: aliases (@/), SCSS preprocessor, proxy to :5000
│   └── src/
│       ├── main.tsx                 # App bootstrap: QueryClient, BrowserRouter, i18n init
│       ├── App.tsx                  # Root: Ant Design ConfigProvider (themes), Routes, lazy loading
│       │
│       ├── types/
│       │   └── index.ts              # All TypeScript interfaces & enums (User, Patient, Operation, etc.)
│       │
│       ├── stores/
│       │   ├── auth.store.ts         # Zustand: user, token, isAuthenticated, login(), logout()
│       │   └── app.store.ts          # Zustand: sidebarCollapsed, darkMode, language (en/ar), direction (ltr/rtl)
│       │
│       ├── hooks/
│       │   ├── useAuth.ts            # Auth convenience hook (wraps authStore)
│       │   └── useDebounce.ts        # Debounce hook for search inputs
│       │
│       ├── services/                # API service layer (one file per domain)
│       │   ├── api.ts                # Axios instance: baseURL, JWT interceptor, 401 redirect
│       │   ├── auth.service.ts       # login, register, getMe
│       │   ├── patient.service.ts    # CRUD + search
│       │   ├── operation.service.ts  # CRUD + status change + cost update + file upload/delete + timeline
│       │   ├── doctor.service.ts     # CRUD + getActive
│       │   ├── hospital.service.ts   # CRUD + getActive
│       │   ├── specialty.service.ts  # CRUD
│       │   ├── dashboard.service.ts  # stats, recent ops, specialty dist, monthly trends, revenue
│       │   ├── search.service.ts     # globalSearch across all entities (mode: 'insensitive' for PostgreSQL case-insensitive search)
│       │   └── upload.service.ts     # single file upload
│       │
│       ├── components/
│       │   ├── RequireAuth.tsx       # Route guard: redirects to /login if not authenticated
│       │   ├── PublicRoute.tsx       # Route guard for public pages (login/register)
│       │   ├── AppLayout.tsx         # Legacy layout component
│       │   ├── layout/
│       │   │   ├── AppLayout/
│       │   │   │   ├── AppLayout.tsx         # Main layout shell: sidebar + header + content area
│       │   │   │   └── AppLayout.module.scss
│       │   │   ├── Header/
│       │   │   │   ├── Header.tsx             # Top bar: logo, search, dark mode, language, profile menu
│       │   │   │   └── Header.module.scss
│       │   │   └── Sidebar/
│       │   │       ├── Sidebar.tsx             # Navigation: Dashboard, Patients, Operations, etc.
│       │   │       └── Sidebar.module.scss
│       │   └── dashboard/
│       │       ├── StatsCards.tsx          # KPI cards (total ops, patients, revenue, etc.)
│       │       ├── MonthlyChart.tsx        # Bar chart of monthly operation trends
│       │       ├── StatusOverview.tsx      # Status breakdown (Scheduled/Completed/Cancelled)
│       │       └── RecentOperations.tsx    # Recent operations table
│       │
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx           # Login form with email/password
│       │   │   ├── LoginPage.module.scss
│       │   │   ├── RegisterPage.tsx        # Registration form
│       │   │   └── RegisterPage.module.scss
│       │   ├── Dashboard/
│       │   │   └── index.tsx                # Re-exports DashboardPage
│       │   ├── DashboardPage.tsx           # Stats, charts, recent operations
│       │   ├── DashboardPage.module.scss
│       │   ├── Patients/
│       │   │   ├── index.tsx                # Re-exports PatientsPage
│       │   │   ├── NewPatient.tsx           # Re-exports PatientFormPage (for new patient)
│       │   │   └── PatientDetail.tsx        # Re-exports PatientDetailPage
│       │   ├── PatientsPage.tsx            # Patient list with search/filter
│       │   ├── PatientsPage.module.scss
│       │   ├── PatientFormPage.tsx         # Patient create/edit form
│       │   ├── PatientFormPage.module.scss
│       │   ├── PatientDetailPage.tsx       # Patient profile + operation history
│       │   ├── PatientDetailPage.module.scss
│       │   ├── Operations/
│       │   │   ├── index.tsx                # Operations list
│       │   │   ├── Operations.scss
│       │   │   ├── NewOperation.tsx         # Re-exports OperationFormPage
│       │   │   ├── EditOperation.tsx        # Re-exports OperationFormPage
│       │   │   ├── OperationDetail.tsx      # Operation detail page
│       │   │   ├── OperationDetail.scss
│       │   │   ├── OperationFormPage.tsx    # Re-exports OperationForm/
│       │   │   └── OperationForm/           # 6-step wizard (isolated)
│       │   │       ├── OperationFormPage.tsx
│       │   │       ├── OperationForm.scss
│       │   │       ├── wizardTypes.ts
│       │   │       ├── wizardConstants.ts
│       │   │       ├── wizardHelpers.ts
│       │   │       ├── WizardNav/
│       │   │       ├── WizardActions/
│       │   │       ├── PatientStep/
│       │   │       ├── OperationDetailsStep/
│       │   │       ├── TeamStep/
│       │   │       ├── CostStep/
│       │   │       ├── FilesStep/
│       │   │       └── ReviewStep/
│       │   ├── Doctors/
│       │   │   ├── index.tsx                # Doctors list / main screen
│       │   │   ├── Doctors.scss             # Page-level layout styles
│       │   │   ├── AddDoctor/
│       │   │   │   ├── AddDoctor.tsx        # Add/edit doctor modal + form
│       │   │   │   └── AddDoctor.scss
│       │   │   ├── DoctorCard/
│       │   │   │   ├── DoctorCard.tsx       # Mobile card (+ skeleton export)
│       │   │   │   └── DoctorCard.scss
│       │   │   └── DoctorRow/
│       │   │       ├── DoctorRow.tsx        # Desktop row (+ skeleton export)
│       │   │       └── DoctorRow.scss
│       │   ├── Hospitals/
│       │   │   ├── index.tsx                # Hospitals list / main screen
│       │   │   ├── Hospitals.scss           # Page-level layout styles
│       │   │   ├── AddHospital/
│       │   │   │   ├── AddHospital.tsx      # Add/edit hospital modal + form
│       │   │   │   └── AddHospital.scss
│       │   │   ├── HospitalCard/
│       │   │   │   ├── HospitalCard.tsx     # Mobile card (+ skeleton export)
│       │   │   │   └── HospitalCard.scss
│       │   │   └── HospitalRow/
│       │   │       ├── HospitalRow.tsx      # Desktop row (+ skeleton export)
│       │   │       └── HospitalRow.scss
│       │   ├── Specialties/
│       │   │   └── index.tsx                # Re-exports SpecialtiesPage
│       │   ├── SpecialtiesPage.tsx         # Specialty management (admin-only CRUD)
│       │   ├── SpecialtiesPage.module.scss
│       │   ├── Search/
│       │   │   └── index.tsx                # Re-exports SearchPage
│       │   ├── SearchPage.tsx              # Global search across patients, operations, doctors, hospitals
│       │   └── SearchPage.module.scss
│       │
│       ├── i18n/
│       │   ├── index.ts              # i18next initialization (en + ar, fallback en)
│       │   ├── en.json               # English translations (~425 keys)
│       │   └── ar.json               # Arabic translations (~425 keys)
│       │
│       ├── styles/
│       │   ├── variables.scss        # Design system: colors, fonts, spacing, shadows, breakpoints, z-index, dark mode
│       │   ├── mixins.scss           # Reusable SCSS mixins (responsive, scrollbar, dark mode, etc.)
│       │   └── global.scss           # Reset, base elements, typography, Ant Design overrides, utility classes, dark mode
│       │
│       └── utils/
│           ├── helpers.ts            # formatCurrency (SAR), formatDate, formatTime, getStatusColor, getInitials, calculateRemaining, getGreeting
│           └── constants.ts          # OPERATION_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, FILE_TYPES, GENDERS, ORTHOPEDIC_CATEGORIES, DEFAULT_PAGINATION
│
├── server/                          # ══ EXPRESS BACKEND (Node.js) ══
│   ├── package.json                 # Express 5, Prisma 7, bcryptjs, jsonwebtoken, multer, zod, swagger-ui-express, tsx
│   ├── tsconfig.json                # TypeScript config (CommonJS)
│   ├── prisma.config.ts             # Prisma config: reads DATABASE_URL from .env via dotenv, schema path
│   ├── .env                         # Environment variables (DATABASE_URL, JWT_SECRET, etc.)
│   └── src/
│       ├── index.ts                 # Express app setup: Swagger UI, CORS, JSON parsing, compression, morgan, static files, listen on :5000
│       ├── docs/
│       │   └── swagger.ts            # OpenAPI 3.0 specification (Swagger UI at /api-docs) — documentation only
│       │
│       ├── routes/
│       │   ├── index.ts              # Route aggregator: mounts all route groups under /api
│       │   ├── auth.routes.ts        # POST /login, POST /register, GET /me (authMiddleware)
│       │   ├── patient.routes.ts     # CRUD (all authMiddleware, scoped by createdBy)
│       │   ├── operation.routes.ts   # CRUD + status + cost + files + timeline (authMiddleware, upload middleware)
│       │   ├── doctor.routes.ts      # CRUD + GET /active (authMiddleware)
│       │   ├── hospital.routes.ts    # CRUD + GET /active (authMiddleware)
│       │   ├── specialty.routes.ts   # GET all auth, POST/PUT/DELETE admin-only (authMiddleware + requireRole('admin'))
│       │   ├── dashboard.routes.ts   # 5 GET endpoints (authMiddleware)
│       │   └── export.routes.ts      # GET /operations?format=csv|json (authMiddleware)
│       │
│       ├── controllers/
│       │   ├── auth.controller.ts    # login, register, getMe
│       │   ├── patient.controller.ts # getAll, getById, create, update, delete
│       │   ├── operation.controller.ts # getAll, getById, create, update, updateStatus, delete, updateCost, uploadFiles, deleteFile, getTimeline
│       │   ├── doctor.controller.ts  # getAll, getActive, getById, create, update, delete
│       │   ├── hospital.controller.ts # getAll, getActive, getById, create, update, delete
│       │   ├── specialty.controller.ts # getAll, getById, create, update, delete
│       │   ├── dashboard.controller.ts # getStats, getRecentOperations, getSpecialtyDistribution, getMonthlyTrends, getRevenue
│       │   └── export.controller.ts  # exportOperations (CSV or JSON)
│       │
│       ├── services/
│       │   ├── auth.service.ts       # Login (bcrypt compare + JWT), register (bcrypt hash + JWT), getMe
│       │   ├── patient.service.ts    # CRUD with ownership (createdBy), getRecent
│       │   ├── operation.service.ts  # CRUD + status change + cost upsert + file upload/delete + timeline + export data + dashboard aggregation
│       │   ├── doctor.service.ts     # CRUD + getActive, specialty management
│       │   ├── hospital.service.ts   # CRUD + getActive
│       │   ├── specialty.service.ts  # CRUD
│       │   ├── dashboard.service.ts  # Aggregated stats from operationRepo + patientRepo
│       │   └── export.service.ts     # Export operations to CSV or JSON with full relational data
│       │
│       ├── repositories/
│       │   ├── user.repo.ts          # findByEmail, findById, create
│       │   ├── patient.repo.ts       # findAll (paginated, searchable via mode: 'insensitive'), findById (with operations), create, update, delete, findRecent
│       │   ├── operation.repo.ts     # findAll (filtered, paginated, sorted), findById (full include), create (with medicalTeam + cost), update, updateStatus, delete, upsertCost, addFile, deleteFile, addTimeline, getTimeline, getRecent, countByStatus, countBySpecialty, getMonthlyTrends, getTotalRevenue, exportData
│       │   ├── doctor.repo.ts        # findAll, findById, findActive, create (with specialties), update, delete, setSpecialties
│       │   ├── hospital.repo.ts      # findAll, findById, findActive, create, update, delete
│       │   └── specialty.repo.ts     # findAll, findById, create, update, delete
│       │
│       ├── middlewares/
│       │   ├── auth.middleware.ts    # JWT verification, user lookup, attach req.user (JwtPayload)
│       │   ├── role.middleware.ts    # requireRole(...roles) — RBAC guard
│       │   ├── upload.ts             # Multer disk storage (crypto filename), 50MB limit, medical file types
│       │   └── errorHandler.ts       # Global error handler: AppError, ZodError, Prisma errors, SyntaxError
│       │
│       ├── validators/
│       │   ├── auth.validator.ts     # loginSchema (email + password min 6), registerSchema (email + password + name + phone?)
│       │   ├── patient.validator.ts  # Patient creation/update Zod schemas
│       │   ├── surgery.validator.ts  # createOperationSchema (nested: medicalTeam, cost), updateOperationSchema, updateCostSchema, updateStatusSchema, operationQuerySchema (pagination, filters, sorting)
│       │   ├── doctor.validator.ts   # Doctor creation/update Zod schemas
│       │   ├── hospital.validator.ts # Hospital creation/update Zod schemas
│       │   ├── specialty.validator.ts # Specialty creation/update Zod schemas
│       │   └── export.validator.ts   # exportQuerySchema (format: json|csv, filters)
│       │
│       └── utils/
│           ├── prisma.ts             # PrismaClient singleton (PostgreSQL via DATABASE_URL)
│           ├── auth.ts               # hashPassword (bcrypt, 12 rounds), comparePassword, generateToken (7d), verifyToken
│           ├── errors.ts             # AppError (base), NotFoundError (404), UnauthorizedError (401), ForbiddenError (403), BadRequestError (400), ConflictError (409)
│           └── response.ts           # sendSuccess, sendError, sendPaginated — standardized API response format
│
└── server/prisma/
    ├── schema.prisma               # Database schema: 11 models, 6 enums
    ├── seed.ts                     # Seeds 15 orthopedic specialties + demo user (demo@medaxis.com / demo1234)
    └── migrations/                  # Prisma migration files (if using db push, may be empty)
```

---

## 4. DATABASE SCHEMA

### 4.1 Enums

| Enum              | Values                                                                             |
| ----------------- | ---------------------------------------------------------------------------------- |
| `Gender`          | `MALE`, `FEMALE`                                                                    |
| `OperationStatus` | `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`                                |
| `PaymentMethod`   | `CASH`, `CARD`, `INSURANCE`, `BANK_TRANSFER`, `OTHER`                             |
| `PaymentStatus`   | `PAID`, `UNPAID`, `PARTIAL`                                                        |
| `FileType`        | `BEFORE_IMAGE`, `BEFORE_XRAY`, `BEFORE_MRI`, `BEFORE_CT`, `BEFORE_LAB`, `BEFORE_PDF`, `AFTER_IMAGE`, `AFTER_REPORT`, `AFTER_PDF`, `AFTER_OTHER` |
| `TimelineAction`  | `OPERATION_CREATED`, `OPERATION_UPDATED`, `OPERATION_DELETED`, `STATUS_CHANGED`, `FILES_UPLOADED`, `COST_UPDATED`, `NOTES_UPDATED`, `TEAM_UPDATED` |

### 4.2 Models

#### User (`users`)
| Field       | Type      | Constraints                            |
| ----------- | --------- | -------------------------------------- |
| id          | String    | PK, UUID, auto-generated               |
| email       | String    | Unique                                |
| password    | String    | bcrypt hash                            |
| name        | String    | —                                      |
| phone       | String?   | Optional                               |
| role        | String    | Default: `"doctor"`                    |
| isActive    | Boolean   | Default: `true`                        |
| createdAt   | DateTime  | Default: `now()`                       |
| updatedAt   | DateTime  | Auto-updated                           |

Relations: has many `operations`, `operationTimelines`, `uploadedFiles`.

#### Patient (`patients`)
| Field       | Type      | Constraints                            |
| ----------- | --------- | -------------------------------------- |
| id          | String    | PK, UUID                               |
| fullName    | String    | —                                      |
| age         | Int       | —                                      |
| gender      | Gender    | Default: `MALE`                        |
| mobile      | String?   | Optional                               |
| notes       | String?   | Optional                               |
| createdBy   | String    | FK → User.id                           |
| createdAt   | DateTime  | Default: `now()`                       |
| updatedAt   | DateTime  | Auto-updated                           |

Relations: has many `operations`. Scoped by `createdBy` (data isolation per user).

#### Specialty (`specialties`)
| Field       | Type      | Constraints                            |
| ----------- | --------- | -------------------------------------- |
| id          | String    | PK, UUID                               |
| name        | String    | Unique                                 |
| nameAr      | String?   | Optional (Arabic name)                 |
| icon        | String?   | Optional                               |
| isActive    | Boolean   | Default: `true`                        |
| createdAt   | DateTime  | Default: `now()`                       |
| updatedAt   | DateTime  | Auto-updated                           |

Relations: has many `doctors` (via DoctorSpecialty), has many `operations`.

#### Doctor (`doctors`)
| Field       | Type      | Constraints                            |
| ----------- | --------- | -------------------------------------- |
| id          | String    | PK, UUID                               |
| name        | String    | —                                      |
| phone       | String?   | Optional                               |
| email       | String?   | Optional                               |
| isActive    | Boolean   | Default: `true`                        |
| createdAt   | DateTime  | Default: `now()`                       |
| updatedAt   | DateTime  | Auto-updated                           |

Relations: has many `specialties` (via DoctorSpecialty), appears in OperationMedicalTeam as `primarySurgeon`, `assistantSurgeon`, `anesthesiologist`, `assistantAnesthesia`.

#### DoctorSpecialty (`doctor_specialties`)
| Field       | Type      | Constraints                            |
| ----------- | --------- | -------------------------------------- |
| id          | String    | PK, UUID                               |
| doctorId    | String    | FK → Doctor.id, Cascade delete         |
| specialtyId | String    | FK → Specialty.id, Cascade delete      |
| createdAt   | DateTime  | Default: `now()`                       |

Unique constraint: `[doctorId, specialtyId]`.

#### Hospital (`hospitals`)
| Field       | Type      | Constraints                            |
| ----------- | --------- | -------------------------------------- |
| id          | String    | PK, UUID                               |
| name        | String    | —                                      |
| address     | String?   | Optional                               |
| phone       | String?   | Optional                               |
| isActive    | Boolean   | Default: `true`                        |
| createdAt   | DateTime  | Default: `now()`                       |
| updatedAt   | DateTime  | Auto-updated                           |

Relations: has many `operations`.

#### Operation (`operations`)
| Field          | Type           | Constraints                            |
| -------------- | -------------- | -------------------------------------- |
| id             | String         | PK, UUID                               |
| name           | String         | —                                      |
| diagnosis      | String         | —                                      |
| hospitalId     | String         | FK → Hospital.id                       |
| operationDate  | DateTime       | —                                      |
| operationTime  | String         | —                                      |
| operationRoom  | String?        | Optional                               |
| duration       | Int?           | Optional (minutes)                     |
| status         | OperationStatus | Default: `COMPLETED`                   |
| notes          | String?        | Optional                               |
| patientId      | String         | FK → Patient.id, Cascade delete        |
| createdBy       | String         | FK → User.id                           |
| specialtyId    | String?        | FK → Specialty.id (optional)           |
| createdAt      | DateTime       | Default: `now()`                       |
| updatedAt      | DateTime       | Auto-updated                           |

Relations: belongs to Patient, Hospital, User (creator), Specialty (optional). Has one MedicalTeam, has many Files, has one Cost, has many Timeline entries. Scoped by `createdBy`.

#### OperationMedicalTeam (`operation_medical_team`)
| Field                 | Type    | Constraints                     |
| --------------------- | ------- | ------------------------------- |
| id                    | String  | PK, UUID                        |
| operationId           | String  | FK → Operation.id, Cascade del  |
| primarySurgeonId      | String? | FK → Doctor.id                  |
| assistantSurgeonId    | String? | FK → Doctor.id                  |
| anesthesiologistId    | String? | FK → Doctor.id                  |
| assistantAnesthesiaId | String? | FK → Doctor.id                  |
| nurse                 | String? | Free text (name)                |
| notes                 | String? | Optional                        |
| createdAt             | DateTime | Default: `now()`                |

#### OperationCost (`operation_costs`)
| Field           | Type          | Constraints                     |
| --------------- | ------------- | ------------------------------- |
| id              | String        | PK, UUID                        |
| operationId     | String        | FK → Operation.id, Unique, Cascade del |
| totalCost       | Decimal        | Default: `0`, `@db.Decimal(10, 2)`  |
| paidAmount      | Decimal        | Default: `0`, `@db.Decimal(10, 2)`  |
| remainingAmount | Decimal        | Default: `0`, `@db.Decimal(10, 2)`  |
| paymentMethod   | PaymentMethod | Default: `CASH`                 |
| paymentStatus   | PaymentStatus | Default: `PAID`                 |
| paymentNotes    | String?       | Optional                        |
| createdAt       | DateTime      | Default: `now()`                |
| updatedAt       | DateTime      | Auto-updated                   |

#### OperationFile (`operation_files`)
| Field       | Type      | Constraints                     |
| ----------- | --------- | ------------------------------- |
| id          | String    | PK, UUID                        |
| operationId | String    | FK → Operation.id, Cascade del  |
| fileType    | FileType  | —                               |
| fileName    | String    | Original filename               |
| filePath    | String    | Server file path                |
| fileSize    | Int?      | Bytes                           |
| mimeType    | String?   | MIME type                       |
| uploadedBy  | String    | FK → User.id                    |
| createdAt   | DateTime  | Default: `now()`                |

#### OperationTimeline (`operation_timeline`)
| Field       | Type           | Constraints                     |
| ----------- | -------------- | ------------------------------- |
| id          | String         | PK, UUID                        |
| operationId | String         | FK → Operation.id, Cascade del  |
| action      | TimelineAction | —                               |
| description | String?        | Optional                        |
| userId      | String         | FK → User.id                    |
| createdAt   | DateTime       | Default: `now()`                |

### 4.3 ER Diagram (ASCII)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    User      │         │   Patient    │         │   Hospital   │
│──────────────│         │──────────────│         │──────────────│
│ id (PK)      │◄──┐     │ id (PK)      │◄──┐     │ id (PK)      │◄──┐
│ email        │   │     │ fullName     │   │     │ name         │   │
│ password     │   │     │ age          │   │     │ address      │   │
│ name         │   │     │ gender       │   │     │ phone        │   │
│ role         │   │     │ mobile       │   │     │ isActive     │   │
│ isActive     │   │     │ notes        │   │     └──────┬───────┘   │
└──────┬───────┘   │     │ createdBy ────┼───┘            │           │
       │           │     └──────┬───────┘                   │           │
       │           │            │                           │           │
       │  ┌────────┴────────┐   │  ┌────────────────────────┴───┐   │
       │  │   Operation     │   └──│   Operation                │   │
       │  │─────────────────│      │───────────────────────────│   │
       │  │ id (PK)         │      │ id (PK)                  │   │
       │  │ name            │      │ hospitalId ──────────────│───┘
       │  │ diagnosis       │      │ patientId ────────────────│──┐
       │  │ hospitalId ─────┼──────│ createdBy ────────────────┼──┼──┐
       │  │ operationDate   │      │ specialtyId               │  │  │
       │  │ status          │      │ operationTime             │  │  │
       │  │ duration        │      │ operationRoom             │  │  │
       │  │ notes           │      └──┬──────┬───────┬────────┘  │  │
       │  └────────┬────────┘         │      │       │            │  │
       │           │                  │      │       │            │  │
       │  ┌────────┴────────┐  ┌─────┴──┐ ┌──┴────┐ ┌──┴─────┐  │  │
       │  │ OperationCost   │  │Oper.  │ │Oper.  │ │Oper.   │  │  │
       │  │─────────────────│  │File   │ │Medical│ │Timeline│  │  │
       │  │ operationId (UQ)│  │       │ │Team   │ │        │  │  │
       │  │ totalCost       │  │fileType│ │primary│ │action  │  │  │
       │  │ paidAmount      │  │filePath│ │asst.  │ │userId  │  │  │
       │  │ paymentMethod   │  └───────┘ │anesth.│ └───┬────┘  │  │
       │  │ paymentStatus   │            └──┬────┘     │       │  │
       │  └─────────────────┘               │          │       │  │
       │                                    │     ┌────┴────┐  │  │
       │                              ┌─────┴──┐  │   User   │  │  │
       │                              │ Doctor │  └─────────┘  │  │
       │                              │────────│               │  │
       │                              │ id(PK) │               │  │
       │                              │ name   │               │  │
       │                              └───┬────┘               │  │
       │                                  │                    │  │
       │                              ┌───┴──────────┐        │  │
       │                              │DoctorSpecialty│        │  │
       │                              │──────────────│        │  │
       │                              │ doctorId     │        │  │
       │                              │ specialtyId  │        │  │
       │                              └──────┬───────┘        │  │
       │                                     │                 │  │
       │                              ┌──────┴──────┐         │  │
       │                              │  Specialty  │         │  │
       │                              │─────────────│         │  │
       │                              │ id (PK)     │         │  │
       │                              │ name (UQ)   │         │  │
       │                              │ nameAr      │         │  │
       │                              └─────────────┘         │  │
       │                                                        │  │
       └────────────────────────────────────────────────────────┘  │
                                                                  │
       ┌──────────────────────────────────────────────────────────┘
       │
  createdBy (data isolation: each user sees only their own data)
```

---

## 5. API DOCUMENTATION

### Swagger / OpenAPI

| Field | Value |
| ----- | ----- |
| **UI URL** | `http://localhost:5000/api-docs` |
| **Spec file** | `server/src/docs/swagger.ts` |
| **Mount** | `server/src/index.ts` → `app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))` |
| **Standard** | OpenAPI 3.0 |
| **Auth in UI** | JWT Bearer (`Authorize` with token from login/register) |

**Rules for agents/developers:**
- Swagger is **documentation only** — never change API behavior, routes, controllers, services, repositories, Prisma schema, or auth to “fit” docs.
- Spec must mirror **real route definitions** only. Do not invent endpoints.
- Keep the OpenAPI spec in `server/src/docs/swagger.ts`; keep `index.ts` limited to mounting Swagger UI.
- When adding/changing an endpoint, update `swagger.ts` (paths, request bodies, query params, responses, security) to match Zod validators and middleware.
- Document `authMiddleware` as Bearer JWT; document `requireRole('admin')` where used (specialty write ops).
- Document multipart uploads accurately (`files` field, optional `fileType`).

Interactive docs: open `/api-docs`, click **Authorize**, paste the JWT from `POST /api/auth/login`.

### Standard Response Format

```json
// Success (single)
{ "success": true, "message": "Success", "data": { ... } }

// Success (paginated)
{ "success": true, "message": "Success", "data": [...], "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }

// Error
{ "success": false, "message": "Error description", "data": [...] }
```

### 5.1 Auth (`/api/auth`)

| Method | Path       | Auth | Request Body                                  | Response                                          |
| ------ | ---------- | ---- | --------------------------------------------- | ------------------------------------------------- |
| POST   | `/login`   | No   | `{ email: string, password: string }`          | `{ data: { token: string, user: { id, email, name, phone, role, isActive } } }` |
| POST   | `/register`| No   | `{ email: string, password: string, name: string, phone?: string }` | `{ data: { token, user } }` (status 201) |
| GET    | `/me`      | Yes  | —                                             | `{ data: { id, email, name, phone, role, isActive, createdAt, updatedAt } }` |

### 5.2 Patients (`/api/patients`)

| Method | Path        | Auth | Request Body / Query                                        | Response                                    |
| ------ | ----------- | ---- | ---------------------------------------------------------- | ------------------------------------------- |
| GET    | `/`         | Yes  | Query: `page, limit, search, gender`                        | Paginated `Patient[]` with `_count.operations` |
| GET    | `/:id`      | Yes  | —                                                          | `Patient` with `operations[]` (includes hospital, specialty) |
| POST   | `/`         | Yes  | `{ fullName, age, gender?, mobile?, notes? }`               | `Patient` (status 201)                     |
| PUT    | `/:id`      | Yes  | Partial patient fields                                     | Updated `Patient`                            |
| DELETE | `/:id`      | Yes  | —                                                          | `{ data: null, message: "Patient deleted" }`  |

### 5.3 Operations (`/api/operations`)

| Method | Path                       | Auth | Request Body / Query                                        | Response                                    |
| ------ | -------------------------- | ---- | ---------------------------------------------------------- | ------------------------------------------- |
| GET    | `/`                        | Yes  | Query: `page, limit, search, status, specialtyId, hospitalId, dateFrom, dateTo, sortBy, sortOrder` | Paginated `Operation[]` with patient, hospital, specialty, medicalTeam, cost, files |
| GET    | `/:id`                     | Yes  | —                                                          | Full `Operation` with patient, hospital, specialty, creator, medicalTeam (with doctors), cost, files (with uploader), timeline (with user) |
| POST   | `/`                        | Yes  | `{ name, diagnosis, hospitalId, operationDate, operationTime, patientId, specialtyId?, operationRoom?, duration?, status?, notes?, medicalTeam?: { primarySurgeonId?, assistantSurgeonId?, anesthesiologistId?, assistantAnesthesiaId?, nurse?, notes? }, cost?: { totalCost, paidAmount?, remainingAmount?, paymentMethod?, paymentStatus?, paymentNotes? } }` | `Operation` with relations (status 201) |
| PUT    | `/:id`                     | Yes  | Partial operation fields                                    | Updated `Operation` with relations          |
| PATCH  | `/:id/status`              | Yes  | `{ status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" }` | Updated `Operation`                        |
| PUT    | `/:id/cost`                | Yes  | `{ totalCost, paidAmount?, remainingAmount?, paymentMethod?, paymentStatus?, paymentNotes? }` | Upserted `OperationCost`                   |
| POST   | `/:id/files`               | Yes  | Multipart form: `files[]` (max 20 files, 50MB each), `fileType` field | `OperationFile[]` (status 201)             |
| DELETE | `/:operationId/files/:fileId` | Yes | —                                                          | `{ data: null, message: "File deleted" }`   |
| GET    | `/:id/timeline`            | Yes  | —                                                          | `OperationTimeline[]` with user             |
| DELETE | `/:id`                     | Yes  | —                                                          | `{ data: null, message: "Operation deleted" }` |

### 5.4 Doctors (`/api/doctors`)

| Method | Path        | Auth | Request Body / Query                               | Response                                    |
| ------ | ----------- | ---- | ------------------------------------------------- | ------------------------------------------- |
| GET    | `/`         | Yes  | Query: `page, limit, search, specialtyId`          | Paginated `Doctor[]`                        |
| GET    | `/active`   | Yes  | —                                                 | `Doctor[]` (active only, limit 100)          |
| GET    | `/:id`      | Yes  | —                                                 | `Doctor` with specialties                    |
| POST   | `/`         | Yes  | `{ name, phone?, email?, specialtyIds?: string[] }` | `Doctor` with `specialties[]` (status 201) |
| PUT    | `/:id`      | Yes  | Partial doctor fields (`phone`, `specialtyIds`)   | Updated `Doctor` with `specialties[]`       |
| DELETE | `/:id`      | Yes  | —                                                 | `{ data: null }`                             |

### 5.5 Hospitals (`/api/hospitals`)

| Method | Path        | Auth | Request Body / Query                               | Response                                    |
| ------ | ----------- | ---- | ------------------------------------------------- | ------------------------------------------- |
| GET    | `/`         | Yes  | Query: `page, limit, search, isActive`             | Paginated `Hospital[]` with `_count.operations` |
| GET    | `/active`   | Yes  | —                                                 | `Hospital[]` (active only, limit 100)        |
| GET    | `/:id`      | Yes  | —                                                 | `Hospital`                                   |
| POST   | `/`         | Yes  | `{ name, nameAr?, address?, city?, phone?, notes?, isActive? }` | `Hospital` (status 201) |
| PUT    | `/:id`      | Yes  | Partial hospital fields                           | Updated `Hospital`                           |
| DELETE | `/:id`      | Yes  | —                                                 | `{ data: null }`                             |

### 5.6 Specialties (`/api/specialties`)

| Method | Path        | Auth | Role   | Request Body / Query                               | Response                              |
| ------ | ----------- | ---- | ------ | ------------------------------------------------- | ------------------------------------- |
| GET    | `/`         | Yes  | Any    | Query: `page, limit, search`                       | Paginated `Specialty[]` with `_count`  |
| GET    | `/:id`      | Yes  | Any    | —                                                 | `Specialty`                           |
| POST   | `/`         | Yes  | Admin  | `{ name, nameAr?, description?, icon?, color? }`  | `Specialty` (status 201)              |
| PUT    | `/:id`      | Yes  | Admin  | Partial specialty fields                          | Updated `Specialty`                    |
| DELETE | `/:id`      | Yes  | Admin  | —                                                 | `{ data: null }`                       |

### 5.7 Dashboard (`/api/dashboard`)

| Method | Path                      | Auth | Response                                                                                           |
| ------ | ------------------------- | ---- | -------------------------------------------------------------------------------------------------- |
| GET    | `/stats`                  | Yes  | `{ totalOperations, statusBreakdown, recentOperations, recentPatients, revenue }`               |
| GET    | `/recent-operations`      | Yes  | `Operation[]` (with patient, hospital, specialty, cost). Query: `?limit=10`                       |
| GET    | `/specialty-distribution` | Yes  | `{ specialtyId, specialtyName, count }[]`                                                          |
| GET    | `/monthly-trends`         | Yes  | `{ month, total, completed }[]` (last 12 months). Query: `?months=12`                             |
| GET    | `/revenue`                | Yes  | `{ totalCost, totalPaid, totalRemaining }`                                                         |

### 5.8 Search (`/api/search`)

| Method | Path   | Auth | Query                                                  | Response                                  |
| ------ | ------ | ---- | ------------------------------------------------------ | ----------------------------------------- |
| GET    | `/`    | Yes  | `query, page?, limit?, type? (patients\|operations\|doctors\|hospitals\|all), dateFrom?, dateTo?` | `{ patients[], operations[], doctors[], hospitals[] }` |

### 5.9 Export (`/api/export`)

| Method | Path            | Auth | Query                                                  | Response                                            |
| ------ | --------------- | ---- | ------------------------------------------------------ | --------------------------------------------------- |
| GET    | `/operations`    | Yes  | `format=json\|csv, status?, specialtyId?, hospitalId?, dateFrom?, dateTo?` | JSON: `{ data: Operation[], meta: { totalRecords } }`. CSV: `text/csv` file download |

### 5.10 Health Check

| Method | Path       | Auth | Response                           |
| ------ | ---------- | ---- | ---------------------------------- |
| GET    | `/health`  | No   | `{ status: "ok", timestamp: "..." }` |

> Also documented in Swagger UI. Note: health is mounted at `/health` (not under `/api`).

---

## 6. FRONTEND ARCHITECTURE

### 6.1 Page Routing

| Path                  | Component           | Auth | Description                        |
| --------------------- | ------------------- | ---- | ---------------------------------- |
| `/login`              | LoginPage           | No   | Login form                         |
| `/register`           | RegisterPage        | No   | Registration form                  |
| `/`                   | DashboardPage       | Yes  | Main dashboard with stats/charts   |
| `/patients`           | PatientsPage        | Yes  | Patient list with search/filter    |
| `/patients/new`       | NewPatient          | Yes  | Create new patient                 |
| `/patients/:id`       | PatientDetailPage   | Yes  | Patient profile + operation history|
| `/operations`         | OperationsPage      | Yes  | Operations list with filters       |
| `/operations/new`     | NewOperation        | Yes  | 6-step operation creation wizard   |
| `/operations/:id`     | OperationDetailPage | Yes  | Full operation detail view         |
| `/operations/:id/edit`| EditOperation       | Yes  | Edit operation (wizard pre-filled) |
| `/doctors`            | DoctorsPage         | Yes  | Doctor management                  |
| `/hospitals`          | HospitalsPage       | Yes  | Hospital management                |
| `/specialties`        | SpecialtiesPage     | Yes  | Specialty management (admin CRUD)  |
| `/search`             | SearchPage          | Yes  | Global search across all entities  |
| `*`                   | Redirect to `/`     | —    | Catch-all fallback                 |

All pages are **lazy-loaded** via `React.lazy()` with `Suspense` and a centered `Spin` loader.

### 6.2 Component Hierarchy

```
<App> (ConfigProvider: theme + direction)
  ├── <LoginPage> / <RegisterPage>         (public)
  └── <RequireAuth>
      └── <AppLayout>
          ├── <Header>
          │   ├── Logo + Title
          │   ├── Search Input (header)
          │   ├── Dark Mode Toggle
          │   ├── Language Toggle (EN/AR)
          │   └── Profile Menu (user name, logout)
          ├── <Sidebar> (Desktop: fixed aside / Mobile: Ant Drawer)
          │   ├── Logo
          │   ├── NavLinks: Dashboard, Patients, Operations, Doctors, Hospitals, Specialties, Search
          │   └── Bottom: Settings, Logout
          └── <main> (Outlet content)
              ├── <DashboardPage>
              │   ├── <StatsCards> (KPI cards)
              │   ├── <MonthlyChart> (bar chart)
              │   ├── <StatusOverview> (status pie/bar)
              │   └── <RecentOperations> (table)
              ├── <PatientsPage> ... etc.
              └── <OperationFormPage> (6-step wizard)
```

### 6.3 State Management

#### Zustand Stores

**auth.store.ts** — Client-side auth state:
- `user: User | null` — Current logged-in user
- `token: string | null` — JWT token
- `isAuthenticated: boolean` — Derived from token presence
- `login(token, user)` — Sets token in localStorage + store
- `logout()` — Clears token from localStorage + store
- `setUser(user)` — Updates user object

**app.store.ts** — UI preferences (persisted to localStorage):
- `sidebarCollapsed: boolean` — Key: `medaxis_sidebarCollapsed`
- `darkMode: boolean` — Key: `medaxis_darkMode`, toggles `dark` class on `<html>`
- `language: 'en' | 'ar'` — Key: `medaxis_language`
- `direction: 'ltr' | 'rtl'` — Auto-derived from language, sets `document.documentElement.dir`
- `toggleSidebar()`, `toggleDarkMode()`, `toggleLanguage()`

#### React Query (Server State)

Configured in `main.tsx`:
```typescript
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } }
});
```

Used via `useQuery` and `useMutation` in every page for all CRUD operations.

### 6.4 Form Handling

- **Library**: `react-hook-form` + `@hookform/resolvers/zod` for client-side validation.
- **Pattern**: Each form page defines a Zod schema, passes it to `useForm({ resolver: zodResolver(schema) })`.
- **Server validation**: Backend controllers use Zod `safeParse()` independently — defense in depth.

### 6.5 Styling

- **SCSS Modules** (`.module.scss`) for component-scoped styles — no inline styles.
- **Ant Design 6** components with custom theme tokens (colorPrimary, borderRadius, fontFamily, etc.) defined in `App.tsx`.
- **Global SCSS** (`global.scss`) handles reset, base typography, Ant Design overrides, dark mode via `.dark` class, and utility classes.
- **Variables** (`variables.scss`) automatically injected into every SCSS file via Vite `additionalData`.

### 6.6 Internationalization (i18n)

- **Library**: `i18next` + `react-i18next`.
- **Languages**: English (`en.json`) and Arabic (`ar.json`), ~425 translation keys each.
- **RTL Support**: When Arabic is selected, `document.documentElement.dir = 'rtl'` and Ant Design `direction="rtl"` is applied.
- **Font Switching**: Arabic body uses `'IBM Plex Sans Arabic', 'Cairo'` (set in global.scss via `[dir='rtl']` selector).
- **Usage**: `const { t } = useTranslation()` then `t('dashboard.title')`.
- **Rule**: No hardcoded user-facing strings — everything goes through i18n keys.

---

## 7. DESIGN SYSTEM

### 7.1 Color Palette

| Token               | Value       | Usage                              |
| ------------------- | ----------- | ---------------------------------- |
| **Primary**         | `#2563EB`   | Buttons, links, active states       |
| Primary Hover       | `#1D4ED8`   | Button hover                       |
| Primary Light       | `#EFF6FF`   | Light backgrounds, badges           |
| Primary 100         | `#DBEAFE`   | Borders, subtle highlights         |
| Primary 200         | `#BFDBFE`   | Lighter accents                    |
| Primary 600/700/800 | `#2563EB` / `#1D4ED8` / `#1E40AF` | Variants |
| **Secondary**       | `#0F172A`   | Dark text, sidebar, headings        |
| **Accent**          | `#14B8A6`   | Teal accent for highlights          |
| **Success**         | `#16A34A`   | Paid, completed, positive states    |
| Success Light       | `#F0FDF4`   | Success backgrounds                 |
| **Warning**         | `#F59E0B`   | Partial, pending, caution states    |
| Warning Light       | `#FFFBEB`   | Warning backgrounds                 |
| **Error**           | `#DC2626`   | Unpaid, cancelled, error states     |
| Error Light         | `#FEF2F2`   | Error backgrounds                   |
| **Info**            | `#0284C7`   | Informational states                |
| Info Light          | `#F0F9FF`   | Info backgrounds                    |
| Background          | `#F8FAFC`   | Page background                     |
| Surface             | `#FFFFFF`   | Card, modal surfaces                |
| Border              | `#E2E8F0`   | Component borders                   |
| Divider             | `#CBD5E1`   | Divider lines                      |
| Text Primary        | `#0F172A`   | Main text                          |
| Text Secondary      | `#475569`   | Secondary text                     |
| Text Muted          | `#94A3B8`   | Placeholder, disabled text         |
| Text Disabled       | `#CBD5E1`   | Disabled form elements             |
| Text Inverse        | `#FFFFFF`   | Text on dark backgrounds           |

#### Status Colors (Operation)

| Status        | Color     | Background         |
| ------------- | --------- | ------------------ |
| Scheduled     | `#2563EB` | `rgba(37,99,235,0.1)` |
| Checked In    | `#14B8A6` | `rgba(20,184,166,0.1)` |
| In Progress   | `#7C3AED` | `rgba(124,58,237,0.1)` |
| Completed     | `#16A34A` | `rgba(22,163,74,0.1)` |
| Cancelled     | `#DC2626` | `rgba(220,38,38,0.1)` |
| No Show       | `#F97316` | `rgba(249,115,22,0.1)` |

### 7.2 Typography

| Scale Token   | Size  | Usage                              |
| ------------- | ----- | ---------------------------------- |
| `$font-caption` | 12px  | Captions, labels, tiny text       |
| `$font-body-sm`| 14px  | Default Ant Design body text     |
| `$font-body`   | 16px  | Body text, form labels            |
| `$font-body-lg`| 18px  | Emphasized body text              |
| `$font-h5`     | 20px  | H5 headings                       |
| `$font-h4`     | 24px  | H4 headings, card titles          |
| `$font-h3`     | 30px  | H3 headings, page subtitles       |
| `$font-h2`     | 36px  | H2 headings, page titles          |
| `$font-h1`     | 48px  | H1 headings, hero text            |

**Font Weights**: Normal (400), Medium (500), Semibold (600), Bold (700)
**Line Heights**: Tight (1.25), Normal (1.5), Relaxed (1.75)

**Font Families**:
- **English (LTR)**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Arabic (RTL)**: `'IBM Plex Sans Arabic', 'Cairo', 'Inter', sans-serif`

### 7.3 Spacing Scale

| Token        | Value |
| ------------ | ----- |
| `$space-1`   | 4px   |
| `$space-2`   | 8px   |
| `$space-3`   | 12px  |
| `$space-4`   | 16px  |
| `$space-5`   | 20px  |
| `$space-6`   | 24px  |
| `$space-8`   | 32px  |
| `$space-10`  | 40px  |
| `$space-12`  | 48px  |
| `$space-16`  | 64px  |

### 7.4 Border Radius

| Token           | Value |
| --------------- | ----- |
| `$radius-sm`    | 4px   |
| `$radius`       | 6px   |
| `$radius-md`    | 8px   |
| `$radius-lg`    | 12px  |
| `$radius-xl`    | 16px  |
| `$radius-2xl`   | 20px  |
| `$radius-full`  | 9999px|

### 7.5 Shadows

| Token          | Value                                                                    |
| -------------- | ------------------------------------------------------------------------ |
| `$shadow-sm`    | `0 1px 2px 0 rgba(0,0,0,0.05)`                                          |
| `$shadow-md`    | `0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)`        |
| `$shadow-lg`    | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)`     |
| `$shadow-xl`    | `0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)`   |

### 7.6 Dark Mode Colors

| Token                    | Value     |
| ------------------------ | --------- |
| `$dark-background`       | `#0B1120` |
| `$dark-surface`          | `#151F32` |
| `$dark-surface-elevated` | `#1E293B` |
| `$dark-border`           | `#1E293B` |
| `$dark-divider`          | `#334155` |
| `$dark-text-primary`     | `#F1F5F9` |
| `$dark-text-secondary`   | `#94A3B8` |
| `$dark-text-muted`       | `#64748B` |
| `$dark-sidebar-bg`       | `#0F172A` |
| `$dark-sidebar-active`   | `#1E3A5F` |

Dark mode is activated by adding class `dark` to `<html>`. Ant Design dark theme is applied via `algorithm: antTheme.darkAlgorithm` with custom dark tokens. Dark shadows have higher opacity (0.3–0.5).

### 7.7 Additional Design Tokens

| Token                  | Value              |
| ---------------------- | ------------------ |
| **Breakpoints**        | xs: 576, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 |
| **Transitions**        | Fast: 150ms, Base: 250ms, Slow: 350ms (all ease) |
| **Z-Index**            | Dropdown: 1000, Sticky: 1020, Fixed: 1030, Modal Backdrop: 1040, Modal: 1050, Popover: 1060, Tooltip: 1070 |
| **Layout**             | Header height: 64px, Sidebar width: 260px, Sidebar collapsed: 72px |
| **Ant Design Control Height** | 40px (buttons, inputs, selects) |
| **Ant Design Border Radius** | 8px (buttons, inputs, selects), 12px (tables, cards), 20px (modals) |

---

## 8. KEY FEATURES

### 8.1 6-Step Operation Wizard (`pages/Operations/OperationForm/`)

The core feature of MedAxis. A multi-step wizard for creating operations in under 60 seconds. Orchestration lives in `OperationForm/OperationFormPage.tsx`; each step, nav, and sticky actions are isolated named folders with co-located `.scss` (same pattern as Doctors/Hospitals).

1. **Step 1 — Patient Information** (`PatientStep/`)
   - Search existing patients via debounced autocomplete
   - Toggle to create new patient inline (name, age, gender, mobile)
   - Smart default: Gender = Male

2. **Step 2 — Operation Details** (`OperationDetailsStep/`)
   - Operation name, diagnosis, hospital (select), specialty (select)
   - Date (DatePicker, default: today), time (TimePicker, default: now), room, duration
   - Smart defaults: Status = Completed, Date = Today, Time = Now, Hospital = Last Used

3. **Step 3 — Medical Team** (`TeamStep/`)
   - Primary Surgeon (default: logged-in doctor), Assistant Surgeon
   - Anesthesiologist, Assistant Anesthesia, Nurse, Notes

4. **Step 4 — Cost & Payment** (`CostStep/`)
   - Live cost summary strip (total / paid / remaining)
   - Payment Method (default: Cash), Payment Status (default: Paid), Payment Notes

5. **Step 5 — Files & Media** (`FilesStep/`)
   - Upload before/after operation files (images, X-rays, MRI, CT, PDF, DICOM)
   - Accepted: `.jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.dicom,.avi,.mp4,.mov`
   - File preview, download, delete (requires save first)

6. **Step 6 — Review & Submit** (`ReviewStep/`)
   - Editable summary sections with jump-back to each step
   - Final validation before submission

Chrome: `WizardNav/` (desktop steps + mobile progress) and `WizardActions/` (sticky mobile footer).

### 8.2 Quick Save

"Quick Save" button on Step 2 saves the operation immediately with current data (useful for rapid logging). Creates the operation and navigates to the detail page.

### 8.3 Auto-Save (localStorage)

Form data is automatically persisted to `localStorage` as the user progresses through wizard steps. If the browser is accidentally closed, data is recovered on return.

### 8.4 Smart Defaults

See dedicated **Section 9** below.

### 8.5 Timeline (Audit Trail)

Every significant operation event is automatically logged to `OperationTimeline`:
- `OPERATION_CREATED` — When operation is first saved
- `OPERATION_UPDATED` — When operation details are edited
- `STATUS_CHANGED` — When status is changed
- `FILES_UPLOADED` — When files are attached
- `COST_UPDATED` — When cost/payment info is updated
- `TEAM_UPDATED` — When medical team is modified
- `NOTES_UPDATED` — When notes are changed

Each entry includes: action, description, timestamp, and the user who performed it.

### 8.6 File Upload

- Multer disk storage with crypto-random filenames
- Max 20 files per upload, 50MB per file
- Accepted MIME types: JPEG, PNG, GIF, WebP, PDF, DICOM, generic binary
- Files stored in `uploads/` directory, served statically at `/uploads`
- Physical files deleted from disk when operation or file record is deleted

### 8.7 Dashboard Analytics

- **Stats Cards**: Total operations, status breakdown, total patients, revenue
- **Monthly Trends**: Bar chart showing total and completed operations per month (last 12 months)
- **Specialty Distribution**: Count of operations per specialty
- **Recent Operations**: Latest 5 operations with patient, hospital, cost
- **Revenue**: Total cost, paid amount, remaining amount

### 8.8 Global Search

Search across all entities simultaneously: patients (by name/mobile), operations (by name/diagnosis/patient), doctors (by name), hospitals (by name). Results grouped by entity type with tabs. All search queries use Prisma's `mode: 'insensitive'` filter for PostgreSQL case-insensitive matching.

---

## 9. SMART DEFAULTS

The operation wizard pre-fills fields to minimize data entry time:

| Field              | Default Value               | Source                                            |
| ------------------ | --------------------------- | ------------------------------------------------- |
| Patient Gender     | `MALE`                      | Hardcoded default                                 |
| Operation Status   | `COMPLETED`                 | Most common for retroactive logging               |
| Operation Date     | Today's date                | `dayjs()` at form init                            |
| Operation Time     | Current time                | `dayjs().format('HH:mm')` at form init            |
| Hospital           | Last used hospital           | `localStorage.getItem('medaxis_lastUsedHospital')`|
| Primary Surgeon    | Logged-in doctor            | `useAuthStore().user` matched against doctor list |
| Payment Method     | `CASH`                      | Hardcoded default                                 |
| Payment Status     | `PAID`                      | Hardcoded default                                 |
| Paid Amount        | `0`                         | Default zero                                       |
| Payment Notes      | `''`                        | Empty                                              |
| Diagnosis          | `''`                        | Empty                                              |
| Operation Room     | `''`                        | Empty                                              |
| Duration           | `null`                      | Optional                                           |
| Notes              | `''`                        | Empty                                              |

The "Last Used Hospital" feature stores the hospital ID in localStorage after each operation save and pre-selects it for the next operation.

---

## 10. MOBILE OPTIMIZATIONS

MedAxis is designed **mobile-first** for orthopedic surgeons who use the app in operating rooms:

1. **One-Hand Usage**: All primary actions (save, next, submit) are within thumb reach. Bottom-sticky action bars on mobile.
2. **Bottom Sticky Actions**: Save/Next/Previous buttons are fixed to the bottom of the viewport on mobile, always accessible.
3. **Large Inputs/Buttons**: Minimum 44px touch targets. Ant Design `controlHeight: 40px` (close to 44px minimum). Large tap areas on all interactive elements.
4. **Camera-First Upload**: On mobile, the file upload triggers camera capture first (via `<input accept="image/*" capture="environment">`), with gallery as fallback.
5. **Single Column Layout**: All pages use single-column layout on mobile (no side-by-side grids). Ant Design `Col` responsive breakpoints (`xs={24}`).
6. **No Horizontal Scroll**: Overflow is handled with vertical scrolling only. Tables have horizontal scroll on their container, not the page.
7. **Mobile Sidebar as Drawer**: On screens < 992px, the sidebar becomes an Ant Design `Drawer` that slides in from left (or right in RTL).
8. **Responsive Breakpoints**: xs: 576, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400.

---

## 11. DEVELOPMENT GUIDE

### 11.1 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **bun** (server uses npm scripts)
- **Git**
- **Docker** (required for PostgreSQL via Docker Compose)

### 11.2 Setup Steps

#### Development (PostgreSQL with Docker Compose)

```bash
# 1. Clone and enter project
 cd medaxis

# 2. Start PostgreSQL via Docker Compose
docker-compose up -d

# 3. Create server/.env file
cd server
 cat > .env << EOF
 DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medaxis
 JWT_SECRET=medaxis-secret-key
 JWT_EXPIRES_IN=7d
 UPLOAD_DIR=./uploads
 EOF

# 4. Install server dependencies
 npm install

# 5. Install client dependencies
 cd ../client && npm install && cd ../server

# 6. Push Prisma schema to PostgreSQL
npx prisma db push

# 7. Generate Prisma client
npx prisma generate

# 8. Seed database (15 specialties + demo user)
npm run seed

# 9. Start server (port 5000, tsx watch)
npm run dev &

# 10. Start client (port 3000 → proxy to server :5000)
cd ../client && npm run dev
```

### 11.3 Environment Variables

| Variable            | Default                          | Description                        |
| ------------------- | -------------------------------- | ---------------------------------- |
| `JWT_SECRET`        | `medaxis-secret-key`             | Secret for signing JWT tokens      |
| `JWT_EXPIRES_IN`    | `7d`                              | JWT token expiry                   |
| `UPLOAD_DIR`        | `{cwd}/uploads`                   | Directory for uploaded files       |
| `NODE_ENV`          | `development`                     | Environment mode                   |
| `DATABASE_URL`      | `postgresql://postgres:postgres@localhost:5432/medaxis` | PostgreSQL connection string (read by `prisma.config.ts` via dotenv) |
| `VITE_API_URL`      | (empty, uses proxy in dev)        | API base URL for Axios in client   |

### 11.4 Scripts

| Script          | Command                | Description                              |
| --------------- | ---------------------- | ---------------------------------------- |
| `dev` (server)  | `tsx watch src/index.ts`| Start server with hot reload on port 5000 |
| `build` (server)| `tsc`                  | Compile TypeScript to `dist/`            |
| `start` (server)| `node dist/index.js`   | Run compiled server                      |
| `seed` (server) | `tsx prisma/seed.ts`   | Seed database with demo data              |
| `db:push`        | `prisma db push`       | Push schema changes to database           |
| `db:generate`    | `prisma generate`      | Generate Prisma Client                    |
| `dev` (client)  | `vite`                 | Start Vite dev server on port 3000        |
| `build` (client)| `tsc -b && vite build`| Type-check and build to `dist/`           |
| `preview` (client)| `vite preview`        | Preview production build                   |

### 11.5 Port Configuration

| Service  | Port  | Notes                                         |
| -------- | ----- | --------------------------------------------- |
| Server   | 5000  | Express API + static frontend in production   |
| Client   | 3000  | Vite dev server (proxies `/api` to `:5000`)  |
| PostgreSQL| 5432 | Docker Compose (postgres:16-alpine)            |

In development, Vite proxies `/api` requests to `http://localhost:5000`. The server runs on port 5000 in production (serving both API and built frontend). In production, Express serves the built client from `client/dist/` with SPA fallback.

---

## 12. TESTING

### 12.1 Login Credentials

| Field     | Value               |
| --------- | ------------------- |
| Email     | `demo@medaxis.com`  |
| Password  | `demo1234`          |
| Role      | `doctor`            |
| Name      | `Dr. Ahmed`         |

### 12.2 Test Scenarios

#### Auth Module
- Login with valid credentials → redirects to dashboard
- Login with invalid email → error message
- Login with wrong password → error message
- Register new account → auto-login → dashboard
- Access protected route without token → redirects to `/login`
- Access `/api/auth/me` with valid token → returns user data
- Access `/api/auth/me` with expired token → 401

#### Patient Module
- Create patient with all fields → appears in list
- Create patient with minimum fields (name, age) → success
- Search patients by name → filtered results
- Filter by gender → correct results
- View patient detail → shows operation history
- Edit patient → updated data persists
- Delete patient → removed from list, cascades to operations

#### Operation Module (Wizard)
- Complete 6-step wizard end-to-end → operation created with all data
- Quick Save on Step 2 → operation created immediately
- Smart defaults: verify date = today, time = now, status = Completed, payment = Cash/Paid
- Last used hospital: create op with Hospital A, create new op → Hospital A pre-selected
- Primary surgeon defaults to logged-in doctor
- Upload files in Step 5 → files appear in operation detail
- Change status from detail page → timeline entry created
- Update cost → remaining auto-calculated, timeline entry created
- Delete file → removed from disk and database

#### Dashboard Module
- View dashboard → shows stats cards, charts, recent operations
- Monthly trends chart → shows last 12 months
- Revenue card → shows total/paid/remaining

#### Doctor/Hospital/Specialty Modules
- CRUD operations on each entity
- Search/filter functionality
- Specialty create/update/delete restricted to admin role

#### Search Module
- Search for patient name → appears in patients tab
- Search for operation name → appears in operations tab
- Empty query → no results or all results

#### Export Module
- Export operations as JSON → downloadable JSON file
- Export operations as CSV → downloadable CSV with headers
- Filter by date range and status → filtered export

#### Mobile Tests
- Responsive layout on 375px width
- Sidebar opens as drawer on mobile
- Bottom sticky actions visible
- Camera capture triggered on file upload

#### i18n Tests
- Switch to Arabic → all text in Arabic, layout RTL
- Switch back to English → LTR restored
- Dark mode toggle → correct colors applied

---

## 13. DEPLOYMENT

### 13.1 Production Setup with PostgreSQL

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Create .env file in server/
cat > server/.env << EOF
NODE_ENV=production
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medaxis"
JWT_SECRET="your-production-secret-key-change-this"
JWT_EXPIRES_IN="7d"
UPLOAD_DIR="./uploads"
EOF

# 3. Push schema
cd server
npx prisma db push
npx prisma generate

# 5. Seed database
npm run seed

# 6. Build client
cd ../client
npm run build

# 7. Build server
cd ../server
npm run build

# 8. Start
cd ../server
npm start
# Server serves API on :5000 AND static files from ../client/dist
```

### 13.2 Docker Compose (Database)

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: medaxis-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: medaxis
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

### 13.3 Required Environment Variables for Production

| Variable            | Required | Description                          |
| ------------------- | -------- | ------------------------------------ |
| `NODE_ENV`          | Yes      | Must be `"production"`               |
| `DATABASE_URL`      | Yes      | PostgreSQL connection string         |
| `JWT_SECRET`        | Yes      | Strong random string (min 32 chars)  |
| `JWT_EXPIRES_IN`    | No       | Default: `"7d"`                     |
| `UPLOAD_DIR`        | No       | Default: `./uploads`                 |

### 13.4 Build Output

- Client builds to `client/dist/` (static HTML/JS/CSS)
- Server compiles to `server/dist/` (CommonJS)
- Express serves `client/dist/` as static files with SPA fallback
- Uploaded files stored in `server/uploads/` (ensure this directory is persistent in production)

---

## 14. ROADMAP

### Phase 1 — MVP (Current)
- [x] Single-doctor operation logbook
- [x] Patient CRUD with search
- [x] 6-step operation wizard with smart defaults
- [x] Medical team assignment
- [x] Cost & payment tracking
- [x] File upload (images, X-rays, MRI, PDF)
- [x] Timeline audit trail
- [x] Dashboard with analytics
- [x] Global search
- [x] Dark mode & i18n (English/Arabic, RTL)
- [x] Export operations (CSV/JSON)
- [x] Hospital & specialty management
- [x] Swagger / OpenAPI 3.0 docs (`/api-docs`, `server/src/docs/swagger.ts`)

### Phase 2 — Multi-Doctor & Clinic Management
- [ ] Multi-doctor support (shared clinic, per-doctor data isolation)
- [ ] Clinic management (rooms, equipment, schedules)
- [ ] Appointment scheduling system
- [ ] Full billing/invoicing system
- [ ] Patient portal (view history, upcoming appointments)
- [ ] Email/SMS notifications
- [ ] Recurring operations tracking

### Phase 3 — Mobile App & Advanced Features
- [ ] React Native / Capacitor mobile app
- [ ] Public API for third-party integrations
- [ ] Advanced analytics with charts (drill-down, comparison)
- [ ] AI-powered suggestions (operation duration prediction, diagnosis assistance)
- [ ] Document template system (consent forms, pre-op reports)
- [ ] Barcode/QR code patient identification

### Phase 4 — Multi-Tenant SaaS
- [ ] Multi-tenant architecture (clinic/organization level)
- [ ] Subscription billing (Stripe/Paddle)
- [ ] Marketplace (templates, integrations, plugins)
- [ ] Role-based access control (admin, surgeon, assistant, nurse, receptionist)
- [ ] Audit log export
- [ ] HIPAA/GDPR compliance tools
- [ ] White-label branding

---

## 15. CODING STANDARDS

### 15.1 Language & Types
- **TypeScript everywhere** — no plain JavaScript files.
- Strict TypeScript configuration on both client and server.
- All entity interfaces defined in `client/src/types/index.ts`.
- Enums mirrored between Prisma schema and client types.

### 15.2 State Management
- **React Query** (`@tanstack/react-query`) for all server state (data fetching, mutations, caching).
- **Zustand** for client-only state (auth, UI preferences).
- Never use `useState` for data that comes from the server.
- React Query config: `staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`.

### 15.3 Validation
- **Zod** for all validation — both client-side (with `@hookform/resolvers/zod`) and server-side (independent Zod schemas in controllers).
- Defense in depth: validate on both client AND server.

### 15.4 Styling
- **SCSS Modules** (`.module.scss`) for component-scoped styles.
- **No inline styles** except in rare, justified cases (like the `PageLoader` component).
- Design tokens from `variables.scss` are auto-injected globally via Vite `additionalData`.
- Use `mixins.scss` for responsive breakpoints, dark mode overrides, scrollbar styling.
- Ant Design component overrides go in `global.scss`.

### 15.5 Internationalization
- **i18n from day one** — no hardcoded user-facing strings.
- All strings in `en.json` and `ar.json` under appropriate namespaces (`common`, `auth`, `dashboard`, `patients`, `operations`, `doctors`, `hospitals`, `specialties`, `search`, `nav`, `sidebar`, `layout`, `validation`).
- Use `const { t } = useTranslation()` then `t('namespace.key')`.

### 15.6 Architecture
- **Feature-based architecture** on both client and server.
- **Repository Pattern** on backend: Controller → Service → Repository → Prisma.
- Controllers handle HTTP concerns (parsing, validation, response formatting).
- Services contain business logic (ownership checks, side effects, timeline entries).
- Repositories handle data access only (Prisma queries).
- All repositories and services are singleton classes exported as `export const xxxRepo = new XxxRepository()`.

### 15.7 Error Handling
- Custom error classes: `AppError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `BadRequestError`, `ConflictError`.
- Global error handler middleware catches all errors and formats them consistently.
- Prisma errors (P2002 unique, P2025 not found, P2003 FK) are translated to user-friendly messages.
- Client-side: React Query `onError` callbacks + Ant Design `message.error()` toasts.

### 15.8 API Design
- RESTful endpoints grouped by resource.
- Standardized response format: `{ success, message, data?, meta? }`.
- Paginated responses include `meta: { page, limit, total, totalPages }`.
- All data is scoped by `createdBy` (user ID) for data isolation.
- **Swagger/OpenAPI**: keep `server/src/docs/swagger.ts` in sync with real routes and Zod validators. Docs-only — never invent endpoints or change API behavior for documentation.

### 15.9 File Organization
- One file per component/page/service/repository.
- Barrel exports for page directories (e.g., `pages/Dashboard/index.tsx` re-exports the page).
- Services follow naming convention: `{domain}.service.ts` (client) and `{domain}.service.ts` (server).
- SCSS co-located with their components: `ComponentName.scss` (or `.module.scss` where modules are used).
- OpenAPI spec lives in `server/src/docs/swagger.ts`; do not inline large specs in `index.ts`.

#### Page feature isolation (CRUD list pages)
For list/management pages under `client/src/pages/` (e.g. Doctors, Hospitals), keep components isolated — do **not** dump card, row, form, and list into one giant `index.tsx`.

| Piece | Location | Naming |
|-------|----------|--------|
| List / main screen | `pages/{Feature}/index.tsx` | Keep as `index.tsx` (route entry) |
| Page layout styles | `pages/{Feature}/{Feature}.scss` | Match folder name |
| Add/Edit form (modal or page) | `pages/{Feature}/Add{Entity}/Add{Entity}.tsx` + `.scss` | Named file — **never** `index.tsx` inside the form folder (e.g. `AddDoctor`, `AddHospital`) |
| Mobile card | `pages/{Feature}/{Entity}Card/{Entity}Card.tsx` + `.scss` | Named folder + matching file |
| Desktop row/list item | `pages/{Feature}/{Entity}Row/{Entity}Row.tsx` + `.scss` | Named folder + matching file |

**Rules:**
- `index.tsx` = list, search, pagination, delete, and wiring open/close for the add form. Prefer thin page orchestration.
- Put create/update form logic (Zod schema, `react-hook-form`, mutations, Modal) inside `Add{Entity}`.
- Each isolated UI piece gets its **own folder** with a **named** `.tsx` and co-located `.scss` (same pattern as `components/layout/AppLayout/`).
- Do not name child feature files `index.tsx` — use `AddDoctor.tsx`, `HospitalCard.tsx`, etc.
- Export skeletons from the same card/row files when needed (e.g. `HospitalCardSkeleton`).
- Prefer plain string class names with global/co-located SCSS unless the file already uses CSS modules (`styles[...]`). Never reference a `styles` object without a CSS-module import.

**Example (Hospitals):**
```
pages/Hospitals/
  index.tsx
  Hospitals.scss
  AddHospital/AddHospital.tsx|.scss
  HospitalCard/HospitalCard.tsx|.scss
  HospitalRow/HospitalRow.tsx|.scss
```

---

## 16. KEY DECISIONS & TRADEOFFS

### 16.1 PostgreSQL as the Sole Database

**Decision**: Use PostgreSQL 16 (via Docker Compose with `postgres:16-alpine`) for both development and production.

**Rationale**:
- PostgreSQL ensures data integrity, concurrent access, and scalability from day one.
- No SQL dialect differences between environments — eliminates a class of subtle bugs.
- Prisma 7 supports PostgreSQL's `mode: 'insensitive'` for case-insensitive search queries natively.
- `Decimal @db.Decimal(10, 2)` for monetary fields avoids floating-point precision issues.
- Docker Compose makes local setup trivial (`docker-compose up -d`).
- Full-text search, advanced indexing, and JSONB are available in development.

**Tradeoff**: Requires Docker for local development. Slightly more setup than a file-based database. Mitigated by the provided `docker-compose.yml` and setup scripts.

### 16.2 Express 5 with Prisma 7

**Decision**: Use Express 5 (latest) with Prisma 7 connecting directly to PostgreSQL.

**Rationale**:
- Express 5 provides improved routing, better async error handling.
- Prisma 7 provides a type-safe ORM with first-class PostgreSQL support.
- `prisma.config.ts` reads `DATABASE_URL` from `.env` via dotenv for clean configuration.
- Direct PostgreSQL connection (no driver adapter layer) for maximum compatibility and performance.

**Tradeoff**: Express 5 is relatively new; some middleware may not be fully compatible.

### 16.3 Why Ant Design

**Decision**: Use Ant Design 6 as the UI component library.

**Rationale**:
- Comprehensive component set (Table, Form, Steps, Upload, DatePicker, Drawer, Modal, etc.) — avoids building custom components.
- Built-in theme system via `ConfigProvider` — easy to implement light/dark mode and custom color tokens.
- Native RTL support via `direction` prop — critical for Arabic language.
- Mobile-responsive components out of the box.
- Enterprise-grade quality with 95k+ GitHub stars.

**Tradeoff**: Large bundle size (~300KB gzipped). Less design flexibility compared to headless UI libraries. Ant Design's opinionated styling may conflict with custom designs.

### 16.4 Why Not Next.js (React + Vite Instead)

**Decision**: Use React 19 + Vite 8 as a standalone SPA, not Next.js.

**Rationale**:
- The user specifically requested React + Vite.
- MedAxis is a single-page application with client-side routing — no SSR/SSG requirements.
- Vite provides faster HMR and build times for SPAs.
- The Express backend is a separate API server — no need for Next.js API routes.

**Tradeoff**: No server-side rendering for SEO (not needed for a private SaaS app). No automatic code splitting by route (mitigated by `React.lazy()`). No built-in image optimization.

### 16.5 Vite Proxy in Dev / Static Serving in Production

**Decision**: Use Vite proxy for API requests in development; Express serves built frontend in production.

**Development**: Vite dev server (port 3000) proxies `/api` requests to Express (port 5000).

**Production**: Express serves the built client from `client/dist/` as static files, with SPA fallback (`app.get('/{*splat}', ...)` sends `index.html`). This means only one port (5000) needs to be exposed.

**Tradeoff**: In development, two processes must be running (client + server). In production, the client build must be regenerated and copied for every frontend change.

### 16.6 JWT Without Refresh Tokens

**Decision**: Use simple JWT with 7-day expiry, no refresh token mechanism.

**Rationale**:
- MVP simplicity — the app is used by a small number of doctors.
- 7-day expiry is convenient (doctors don't want to log in daily).
- Token stored in `localStorage` (simpler than httpOnly cookies for SPA).

**Tradeoff**: If a token is compromised, it's valid for 7 days. No automatic session management. For production SaaS, refresh tokens and httpOnly cookies should be added.

### 16.7 File Storage (Local Disk)

**Decision**: Store uploaded files on local disk (`uploads/` directory) rather than cloud storage (S3, etc.).

**Rationale**:
- Simplicity for MVP — no external service dependency.
- Files are served directly by Express static middleware.
- Medical images are typically large; local storage avoids egress costs during development.

**Tradeoff**: Not horizontally scalable. Files lost if server disk fails. For production, migrate to S3-compatible storage (AWS S3, Cloudflare R2, etc.) with signed URLs.
