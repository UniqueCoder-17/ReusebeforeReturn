-- ============================================================
-- Reuse Before Return — Email & Notification Preference Tables
-- ============================================================

-- ============================================================
-- NOTIFICATION PREFERENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id                        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  email_enabled             boolean NOT NULL DEFAULT true,
  availability_alerts       boolean NOT NULL DEFAULT true,
  saved_search_alerts       boolean NOT NULL DEFAULT true,
  message_emails            boolean NOT NULL DEFAULT true,
  request_emails            boolean NOT NULL DEFAULT true,
  digest_frequency          text NOT NULL DEFAULT 'immediate' CHECK (digest_frequency IN ('immediate', 'daily', 'disabled')),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCT ALERT SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_alert_subscriptions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  active      boolean NOT NULL DEFAULT true,
  notified_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- ============================================================
-- SAVED SEARCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_searches (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  search_query text,
  category_id uuid REFERENCES categories(id),
  city        text,
  locality    text,
  radius_km   int DEFAULT 10,
  free_only   boolean NOT NULL DEFAULT false,
  active      boolean NOT NULL DEFAULT true,
  last_notified_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- EMAIL DELIVERY LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS email_delivery_logs (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             uuid REFERENCES profiles(id) ON DELETE SET NULL,
  event_type          text NOT NULL,
  related_entity_id   uuid,
  provider_message_id text,
  recipient_email     text,
  subject             text,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  error_message       text,
  sent_at             timestamptz,
  idempotency_key     text UNIQUE,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Auto-create notification preferences when profile is created
CREATE OR REPLACE FUNCTION handle_new_profile_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_profile_created_prefs ON public.profiles;
CREATE TRIGGER on_profile_created_prefs
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_prefs();
