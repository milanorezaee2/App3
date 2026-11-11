-- Support chat recovery.
-- Problem: when the manager soft-deletes a learner's support conversation
-- (chat_conversation_moderation.deleted_at), ensure_support_conversation kept
-- returning that same conversation. The learner could then neither read nor
-- send messages and saw a raw "row-level security policy" error.
-- Fix: a deleted support conversation is detached and a fresh one is created;
-- a blocked learner gets an explicit CHAT_ACCESS_BLOCKED error instead.
BEGIN;

CREATE OR REPLACE FUNCTION public.ensure_support_conversation(p_display_name text DEFAULT 'زبان‌آموز')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  caller_id uuid := auth.uid();
  manager_id uuid;
  existing_conversation uuid;
  new_conversation_id uuid;
BEGIN
  IF caller_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;

  IF EXISTS (SELECT 1 FROM public.user_chat_access a WHERE a.user_id = caller_id AND a.is_blocked) THEN
    RAISE EXCEPTION 'CHAT_ACCESS_BLOCKED';
  END IF;

  SELECT a.user_id INTO manager_id
  FROM public.education_admins AS a
  WHERE a.singleton_key = 1
  LIMIT 1;
  IF manager_id IS NULL THEN RAISE EXCEPTION 'SUPPORT_UNAVAILABLE'; END IF;
  IF manager_id = caller_id THEN RAISE EXCEPTION 'SUPPORT_SELF'; END IF;

  SELECT c.conversation_id INTO existing_conversation
  FROM public.learning_contacts AS c
  WHERE c.user_id = caller_id AND c.contact_id = manager_id;

  IF existing_conversation IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.chat_conversation_moderation m
      WHERE m.conversation_id = existing_conversation AND m.deleted_at IS NOT NULL
    ) AND EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = existing_conversation AND cm.user_id = caller_id
    ) THEN
      INSERT INTO public.support_requests (conversation_id, learner_id, manager_id)
      VALUES (existing_conversation, caller_id, manager_id)
      ON CONFLICT (conversation_id) DO NOTHING;
      RETURN existing_conversation;
    END IF;

    -- The previous conversation was closed by the manager (or membership is
    -- missing). Detach the pair so a fresh private conversation can be created.
    DELETE FROM public.learning_contacts
    WHERE (user_id = caller_id AND contact_id = manager_id)
       OR (user_id = manager_id AND contact_id = caller_id);
  END IF;

  INSERT INTO public.profiles (id, display_name, last_seen)
  VALUES (caller_id, COALESCE(NULLIF(pg_catalog.btrim(p_display_name), ''), 'زبان‌آموز'), pg_catalog.now())
  ON CONFLICT (id) DO UPDATE
    SET display_name = EXCLUDED.display_name, last_seen = pg_catalog.now();

  INSERT INTO public.profiles (id, display_name, last_seen)
  VALUES (manager_id, 'پشتیبانی Milo', pg_catalog.now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.conversations DEFAULT VALUES
  RETURNING id INTO new_conversation_id;

  INSERT INTO public.conversation_members (conversation_id, user_id)
  VALUES (new_conversation_id, manager_id), (new_conversation_id, caller_id);

  INSERT INTO public.learning_contacts (user_id, contact_id, conversation_id)
  VALUES
    (manager_id, caller_id, new_conversation_id),
    (caller_id, manager_id, new_conversation_id);

  INSERT INTO public.support_requests (conversation_id, learner_id, manager_id)
  VALUES (new_conversation_id, caller_id, manager_id);

  RETURN new_conversation_id;
END;
$$;
REVOKE ALL ON FUNCTION public.ensure_support_conversation(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_support_conversation(text) TO authenticated;

COMMIT;
