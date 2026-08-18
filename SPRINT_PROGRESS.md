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
- [ ] Add global Follow-ups page with Upcoming / Overdue / Completed filters
- [ ] Add dashboard follow-up summary and calendar integration
- [ ] Add reminder notifications after notification infrastructure is introduced

### Verification
- [ ] Run `npm run db:generate`
- [ ] Run `npx prisma validate`
- [ ] Run `npm run typecheck`
- [ ] Run `npm run build`
- [ ] Run local API smoke tests for follow-up CRUD
- [ ] Verify mobile UX in browser

## Frontend Rules
- [x] Added `docs/FRONTEND_RULES.md` with mobile-first Ant Design, TypeScript, and kebab-case SCSS conventions

## Next Roadmap
- [ ] Sprint 3 — Operation Templates
- [ ] Sprint 4 — Case Completeness
- [ ] Sprint 5 — Implant Tracking
- [ ] Sprint 6 — Operative Notes + Templates
- [ ] Sprint 7 — Advanced Analytics
- [ ] Sprint 8 — AI-assisted clinical workflow

## Environment
- Development API: `medaxis-api-dev.vercel.app`
- Development files: Supabase DEV Storage only
- Production storage must remain isolated from DEV
- Service-role credentials remain server-only
