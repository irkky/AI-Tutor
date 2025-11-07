import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.POSTGRES_URL || "postgresql://placeholder";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
