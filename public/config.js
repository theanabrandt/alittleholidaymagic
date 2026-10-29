// Public settings for the website. Safe to publish (no secret keys here).
window.ALHM_CONFIG = {
  SITE_URL: "https://alittleholidaymagic.com",

  // Supabase → Project Settings → API
  SUPABASE_URL: "https://vbswhhvehogqwemriniv.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_P0FtG0cMGokc5OhPb51qnA_d6uP3FKW",

  // Stripe Payment Links (Stripe → Payment Links → copy link)
  STRIPE_LINK_LAUNCH: "https://buy.stripe.com/aFaeVe0qR8ss8HM3DR33W2I",   // $99 sale price
  STRIPE_LINK_FULL:   "https://buy.stripe.com/00wdRa0qR6kkbTYcan33W27",  // $199 lifetime

  // When the $99 sale price ends. Use your local time with offset, e.g. "2026-10-15T09:00:00-07:00".
  // Leave "" to show only the $199 price.
  // Free coloring book shown in Santa's Workshop on every studio page. Leave "" to hide it.
  COLORING_BOOK_URL: "https://drive.google.com/file/d/1xk6ry7BWDZbRcGYOK_31n6EId3DI7bfq/view?usp=sharing",

  LAUNCH_ENDS: "2026-11-01T23:59:00-08:00"
};
