import { db, json, sendEmail, familyEmail, cheatSheetEmail, env } from "../lib/shared.mjs";

// POST /api/submit — sent only when a parent fills in the grown-ups form.
const clean = (v, n = 80) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let b; try { b = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  if (b.website) return json({ ok: true }); // honeypot: bots fill this in

  const email = clean(b.parentEmail, 200).toLowerCase();
  const child = clean(b.childName, 20).split(/\s+/)[0];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  if (!child) return json({ error: "Please add your child's first name." }, 400);

  const supa = db();
  const { data: studio } = await supa.from("studios").select("id, slug, name, toy_on, notify_email, owner_email, status").eq("slug", clean(b.slug, 40).toLowerCase()).maybeSingle();
  if (!studio || studio.status !== "active") return json({ error: "This Santa page isn't active." }, 404);

  // Light rate limit: max 5 sends per parent email per studio per day.
  const since = new Date(Date.now() - 864e5).toISOString();
  const { count } = await supa.from("submissions").select("id", { count: "exact", head: true }).eq("studio_id", studio.id).eq("parent_email", email).gte("created_at", since);
  if ((count || 0) >= 5) return json({ error: "You've already sent this a few times today. Check your inbox (and spam folder)." }, 429);

  const a = b.answers || {};
  const answers = {
    age: clean(a.age, 20), good: clean(a.good, 30), deed: clean(a.deed, 60), sibling: clean(a.sibling, 30),
    cookie: clean(a.cookie, 30), reindeer: clean(a.reindeer, 20), pet: clean(a.pet, 40), wish: clean(a.wish, 60),
    more: Array.isArray(a.more) ? a.more.slice(0, 5).map(x => clean(x, 60)).filter(Boolean) : [],
    helper: a.helper === "Yes" || a.helper === "Asking" ? a.helper : null
  };
  const row = {
    studio_id: studio.id, parent_email: email, child_name: child, answers,
    visit_day: clean(b.visitDay, 60) || null,
    wants_letter: !!b.wantsLetter, wants_daily: !!b.wantsDaily, share_with_studio: !!b.shareWithStudio
  };
  const { data: sub, error } = await supa.from("submissions").insert(row).select().single();
  if (error) return json({ error: "We couldn't save that. Please try again." }, 500);

  const jobs = [];
  if (sub.wants_letter && answers.deed) jobs.push(sendEmail({ to: email, reply_to: studio.notify_email || studio.owner_email, ...familyEmail(studio, sub) }));
  if (sub.share_with_studio && answers.deed) jobs.push(sendEmail({ to: studio.notify_email || studio.owner_email, reply_to: email, ...cheatSheetEmail(studio, sub) }));
  const results = await Promise.allSettled(jobs);
  const failed = results.filter(r => r.status === "rejected");
  if (failed.length) console.error("submit email errors", failed.map(f => String(f.reason)));
  if (jobs.length && failed.length === jobs.length) return json({ error: "Saved, but the email didn't go out. Please try again in a minute." }, 502);
  return json({ ok: true });
};
export const config = { path: "/api/submit" };
