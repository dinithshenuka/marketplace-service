import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  // biome-ignore lint/style/noNonNullAssertion: database URL must be provided
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle({ client: pool });
