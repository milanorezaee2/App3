#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(root, 'node_modules', '.cache', 'personal-sync-test');
mkdirSync(cache, { recursive: true });
const entry = path.join(cache, 'entry.ts');
const output = path.join(cache, 'bundle.mjs');
writeFileSync(entry, `export * as sync from '${path.join(root, 'lib/personalLearningSync.ts')}';`);
const esbuild = await import('esbuild');
const bundle = await esbuild.build({
  entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent',
  plugins: [{ name: 'personal-sync-test-doubles', setup(build) {
    const stubs = {
      './supabase': `
        export const supabase = {
          auth: { async getSession() { return { data: { session: globalThis.__personalSyncSession }, error: null }; } },
          from(table) { return globalThis.__personalSyncDb.from(table); },
        };
      `,
      './courseProgress': `
        export async function getCourseProgress() { globalThis.__englishReads = (globalThis.__englishReads || 0) + 1; return globalThis.__englishProgress; }
      `,
      './englishBackup': `
        export async function exportEnglishSyncExtras() { return structuredClone(globalThis.__englishExtras); }
        export async function mergeEnglishSyncExtras(remote) {
          const local = globalThis.__englishExtras;
          const study = { ...remote.study, ...local.study,
            days: { ...remote.study.days, ...local.study.days },
            sessions: { ...remote.study.sessions, ...local.study.sessions },
            lessonEvidence: { ...remote.study.lessonEvidence, ...local.study.lessonEvidence },
          };
          const supplement = { ...remote.supplement, ...local.supplement,
            evidence: { ...remote.supplement.evidence, ...local.supplement.evidence },
            drafts: { ...local.supplement.drafts },
          };
          globalThis.__englishExtras = { study, supplement };
          return structuredClone(globalThis.__englishExtras);
        }
      `,
      './languages/pronunciationProgress': `
        export async function mergeRemotePronunciationMarks(language, remote) { return globalThis.__mergePronunciation(language, remote); }
        export const loadPronunciationMarks = async language => globalThis.__pronunciationMarks[language];
      `,
    };
    for (const [specifier, contents] of Object.entries(stubs)) {
      build.onResolve({ filter: new RegExp(`^${specifier.replaceAll('/', '\\/').replaceAll('.', '\\.').replaceAll('-', '\\-')}$`) }, () => ({ path: specifier, namespace: 'personal-sync-test' }));
      build.onLoad({ filter: /.*/, namespace: 'personal-sync-test' }, args => args.path === specifier ? ({ contents, loader: 'js' }) : undefined);
    }
  } }],
});
writeFileSync(output, bundle.outputFiles[0].text);

const iso = minute => new Date(Date.UTC(2026, 9, 12, 12, minute)).toISOString();
const db = {
  row: null,
  conflictOnce: false,
  from(table) {
    assert.equal(table, 'learning_progress');
    const query = { action: 'select', payload: null, filters: {} };
    query.select = () => query;
    query.update = payload => { query.action = 'update'; query.payload = payload; return query; };
    query.insert = payload => { query.action = 'insert'; query.payload = payload; return query; };
    query.eq = (key, value) => { query.filters[key] = value; return query; };
    query.abortSignal = () => query;
    query.maybeSingle = async () => {
      if (query.action === 'select') return { data: db.row ? structuredClone(db.row) : null, error: null };
      if (query.action === 'insert') {
        if (db.row) return { data: null, error: { code: '23505', message: 'duplicate' } };
        db.row = structuredClone(query.payload);
        return { data: { updated_at: db.row.updated_at }, error: null };
      }
      if (!db.row || db.row.user_id !== query.filters.user_id || db.row.updated_at !== query.filters.updated_at) {
        return { data: null, error: null };
      }
      if (db.conflictOnce) {
        db.conflictOnce = false;
        const oldGerman = db.row.language_progress.de;
        db.row = {
          ...db.row,
          language_progress: { ...db.row.language_progress, de: {
            ...oldGerman,
            course: { ...oldGerman.course, completedLessonIds: [...oldGerman.course.completedLessonIds, 'remote-race'] },
          } },
          updated_at: new Date(Date.parse(db.row.updated_at) + 1).toISOString(),
        };
        return { data: null, error: null };
      }
      db.row = { ...db.row, ...structuredClone(query.payload) };
      return { data: { updated_at: db.row.updated_at }, error: null };
    };
    return query;
  },
};

globalThis.__personalSyncSession = { user: { id: 'user-otp-1', email: 'learner@example.com', is_anonymous: false } };
globalThis.__personalSyncDb = db;
globalThis.__englishProgress = { completedLessonIds: ['en-1'] };
globalThis.__englishReads = 0;
globalThis.__englishExtras = {
  study: { version: 1, sessions: { 'en-lesson': { stage: 1, sentenceIndex: 2, revealed: false, evidencePassed: false } }, days: { '2026-10-12': 1800 }, lessonEvidence: {} },
  supplement: { version: 1, evidence: { 'en-task': { correct: true, attempts: 1 } }, drafts: { 'private-answer': 'Keep this only on the device.' }, assessmentAttempts: [], checklists: {} },
};
globalThis.__pronunciationMarks = {
  en: { 'en-th': { mark: 'practiced', updatedAt: iso(2) } },
  de: { 'de-ch': { mark: 'review', updatedAt: iso(3) } },
};
globalThis.__mergePronunciation = (language, remote) => {
  const local = globalThis.__pronunciationMarks[language];
  const merged = { ...remote };
  for (const [id, item] of Object.entries(local)) {
    const prior = merged[id];
    if (!prior || Date.parse(item.updatedAt) > Date.parse(prior.updatedAt)
      || (item.updatedAt === prior.updatedAt && JSON.stringify(item) > JSON.stringify(prior))) merged[id] = item;
  }
  globalThis.__pronunciationMarks[language] = merged;
  return structuredClone(merged);
};

const app = await import(`${output}?run=${Date.now()}`);
let checks = 0;
const verify = (condition, message) => { assert.ok(condition, message); checks += 1; };

const first = await app.sync.syncPersonalLearningData();
verify(first.status === 'synced' && first.email === 'learner@example.com', 'email-authenticated user can create the personal cloud row');
verify(db.row.user_id === 'user-otp-1', 'the row is keyed by the authenticated auth.uid');
verify(db.row.language_progress.en.study.days['2026-10-12'] === 1800
  && Object.keys(db.row.language_progress.en.supplement.drafts).length === 0, 'English study time and objective supplement evidence sync without free-text drafts');
verify(globalThis.__englishExtras.supplement.drafts['private-answer'] === 'Keep this only on the device.', 'English free-text drafts stay in local storage after sync');
verify(db.row.pronunciation_progress.en['en-th'].mark === 'practiced', 'English self-assessment notes are uploaded');
verify(!Object.hasOwn(db.row, 'service_role'), 'the client payload never contains a service-role credential');

// Legacy language data is left untouched, including during a concurrent update.
db.row.language_progress.de = { course: { completedLessonIds: ['legacy'] }, extra: { retained: true } };
db.row.pronunciation_progress.de = { legacy: { mark: 'review', updatedAt: iso(3) } };
globalThis.__pronunciationMarks.en['en-rhythm'] = { mark: 'review', updatedAt: iso(6) };
db.conflictOnce = true;
const second = await app.sync.syncPersonalLearningData();
verify(second.status === 'synced', 'optimistic retry succeeds after a concurrent-device update');
verify(db.row.language_progress.de.extra.retained && db.row.language_progress.de.course.completedLessonIds.includes('remote-race'), 'legacy cloud progress survives concurrent sync unchanged');
verify(db.row.pronunciation_progress.de.legacy.mark === 'review', 'legacy pronunciation data remains untouched');
verify(db.row.pronunciation_progress.en['en-rhythm'].mark === 'review', 'English pronunciation marks merge');
verify(globalThis.__englishReads >= 2, 'English progress is kept on its compatible RLS-protected store and participates in sync');

const readsBeforeAnonymous = globalThis.__englishReads;
globalThis.__personalSyncSession = { user: { id: 'device-anon', is_anonymous: true } };
const anonymous = await app.sync.syncPersonalLearningData();
verify(anonymous.status === 'signed-out' && globalThis.__englishReads === readsBeforeAnonymous, 'device-specific anonymous identities cannot use personal cross-device sync');

const migration = readFileSync(path.join(root, 'supabase/migrations/202610120001_personal_language_sync.sql'), 'utf8');
verify(/ENABLE ROW LEVEL SECURITY/i.test(migration) && /user_id\s*=\s*\(SELECT auth\.uid\(\)\)/i.test(migration), 'migration enables owner-only RLS');
verify(/REVOKE ALL ON TABLE public\.learning_progress FROM PUBLIC, anon, authenticated/i.test(migration)
  && /GRANT SELECT, INSERT, UPDATE ON TABLE public\.learning_progress TO authenticated/i.test(migration), 'anon has no table grant and authenticated users receive only needed verbs');
verify(/FOR ALL TO authenticated/i.test(migration) && !/GRANT .*DELETE/i.test(migration), 'policy is restricted to authenticated users without client delete access');

const authScreen = readFileSync(path.join(root, 'app/personal-sync.tsx'), 'utf8');
verify(/signInWithOtp\(/.test(authScreen) && /verifyOtp\(/.test(authScreen) && /type:\s*'email'/.test(authScreen), 'account screen sends and verifies email OTP codes');
verify(!/signInWithPassword|autoComplete="password"|textContentType="password"/i.test(authScreen), 'account UI has no password-authentication field or flow');

// Run the actual migration against a disposable PostgreSQL-compatible test DB.
const { PGlite } = await import('@electric-sql/pglite');
const sqlDb = new PGlite();
const owner = '10000000-0000-4000-8000-000000000001';
const other = '10000000-0000-4000-8000-000000000002';
await sqlDb.exec(`
  CREATE ROLE anon;
  CREATE ROLE authenticated;
  CREATE SCHEMA auth;
  CREATE TABLE auth.users(id uuid PRIMARY KEY);
  CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
    SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  GRANT USAGE ON SCHEMA auth, public TO anon, authenticated;
  INSERT INTO auth.users VALUES ('${owner}'), ('${other}');
  CREATE TABLE public.learning_progress(
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    progress jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
  GRANT ALL ON TABLE public.learning_progress TO anon, authenticated;
  CREATE POLICY broad_legacy_access ON public.learning_progress FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  CREATE POLICY prior_owner_access ON public.learning_progress FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
  INSERT INTO public.learning_progress(user_id, progress) VALUES ('${owner}', '{"completedLessonIds":["en-first"]}');
`);
await sqlDb.exec(migration);
await sqlDb.exec(migration);
verify(true, 'migration is repeatable and removes historical broad policies');
const policies = await sqlDb.query("SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='learning_progress'");
verify(policies.rows.length === 1 && policies.rows[0].policyname === 'personal_learning_progress_owner', 'only the owner-bound authenticated policy remains');
const defaults = (await sqlDb.query('SELECT progress, language_progress, pronunciation_progress FROM public.learning_progress WHERE user_id=$1', [owner])).rows[0];
verify(defaults.progress.completedLessonIds[0] === 'en-first'
  && JSON.stringify(defaults.language_progress) === '{}' && JSON.stringify(defaults.pronunciation_progress) === '{}', 'new JSON columns default empty while existing English progress remains intact');

async function assume(userId, role) {
  await sqlDb.exec('RESET ROLE');
  await sqlDb.query("SELECT set_config('request.jwt.claim.sub', $1, false)", [userId ?? '']);
  await sqlDb.exec(`SET ROLE ${role}`);
}
await assume(null, 'anon');
let anonBlocked = false;
try { await sqlDb.query('SELECT * FROM public.learning_progress'); } catch { anonBlocked = true; }
verify(anonBlocked, 'anon role cannot read personal progress');
let anonInsertBlocked = false;
try { await sqlDb.query('INSERT INTO public.learning_progress(user_id,progress) VALUES ($1,\'{}\')', [owner]); } catch { anonInsertBlocked = true; }
verify(anonInsertBlocked, 'anon role cannot insert personal progress');
await assume(owner, 'authenticated');
verify((await sqlDb.query('SELECT * FROM public.learning_progress')).rows.length === 1, 'authenticated user can read their own row');
verify((await sqlDb.query('SELECT * FROM public.learning_progress WHERE user_id=$1', [other])).rows.length === 0, 'authenticated user cannot read another account row');
let crossInsertBlocked = false;
try { await sqlDb.query('INSERT INTO public.learning_progress(user_id,progress) VALUES ($1,\'{}\')', [other]); } catch { crossInsertBlocked = true; }
verify(crossInsertBlocked, 'authenticated user cannot insert a row for another account');
await assume(other, 'authenticated');
await sqlDb.query('INSERT INTO public.learning_progress(user_id,progress) VALUES ($1,\'{}\')', [other]);
verify((await sqlDb.query('SELECT * FROM public.learning_progress')).rows.length === 1, 'authenticated user can insert their own row');
await assume(owner, 'authenticated');
verify((await sqlDb.query(`UPDATE public.learning_progress SET language_progress='{"de":{}}'::jsonb WHERE user_id=$1 RETURNING user_id`, [owner])).rows.length === 1, 'authenticated user can update their own language progress');
verify((await sqlDb.query(`UPDATE public.learning_progress SET language_progress='{"de":{}}'::jsonb WHERE user_id=$1 RETURNING user_id`, [other])).rows.length === 0, 'authenticated user cannot update another account row');
let deleteBlocked = false;
try { await sqlDb.query('DELETE FROM public.learning_progress WHERE user_id=$1', [owner]); } catch { deleteBlocked = true; }
verify(deleteBlocked, 'client has no delete grant on progress records');
await sqlDb.close();

console.log(`${checks} checks passed; OTP-gated owner RLS, non-destructive legacy-data preservation, retries and anonymous-session exclusion verified.`);
