# MedAxis Sprint Progress

> Living project tracker. Update this file after every completed sprint item.

## Current Status

- **Sprint 0:** 🟢 Implementation complete; local verification pending
- **Sprint 1:** 🟢 Core implementation complete; local verification pending
- **API routing consistency:** 🟢 Frontend services audited; centralized Axios client is the API entry point
- **Prisma migration history:** 🟡 Baseline added; existing databases must be marked as baseline-applied before deploying migrations
- **Production database:** 🔒 Not touched
- **Production deployment:** 🔒 Not performed

---

## Sprint 0 — Foundation & Hospital UX

### UI / UX foundation

- [x] Shared Ant Design 6 theme tokens via `ConfigProvider`
- [x] Consistent control sizing and border radius
- [x] Shared `EntityTag` status/tag component
- [x] RTL-aware Ant Design direction at app root

### Hospitals

- [x] Hospital name remains required
- [x] Governorate is required
- [x] Address is optional
- [x] District / area is optional
- [x] Phone is optional
- [x] Notes are optional
- [x] Arabic hospital name is optional
- [x] Egyptian governorates reference model
- [x] Governorate migration
- [x] Idempotent Egyptian governorate seed
- [x] `GET /api/governorates`
- [x] Hospital create/update supports governorate and optional fields
- [x] Hospital queries can filter by governorate
- [x] Modern responsive Ant Design hospital form

### Sprint 0 verification

- [ ] `npm run db:generate`
- [ ] `npx prisma validate`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run seed:governorates` against local/staging DB
- [ ] API smoke test for `/api/governorates`
- [ ] Create/edit hospital smoke test

---

## Sprint 1 — Operation Experience & Financials

### Operation Details UX

- [x] Modern operation header
- [x] Status control in header
- [x] Patient / hospital / date / room summary cards
- [x] Ant Design 6 tabs
- [x] Overview tab
- [x] Clinical Files tab
- [x] Medical Team tab
- [x] Financials tab
- [x] Timeline tab
- [x] Responsive layout using Ant Design Flex/Card/Tabs
- [x] Existing delete/edit/status actions retained

### Operation Financials

- [x] Total operation cost remains the primary field
- [x] Cost breakdown is optional
- [x] Breakdown is collapsed by default
- [x] Hospital cost
- [x] Nursing cost
- [x] Assistant doctors cost
- [x] Equipment cost
- [x] Other cost
- [x] Automatic doctor share calculation
- [x] Breakdown cannot exceed total operation cost
- [x] Paid amount cannot exceed total cost
- [x] Backend normalization and validation
- [x] Prisma model fields
- [x] Additive migration SQL
- [x] Financials save/update endpoint support

### Sprint 1 verification

- [ ] `npm run db:generate`
- [ ] `npx prisma validate`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Operation details smoke test
- [ ] Financials save/update smoke test
- [ ] Validation smoke test: breakdown > total
- [ ] RTL smoke test
- [ ] Mobile/tablet smoke test

---

## API Routing & Environment Consistency

- [x] Central Axios client is used by the frontend service layer
- [x] Local fallback API base URL is `/api` when `VITE_API_URL` is absent
- [x] Local Vite proxy forwards `/api` to `http://localhost:5000`
- [x] Auth endpoints use the centralized API client
- [x] Specialty endpoints use the centralized API client
- [x] Hospital endpoints use the centralized API client
- [x] Operation endpoints use the centralized API client
- [x] Governorate endpoints use the centralized API client
- [x] Local `.env` removed from Git; environment values must be configured locally/Vercel
- [ ] Full browser smoke test of every service endpoint

> Important: seeing `http://localhost:3005/specialties` instead of `/api/specialties` after changing `.env` usually means the Vite dev server was not restarted or the calling code is bypassing the centralized client. The current service files inspected on `develop` use the centralized `api` client.

---

## Database Changes

### Added

- `governorates` table
- `hospitals.nameAr`
- `hospitals.city`
- `hospitals.governorateId`
- `hospitals.notes`
- `operation_costs.hospitalCost`
- `operation_costs.nursingCost`
- `operation_costs.assistantDoctorsCost`
- `operation_costs.equipmentCost`
- `operation_costs.otherCost`

### Migration history

- [x] Added `server/prisma/migrations/20260817_baseline/migration.sql` to reconstruct the existing Prisma schema in a fresh/shadow database.
- [x] Kept `20260818_sprint_0_1_hospital_governorates_cost_breakdown` as the follow-up Sprint 0/1 migration.
- [ ] On an existing local database that already contains the pre-Sprint schema, mark the baseline as applied before running `migrate dev`.

### Local migration recovery

If the local database already has the schema/tables and has never had the baseline migration recorded, run from `server`:

```bash
npx prisma migrate resolve --applied 20260817_baseline
npx prisma migrate dev
```

Do **not** run `prisma migrate reset` if the local database contains data you want to preserve.

For a completely disposable empty local database, a reset/recreate is also possible, but it is not required for this migration-history fix.

### Safety

- New hospital fields are nullable.
- New cost fields default to `0` so existing operation costs remain valid.
- Governorate foreign key uses `ON DELETE SET NULL`.
- Production has not been changed by this work.
- Do not use `prisma db push` against production.
- Do not mark a production baseline as applied until the existing production schema has been verified against the baseline.

---

## Next Planned Work

1. Finish local verification for Sprint 0/1.
2. Resolve any TypeScript/build issues found by verification.
3. Verify the local migration history using the new baseline.
4. Start **Sprint 2 — Files 2.0**:
   - Before / During / After stages
   - Imaging / Clinical / Documents / Other types
   - File metadata
   - Image/PDF preview
   - Timeline integration
   - Secure Supabase Storage workflow
