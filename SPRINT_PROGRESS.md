# Sprint Progress

## Sprint 0 — Foundation & Data Quality
- [x] PostgreSQL `timestamptz(6)` mapping for application DateTime fields
- [x] Egyptian governorates catalog + seed (26 governorates)
- [x] Hospital bilingual names and governorate support
- [x] Operation cost breakdown with automatic doctor share calculation
- [x] Mobile-first operation detail UX
- [x] Shared Design System components: PageHeader, StatusTag, InfoCard, EmptyState, DataCard, PhoneLink, DateTimeTag, MoneyInput, FileCard, StaffCard, SectionHeader, ConfirmAction

## Sprint 1 — Clinical Case Experience
- [x] Operation detail tabs: Overview, Clinical Files, Medical Team, Financials, Timeline
- [x] Clinical Files 2.0: Before / During / After / Imaging / Documents / Other UX
- [x] Supabase DEV Storage with signed browser uploads
- [x] Timeline visual redesign with translated human-readable actions and icons
- [x] Mobile-first medical team cards and clickable phone links
- [x] Financials + Cost Breakdown UX polish

## Sprint 2 — Clinical Journey & Follow-up Management

### Clinical Case Timeline
- [x] Keep operation audit timeline visible with human-readable actions
- [x] Timeline icons, colored dots and latest-event emphasis
- [ ] Add clinical milestone semantics: Before Surgery → Surgery → After Surgery → Follow-up

### Follow-up Management
- [x] Follow-up data model and migration
- [x] Authenticated operation-scoped Follow-up APIs
- [x] Upcoming / Overdue / Completed / Cancelled states
- [x] Automatic overdue derivation for unfinished past appointments
- [x] Add / complete / delete follow-ups
- [x] Mobile-first Follow-ups tab in Operation Detail
- [x] Arabic / English follow-up labels
- [x] Follow-up summary cards and compact mobile actions
- [x] Follow-up item redesign with compact Complete / Delete icon actions
- [x] Frontend TypeScript cleanup: no unsafe `any` in FollowUpsPanel
- [x] Global Follow-ups page with Upcoming / Overdue / Completed filters
- [x] Global authenticated Follow-ups API with doctor-level data isolation
- [x] Calendar 2.0 follow-up context panel for the active calendar range
- [ ] Add dashboard follow-up summary
- [ ] Add reminder notifications after notification infrastructure is introduced

### Verification
- [ ] Run `npm run db:generate`
- [ ] Run `npx prisma validate`
- [ ] Run `npm run typecheck`
- [ ] Run `npm run build`
- [ ] Run local API smoke tests for global follow-up filters and CRUD
- [ ] Verify mobile UX in browser

## Frontend Rules
- [x] Added `docs/FRONTEND_RULES.md` with mobile-first Ant Design, TypeScript, and kebab-case SCSS conventions

## Product Roadmap — Remaining

### 🔴 Core Workflow
- [ ] Sprint 3 — Patients Management 2.0: patient profile, operation history, follow-ups, files, timeline
- [ ] Sprint 4 — Dashboard 2.0: actionable operations, follow-ups, overdue cases, quick actions
- [ ] Sprint 5 — Notifications: in-app operation and follow-up alerts
- [ ] Sprint 6 — Global Search: patients, operations, hospitals, doctors, follow-ups
- [ ] Sprint 7 — Activity / Audit Center: cross-system recent activity

### 🟠 Clinical Intelligence — Later
- [ ] Sprint 8 — Operation Templates
- [ ] Sprint 9 — Case Completeness
- [ ] Sprint 10 — Implant Tracking
- [ ] Sprint 11 — Operative Notes + Templates
- [ ] Sprint 12 — Advanced Analytics
- [ ] Sprint 13 — AI-assisted clinical workflow

## Environment
- Development API: `medaxis-api-dev.vercel.app`
- Development files: Supabase DEV Storage only
- Production storage must remain isolated from DEV
- Service-role credentials remain server-only
