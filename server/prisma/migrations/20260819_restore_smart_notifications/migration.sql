-- Restore the smart_notifications table required by the assistant notification API.
-- The previous table was preserved as smart_notifications_backup_medaxis.
CREATE TABLE IF NOT EXISTS public.smart_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  entity_type text NULL,
  entity_id uuid NULL,
  scheduled_for timestamptz NULL,
  read_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT smart_notifications_main_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS smart_notifications_main_user_created_idx
  ON public.smart_notifications(user_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS smart_notifications_main_user_kind_scheduled_idx
  ON public.smart_notifications(user_id, kind, scheduled_for);
