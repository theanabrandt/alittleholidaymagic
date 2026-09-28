import { db, json, PUBLIC_COLS } from "../lib/shared.mjs";
import { RESERVED_SLUGS } from "../../public/js/content.js";

// GET /api/studio?slug=anabrandt → the studio's public page settings
export default async (req) => {
  const slug = (new URL(req.url).searchParams.get("slug") || "").toLowerCase().trim();
  if (!/^[a-z0-9-]{3,40}$/.test(slug) || RESERVED_SLUGS.includes(slug)) return json({ error: "Not found" }, 404);
  const { data, error } = await db().from("studios").select(PUBLIC_COLS).eq("slug", slug).eq("status", "active").maybeSingle();
  if (error) return json({ error: "Server error" }, 500);
  if (!data || !data.name) return json({ error: "Not found" }, 404);
  delete data.id;
  return json(data, 200, { "cache-control": "public, max-age=60" });
};
export const config = { path: "/api/studio" };
