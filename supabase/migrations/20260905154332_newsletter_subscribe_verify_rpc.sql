-- Subscribe and verify via SECURITY DEFINER so the emailed token
-- is always the one stored, and confirmation does not depend on RLS.

CREATE OR REPLACE FUNCTION public.subscribe_newsletter(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec public.subscribers;
  new_token text := gen_random_uuid()::text;
  clean_email text := lower(trim(p_email));
BEGIN
  IF clean_email IS NULL OR clean_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RETURN jsonb_build_object('status', 'invalid_email');
  END IF;

  SELECT * INTO rec
  FROM public.subscribers
  WHERE email = clean_email;

  IF FOUND THEN
    IF rec.is_active OR rec.verified_at IS NOT NULL THEN
      RETURN jsonb_build_object('status', 'already_verified');
    END IF;

    UPDATE public.subscribers
    SET verification_token = new_token,
        is_active = false
    WHERE id = rec.id;

    RETURN jsonb_build_object('status', 'pending', 'token', new_token);
  END IF;

  INSERT INTO public.subscribers (email, is_active, verification_token)
  VALUES (clean_email, false, new_token);

  RETURN jsonb_build_object('status', 'pending', 'token', new_token);
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_newsletter(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec public.subscribers;
  clean_token text := trim(p_token);
BEGIN
  IF clean_token IS NULL OR clean_token = '' THEN
    RETURN jsonb_build_object('status', 'invalid');
  END IF;

  SELECT * INTO rec
  FROM public.subscribers
  WHERE verification_token = clean_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'invalid');
  END IF;

  IF rec.is_active OR rec.verified_at IS NOT NULL THEN
    UPDATE public.subscribers
    SET verification_token = NULL
    WHERE id = rec.id AND verification_token IS NOT NULL;
    RETURN jsonb_build_object('status', 'already_verified');
  END IF;

  UPDATE public.subscribers
  SET is_active = true,
      verified_at = now(),
      verification_token = NULL
  WHERE id = rec.id;

  RETURN jsonb_build_object('status', 'verified');
END;
$$;

REVOKE ALL ON FUNCTION public.subscribe_newsletter(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_newsletter(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_newsletter(text) TO anon, authenticated;
