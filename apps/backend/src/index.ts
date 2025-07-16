import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { checkConnection } from "./infrastructure/database";

const PORT = parseInt(process.env.PORT ?? "3000");

const app = new Hono();

app.get("/health", async (c) => {
  try {
    await checkConnection();

    return c.json({ status: "ok" });
  } catch (error) {
    return new Response("Service Unavailable", {
      status: 503,
    });
  }
});

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  async (info) => {
    await checkConnection();
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
