-- Andy Lenárt website: tables and file storage in Supabase.
--
-- Run once: Supabase → SQL Editor → New query → paste this file → Run.
-- Safe to run again (it only adds what is missing).
--
-- Only the website's server reads and writes these, with the secret key.
-- Row level security is on with no policies, so the public (anon /
-- publishable) key cannot read or change anything.

-- Everything edited in the admin panel (settings, home page, privacy policy,
-- garments and Listening Rooms) is one JSON document under the key "content".
create table if not exists public.content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- "Request this piece" form.
create table if not exists public.piece_requests (
  id text primary key,
  created_at timestamptz generated always as (to_timestamp((data->>'createdAt')::double precision / 1000)) stored,
  garment text generated always as (data->>'garment') stored,
  name text generated always as (data->>'name') stored,
  city text generated always as (data->>'city') stored,
  email text generated always as (data->>'email') stored,
  message text generated always as (data->>'message') stored,
  done boolean generated always as (coalesce((data->>'done')::boolean, false)) stored,
  data jsonb not null
);

-- "Stay connected" sign-ups.
create table if not exists public.subscribers (
  id text primary key,
  created_at timestamptz generated always as (to_timestamp((data->>'createdAt')::double precision / 1000)) stored,
  name text generated always as (data->>'name') stored,
  email text generated always as (data->>'email') stored,
  message text generated always as (data->>'message') stored,
  data jsonb not null
);

-- Marks left on The Staircase.
create table if not exists public.staircase_marks (
  id text primary key,
  created_at timestamptz generated always as (to_timestamp((data->>'createdAt')::double precision / 1000)) stored,
  text text generated always as (data->>'text') stored,
  name text generated always as (data->>'name') stored,
  city text generated always as (data->>'city') stored,
  garment_no text generated always as (data->>'no') stored,
  room text generated always as (data->>'room') stored,
  hidden boolean generated always as (coalesce((data->>'hidden')::boolean, false)) stored,
  data jsonb not null
);

-- Submissions per visitor per hour, so the public forms cannot be flooded.
create table if not exists public.rate_limits (
  key text primary key,
  count integer not null,
  expires_at timestamptz not null
);

create or replace function public.hit_rate_limit(p_key text, p_ttl integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  result integer;
begin
  insert into rate_limits as r (key, count, expires_at)
  values (p_key, 1, now() + make_interval(secs => p_ttl))
  on conflict (key) do update
    set count = case when r.expires_at < now() then 1 else r.count + 1 end,
        expires_at = case when r.expires_at < now() then now() + make_interval(secs => p_ttl) else r.expires_at end
  returning count into result;
  delete from rate_limits where expires_at < now() - interval '1 day';
  return result;
end;
$$;

revoke execute on function public.hit_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer) to service_role;

alter table public.content enable row level security;
alter table public.piece_requests enable row level security;
alter table public.subscribers enable row level security;
alter table public.staircase_marks enable row level security;
alter table public.rate_limits enable row level security;

-- Photos and audio uploaded in the admin panel. Public, so the website can
-- show them; only the website's server can add or delete files.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
