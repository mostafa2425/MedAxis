create table if not exists public.push_vapid_config (
  id boolean primary key default true check (id = true),
  subject text not null,
  public_key text not null,
  private_key text not null,
  updated_at timestamptz not null default now()
);

alter table public.push_vapid_config enable row level security;

-- The private key is provisioned out-of-band in the development database and must never be exposed to the client.
