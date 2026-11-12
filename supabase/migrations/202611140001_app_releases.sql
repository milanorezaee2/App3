-- In-app updates: the manager publishes APK releases; learner apps fetch the
-- latest release for their own package and install it. Safe to re-run.
BEGIN;

-- Audit log (same definition as SETUP-ADMIN-PANEL-ONCE; harmless if it exists).
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id bigserial PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT pg_catalog.now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.admin_log_action(p_action text, p_target text, p_details jsonb DEFAULT '{}'::jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  INSERT INTO public.admin_audit_log(admin_id, action, target_id, details)
  VALUES (auth.uid(), p_action, p_target, COALESCE(p_details, '{}'::jsonb));
$$;
REVOKE ALL ON FUNCTION public.admin_log_action(text, text, jsonb) FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS public.app_releases (
  id uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
  package_name text NOT NULL CHECK (package_name ~ '^[a-zA-Z0-9_.]{3,120}$'),
  platform text NOT NULL DEFAULT 'android' CHECK (platform IN ('android')),
  version_name text NOT NULL CHECK (length(btrim(version_name)) BETWEEN 1 AND 40),
  version_code integer NOT NULL CHECK (version_code > 0),
  download_url text NOT NULL CHECK (download_url ~ '^https://'),
  storage_path text,
  file_size bigint,
  sha256 text,
  release_notes text NOT NULL DEFAULT '',
  mandatory boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT pg_catalog.now(),
  UNIQUE (package_name, platform, version_code)
);
CREATE INDEX IF NOT EXISTS app_releases_latest_idx ON public.app_releases(package_name, platform, published, version_code DESC);
ALTER TABLE public.app_releases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_releases FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.app_releases TO authenticated;
DROP POLICY IF EXISTS app_releases_admin_read ON public.app_releases;
CREATE POLICY app_releases_admin_read ON public.app_releases
  FOR SELECT TO authenticated USING (public.is_education_admin());

-- Learner apps: only the newest published release of their own package.
CREATE OR REPLACE FUNCTION public.latest_app_release(p_package_name text, p_platform text DEFAULT 'android')
RETURNS TABLE(id uuid, version_name text, version_code integer, download_url text, file_size bigint, sha256 text, release_notes text, mandatory boolean, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT r.id, r.version_name, r.version_code, r.download_url, r.file_size, r.sha256, r.release_notes, r.mandatory, r.created_at
  FROM public.app_releases r
  WHERE r.package_name = p_package_name AND r.platform = COALESCE(p_platform, 'android') AND r.published
  ORDER BY r.version_code DESC
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.latest_app_release(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.latest_app_release(text, text) TO anon, authenticated;

-- Manager: publish / edit / remove releases.
CREATE OR REPLACE FUNCTION public.admin_publish_release(
  p_package_name text, p_version_name text, p_version_code integer, p_download_url text,
  p_release_notes text DEFAULT '', p_mandatory boolean DEFAULT false,
  p_storage_path text DEFAULT NULL, p_file_size bigint DEFAULT NULL, p_sha256 text DEFAULT NULL
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE new_id uuid;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  INSERT INTO public.app_releases(package_name, version_name, version_code, download_url, release_notes, mandatory, storage_path, file_size, sha256, created_by)
  VALUES (pg_catalog.btrim(p_package_name), pg_catalog.btrim(p_version_name), p_version_code, pg_catalog.btrim(p_download_url),
          COALESCE(pg_catalog.left(p_release_notes, 4000), ''), COALESCE(p_mandatory, false), p_storage_path, p_file_size, p_sha256, auth.uid())
  ON CONFLICT (package_name, platform, version_code) DO UPDATE SET
    version_name = EXCLUDED.version_name, download_url = EXCLUDED.download_url, release_notes = EXCLUDED.release_notes,
    mandatory = EXCLUDED.mandatory, storage_path = EXCLUDED.storage_path, file_size = EXCLUDED.file_size, sha256 = EXCLUDED.sha256,
    published = true, created_by = auth.uid(), created_at = pg_catalog.now()
  RETURNING id INTO new_id;
  PERFORM public.admin_log_action('publish_release', new_id::text,
    pg_catalog.jsonb_build_object('package', p_package_name, 'version_code', p_version_code, 'version_name', p_version_name));
  RETURN new_id;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_publish_release(text, text, integer, text, text, boolean, text, bigint, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_publish_release(text, text, integer, text, text, boolean, text, bigint, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_release_published(p_release_id uuid, p_published boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  UPDATE public.app_releases SET published = p_published WHERE id = p_release_id;
  PERFORM public.admin_log_action(CASE WHEN p_published THEN 'publish_release' ELSE 'unpublish_release' END, p_release_id::text, '{}'::jsonb);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_set_release_published(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_release_published(uuid, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_delete_release(p_release_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  DELETE FROM public.app_releases WHERE id = p_release_id;
  PERFORM public.admin_log_action('delete_release', p_release_id::text, '{}'::jsonb);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_delete_release(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_release(uuid) TO authenticated;

-- Public storage bucket for APK files (admin writes, everyone downloads).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('app-releases', 'app-releases', true, 524288000, ARRAY['application/vnd.android.package-archive', 'application/octet-stream'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS app_releases_public_read ON storage.objects;
CREATE POLICY app_releases_public_read ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'app-releases');
DROP POLICY IF EXISTS app_releases_admin_insert ON storage.objects;
CREATE POLICY app_releases_admin_insert ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-releases' AND public.is_education_admin());
DROP POLICY IF EXISTS app_releases_admin_update ON storage.objects;
CREATE POLICY app_releases_admin_update ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'app-releases' AND public.is_education_admin());
DROP POLICY IF EXISTS app_releases_admin_delete ON storage.objects;
CREATE POLICY app_releases_admin_delete ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'app-releases' AND public.is_education_admin());

COMMIT;
