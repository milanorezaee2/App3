import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
let count = 0;
const check = (value, message) => { assert.ok(value, message); count += 1; };

const gate = read('components/RegistrationGate.tsx');
// The login/registration UI lives in its own presentational component; the
// session logic stays in RegistrationGate, so form assertions read both.
const loginUi = read('components/LoginScreen.tsx');
const loginFlow = gate + loginUi;
const registration = read('lib/userRegistration.ts');
const layout = read('app/_layout.tsx');
const migration = read('supabase/migrations/202610140002_registered_users_admin.sql');
const admin = read('app/admin/index.tsx');
const adminApi = read('lib/educationAdmin.ts');
const appConfig = read('app.config.js');
const workflow = read('.github/workflows/android-build.yml');

check(/<RegistrationGate>/.test(layout), 'learner routes are protected by the registration gate');
check(/signInWithOtp\(/.test(registration) && /verifyOtp\(/.test(registration) && /shouldCreateUser/.test(registration), 'login and registration request and verify real Supabase email OTPs');
check(/full_name/.test(registration) && /completeLearnerProfile/.test(gate), 'registration captures the learner name and repairs older incomplete profiles');
check(/routeToAssessmentEntry/.test(gate) && /writeResumeSnapshot\(\{ version: 1, href: '\/languages'/.test(gate)
  && /router\.replace\('\/languages'/.test(gate) && /PLACEMENT_ENTRY_KEY/.test(gate), 'OTP completion sends learners to the language assessment entry and stores that resume destination');
check(/requestLearnerOtp/.test(gate) && /verifyLearnerOtp/.test(gate) && /onResend/.test(loginFlow), 'the gate separates OTP request, verification, and resend');
check(!/generateLoginCode|signInWithPassword|toAuthPassword/.test(registration + gate), 'the learner gate no longer invents local codes or uses password login');
check(/color: '#102A56'/.test(loginFlow) && /backgroundColor: '#EAF1FA'/.test(loginFlow)
  && /borderColor: '#AFC2D9'/.test(loginFlow) && /placeholderTextColor="#52657D"/.test(loginFlow), 'email and OTP fields use high-contrast text, fill, border and placeholder colors');
check(/KeyboardAvoidingView/.test(loginFlow) && /KeyboardAwareScrollView/.test(loginFlow)
  && /bottomOffset=\{24\}/.test(loginFlow), 'auth screens follow and scroll above the keyboard');
check(/LearnerOtpType = 'email'/.test(registration) && /email_change/.test(registration)
  && /rate limit/.test(registration), 'the learner flow verifies email OTPs, preserves anonymous upgrades and handles Supabase send limits');
check(/app_user_profiles/.test(migration) && /ENABLE ROW LEVEL SECURITY/.test(migration), 'registered profiles are protected by RLS');
check(/user_id = auth\.uid\(\)/.test(migration), 'learners can only access their own profile');
check(/admin_registered_users/.test(migration) && /is_education_admin/.test(migration), 'the registered-user directory verifies server-side manager authorization');
check(/education_admins_single_owner_idx/.test(migration), 'the database enforces one operational manager');
check(/registeredUsers/.test(admin) && /کاربران ثبت‌شده/.test(admin), 'the management UI lists registered learners');
check(/LinearGradient/.test(admin) && /sidebarMobile/.test(admin) && /mobileNavItem/.test(admin) && /navTextActive/.test(admin), 'the management UI keeps a polished responsive sidebar on mobile');
check(!/flexDirection:\s*'column'\s*}\]}[^\n]*sidebar/.test(admin), 'the management navigation does not collapse into top tabs');
check(/sidebarMobile:\{width:90/.test(admin) && /statNumber:\{fontFamily:'Vazir-Bold',fontSize:16/.test(admin) && /borderRadius:15,padding:12,gap:10/.test(admin), 'all management tabs keep a compact mobile density and smaller Vazir numbers');
check(/admin_registered_users/.test(adminApi), 'the management client loads the protected directory RPC');
check(/com\.devicecontrol\.miloadmin/.test(appConfig) && /com\.devicecontrol\.companion/.test(read('app.json')), 'learner and management APKs have separate Android package IDs');
check(/MiloAdmin\.apk/.test(workflow) && /MiloMultilang\.apk/.test(workflow), 'CI builds and publishes both standalone APKs');
check(/EXPO_PUBLIC_MILO_ADMIN_APP/.test(read('app/index.tsx')), 'the management APK boots directly into its protected panel');
check(/پیام‌های خصوصی/.test(loginFlow) && /پیام‌های خصوصی/.test(admin), 'both apps disclose and preserve private-message boundaries');
check(/learnerLogin: true/.test(read('lib/features.ts')), 'learner routes keep the requested login gate enabled');
check(/MiloMultilang-Login\.apk/.test(workflow) && /EXPO_PUBLIC_LEARNER_LOGIN=true/.test(workflow), 'CI builds and publishes the learner login APK');
check(/com\.devicecontrol\.milomultilang/.test(appConfig) && /name: 'MiloMultiLanguage Admin'/.test(appConfig), 'login APK keeps its own package and management branding includes MiloMultiLanguage');
check(/is_education_admin/.test(read('supabase/functions/admin-delete-user/index.ts')) && /deleteUser\(/.test(read('supabase/functions/admin-delete-user/index.ts')), 'account deletion is manager-only and runs on the server');
check(/deleteRegisteredUser/.test(read('app/admin/index.tsx')) && /downloadRegisteredUsers/.test(read('app/admin/index.tsx')), 'manager app can delete users and export users');
check(/MANAGEMENT_BUILD \? adminClient\(\) : supabase/.test(read('lib/conversations.ts')), 'the manager APK sends chat as the manager, not an anonymous learner');
check(/Intentionally silent/.test(read('lib/responsiveSpeech.ts')) && !/Speech\.speak\(locale/.test(read('lib/responsiveSpeech.ts')), 'startup warm-up never speaks words aloud');
check(/welcome-chime\.wav/.test(read('app/_layout.tsx')), 'the original startup sound is kept');
check(/ensureSupportConversation/.test(read('app/languages.tsx')) && /ensureSupportConversation/.test(read('app/conversations/index.tsx')), 'learners reach the manager through the support button');
check(/MiloLogoMotion/.test(read('app/_layout.tsx')) && /MiloLogoMotion/.test(read('app/languages.tsx')), 'the Milo logo motion is used in the intro and the home header');
check(/welcome-voice\.wav/.test(read('app/languages.tsx')) && /welcome-chime\.wav/.test(read('app/_layout.tsx')), 'Welcome plays on the main screen and the startup sound is kept');
console.log(`${count} registration and private management checks passed.`);
