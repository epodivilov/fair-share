import { Hono } from "hono";
import { serve } from "@hono/node-server";

import { databaseManager } from "./infrastructure/database";

const PORT = parseInt(process.env.PORT ?? "3000", 10);

const app = new Hono();

app.get("/health", async (c) => {
  try {
    await databaseManager.checkConnection();

    return c.json({ status: "ok" });
  } catch (error) {
    return new Response("Service Unavailable", { status: 503 });
  }
});

async function startServer() {
  try {
    await databaseManager.connect();

    const server = serve(
      {
        fetch: app.fetch,
        port: PORT,
      },
      (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
      }
    );

    const shutdown = async () => {
      console.log("Gracefully shutting down...");
      server.close();
      await databaseManager.disconnect();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
