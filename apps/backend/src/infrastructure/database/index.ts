import { Pool } from "pg";
import { Kysely, PostgresDialect, sql } from "kysely";

interface Database {
  // Тут будут определены таблицы
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: DATABASE_URL,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

export const checkConnection = async () => {
  try {
    await sql`SELECT 1`.execute(db);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};
