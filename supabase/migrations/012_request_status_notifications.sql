CREATE OR REPLACE FUNCTION public.notify_requester_of_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF OLD.status = 'pending'
    AND NEW.status IN ('accepted', 'rejected')
    AND auth.uid() = NEW.owner_id
  THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      related_entity_id,
      related_entity_type
    )
    SELECT
      NEW.requester_id,
      CASE NEW.status
        WHEN 'accepted' THEN 'request_accepted'
        ELSE 'request_declined'
      END,
      CASE NEW.status
        WHEN 'accepted' THEN 'Your request was accepted'
        ELSE 'Your request was declined'
      END,
      'The owner '
        || CASE NEW.status WHEN 'accepted' THEN 'accepted' ELSE 'declined' END
        || ' your request for "' || product.title || '".',
      NEW.id,
      'request'
    FROM public.products AS product
    WHERE product.id = NEW.product_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_request_status_changed_notify_requester ON public.requests;
CREATE TRIGGER on_request_status_changed_notify_requester
  AFTER UPDATE OF status ON public.requests
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.notify_requester_of_status_change();
