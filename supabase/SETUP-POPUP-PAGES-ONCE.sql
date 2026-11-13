-- Run ONCE in Supabase SQL editor (after SETUP-ADMIN-EXTRAS-ONCE.sql).
-- Pop-ups can now target specific learner pages (any number); NULL = every page.

ALTER TABLE public.app_popups ADD COLUMN IF NOT EXISTS target_routes text[];

DROP FUNCTION IF EXISTS public.active_app_popups(text);
CREATE OR REPLACE FUNCTION public.active_app_popups(p_package_name text)
RETURNS TABLE(id uuid, title text, body text, button_label text, button_url text, kind text, show_once boolean, priority integer, updated_at timestamptz, target_routes text[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p.id, p.title, p.body, p.button_label, p.button_url, p.kind, p.show_once, p.priority, p.updated_at, p.target_routes
  FROM public.app_popups p
  WHERE p.active
    AND (p.package_name IS NULL OR p.package_name = p_package_name)
    AND p.starts_at <= pg_catalog.now()
    AND (p.ends_at IS NULL OR p.ends_at > pg_catalog.now())
  ORDER BY p.priority DESC, p.updated_at DESC
  LIMIT 50;
$$;
REVOKE ALL ON FUNCTION public.active_app_popups(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.active_app_popups(text) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.admin_save_popup(uuid, text, text, text, text, text, text, boolean, boolean, timestamptz, timestamptz, integer);
CREATE OR REPLACE FUNCTION public.admin_save_popup(
  p_id uuid, p_title text, p_body text, p_button_label text, p_button_url text, p_package_name text,
  p_kind text, p_show_once boolean, p_active boolean, p_starts_at timestamptz, p_ends_at timestamptz, p_priority integer,
  p_target_routes text[] DEFAULT NULL
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE saved uuid;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.app_popups(title, body, button_label, button_url, package_name, kind, show_once, active, starts_at, ends_at, priority, target_routes, created_by)
    VALUES (pg_catalog.btrim(p_title), p_body, NULLIF(pg_catalog.btrim(COALESCE(p_button_label, '')), ''), NULLIF(pg_catalog.btrim(COALESCE(p_button_url, '')), ''),
            NULLIF(pg_catalog.btrim(COALESCE(p_package_name, '')), ''), COALESCE(p_kind, 'info'), COALESCE(p_show_once, true), COALESCE(p_active, true),
            COALESCE(p_starts_at, pg_catalog.now()), p_ends_at, COALESCE(p_priority, 0),
            CASE WHEN p_target_routes IS NULL OR pg_catalog.cardinality(p_target_routes) = 0 THEN NULL ELSE p_target_routes END, auth.uid())
    RETURNING id INTO saved;
  ELSE
    UPDATE public.app_popups SET title = pg_catalog.btrim(p_title), body = p_body,
      button_label = NULLIF(pg_catalog.btrim(COALESCE(p_button_label, '')), ''), button_url = NULLIF(pg_catalog.btrim(COALESCE(p_button_url, '')), ''),
      package_name = NULLIF(pg_catalog.btrim(COALESCE(p_package_name, '')), ''), kind = COALESCE(p_kind, 'info'), show_once = COALESCE(p_show_once, true),
      active = COALESCE(p_active, true), starts_at = COALESCE(p_starts_at, starts_at), ends_at = p_ends_at, priority = COALESCE(p_priority, 0),
      target_routes = CASE WHEN p_target_routes IS NULL OR pg_catalog.cardinality(p_target_routes) = 0 THEN NULL ELSE p_target_routes END,
      updated_at = pg_catalog.now()
    WHERE id = p_id RETURNING id INTO saved;
  END IF;
  PERFORM public.admin_log_action('save_popup', saved::text, pg_catalog.jsonb_build_object('title', p_title, 'active', p_active, 'pages', p_target_routes));
  RETURN saved;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_save_popup(uuid, text, text, text, text, text, text, boolean, boolean, timestamptz, timestamptz, integer, text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_save_popup(uuid, text, text, text, text, text, text, boolean, boolean, timestamptz, timestamptz, integer, text[]) TO authenticated;
