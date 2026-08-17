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
