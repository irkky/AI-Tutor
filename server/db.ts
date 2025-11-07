import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema.js";

const sql = neon(process.env.POSTGRES_URL!);

export const db = drizzle(sql, { 
  schema: {
    ...schema,
  }
});