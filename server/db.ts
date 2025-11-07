import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema.js";

const pool = new pg.Pool({
  connectionString: `${process.env.POSTGRES_URL}?sslmode=require`,
  ssl: {
    require: true,
    rejectUnauthorized: false, // important
  },
});

export const db = drizzle(pool, { schema });
