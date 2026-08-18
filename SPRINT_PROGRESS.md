# Sprint Progress

## Sprint 2 — Clinical Files 2.0

### Storage architecture
- [x] Supabase DEV `clinical-files` public bucket
- [x] Direct client uploads with signed upload URLs
- [x] API authorization + metadata persistence
- [x] Public preview/download URLs
- [x] Delete storage object + metadata safely
- [x] File size/MIME validation (50 MB max)
- [x] Mobile upload flow wired to the Clinical Files UI
- [ ] Local typecheck/build verification — run from the developer checkout
- [ ] End-to-end upload/preview/delete smoke test against DEV deployment

### Implementation
- API defaults to `SUPABASE_STORAGE_BUCKET=clinical-files`.
- Files are stored under `operations/{operationId}/...`.
- The service-role key is server-only and must never be exposed to the client.
- Existing authenticated operation access checks remain in place before upload completion, file reads and deletion.

## Environment
- Development API: `medaxis-api-dev.vercel.app`
- Development files: Supabase DEV Storage only
- Production storage must remain isolated from DEV
- See `server/.env.example` for required DEV Storage variables.
