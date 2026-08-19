# MedAxis — Project Rules

## 1. Scope

These rules apply to all backend/full-stack work on MedAxis, especially production hardening, deployment, authentication, database access, storage, and API changes.

## 2. Secrets

Never request, print, paste, log, commit, or hardcode:

- `DATABASE_URL` values
- `JWT_SECRET` values
- database passwords
- Supabase service-role keys
- API keys
- access tokens
- refresh tokens
- user passwords

Only environment-variable **names** may appear in documentation.

## 3. Production Stack

Use the existing architecture:

- Express + TypeScript backend
- Prisma ORM
- Supabase PostgreSQL
- Supabase Storage for persistent files
- JWT authentication
- Vercel for backend deployment

Do not replace the architecture without a concrete technical reason.

## 4. Database

- Reuse existing Prisma models.
- Do not create duplicate models for the same domain entity.
- Do not reset production data.
- Do not use destructive database commands against production without explicit approval.
- Prefer versioned Prisma migrations for production schema changes.
- Always regenerate Prisma Client after schema changes.
- Keep database access on the server.

### 4.1 CRITICAL — Data Preservation & Schema Sync

This rule is mandatory and has priority over convenience/debugging speed.

**Never run `prisma db pull`, `prisma db push`, schema replacement, database reset, truncate, drop, or migration work against an existing environment until the existing application data and database target have been verified.**

Before any schema synchronization:

1. Identify the exact database/environment being targeted.
2. Inventory existing application data and tables.
3. Determine which records must be preserved, including users, doctors, patients, hospitals, specialties, operations, operation teams, costs, timelines, files, follow-ups, and notification/PWA data.
4. Back up or otherwise preserve required existing data before destructive or potentially destructive changes.
5. Prefer additive/versioned migrations over `db push` for established databases.
6. Never use `--accept-data-loss` as a shortcut when existing data may matter.
7. Verify the resulting schema and representative records after the change.
8. Verify demo/test login and representative doctor operations before declaring the environment ready.

**Schema introspection is not data migration.** `prisma db pull` can update the Prisma schema to describe the database, but it does not migrate application records between databases.

**Never recreate or reseed reference/demo data blindly if existing records must be preserved.** Seeds must be additive/idempotent and must not silently replace production or established development data.

**Development and production must be treated separately.** A destructive operation that is acceptable on an empty disposable development database is not automatically acceptable on an established development or production database.

## 5. File Storage

Vercel's filesystem is not persistent application storage.

All production uploads must use Supabase Storage.

Database records should contain file metadata/reference information rather than binary file contents unless an existing model explicitly requires otherwise.

Recommended path convention:

```text
patients/{patientId}/...
doctors/{doctorId}/...
operations/{operationId}/...
```

Uploads must have:

- authentication/authorization checks
- file type validation
- file size validation
- safe generated storage paths
- useful API errors
- cleanup on failed persistence when practical

The Supabase service-role key is backend-only.

## 6. Authentication

JWT behavior should remain compatible with the current application.

For protected APIs:

- verify the JWT
- derive the authenticated identity server-side
- never trust a client-supplied doctor/user ID when the JWT provides the identity
- return 401 for missing/invalid/expired credentials

## 7. Specialty Scoping

`GET /api/specialties` must respect the authenticated doctor's specialty context.

The backend should determine the doctor's specialty from trusted server-side data and return only the relevant specialty/areas of expertise rather than exposing the entire catalog to every doctor.

Pagination must remain compatible with the current API where applicable.

## 8. Operation Scoping

Operations must be scoped according to the authenticated doctor's ownership/access rules.

Never allow a doctor to access another doctor's private operation data through an arbitrary ID.

Operation data must preserve the required relationships and fields, including:

- doctor
- patient
- hospital
- location
- operation date
- operation time
- status
- cost/payment information
- attached files

## 9. API Contract

Prefer backward-compatible changes.

Before changing an endpoint response or request shape:

1. Inspect frontend usage.
2. Inspect backend consumers/controllers/services.
3. Preserve existing fields where possible.
4. Add fields rather than removing them when compatibility matters.
5. Only modify the frontend if a backend contract change is unavoidable.

## 10. Error Responses

Production errors must be safe and actionable.

Validation errors should identify:

- field/path
- problem
- expected value/type when useful

Never expose:

- stack traces
- SQL/database credentials
- JWT secrets
- Supabase service-role credentials
- internal server filesystem paths

## 11. Environment Configuration

Required environment-variable names are:

```text
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
NODE_ENV
CORS_ORIGIN
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET
```

Never assume a secret is available from source code.

## 12. Vercel

The production backend must work as deployed by Vercel.

Do not rely on:

- persistent local files
- in-memory state surviving requests
- a permanent local process
- local-only environment configuration

The production build must generate Prisma Client and complete TypeScript compilation successfully.

## 13. Required Verification

Every production backend change should be checked with:

```bash
npm run typecheck
npm run build
npx prisma generate
```

Then verify the deployed API:

```text
GET /health
POST /api/auth/login
GET /api/auth/me
GET /api/specialties?page=1&limit=24
GET /api/operations
```

Authenticated tests must use a real test account without exposing credentials in chat or source control.

File-upload changes must additionally verify upload, metadata persistence, authorization, retrieval/access behavior, and deletion.

## 14. Current Production Milestone

Current milestone: **Backend Production Hardening / Vercel + Supabase**.

Completed/verified:

- Vercel production deployment is live.
- `/health` returns HTTP 200.
- `/api/specialties` is reachable and preserves pagination response structure.
- Protected operations reject invalid/missing JWTs with HTTP 401.
- Production environment variables have been configured outside the repository.

Still to verify:

- real doctor login
- authenticated `/api/auth/me`
- doctor-specific specialties/areas of expertise
- authenticated operation list/detail/create/update flows
- operation time in all required responses
- Supabase Storage upload lifecycle
- production seed/reference data
- complete production smoke-test pass

## 15. Agent Behavior

When working on MedAxis:

1. Inspect the existing implementation before changing it.
2. Prefer the smallest correct change.
3. Reuse existing services, repositories, validators, and Prisma models.
4. Do not invent a parallel architecture.
5. Run checks after changes.
6. Fix errors found by those checks before declaring the work complete.
7. Never stop after a code change without considering deployment/runtime impact.
8. Do not expose secrets while debugging.
9. Document meaningful production changes.
10. Keep frontend changes out of backend tasks unless the API contract requires them.
