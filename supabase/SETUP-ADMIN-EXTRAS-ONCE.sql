-- Admin extras: learner pop-ups, bulk conversation tools, subscription
-- infrastructure (switched off by default). Safe to re-run.
BEGIN;

-- ----------------------------------------------------------- app settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT pg_catalog.now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_settings FROM PUBLIC, anon, authenticated;
INSERT INTO public.app_settings(key, value) VALUES ('subscriptions', '{"enabled": false, "free_lessons": 10}'::jsonb)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.public_app_settings()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT COALESCE(pg_catalog.jsonb_object_agg(s.key, s.value), '{}'::jsonb) FROM public.app_settings s WHERE s.key IN ('subscriptions');
$$;
REVOKE ALL ON FUNCTION public.public_app_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_app_settings() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_setting(p_key text, p_value jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  INSERT INTO public.app_settings(key, value, updated_by, updated_at) VALUES (p_key, p_value, auth.uid(), pg_catalog.now())
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = auth.uid(), updated_at = pg_catalog.now();
  PERFORM public.admin_log_action('set_setting', p_key, p_value);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_set_setting(text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_setting(text, jsonb) TO authenticated;

-- ---------------------------------------------------------------- pop-ups
CREATE TABLE IF NOT EXISTS public.app_popups (
  id uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
  title text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 120),
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 2000),
  button_label text,
  button_url text CHECK (button_url IS NULL OR button_url ~ '^https?://'),
  package_name text,                      -- NULL = every app
  kind text NOT NULL DEFAULT 'info' CHECK (kind IN ('info', 'success', 'warning', 'promo')),
  show_once boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  starts_at timestamptz NOT NULL DEFAULT pg_catalog.now(),
  ends_at timestamptz,
  priority integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT pg_catalog.now(),
  updated_at timestamptz NOT NULL DEFAULT pg_catalog.now()
);
ALTER TABLE public.app_popups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_popups FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.app_popups TO authenticated;
DROP POLICY IF EXISTS app_popups_admin_read ON public.app_popups;
CREATE POLICY app_popups_admin_read ON public.app_popups FOR SELECT TO authenticated USING (public.is_education_admin());

CREATE OR REPLACE FUNCTION public.active_app_popups(p_package_name text)
RETURNS TABLE(id uuid, title text, body text, button_label text, button_url text, kind text, show_once boolean, priority integer, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p.id, p.title, p.body, p.button_label, p.button_url, p.kind, p.show_once, p.priority, p.updated_at
  FROM public.app_popups p
  WHERE p.active
    AND (p.package_name IS NULL OR p.package_name = p_package_name)
    AND p.starts_at <= pg_catalog.now()
    AND (p.ends_at IS NULL OR p.ends_at > pg_catalog.now())
  ORDER BY p.priority DESC, p.updated_at DESC
  LIMIT 5;
$$;
REVOKE ALL ON FUNCTION public.active_app_popups(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.active_app_popups(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_save_popup(
  p_id uuid, p_title text, p_body text, p_button_label text, p_button_url text, p_package_name text,
  p_kind text, p_show_once boolean, p_active boolean, p_starts_at timestamptz, p_ends_at timestamptz, p_priority integer
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE saved uuid;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.app_popups(title, body, button_label, button_url, package_name, kind, show_once, active, starts_at, ends_at, priority, created_by)
    VALUES (pg_catalog.btrim(p_title), p_body, NULLIF(pg_catalog.btrim(COALESCE(p_button_label, '')), ''), NULLIF(pg_catalog.btrim(COALESCE(p_button_url, '')), ''),
            NULLIF(pg_catalog.btrim(COALESCE(p_package_name, '')), ''), COALESCE(p_kind, 'info'), COALESCE(p_show_once, true), COALESCE(p_active, true),
            COALESCE(p_starts_at, pg_catalog.now()), p_ends_at, COALESCE(p_priority, 0), auth.uid())
    RETURNING id INTO saved;
  ELSE
    UPDATE public.app_popups SET title = pg_catalog.btrim(p_title), body = p_body,
      button_label = NULLIF(pg_catalog.btrim(COALESCE(p_button_label, '')), ''), button_url = NULLIF(pg_catalog.btrim(COALESCE(p_button_url, '')), ''),
      package_name = NULLIF(pg_catalog.btrim(COALESCE(p_package_name, '')), ''), kind = COALESCE(p_kind, 'info'), show_once = COALESCE(p_show_once, true),
      active = COALESCE(p_active, true), starts_at = COALESCE(p_starts_at, starts_at), ends_at = p_ends_at, priority = COALESCE(p_priority, 0), updated_at = pg_catalog.now()
    WHERE id = p_id RETURNING id INTO saved;
  END IF;
  PERFORM public.admin_log_action('save_popup', saved::text, pg_catalog.jsonb_build_object('title', p_title, 'active', p_active));
  RETURN saved;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_save_popup(uuid, text, text, text, text, text, text, boolean, boolean, timestamptz, timestamptz, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_save_popup(uuid, text, text, text, text, text, text, boolean, boolean, timestamptz, timestamptz, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_delete_popup(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  DELETE FROM public.app_popups WHERE id = p_id;
  PERFORM public.admin_log_action('delete_popup', p_id::text, '{}'::jsonb);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_delete_popup(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_popup(uuid) TO authenticated;

-- ---------------------------------------------------- bulk conversation ops
CREATE OR REPLACE FUNCTION public.admin_purge_conversations(p_conversation_ids uuid[])
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE removed integer;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  DELETE FROM public.messages WHERE conversation_id = ANY(p_conversation_ids);
  DELETE FROM public.learning_contacts WHERE conversation_id = ANY(p_conversation_ids);
  DELETE FROM public.conversations WHERE id = ANY(p_conversation_ids);
  GET DIAGNOSTICS removed = ROW_COUNT;
  PERFORM public.admin_log_action('purge_conversations', NULL, pg_catalog.jsonb_build_object('count', removed));
  RETURN removed;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_purge_conversations(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_purge_conversations(uuid[]) TO authenticated;

DROP FUNCTION IF EXISTS public.admin_export_conversations(uuid[]);
CREATE FUNCTION public.admin_export_conversations(p_conversation_ids uuid[])
RETURNS TABLE(conversation_id uuid, message_id uuid, sender_id uuid, sender_name text, sender_email text, message_type text, body text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  RETURN QUERY
  SELECT m.conversation_id, m.id, m.sender_id, COALESCE(up.full_name, pr.display_name, 'زبان‌آموز'), up.email, m.message_type, m.body, m.created_at
  FROM public.messages m
  LEFT JOIN public.app_user_profiles up ON up.user_id = m.sender_id
  LEFT JOIN public.profiles pr ON pr.id = m.sender_id
  WHERE m.conversation_id = ANY(p_conversation_ids)
  ORDER BY m.conversation_id, m.created_at;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_export_conversations(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_export_conversations(uuid[]) TO authenticated;

-- ---------------------------------------------------------- subscriptions
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
  code text UNIQUE NOT NULL CHECK (code ~ '^[a-z0-9_-]{2,40}$'),
  title text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 80),
  description text NOT NULL DEFAULT '',
  price_amount integer NOT NULL DEFAULT 0 CHECK (price_amount >= 0),
  currency text NOT NULL DEFAULT 'IRR',
  duration_days integer NOT NULL CHECK (duration_days > 0),
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT pg_catalog.now()
);
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.subscription_plans FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.subscription_plans TO anon, authenticated;
DROP POLICY IF EXISTS subscription_plans_public_read ON public.subscription_plans;
CREATE POLICY subscription_plans_public_read ON public.subscription_plans FOR SELECT TO anon, authenticated USING (active OR public.is_education_admin());

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at timestamptz NOT NULL DEFAULT pg_catalog.now(),
  ends_at timestamptz NOT NULL,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'gateway', 'promo')),
  reference text,
  note text,
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT pg_catalog.now()
);
CREATE INDEX IF NOT EXISTS user_subscriptions_user_idx ON public.user_subscriptions(user_id, ends_at DESC);
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_subscriptions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.user_subscriptions TO authenticated;
DROP POLICY IF EXISTS user_subscriptions_self_or_admin ON public.user_subscriptions;
CREATE POLICY user_subscriptions_self_or_admin ON public.user_subscriptions FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_education_admin());

-- Learner: own entitlement. Returns {enabled, tier, plan, ends_at}.
CREATE OR REPLACE FUNCTION public.my_entitlement()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE enabled boolean; sub record;
BEGIN
  SELECT COALESCE((s.value ->> 'enabled')::boolean, false) INTO enabled FROM public.app_settings s WHERE s.key = 'subscriptions';
  SELECT us.ends_at, p.code, p.title INTO sub
  FROM public.user_subscriptions us JOIN public.subscription_plans p ON p.id = us.plan_id
  WHERE us.user_id = auth.uid() AND us.status = 'active' AND us.ends_at > pg_catalog.now()
  ORDER BY us.ends_at DESC LIMIT 1;
  RETURN pg_catalog.jsonb_build_object(
    'enabled', COALESCE(enabled, false),
    'tier', CASE WHEN sub.code IS NULL THEN 'free' ELSE 'premium' END,
    'plan_code', sub.code, 'plan_title', sub.title, 'ends_at', sub.ends_at);
END;
$$;
REVOKE ALL ON FUNCTION public.my_entitlement() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.my_entitlement() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_save_plan(
  p_id uuid, p_code text, p_title text, p_description text, p_price_amount integer, p_currency text,
  p_duration_days integer, p_features jsonb, p_active boolean, p_sort_order integer
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE saved uuid;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.subscription_plans(code, title, description, price_amount, currency, duration_days, features, active, sort_order)
    VALUES (pg_catalog.lower(pg_catalog.btrim(p_code)), pg_catalog.btrim(p_title), COALESCE(p_description, ''), COALESCE(p_price_amount, 0), COALESCE(NULLIF(p_currency, ''), 'IRR'),
            p_duration_days, COALESCE(p_features, '[]'::jsonb), COALESCE(p_active, true), COALESCE(p_sort_order, 0))
    RETURNING id INTO saved;
  ELSE
    UPDATE public.subscription_plans SET code = pg_catalog.lower(pg_catalog.btrim(p_code)), title = pg_catalog.btrim(p_title), description = COALESCE(p_description, ''),
      price_amount = COALESCE(p_price_amount, 0), currency = COALESCE(NULLIF(p_currency, ''), 'IRR'), duration_days = p_duration_days,
      features = COALESCE(p_features, '[]'::jsonb), active = COALESCE(p_active, true), sort_order = COALESCE(p_sort_order, 0)
    WHERE id = p_id RETURNING id INTO saved;
  END IF;
  PERFORM public.admin_log_action('save_plan', saved::text, pg_catalog.jsonb_build_object('code', p_code));
  RETURN saved;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_save_plan(uuid, text, text, text, integer, text, integer, jsonb, boolean, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_save_plan(uuid, text, text, text, integer, text, integer, jsonb, boolean, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_grant_subscription(p_user_id uuid, p_plan_id uuid, p_days integer DEFAULT NULL, p_note text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE plan_days integer; new_id uuid; base_start timestamptz;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  SELECT duration_days INTO plan_days FROM public.subscription_plans WHERE id = p_plan_id;
  IF plan_days IS NULL THEN RAISE EXCEPTION 'PLAN_NOT_FOUND'; END IF;
  -- Extend from the current active end so renewals stack.
  SELECT GREATEST(pg_catalog.now(), COALESCE(MAX(ends_at), pg_catalog.now())) INTO base_start
  FROM public.user_subscriptions WHERE user_id = p_user_id AND status = 'active' AND ends_at > pg_catalog.now();
  INSERT INTO public.user_subscriptions(user_id, plan_id, status, starts_at, ends_at, source, note, granted_by)
  VALUES (p_user_id, p_plan_id, 'active', base_start, base_start + (COALESCE(p_days, plan_days) || ' days')::interval, 'manual', p_note, auth.uid())
  RETURNING id INTO new_id;
  PERFORM public.admin_log_action('grant_subscription', p_user_id::text, pg_catalog.jsonb_build_object('plan_id', p_plan_id, 'days', COALESCE(p_days, plan_days)));
  RETURN new_id;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_grant_subscription(uuid, uuid, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_grant_subscription(uuid, uuid, integer, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_cancel_subscription(p_subscription_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  UPDATE public.user_subscriptions SET status = 'cancelled' WHERE id = p_subscription_id;
  PERFORM public.admin_log_action('cancel_subscription', p_subscription_id::text, '{}'::jsonb);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_cancel_subscription(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_cancel_subscription(uuid) TO authenticated;

DROP FUNCTION IF EXISTS public.admin_subscriptions_overview();
CREATE FUNCTION public.admin_subscriptions_overview()
RETURNS TABLE(id uuid, user_id uuid, full_name text, email text, plan_id uuid, plan_title text, plan_code text, status text, starts_at timestamptz, ends_at timestamptz, source text, note text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  RETURN QUERY
  SELECT us.id, us.user_id, COALESCE(up.full_name, 'زبان‌آموز'), up.email, p.id, p.title, p.code,
         CASE WHEN us.status = 'active' AND us.ends_at <= pg_catalog.now() THEN 'expired' ELSE us.status END,
         us.starts_at, us.ends_at, us.source, us.note, us.created_at
  FROM public.user_subscriptions us
  JOIN public.subscription_plans p ON p.id = us.plan_id
  LEFT JOIN public.app_user_profiles up ON up.user_id = us.user_id
  ORDER BY us.created_at DESC LIMIT 500;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_subscriptions_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_subscriptions_overview() TO authenticated;

COMMIT;
