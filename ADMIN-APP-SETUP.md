# Milo learner registration and private management app

## Production activation

The APKs must not be distributed until the new Supabase migrations are applied.

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

In Supabase Authentication:

1. Enable Email/Password authentication.
2. Decide whether email confirmation is required. Both modes are supported.
3. Create the one management user from **Authentication > Users** with a strong password.
4. Copy that user's UUID and register it once from the SQL editor:

```sql
insert into public.education_admins (user_id, display_name)
values ('THE-MANAGER-AUTH-UUID', 'مدیر اصلی');
```

The database unique index rejects a second manager. Never put the service-role key or the manager password in either APK or in Git.

## APK roles

- `Milo-English-Turkish-Login.apk` (`com.devicecontrol.miloenglishturkish`): English and Istanbul Turkish only; learner email login/registration is required.
- `Milo-English-Russian-Optional-Login.apk` (`com.devicecontrol.miloenglishrussian`): English and Russian only; learning opens without an account, with an optional **ورود** button for email login/registration and account sync.
- `MiloAdmin.apk` (`com.devicecontrol.miloadmin`): opens the protected manager login and reads the registered-user directory through an authorization-checking RPC.

The manager directory includes account identity, app version, platform, registration time, last activity, and consented learning summaries. It does not expose private chats or personal files.
