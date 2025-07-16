import { Pool } from "pg";
import { Kysely, PostgresDialect, sql } from "kysely";

interface Database {
  // Определения таблиц будут добавлены здесь
}

class DatabaseManager {
  private static instance: DatabaseManager;

  private dbInstance: Kysely<Database> | null = null;

  private constructor(private readonly connectionString: string) {}

  public static getInstance(databaseUrl?: string): DatabaseManager {
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set.");
    }

    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(databaseUrl);
    }

    return DatabaseManager.instance;
  }

  public get db(): Kysely<Database> {
    if (!this.dbInstance) {
      throw new Error("Database connection not established. Call connect() first.");
    }

    return this.dbInstance;
  }

  public async connect(): Promise<void> {
    if (this.dbInstance) {
      console.log("Database connection already established.");
      return;
    }

    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: this.connectionString,
      }),
    });

    this.dbInstance = new Kysely<Database>({
      dialect,
    });

    await this.checkConnection();
  }

  public async disconnect(): Promise<void> {
    if (this.dbInstance) {
      await this.dbInstance.destroy();
      this.dbInstance = null;

      console.log("Database connection pool closed.");
    }
  }

  public async checkConnection(): Promise<void> {
    try {
      if (!this.dbInstance) {
        throw new Error("Database connection not established. Call connect() first.");
      }

      await sql`SELECT 1`.execute(this.dbInstance);
      console.log("Database connection successful.");
    } catch (error) {
      console.error("Database connection failed.", error);
      throw error;
    }
  }
}

export const databaseManager = DatabaseManager.getInstance(process.env.DATABASE_URL);
