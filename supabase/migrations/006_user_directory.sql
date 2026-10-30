-- User records for manual management in the Supabase Dashboard.
-- This table is intentionally independent of any authentication provider.
-- Do not put passwords, password hashes, or authentication tokens here.
CREATE TABLE IF NOT EXISTS public.user_directory (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL,
  full_name   text NOT NULL,
  phone       text,
  state       text,
  city        text,
  locality    text,
  pin_code    text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_directory_email_normalized
    CHECK (email = lower(btrim(email)) AND email <> ''),
  CONSTRAINT user_directory_full_name_not_empty
    CHECK (btrim(full_name) <> '')
);

CREATE UNIQUE INDEX IF NOT EXISTS user_directory_email_unique
  ON public.user_directory (email);

CREATE OR REPLACE FUNCTION public.set_user_directory_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_directory_updated_at ON public.user_directory;
CREATE TRIGGER user_directory_updated_at
  BEFORE UPDATE ON public.user_directory
  FOR EACH ROW EXECUTE FUNCTION public.set_user_directory_updated_at();

ALTER TABLE public.user_directory ENABLE ROW LEVEL SECURITY;

-- User data is not accessible through the browser API until an auth provider
-- and ownership policies are deliberately selected and configured.
REVOKE ALL ON TABLE public.user_directory FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.user_directory TO service_role;
REVOKE ALL ON FUNCTION public.set_user_directory_updated_at() FROM PUBLIC, anon, authenticated;
