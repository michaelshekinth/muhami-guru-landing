-- Run this in Supabase Dashboard → SQL Editor
-- Or via Supabase CLI: supabase db push

create table if not exists public.lawyer_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  nationality text not null,
  experience text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists lawyer_applications_email_idx
  on public.lawyer_applications (lower(email));

create unique index if not exists lawyer_applications_phone_idx
  on public.lawyer_applications (regexp_replace(phone, '\s', '', 'g'));

alter table public.lawyer_applications enable row level security;

-- No public policies: only the service role (Express API) can read/write.
