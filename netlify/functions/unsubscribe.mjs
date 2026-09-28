import { db } from "../lib/shared.mjs";

// GET or POST /api/unsubscribe?t=<token> — stops Santa's daily notes for that sign-up.
const page = (msg) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed</title>
<body style="font-family:Arial,sans-serif;background:#f6faf7;color:#1c2a21;display:grid;place-items:center;min-height:90vh;margin:0;padding:16px">
<div style="max-width:420px;text-align:center"><h1 style="color:#c61f2e">${msg}</h1><p>You can close this page.</p></div></body>`, { headers: { "content-type": "text/html; charset=utf-8" } });

export default async (req) => {
  const t = new URL(req.url).searchParams.get("t") || "";
  if (!/^[0-9a-f-]{36}$/i.test(t)) return page("That link doesn't look right.");
  const { error } = await db().from("submissions").update({ unsubscribed: true }).eq("unsub_token", t);
  return page(error ? "Something went wrong. Please try again." : "Santa's daily notes are turned off.");
};
export const config = { path: "/api/unsubscribe" };
