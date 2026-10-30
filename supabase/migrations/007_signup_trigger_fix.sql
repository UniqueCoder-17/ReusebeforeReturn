-- Repair the Auth signup trigger for existing Supabase projects.
-- Qualify public objects explicitly and never trust user metadata for role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, full_name, phone, state, city, locality, pin_code, avatar_url, role
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(btrim(NEW.raw_user_meta_data->>'full_name'), ''), 'New User'),
    NULLIF(btrim(NEW.raw_user_meta_data->>'phone'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'state'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'city'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'locality'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'pin_code'), ''),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
