create table if not exists public.smart_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null,
  title text not null,
  message text not null,
  priority text not null default 'normal',
  entity_type text,
  entity_id uuid,
  scheduled_for timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, kind, scheduled_for)
);

create index if not exists smart_notifications_user_created_idx
  on public.smart_notifications (user_id, created_at desc);

create index if not exists smart_notifications_user_read_idx
  on public.smart_notifications (user_id, read_at);

alter table public.smart_notifications enable row level security;
