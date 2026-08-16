import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 loads this config during npm install/postinstall for `prisma generate`.
// Generation does not need a live database connection, so do not make local or
// CI installs fail just because DATABASE_URL is not present yet. Runtime database
// access is still guarded by src/utils/prisma.ts.
const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medaxis';

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
