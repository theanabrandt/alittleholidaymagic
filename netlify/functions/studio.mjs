import { db, json, env, PUBLIC_COLS } from "../lib/shared.mjs";
import { RESERVED_SLUGS } from "../../public/js/content.js";

// Which kind of Supabase key the server has (never shows the key itself).
function keyKind() {
  const k = (env("SUPABASE_SERVICE_ROLE_KEY") || "").trim();
  if (!k) return "missing";
  if (k.startsWith("sb_secret_")) return "secret (correct)";
  if (k.startsWith("sb_publishable_")) return "publishable (WRONG: use the secret or service_role key)";
  if (k.startsWith("eyJ")) {
    try { const p = JSON.parse(Buffer.from(k.split(".")[1], "base64url").toString()); return p.role === "service_role" ? "service_role (correct)" : `${p.role} (WRONG: use service_role)`; }
    catch { return "unreadable JWT"; }
  }
  return "unknown format";
}

// GET /api/studio?slug=anabrandt → the studio's public page settings
// GET /api/studio?diag=1 → setup check
export default async (req) => {
  const params = new URL(req.url).searchParams;
  if (params.get("diag") === "1") {
    let host = ""; try { host = new URL(env("SUPABASE_URL")).host; } catch { host = "invalid SUPABASE_URL"; }
    const { count, error } = await db().from("studios").select("id", { count: "exact", head: true });
    return json({ supabase: host, key: keyKind(), studios_visible: error ? `error: ${error.message}` : count });
  }
  const slug = (params.get("slug") || "").toLowerCase().trim();
  if (!/^[a-z0-9-]{3,40}$/.test(slug) || RESERVED_SLUGS.includes(slug)) return json({ error: "Not found" }, 404);
  const { data, error } = await db().from("studios").select(PUBLIC_COLS).eq("slug", slug).eq("status", "active").maybeSingle();
  if (error) { console.error("studio lookup", error); return json({ error: "Server error" }, 500); }
  if (!data || !data.name) return json({ error: "Not found" }, 404);
  delete data.id;
  return json(data, 200, { "cache-control": "public, max-age=60" });
};
export const config = { path: "/api/studio" };
