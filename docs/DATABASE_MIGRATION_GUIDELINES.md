# Database Migration Safety Guidelines

## Why this exists

MedAxis has an existing PostgreSQL database that may already contain schema objects created by previous deployments, manual changes, or migrations whose history was not recorded by Prisma.

A migration must therefore be written and reviewed against the **actual database state**, not only against `schema.prisma`.

## Rules for future changes

### 1. Never assume the database is empty

Do not use destructive commands such as:

```bash
npx prisma migrate reset
npx prisma db push
```

against the shared/development/production database unless the impact has been explicitly reviewed and approved.

For an existing database, prefer the migration history and `prisma migrate deploy`.

### 2. Baseline existing databases carefully

If `prisma migrate deploy` returns `P3005` (`The database schema is not empty`), do not reset the database.

MedAxis uses a baseline migration for an already-existing schema. Mark the baseline as applied **only after confirming that the baseline represents the existing database**:

```bash
npx prisma migrate resolve --applied 20260817_baseline
```

Then run:

```bash
npx prisma migrate deploy
```

### 3. A failed migration must be investigated before resolving it

If Prisma returns `P3018`, do not blindly run `--applied`.

First determine whether the failed migration is:

- fully present in the database already;
- partially present;
- or completely missing.

Only mark a migration as applied when **all of its schema changes already exist and match the migration**.

If the migration partially ran, repair the missing pieces or roll it back safely before continuing.

### 4. Migrations must be idempotent when the existing schema can already contain the objects

For migrations that reconcile an existing schema, prefer guarded operations where PostgreSQL supports them:

```sql
DROP CONSTRAINT IF EXISTS "constraint_name";
```

For adding constraints, indexes, or other objects where PostgreSQL does not provide a direct `IF NOT EXISTS` form, use a safe catalog check or a guarded `DO $$ ... $$` block.

Example:

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'example_fkey'
  ) THEN
    ALTER TABLE "example"
      ADD CONSTRAINT "example_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id");
  END IF;
END $$;
```

### 5. Check the complete migration, not just the first error

A migration that fails with:

```text
relation already exists
```

does **not** automatically mean the whole migration has already been applied.

Likewise:

```text
constraint does not exist
```

does not automatically mean the migration should be marked as applied.

Inspect every operation in the migration: tables, columns, indexes, constraints, foreign keys, enums, and data changes.

### 6. Verify the actual database state

For an existing object, inspect PostgreSQL before deciding how to recover a migration.

Useful checks:

```sql
-- Columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'your_table'
ORDER BY ordinal_position;

-- Indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'your_table';

-- Constraints / foreign keys
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
 AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
 AND tc.table_schema = ccu.table_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'your_table';
```

### 7. Prisma Client and database schema are separate concerns

A Prisma error such as:

```text
Unknown field `avatarUrl`
```

can mean the generated Prisma Client is stale.

After schema changes, generate the client:

```bash
npx prisma generate
```

MedAxis runs this automatically through the server `predev` script.

But if the next error is:

```text
The column `users.avatarUrl` does not exist in the current database.
```

then the generated client is correct and the **database migration has not been applied**. Do not solve that by changing repository code to hide the field.

### 8. Keep migration history consistent across environments

Before declaring a migration complete, verify:

```bash
npx prisma migrate status
npx prisma migrate deploy
```

The target database should have no unexpected failed or pending migrations.

For local development, the same migration chain used by `develop` should be reproducible without destructive resets.

### 9. Prisma 7 enum formatting is part of the build contract

Prisma 7 requires enum members to be declared on separate lines. Do not collapse enum definitions back into one-line declarations such as:

```prisma
enum Gender { MALE FEMALE }
```

Use:

```prisma
enum Gender {
  MALE
  FEMALE
}
```

This matters for Vercel builds as well as local builds because `prisma generate` runs during the server installation/build lifecycle. A schema that works only because an older generated client is present can fail immediately on a clean Vercel build.

Before pushing a Prisma schema change, always run:

```bash
npx prisma generate
```

and confirm the build is using the current `develop` commit rather than an older Vercel deployment.

## Incident that prompted these rules

During the August 2026 MedAxis development work, the existing database was baselined successfully, but a later migration contained assumptions about foreign-key state that did not match the actual database. The migration attempted to drop a foreign key that was already absent in the migration's expected state, while another migration-created object (`operation_follow_ups`) already existed.

This exposed two important requirements:

1. Existing database state must be inspected before resolving a migration as applied.
2. Schema-reconciliation migrations must be written defensively so they can safely handle objects that may already exist or may already be absent.

The affected migration was updated to use guarded foreign-key operations instead of assuming the constraint was always present.

## Release checklist for every schema change

Before merging:

- [ ] Read the complete migration SQL.
- [ ] Check whether the target database may already contain any affected objects.
- [ ] Avoid destructive operations unless explicitly approved.
- [ ] Make reconciliation operations idempotent where appropriate.
- [ ] Test `prisma generate`.
- [ ] Test `prisma migrate deploy` against a representative existing database.
- [ ] Check `prisma migrate status`.
- [ ] Verify the affected API flow after migration.
- [ ] Confirm no migration is left in a failed state.
- [ ] Confirm Vercel is deploying the current `develop` SHA and not an older commit.

**Golden rule:** never mark a migration as applied just because the first SQL statement appears to have already happened. Verify the entire migration first.