import "dotenv/config";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	console.error("DATABASE_URL environment variable is not set");
	process.exit(1);
}

const pool = new Pool({
	connectionString: databaseUrl,
});
const db = drizzleNode({ client: pool });

export { db };
