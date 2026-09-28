import Stripe from "stripe";
import { db, json, env, sendEmail, welcomeEmail } from "../lib/shared.mjs";

// Stripe → checkout.session.completed. Access is tied to the buyer's email,
// so buyers who already have an account (or buy twice) never hit an error.
export default async (req) => {
  const stripe = new Stripe(env("STRIPE_SECRET_KEY"));
  const raw = await req.text();
  let event;
  try { event = await stripe.webhooks.constructEventAsync(raw, req.headers.get("stripe-signature"), env("STRIPE_WEBHOOK_SECRET")); }
  catch (e) { return json({ error: "Bad signature" }, 400); }

  if (event.type !== "checkout.session.completed") return json({ received: true });
  const s = event.data.object;
  if (s.payment_status !== "paid") return json({ received: true });
  const email = (s.customer_details?.email || s.customer_email || "").toLowerCase().trim();
  if (!email) return json({ error: "No email on session" }, 400);

  const supa = db();
  const { error: pErr } = await supa.from("purchases").insert({ stripe_session: s.id, email, amount_cents: s.amount_total, currency: s.currency });
  const duplicate = pErr && pErr.code === "23505";
  if (pErr && !duplicate) return json({ error: "DB error" }, 500); // Stripe will retry

  const { data: existing } = await supa.from("studios").select("id, status").eq("owner_email", email).maybeSingle();
  if (!existing) {
    const { error } = await supa.from("studios").insert({ owner_email: email, notify_email: email });
    if (error && error.code !== "23505") return json({ error: "DB error" }, 500);
  } else if (existing.status !== "active") {
    await supa.from("studios").update({ status: "active" }).eq("id", existing.id);
  }
  if (!duplicate) {
    try { await sendEmail({ reply_to: env("SUPPORT_EMAIL") || undefined, ...welcomeEmail(email) }); }
    catch (e) { console.error("welcome email", String(e)); }
  }
  return json({ received: true });
};
export const config = { path: "/api/stripe-webhook" };
