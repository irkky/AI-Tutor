import { defineConfig } from "drizzle-kit";

// Make DATABASE_URL optional for Vercel builds
// When deploying to Vercel without a database, this won't throw an error
const databaseUrl = process.env.DATABASE_URL || "postgresql://placeholder";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
