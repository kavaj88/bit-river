import { createClient } from "@libsql/client";

const TURSO_URL = import.meta.env.TURSO_URL;
const TURSO_AUTH_TOKEN = import.meta.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export async function getAndIncrementViews(slug: string): Promise<number> {
  if (!slug) {
    throw new Error("Missing slug");
  }

  try {
    // 1. 尝试获取当前阅读数
    const result = await client.execute({
      sql: "SELECT count FROM views WHERE slug = ?",
      args: [slug],
    });

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
    return count + 1;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}
