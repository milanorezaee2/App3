import { useEffect } from 'react';
import { Platform } from 'react-native';
import { DESIGN_VARIANT } from '@/lib/theme';

/** Web-only chrome for the opt-in redesign; native screens keep their own layout. */
export function DesignVariantStyles() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.dataset.design = DESIGN_VARIANT;
    const id = 'milo-design-variant';
    let style = document.getElementById(id) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = DESIGN_VARIANT === 'learner-v2' ? `
      :root { color-scheme: light; }
      body { background: #F8FAFF !important; }
      ::selection { background: #D8D5FF; color: #211A68; }
      ::-webkit-scrollbar { width: 9px; }
      ::-webkit-scrollbar-thumb { background: #C7CFDB; border-radius: 999px; border: 3px solid #F8FAFF; }
    ` : '';
    return () => { if (style) style.textContent = ''; };
  }, []);
  return null;
}
