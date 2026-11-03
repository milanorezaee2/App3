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
      html, body { background: #F5F4EF !important; }
      body { margin: 0 !important; }
      #root { min-height: 100vh; background: radial-gradient(circle at 92% 0%, rgba(180,154,112,.08), transparent 28rem), radial-gradient(circle at 0% 88%, rgba(114,141,117,.09), transparent 24rem), #F5F4EF !important; }
      #root > div { min-height: 100vh; max-width: 1180px; margin: 0 auto; background: #F5F4EF; box-shadow: 0 0 60px rgba(41,54,47,.07); }
      [role="button"] { transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease !important; }
      [role="button"]:hover { transform: translateY(-1px); }
      input, textarea { outline: none !important; }
      ::selection { background: #E4ECE4; color: #29362F; }
      ::-webkit-scrollbar { width: 9px; }
      ::-webkit-scrollbar-thumb { background: #BEC2BA; border-radius: 999px; border: 3px solid #F5F4EF; }
    ` : '';
    return () => { if (style) style.textContent = ''; };
  }, []);
  return null;
}
