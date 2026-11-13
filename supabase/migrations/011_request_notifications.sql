CREATE OR REPLACE FUNCTION public.notify_product_owner_of_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    related_entity_id,
    related_entity_type
  )
  SELECT
    product.owner_id,
    'new_request',
    'New request for your listing',
    COALESCE(NULLIF(BTRIM(requester.full_name), ''), 'Someone')
      || ' is interested in "' || product.title || '".',
    NEW.id,
    'request'
  FROM public.products AS product
  LEFT JOIN public.profiles AS requester ON requester.id = NEW.requester_id
  WHERE product.id = NEW.product_id
    AND product.owner_id <> NEW.requester_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_request_created_notify_owner ON public.requests;
CREATE TRIGGER on_request_created_notify_owner
  AFTER INSERT ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_product_owner_of_request();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END;
$$;
