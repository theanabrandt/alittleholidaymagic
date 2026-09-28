import { db, sendBatch, dailyNoteEmail } from "../lib/shared.mjs";
import { noteFor } from "../../public/js/content.js";

// Runs every hour from 14:00–20:00 UTC (6am PT / 9am ET onward), December 1–24.
// Each sign-up gets exactly one note per day; later runs pick up anything left over.
const PER_RUN = 1500;

export default async () => {
  const now = new Date();
  const day = now.getUTCDate(), month = now.getUTCMonth(), year = now.getUTCFullYear();
  if (month !== 11 || day < 1 || day > 24) return new Response("Not note season");

  const supa = db();
  const { data: subs, error } = await supa.from("submissions")
    .select("id, studio_id, parent_email, child_name, visit_day, unsub_token, last_note_day, last_note_year, studios!inner(slug, name, notes, status)")
    .eq("wants_daily", true).eq("unsubscribed", false).eq("studios.status", "active")
    .or(`last_note_year.lt.${year},last_note_day.lt.${day}`)
    .order("created_at", { ascending: true })
    .limit(PER_RUN * 3);
  if (error) { console.error(error); return new Response("DB error", { status: 500 }); }

  // One note per parent email + child per studio (a family may have submitted twice).
  const seen = new Set(); const todo = [];
  for (const s of subs) {
    const key = `${s.studio_id}|${s.parent_email}|${s.child_name.toLowerCase()}`;
    if (seen.has(key)) { todo.push({ s, skip: true }); continue; }
    seen.add(key); todo.push({ s });
    if (todo.filter(t => !t.skip).length >= PER_RUN) break;
  }
  const msgs = todo.filter(t => !t.skip).map(({ s }) => dailyNoteEmail(s.studios, s, noteFor(s.studios, day, s.child_name, s.visit_day).text, day));
  await sendBatch(msgs);

  const ids = todo.map(t => t.s.id);
  for (let i = 0; i < ids.length; i += 500) {
    await supa.from("submissions").update({ last_note_day: day, last_note_year: year }).in("id", ids.slice(i, i + 500));
  }
  return new Response(`Sent ${msgs.length} notes for December ${day}`);
};
export const config = { schedule: "0 14-20 1-24 12 *" };
