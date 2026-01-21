// src/pages/api/views.ts
import type { APIRoute } from "astro";
import { createClient } from "@libsql/client";

// 从环境变量中获取配置
const TURSO_URL = import.meta.env.TURSO_URL;
const TURSO_AUTH_TOKEN = import.meta.env.TURSO_AUTH_TOKEN;

// 创建 Turso 客户端实例
const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});



export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get("slug");

  console.log("API called with slug:", slug); // 添加日志

  if (!slug) {
    console.log("Missing slug in request"); // 添加日志

    return new Response("Missing slug", { status: 400 });
  }

  try {
    console.log("Database URL:", TURSO_URL); // 添加日志

    // 1. 尝试获取当前阅读数
    const result = await client.execute({
      sql: "SELECT count FROM views WHERE slug = ?",
      args: [slug],
    });

    console.log("Database query result:", result); // 添加日志

    let count = 0;
    if (result.rows.length > 0) {
      // 如果记录存在，获取当前计数
      count = result.rows[0].count as number;
    } else {
      // 如果记录不存在，插入新记录，计数为 1
      await client.execute({
        sql: "INSERT INTO views (slug, count) VALUES (?, 1)",
        args: [slug],
      });
      count = 1;
    }

    // 2. 增加阅读数
    await client.execute({
      sql: "UPDATE views SET count = count + 1 WHERE slug = ?",
      args: [slug],
    });

    // 3. 返回更新后的阅读数
    const newCount = count + 1;
    console.log("Returning view count:", newCount); // 添加日志

    return new Response(JSON.stringify({ views: newCount }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database error:", error); // 添加日志
    return new Response("Internal Server Error", { status: 500 });
  }
};
