// src/pages/api/test-db.ts
import type { APIRoute } from "astro";
import { createClient } from "@libsql/client";

const TURSO_URL = import.meta.env.TURSO_URL;
const TURSO_AUTH_TOKEN = import.meta.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const GET: APIRoute = async () => {
  try {
    // 测试查询
    const result = await client.execute("SELECT 1 as test");
    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};
