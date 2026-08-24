-- Keep runtime-only tables used by raw SQL services in sync with develop.
-- These tables may be managed outside Prisma models because they use snake_case
-- columns and raw SQL access.

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  expiration_time bigint,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx
  ON public.push_subscriptions(user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.push_vapid_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  subject text NOT NULL,
  public_key text NOT NULL,
  private_key text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.push_vapid_config ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.operations
  ADD COLUMN IF NOT EXISTS "operationRoom" text;
