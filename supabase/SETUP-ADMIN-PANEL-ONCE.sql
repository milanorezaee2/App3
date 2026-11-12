-- Admin panel v2: server-side aggregates and moderation for the management app.
-- Safe to re-run. Requires the earlier education-admin, registered-users,
-- conversations and multi-contact-admin setups.
BEGIN;

-- ---------------------------------------------------------------- audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id bigserial PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT pg_catalog.now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_audit_log FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.admin_audit_log TO authenticated;
DROP POLICY IF EXISTS admin_audit_log_admin_read ON public.admin_audit_log;
CREATE POLICY admin_audit_log_admin_read ON public.admin_audit_log
  FOR SELECT TO authenticated USING (public.is_education_admin());

CREATE OR REPLACE FUNCTION public.admin_log_action(p_action text, p_target text, p_details jsonb DEFAULT '{}'::jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  INSERT INTO public.admin_audit_log(admin_id, action, target_id, details)
  VALUES (auth.uid(), p_action, p_target, COALESCE(p_details, '{}'::jsonb));
$$;
REVOKE ALL ON FUNCTION public.admin_log_action(text, text, jsonb) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------- dashboard
CREATE OR REPLACE FUNCTION public.admin_dashboard_stats()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  SELECT pg_catalog.jsonb_build_object(
    'users_total', (SELECT count(*) FROM public.app_user_profiles),
    'users_today', (SELECT count(*) FROM public.app_user_profiles WHERE registered_at >= pg_catalog.now() - interval '1 day'),
    'users_week', (SELECT count(*) FROM public.app_user_profiles WHERE registered_at >= pg_catalog.now() - interval '7 days'),
    'users_active_week', (SELECT count(*) FROM public.app_user_profiles WHERE last_seen_at >= pg_catalog.now() - interval '7 days'),
    'users_blocked', (SELECT count(*) FROM public.user_chat_access WHERE is_blocked),
    'conversations_total', (SELECT count(*) FROM public.conversations WHERE kind = 'direct'),
    'conversations_deleted', (SELECT count(*) FROM public.chat_conversation_moderation WHERE deleted_at IS NOT NULL),
    'messages_total', (SELECT count(*) FROM public.messages),
    'messages_today', (SELECT count(*) FROM public.messages WHERE created_at >= pg_catalog.now() - interval '1 day'),
    'support_open', (SELECT count(*) FROM public.support_requests WHERE status = 'open'),
    'support_resolved', (SELECT count(*) FROM public.support_requests WHERE status = 'resolved'),
    'generated_at', pg_catalog.now()
  ) INTO result;
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_dashboard_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_stats() TO authenticated;

-- ------------------------------------------------------------------- users
DROP FUNCTION IF EXISTS public.admin_users_overview();
CREATE FUNCTION public.admin_users_overview()
RETURNS TABLE(
  user_id uuid,
  full_name text,
  email text,
  platform text,
  app_version text,
  account_kind text,
  registered_at timestamptz,
  last_seen_at timestamptz,
  chat_blocked boolean,
  block_reason text,
  conversation_count integer,
  message_count integer,
  support_conversation_id uuid,
  support_status text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  RETURN QUERY
  SELECT p.user_id, p.full_name, p.email, p.platform, p.app_version,
         COALESCE(pg_catalog.to_jsonb(p) ->> 'account_kind', 'email'),
         p.registered_at, p.last_seen_at,
         COALESCE(a.is_blocked, false), a.reason,
         (SELECT count(*)::integer FROM public.conversation_members cm WHERE cm.user_id = p.user_id),
         (SELECT count(*)::integer FROM public.messages m WHERE m.sender_id = p.user_id),
         sr.conversation_id, sr.status
  FROM public.app_user_profiles p
  LEFT JOIN public.user_chat_access a ON a.user_id = p.user_id
  LEFT JOIN LATERAL (
    SELECT s.conversation_id, s.status FROM public.support_requests s
    WHERE s.learner_id = p.user_id ORDER BY s.updated_at DESC LIMIT 1
  ) sr ON true
  ORDER BY p.registered_at DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_users_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_users_overview() TO authenticated;

-- ------------------------------------------------------------ conversations
DROP FUNCTION IF EXISTS public.admin_conversations_overview();
CREATE FUNCTION public.admin_conversations_overview()
RETURNS TABLE(
  conversation_id uuid,
  kind text,
  created_at timestamptz,
  is_support boolean,
  support_status text,
  deleted_at timestamptz,
  message_count integer,
  last_message_at timestamptz,
  last_message_preview text,
  members jsonb
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  RETURN QUERY
  SELECT c.id, c.kind, c.created_at,
         (sr.conversation_id IS NOT NULL), sr.status,
         mod.deleted_at,
         (SELECT count(*)::integer FROM public.messages m WHERE m.conversation_id = c.id),
         lm.created_at,
         CASE WHEN lm.message_type = 'voice' THEN '🎤 پیام صوتی' ELSE pg_catalog.left(COALESCE(lm.body, ''), 80) END,
         COALESCE((
           SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
             'user_id', cm.user_id,
             'name', COALESCE(up.full_name, pr.display_name, 'زبان‌آموز'),
             'email', up.email,
             'blocked', COALESCE(ua.is_blocked, false),
             'is_admin', EXISTS (SELECT 1 FROM public.education_admins ea WHERE ea.user_id = cm.user_id)
           ) ORDER BY cm.joined_at)
           FROM public.conversation_members cm
           LEFT JOIN public.app_user_profiles up ON up.user_id = cm.user_id
           LEFT JOIN public.profiles pr ON pr.id = cm.user_id
           LEFT JOIN public.user_chat_access ua ON ua.user_id = cm.user_id
           WHERE cm.conversation_id = c.id
         ), '[]'::jsonb)
  FROM public.conversations c
  LEFT JOIN public.support_requests sr ON sr.conversation_id = c.id
  LEFT JOIN public.chat_conversation_moderation mod ON mod.conversation_id = c.id
  LEFT JOIN LATERAL (
    SELECT m.created_at, m.body, m.message_type FROM public.messages m
    WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1
  ) lm ON true
  WHERE c.kind = 'direct'
  ORDER BY COALESCE(lm.created_at, c.created_at) DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_conversations_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_conversations_overview() TO authenticated;

-- Read-only view of a conversation for moderation (admin only).
DROP FUNCTION IF EXISTS public.admin_conversation_messages(uuid, integer);
CREATE FUNCTION public.admin_conversation_messages(p_conversation_id uuid, p_limit integer DEFAULT 200)
RETURNS TABLE(id uuid, sender_id uuid, sender_name text, message_type text, body text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  RETURN QUERY
  SELECT m.id, m.sender_id,
         COALESCE(up.full_name, pr.display_name, 'زبان‌آموز'),
         m.message_type, m.body, m.created_at
  FROM public.messages m
  LEFT JOIN public.app_user_profiles up ON up.user_id = m.sender_id
  LEFT JOIN public.profiles pr ON pr.id = m.sender_id
  WHERE m.conversation_id = p_conversation_id
  ORDER BY m.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 200), 500));
END;
$$;
REVOKE ALL ON FUNCTION public.admin_conversation_messages(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_conversation_messages(uuid, integer) TO authenticated;

-- Permanent deletion of a conversation and all of its messages.
CREATE OR REPLACE FUNCTION public.admin_purge_conversation(p_conversation_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE removed integer;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  DELETE FROM public.messages WHERE conversation_id = p_conversation_id;
  GET DIAGNOSTICS removed = ROW_COUNT;
  DELETE FROM public.learning_contacts WHERE conversation_id = p_conversation_id;
  DELETE FROM public.conversations WHERE id = p_conversation_id;
  PERFORM public.admin_log_action('purge_conversation', p_conversation_id::text, pg_catalog.jsonb_build_object('messages', removed));
END;
$$;
REVOKE ALL ON FUNCTION public.admin_purge_conversation(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_purge_conversation(uuid) TO authenticated;

-- Deletes the messages of a conversation but keeps the conversation itself.
CREATE OR REPLACE FUNCTION public.admin_clear_conversation(p_conversation_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE removed integer;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  DELETE FROM public.messages WHERE conversation_id = p_conversation_id;
  GET DIAGNOSTICS removed = ROW_COUNT;
  PERFORM public.admin_log_action('clear_conversation', p_conversation_id::text, pg_catalog.jsonb_build_object('messages', removed));
  RETURN removed;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_clear_conversation(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_clear_conversation(uuid) TO authenticated;

-- Blocks (or unblocks) every member of a conversation except admins.
CREATE OR REPLACE FUNCTION public.admin_block_conversation_members(p_conversation_id uuid, p_blocked boolean)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE affected integer := 0; member uuid;
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  FOR member IN
    SELECT cm.user_id FROM public.conversation_members cm
    WHERE cm.conversation_id = p_conversation_id
      AND cm.user_id <> auth.uid()
      AND NOT EXISTS (SELECT 1 FROM public.education_admins ea WHERE ea.user_id = cm.user_id)
  LOOP
    INSERT INTO public.user_chat_access(user_id, is_blocked, reason, updated_by, updated_at)
    VALUES (member, p_blocked, CASE WHEN p_blocked THEN 'مسدود از طریق گفتگو' END, auth.uid(), pg_catalog.now())
    ON CONFLICT (user_id) DO UPDATE SET is_blocked = EXCLUDED.is_blocked, reason = EXCLUDED.reason,
      updated_by = auth.uid(), updated_at = pg_catalog.now();
    affected := affected + 1;
  END LOOP;
  PERFORM public.admin_log_action(CASE WHEN p_blocked THEN 'block_conversation_members' ELSE 'unblock_conversation_members' END,
    p_conversation_id::text, pg_catalog.jsonb_build_object('members', affected));
  RETURN affected;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_block_conversation_members(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_block_conversation_members(uuid, boolean) TO authenticated;

-- Recent audit entries for the settings screen.
DROP FUNCTION IF EXISTS public.admin_recent_actions(integer);
CREATE FUNCTION public.admin_recent_actions(p_limit integer DEFAULT 50)
RETURNS TABLE(id bigint, action text, target_id text, details jsonb, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
  RETURN QUERY SELECT l.id, l.action, l.target_id, l.details, l.created_at
  FROM public.admin_audit_log l ORDER BY l.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 50), 200));
END;
$$;
REVOKE ALL ON FUNCTION public.admin_recent_actions(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_recent_actions(integer) TO authenticated;

COMMIT;
