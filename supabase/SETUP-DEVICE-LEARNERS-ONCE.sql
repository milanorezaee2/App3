-- Device-registered learner accounts for the open (no-login) five-language app.
-- The learner activates a profile on the device with an app-generated code
-- (no OTP). The app then signs in anonymously and registers name + e-mail here
-- so the manager sees the learner in Admin App like any registered user.
-- The e-mail is self-declared (not verified), so it is flagged as such.
BEGIN;

ALTER TABLE public.app_user_profiles
  ADD COLUMN IF NOT EXISTS account_kind text NOT NULL DEFAULT 'email'
  CHECK (account_kind IN ('email', 'device'));

CREATE OR REPLACE FUNCTION public.register_device_learner(
  p_full_name text,
  p_email text,
  p_platform text DEFAULT NULL,
  p_app_version text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  caller_id uuid := auth.uid();
  clean_name text := pg_catalog.btrim(COALESCE(p_full_name, ''));
  clean_email text := pg_catalog.lower(pg_catalog.btrim(COALESCE(p_email, '')));
BEGIN
  IF caller_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF pg_catalog.length(clean_name) < 2 OR pg_catalog.length(clean_name) > 80 THEN RAISE EXCEPTION 'NAME_INVALID'; END IF;
  IF clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN RAISE EXCEPTION 'EMAIL_INVALID'; END IF;
  -- A verified e-mail account must never be overwritten by a device claim.
  IF EXISTS (SELECT 1 FROM public.app_user_profiles p WHERE p.user_id = caller_id AND p.account_kind = 'email') THEN
    RAISE EXCEPTION 'ACCOUNT_IS_EMAIL';
  END IF;

  INSERT INTO public.app_user_profiles (user_id, full_name, email, platform, app_version, account_kind, registered_at, last_seen_at, updated_at)
  VALUES (caller_id, clean_name, clean_email,
          CASE WHEN p_platform IN ('android', 'ios', 'web') THEN p_platform ELSE NULL END,
          NULLIF(pg_catalog.btrim(COALESCE(p_app_version, '')), ''),
          'device', pg_catalog.now(), pg_catalog.now(), pg_catalog.now())
  ON CONFLICT (user_id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        platform = COALESCE(EXCLUDED.platform, public.app_user_profiles.platform),
        app_version = COALESCE(EXCLUDED.app_version, public.app_user_profiles.app_version),
        last_seen_at = pg_catalog.now(),
        updated_at = pg_catalog.now();

  -- Keep the chat display name in step with the profile name.
  INSERT INTO public.profiles (id, display_name, last_seen)
  VALUES (caller_id, clean_name, pg_catalog.now())
  ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, last_seen = pg_catalog.now();
END;
$$;
REVOKE ALL ON FUNCTION public.register_device_learner(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_device_learner(text, text, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.touch_device_learner(p_app_version text DEFAULT NULL)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE public.app_user_profiles
  SET last_seen_at = pg_catalog.now(),
      app_version = COALESCE(NULLIF(pg_catalog.btrim(COALESCE(p_app_version, '')), ''), app_version),
      updated_at = pg_catalog.now()
  WHERE user_id = auth.uid() AND account_kind = 'device';
$$;
REVOKE ALL ON FUNCTION public.touch_device_learner(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.touch_device_learner(text) TO authenticated;

COMMIT;
