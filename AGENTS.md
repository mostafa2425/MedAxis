# MedAxis — Agent / Engineering Context

## Project
MedAxis is a medical operation logbook platform for doctors. The repository contains a React/Vite frontend and an Express/TypeScript backend using Prisma and PostgreSQL.

## Current Production Architecture

- Frontend: React + TypeScript + Vite.
- Backend: Node.js + Express + TypeScript.
- ORM: Prisma.
- Database: Supabase PostgreSQL.
- Production backend hosting: Vercel.
- File storage: Supabase Storage.
- Authentication: JWT.
- Validation: Zod.
- Upload handling: Multer on the backend, with persistent files stored in Supabase Storage.

## Production Status

The backend has been deployed to Vercel and the production health endpoint has been verified successfully:

`GET /health` → HTTP 200

Expected response shape:

```json
{
  "success": true,
  "message": "API is healthy"
}
```

The production specialties endpoint is reachable and returns the existing pagination contract. The current production database may still need seeded specialty/doctor data before authenticated specialty behavior can be fully verified.

Protected operation endpoints correctly reject missing/invalid JWTs with HTTP 401.

## Current Workstream

The current workstream is **backend production hardening and verification**. Priorities are:

1. Verify production database connectivity and seed/reference data.
2. Verify real doctor login and JWT authentication in production.
3. Verify `/api/specialties` only returns specialties/areas of expertise belonging to the authenticated doctor's own specialty.
4. Verify operations are scoped to the authenticated doctor.
5. Verify operation date/time is consistently returned wherever operations are exposed.
6. Verify hospital, patient, doctor, location, and operation relationships.
7. Verify persistent file uploads using Supabase Storage.
8. Verify file authorization, type/size validation, metadata persistence, and deletion.
9. Run production API smoke tests after every backend deployment.
10. Keep the frontend contract stable unless a backend change genuinely requires an update.

## Required Environment Variables

Never commit values. Never request or expose secret values in source control, chat, logs, or documentation.

Required production variable names:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV`
- `CORS_ORIGIN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to the browser/frontend.

## Database Rules

- Reuse the existing Prisma schema and models.
- Do not duplicate existing entities or relationships.
- Do not recreate the database schema unnecessarily.
- Prefer Prisma migrations for controlled production schema changes.
- Run Prisma Client generation as part of deployment/build.
- Never hardcode credentials.
- Do not commit `.env` or production secrets.

## Storage Rules

- Never rely on the Vercel local filesystem for persistent uploads.
- Actual uploaded files belong in Supabase Storage.
- File metadata belongs in PostgreSQL when the existing data model supports it or when minimal metadata is required.
- Keep storage paths organized by resource, for example:
  - `patients/{patientId}/...`
  - `doctors/{doctorId}/...`
  - `operations/{operationId}/...`
- Private storage access must be controlled by the backend.
- Do not expose the Supabase service-role key to the frontend.

## Authentication Rules

- Preserve the existing JWT behavior unless a security/production issue requires a change.
- Protected endpoints must identify the authenticated doctor/user from the verified token.
- Do not trust doctor/user IDs supplied by the client when the identity can be derived from the JWT.
- Invalid or expired tokens must return a safe 401 response.

## API / Authorization Rules

### Specialties
`GET /api/specialties` must not behave as a global catalog for every authenticated doctor when the endpoint is intended to serve the doctor's own specialty context.

The backend must:

1. Verify the authenticated user.
2. Determine the doctor's specialty from server-side data.
3. Return only the relevant specialty/areas-of-expertise data.
4. Preserve pagination if already part of the contract.
5. Handle missing specialty data with a clear, safe API response.

### Operations
Operation data must be scoped to the authenticated doctor where the product requires doctor ownership.

Operation responses should preserve:

- operation date
- operation time
- location
- hospital
- patient
- doctor
- status
- cost/payment data where applicable
- attached files where applicable

Operation time must not be dropped from API responses merely because a UI currently does not display it.

## Error Handling

- Use consistent API error shapes.
- Validation errors should identify the field and actionable reason.
- Never return stack traces, secrets, database credentials, or internal implementation details in production responses.
- Keep errors useful enough for the frontend to show the user what needs fixing.

## Vercel Rules

- The backend must remain compatible with Vercel's serverless runtime/deployment model.
- Do not assume a long-running local server process or persistent local disk.
- Keep deployment/build scripts deterministic.
- Ensure Prisma Client is generated during install/build.
- Verify environment variables are read only at runtime/server side.

## Verification Checklist

After backend changes:

- `npm run typecheck`
- `npm run build`
- `npx prisma generate`
- run available tests
- inspect changed files for unused imports and TypeScript errors
- deploy to Vercel
- test `GET /health`
- test login with a real test account
- test authenticated `/api/specialties`
- test authenticated operations list/detail/create/update flows
- test upload/download/delete behavior through Supabase Storage

## Do Not Do

- Do not ask the project owner for production secrets.
- Do not print or echo secrets in logs.
- Do not hardcode secrets.
- Do not commit `.env` files.
- Do not store production uploads on Vercel's filesystem.
- Do not expose service-role credentials to the frontend.
- Do not make unrelated frontend changes during backend production hardening.
- Do not silently change existing API contracts.
