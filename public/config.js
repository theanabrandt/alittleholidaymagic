// Public settings for the website. Safe to publish (no secret keys here).
window.ALHM_CONFIG = {
  SITE_URL: "https://alittleholidaymagic.com",

  // Supabase → Project Settings → API
  SUPABASE_URL: "https://vbswhhvehogqwemriniv.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_P0FtG0cMGokc5OhPb51qnA_d6uP3FKW",

  // Stripe Payment Links (Stripe → Payment Links → copy link)
   STRIPE_LINK_LAUNCH: "https://buy.stripe.com/aFacN67TjeQQ7DIeiv33W26",   // $74 lifetime, first 24 hours
  STRIPE_LINK_FULL:   "https://buy.stripe.com/00wdRa0qR6kkbTYcan33W27",  // $199 lifetime

  // When the $74 launch price ends. Use your local time with offset, e.g. "2026-10-15T09:00:00-07:00".
  // Leave "" to show only the $199 price.
      LAUNCH_ENDS: "2026-10-01T08:00:00-07:00"
};
