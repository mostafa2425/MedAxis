# MedAxis Sprint Progress

> Living project tracker. Update this file after every completed sprint item.

## Current Status

- **Sprint 0:** 🟢 Implementation complete; local verification pending
- **Sprint 1:** 🟢 Core implementation complete; local verification pending
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

### Safety

- New hospital fields are nullable.
- New cost fields default to `0` so existing operation costs remain valid.
- Governorate foreign key uses `ON DELETE SET NULL`.
- Production has not been changed by this work.
- Do not use `prisma db push` against production.

---

## Next Planned Work

1. Finish local verification for Sprint 0/1.
2. Resolve any TypeScript/build issues found by verification.
3. Review production migration/baseline strategy before applying DB changes.
4. Start **Sprint 2 — Files 2.0**:
   - Before / During / After stages
   - Imaging / Clinical / Documents / Other types
   - File metadata
   - Image/PDF preview
   - Timeline integration
   - Secure Supabase Storage workflow
