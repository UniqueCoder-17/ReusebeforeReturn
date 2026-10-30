-- Ensure signup can create notification preferences after creating a profile.
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id                        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_enabled             boolean NOT NULL DEFAULT true,
  availability_alerts       boolean NOT NULL DEFAULT true,
  saved_search_alerts       boolean NOT NULL DEFAULT true,
  message_emails            boolean NOT NULL DEFAULT true,
  request_emails            boolean NOT NULL DEFAULT true,
  digest_frequency          text NOT NULL DEFAULT 'immediate' CHECK (digest_frequency IN ('immediate', 'daily', 'disabled')),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_profile_prefs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_prefs ON public.profiles;
CREATE TRIGGER on_profile_created_prefs
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_prefs();
