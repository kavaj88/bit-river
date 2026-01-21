// src/pages/api/views.ts
import type { APIRoute } from "astro";
import { getAndIncrementViews } from "../../../db/db.ts";

export const GET: APIRoute = async ({ url }) => {
  console.log("API /views called", url);
  const slug = url.searchParams.get("slug");

  console.log("API called with slug:", slug);

  if (!slug) {
    console.log("Missing slug in request");
    return new Response("Missing slug", { status: 400 });
  }

  try {
    const views = await getAndIncrementViews(slug);
    console.log("Returning view count:", views);

    return new Response(JSON.stringify({ views }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
