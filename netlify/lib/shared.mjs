import { createClient } from "@supabase/supabase-js";
import { RECIPES, COOKIE_KEY, santaLines } from "../../public/js/content.js";

export const env = k => (typeof Netlify !== "undefined" && Netlify.env ? Netlify.env.get(k) : process.env[k]) || process.env[k];

export function db() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
}

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const siteUrl = () => (env("SITE_URL") || "https://alittleholidaymagic.com").replace(/\/+$/, "");
export const PUBLIC_COLS = "id, slug, name, tagline, color, town, toy_on, charity, bonus, gift_pick, days, notes, photos";

// ---------- Email (Resend) ----------
export async function sendEmail(msg) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env("RESEND_API_KEY")}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env("MAIL_FROM") || "Santa's Helpers <santa@mail.alittleholidaymagic.com>", ...msg })
  });
  if (!r.ok) throw new Error(`Email failed: ${r.status} ${await r.text()}`);
  return r.json();
}
export async function sendBatch(msgs) {
  if (!msgs.length) return;
  const from = env("MAIL_FROM") || "Santa's Helpers <santa@mail.alittleholidaymagic.com>";
  for (let i = 0; i < msgs.length; i += 100) {
    const r = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${env("RESEND_API_KEY")}`, "content-type": "application/json" },
      body: JSON.stringify(msgs.slice(i, i + 100).map(m => ({ from, ...m })))
    });
    if (!r.ok) throw new Error(`Batch email failed: ${r.status} ${await r.text()}`);
  }
}

// ---------- Email templates ----------
const wrap = (studio, inner, footer = "") => `<!doctype html><html><body style="margin:0;background:#f6faf7;font-family:Arial,Helvetica,sans-serif;color:#1c2a21">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6faf7"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="height:8px;background:repeating-linear-gradient(135deg,#c61f2e 0 12px,#ffffff 12px 24px,#1d6a44 24px 36px,#ffffff 36px 48px);background-color:#c61f2e"></td></tr>
<tr><td style="padding:28px 28px 8px">${inner}</td></tr>
<tr><td style="padding:16px 28px 28px;font-size:12px;color:#5b6d61;border-top:1px solid #dce7df">Delivered by Santa's helpers at ${esc(studio.name || "your photographer")}.${footer}</td></tr>
</table></td></tr></table></body></html>`;

export function familyEmail(studio, sub) {
  const a = sub.answers || {}; const n = esc(sub.child_name);
  const recipe = RECIPES[COOKIE_KEY[a.cookie] || "sugar"];
  const wishes = [a.wish, ...(a.more || [])].filter(Boolean);
  const year = new Date().getMonth() === 11 && new Date().getDate() > 25 ? new Date().getFullYear() + 1 : new Date().getFullYear();
  const inner = `
<p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#c61f2e;font-weight:bold;margin:0 0 8px">From the desk of Santa Claus · North Pole</p>
<div style="font-family:Georgia,serif;font-size:18px;line-height:1.6">
<p>Dear ${n},</p>
<p>Thank you for chatting with me! The elves gave you a gold star for ${esc(a.deed || "being kind")} this year, and that made the whole North Pole smile.</p>
${a.wish ? `<p>I've written your wish for ${esc(a.wish)} in my big book. My workshop is very busy, but the elves will do their very best.</p>` : ""}
${a.cookie ? `<p>I'll be looking for ${esc(a.cookie)} on Christmas Eve.${a.reindeer ? ` ${esc(a.reindeer)} sends a big snowy hello.` : ""}</p>` : ""}
<p>Keep being kind,<br><span style="font-size:28px;color:#c61f2e">Santa</span></p></div>
<table role="presentation" width="100%" style="margin:24px 0;border:4px double #1d6a44;border-radius:6px;background:#fffdf9"><tr><td align="center" style="padding:24px">
<div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#1d6a44;font-weight:bold">Official · North Pole Records</div>
<div style="font-size:30px;font-weight:bold;color:#c61f2e;margin:6px 0">Nice List</div>
<div style="font-family:Georgia,serif;font-size:36px;margin:4px 0">${n}</div>
<div style="font-size:14px;color:#7b6d72">is officially on the Nice List for Christmas ${year}, with a gold star for ${esc(a.deed || "being kind")}.</div>
<div style="font-size:11px;color:#7b6d72;margin-top:10px">Presented by ${esc(studio.name || "")}</div></td></tr></table>
${wishes.length ? `<h3 style="margin:0 0 6px">For grown-ups: ${n}'s wish list</h3><ul style="margin:0 0 20px;padding-left:20px">${wishes.map((w, i) => `<li>${esc(w)}${i === 0 ? " <b style=\"color:#c61f2e\">(top wish)</b>" : ""}</li>`).join("")}</ul>` : ""}
<h3 style="margin:0 0 6px;color:#c61f2e">${esc(recipe.title)} for Santa</h3>
<p style="margin:0 0 8px;color:#5b6d61;font-size:13px">${recipe.meta.map(esc).join(" · ")}</p>
<p style="margin:0 0 4px;font-weight:bold">You'll need</p><ul style="margin:0 0 10px;padding-left:20px">${recipe.ing.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
<p style="margin:0 0 4px;font-weight:bold">Let's bake</p><ol style="margin:0 0 10px;padding-left:20px">${recipe.steps.map(i => `<li>${esc(i)}</li>`).join("")}</ol>
<p style="font-size:13px;color:#7b6d72"><i>Elf tip: bake with a grown-up. Save the best-looking one for Santa's plate!</i></p>`;
  const unsub = `${siteUrl()}/api/unsubscribe?t=${sub.unsub_token}`;
  return { subject: "A letter from the North Pole", html: wrap(studio, inner, sub.wants_daily ? ` <a href="${unsub}" style="color:#5b6d61">Stop Santa's daily notes</a>.` : ""), headers: sub.wants_daily ? { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : undefined };
}

export function cheatSheetEmail(studio, sub) {
  const a = sub.answers || {}; const k = { name: sub.child_name, ...a };
  const rows = [["Age", a.age], ["Been good?", a.good], ["Good deed", a.deed], ["Siblings", a.sibling], ["Cookie", a.cookie], ["Reindeer", a.reindeer], ["Pet", a.pet], ["Top wish", a.wish], ["Also wants", (a.more || []).join(", ")], ["Toy helper", a.helper === "Yes" ? "Yes, bringing a toy" : a.helper === "Asking" ? "Asking grown-ups" : ""]].filter(r => r[1]);
  const inner = `<p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#1d6a44;font-weight:bold;margin:0 0 6px">Santa's cheat sheet</p>
<h1 style="margin:0 0 4px;font-size:30px">${esc(sub.child_name)}</h1>
<p style="margin:0 0 16px;color:#5b6d61">${sub.visit_day ? `Santa session · ${esc(sub.visit_day)}` : "Not booked yet"} · Parent: ${esc(sub.parent_email)}</p>
<table role="presentation" cellpadding="6" style="font-size:15px;border-collapse:collapse">${rows.map(([l, v]) => `<tr><td style="color:#7b6d72;font-size:12px;text-transform:uppercase;letter-spacing:.06em;font-weight:bold">${esc(l)}</td><td style="font-weight:bold">${esc(v)}</td></tr>`).join("")}</table>
<h3 style="color:#c61f2e;margin:20px 0 6px">Lines for Santa to say</h3><ol style="padding-left:20px;margin:0">${santaLines(k, studio.toy_on).map(l => `<li style="margin-bottom:6px">${esc(l)}</li>`).join("")}</ol>
<p style="margin-top:20px"><a href="${siteUrl()}/dashboard" style="color:#1d6a44;font-weight:bold">See all your families in your dashboard</a></p>`;
  return { subject: `Santa's cheat sheet: ${sub.child_name}`, html: wrap(studio, inner) };
}

export function dailyNoteEmail(studio, sub, noteText, day) {
  const unsub = `${siteUrl()}/api/unsubscribe?t=${sub.unsub_token}`;
  const link = studio.slug ? `${siteUrl()}/${studio.slug}` : siteUrl();
  const inner = `<p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#1d6a44;font-weight:bold;margin:0 0 8px">December ${day} · Read this one aloud</p>
<div style="font-family:Georgia,serif;font-size:22px;line-height:1.5;background:#fffdf9;border:1px solid #eadfd2;border-radius:10px;padding:18px 20px">${esc(noteText)}</div>
<p style="margin:18px 0 0;font-size:14px"><a href="${link}" style="color:#c61f2e;font-weight:bold">Visit Santa's workshop</a></p>`;
  return { to: sub.parent_email, subject: `A note from the North Pole · December ${day}`, html: wrap(studio, inner, ` <a href="${unsub}" style="color:#5b6d61">Stop these notes</a>.`), headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } };
}

export function welcomeEmail(email) {
  const inner = `<h1 style="margin:0 0 10px;font-size:28px">Welcome to A Little Holiday Magic</h1>
<p style="font-size:16px;line-height:1.6">Thank you! Your lifetime access is ready. Here's how to set up your studio's Santa page:</p>
<ol style="font-size:16px;line-height:1.7;padding-left:20px">
<li>Go to <a href="${siteUrl()}/dashboard" style="color:#c61f2e;font-weight:bold">${siteUrl().replace(/^https?:\/\//, "")}/dashboard</a></li>
<li>Enter <b>${esc(email)}</b>. We'll email you a sign-in link. No password needed.</li>
<li>Pick your page link, add your studio name, colors, Santa photos, and session days.</li>
<li>Share your link with your families.</li></ol>
<p style="font-size:14px;color:#5b6d61">Questions? Just reply to this email.</p>`;
  return { to: email, subject: "Your Santa page is ready to set up", html: wrap({ name: "A Little Holiday Magic" }, inner) };
}
