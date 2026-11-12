import { FEATURES } from '@/lib/features';
import { Redirect, Slot } from 'expo-router';
import { AdminShell } from '@/features/admin/Shell';
import { AdminProvider } from '@/features/admin/store';

/** Management panel: provider + shell (sidebar on wide screens, tabs on phones). */
export default function AdminLayout() {
  if (!FEATURES.adminPanel) return <Redirect href={'/languages' as never} />;
  return (
    <AdminProvider>
      <AdminShell><Slot /></AdminShell>
    </AdminProvider>
  );
}
