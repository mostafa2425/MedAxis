# Production Readiness Checks

Before declaring the backend production-ready:

- `npm run db:generate`
- `npm run typecheck`
- `npm run build`
- `npm run db:migrate:deploy` for reviewed pending migrations
- Run available tests with `npm test`
- Verify `GET /health`
- Verify authentication and authorization flows
- Verify Specialty -> Area of Expertise filtering
- Verify Operation Catalog filtering
- Verify persistent uploads use Supabase Storage
- Verify production responses do not expose stack traces or secrets

Never run `prisma migrate reset`, destructive database commands, or production `prisma db push` as a deployment shortcut.


## Business-flow E2E coverage

Production readiness must test complete business flows, not only isolated endpoints.

### Operations P0 scenario

The automated E2E suite in `e2e/operations.spec.ts` must cover:

1. Authenticate with a verified doctor account.
2. Resolve an accessible patient, hospital, operation-catalog item, and doctor.
3. Create a scheduled operation.
4. Persist the selected procedure/catalog item.
5. Persist the medical team.
6. Persist operation cost/payment data.
7. Verify the created operation can be fetched with its relations.
8. Verify an `OPERATION_CREATED` timeline entry exists.
9. Change the operation status and verify the update.
10. Delete the E2E operation and verify cleanup.
11. Reject malformed operation input with a 4xx response.

Required E2E variables:

- `E2E_API_BASE_URL`
- `E2E_EMAIL`
- `E2E_PASSWORD`
- `E2E_PATIENT_ID`
- `E2E_HOSPITAL_ID`
- `E2E_OPERATION_CATALOG_ID`
- `E2E_DOCTOR_ID`

### Operation transaction rule

Creating an operation and its initial timeline entry is one atomic database operation. The service must use the repository's atomic create flow so that a failure in a nested write or the initial timeline write rolls back the entire operation. Never return a 500 after the operation has already been committed.

### Minimum business-flow matrix

Before production, add/execute E2E coverage for:

- Authentication: register, email verification, resend verification, verified login, unverified-login rejection.
- Patient: create, read, update, delete, and operation relationship.
- Hospital: create, read, update, delete, governorate UUID validation, and doctor isolation.
- Operation Catalog: create/read/update/delete and doctor isolation.
- Operations: create, procedures, medical team, cost/payment, timeline, status update, follow-up, files, authorization, and delete.
- Follow-ups: create, update, complete, list, and reminder scheduling.
- Uploads: avatar and operation files persist in Supabase Storage and survive refresh.
- Authorization: one doctor's records are not readable or mutable by another doctor.

A green endpoint smoke test alone is not sufficient to declare production readiness.
