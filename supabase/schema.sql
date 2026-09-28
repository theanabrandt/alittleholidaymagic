-- A Little Holiday Magic — Supabase schema
-- Run this once in a NEW Supabase project (SQL Editor → New query → Run).
-- Includes explicit grants (required for new tables from Oct 30, 2026) plus RLS policies.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Studios: one row per photographer who bought. Matched to logins by email,
-- so an existing account never causes a "user already exists" problem.
-- ---------------------------------------------------------------------------
create table if not exists public.studios (
  id            uuid primary key default gen_random_uuid(),
  owner_email   text not null unique,
  slug          text unique check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$'),
  name          text,
  tagline       text default 'A holiday gift for our families',
  color         text default '#c61f2e',
  town          text default 'New York',
  toy_on        boolean default false,
  charity       text default 'our local children''s toy drive',
  bonus         text default 'Get one bonus digital image added to your package.',
  gift_pick     text,
  days          jsonb not null default '[]'::jsonb,   -- [{date, time, link}]
  notes         jsonb not null default '{}'::jsonb,   -- {"3": "custom note with {name}"}
  photos        jsonb not null default '{}'::jsonb,   -- {wave, read, write, gift} public URLs
  notify_email  text,
  status        text not null default 'active' check (status in ('active','paused')),
  plan          text default 'lifetime',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists studios_owner_email_lower on public.studios (lower(owner_email));

grant select, update on public.studios to authenticated;
grant select, insert, update, delete on public.studios to service_role;

alter table public.studios enable row level security;

drop policy if exists "owner reads own studio" on public.studios;
create policy "owner reads own studio" on public.studios
  for select to authenticated
  using (lower(owner_email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "owner updates own studio" on public.studios;
create policy "owner updates own studio" on public.studios
  for update to authenticated
  using (lower(owner_email) = lower(auth.jwt() ->> 'email'))
  with check (lower(owner_email) = lower(auth.jwt() ->> 'email'));

-- Owners may not change who owns the studio or its status/plan.
create or replace function public.studios_guard() returns trigger
language plpgsql as $$
begin
  if auth.role() = 'authenticated' then
    new.owner_email := old.owner_email;
    new.status      := old.status;
    new.plan        := old.plan;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists studios_guard on public.studios;
create trigger studios_guard before update on public.studios
  for each row execute function public.studios_guard();

-- ---------------------------------------------------------------------------
-- Submissions: what a PARENT sends from the grown-ups area (never automatic).
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id                uuid primary key default gen_random_uuid(),
  studio_id         uuid not null references public.studios(id) on delete cascade,
  created_at        timestamptz not null default now(),
  parent_email      text not null,
  child_name        text not null,
  answers           jsonb not null default '{}'::jsonb,
  visit_day         text,
  wants_letter      boolean not null default true,
  wants_daily       boolean not null default false,
  share_with_studio boolean not null default false,
  unsub_token       uuid not null default gen_random_uuid(),
  unsubscribed      boolean not null default false,
  last_note_day     int not null default 0,
  last_note_year    int not null default 0
);
create index if not exists submissions_studio on public.submissions (studio_id, created_at desc);
create index if not exists submissions_daily on public.submissions (wants_daily, unsubscribed);

grant select on public.submissions to authenticated;
grant select, insert, update, delete on public.submissions to service_role;

alter table public.submissions enable row level security;

drop policy if exists "owner reads own families" on public.submissions;
create policy "owner reads own families" on public.submissions
  for select to authenticated
  using (studio_id in (
    select id from public.studios where lower(owner_email) = lower(auth.jwt() ->> 'email')
  ));

-- ---------------------------------------------------------------------------
-- Purchases: written only by the Stripe webhook.
-- ---------------------------------------------------------------------------
create table if not exists public.purchases (
  id             uuid primary key default gen_random_uuid(),
  stripe_session text not null unique,
  email          text not null,
  amount_cents   int,
  currency       text,
  created_at     timestamptz not null default now()
);
grant select, insert, update, delete on public.purchases to service_role;
alter table public.purchases enable row level security;

-- ---------------------------------------------------------------------------
-- Santa photos: public bucket, owners upload into a folder named by studio id.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('santa-photos', 'santa-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "owners upload santa photos" on storage.objects;
create policy "owners upload santa photos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'santa-photos'
    and (storage.foldername(name))[1] in (
      select id::text from public.studios where lower(owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

drop policy if exists "owners replace santa photos" on storage.objects;
create policy "owners replace santa photos" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'santa-photos'
    and (storage.foldername(name))[1] in (
      select id::text from public.studios where lower(owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

drop policy if exists "owners delete santa photos" on storage.objects;
create policy "owners delete santa photos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'santa-photos'
    and (storage.foldername(name))[1] in (
      select id::text from public.studios where lower(owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Upload needs select on its own objects for upsert.
drop policy if exists "owners read own santa photos" on storage.objects;
create policy "owners read own santa photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'santa-photos');

-- ---------------------------------------------------------------------------
-- Your own studio (Ana) — edit the email, then run to give yourself access
-- without buying:
-- insert into public.studios (owner_email, slug, name, town, toy_on)
-- values ('ana@anabrandt.com', 'anabrandt', 'Ana Brandt Photography', 'Orange County, CA', true)
-- on conflict (owner_email) do nothing;
