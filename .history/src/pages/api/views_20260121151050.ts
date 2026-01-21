// src/pages/api/views.ts
import type { APIRoute } from "astro";
import { getAndIncrementViews } from "../../../db/db.ts";

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  try {
    const views = await getAndIncrementViews(slug);

    return new Response(JSON.stringify({ views }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
