import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web-only HTML shell for every page (used by `expo start --web` and by the
 * static web export). Native builds never load this file.
 *
 * The app is a Persian RTL app, so the document itself is marked `dir="rtl"`:
 * without it the server-rendered HTML paints LTR until index.js flips
 * `document.documentElement.dir` after hydration. The background colour matches
 * the page background used by the screens (Colors.neutral[950]) so there is no
 * white flash before styles load.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <script dangerouslySetInnerHTML={{ __html: safeStorageBootstrap }} />
        {/* Disables body scrolling so ScrollView behaves like it does on native. */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: pageBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const safeStorageBootstrap = `
(function(){
  try {
    var s = window.localStorage;
    var k = '__milo_ls_probe__';
    s.setItem(k, k);
    s.removeItem(k);
  } catch (e) {
    var m = Object.create(null);
    var shim = {
      get length() { return Object.keys(m).length; },
      key: function(i) { return Object.keys(m)[i] || null; },
      getItem: function(k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
      setItem: function(k, v) { m[String(k)] = String(v); },
      removeItem: function(k) { delete m[String(k)]; },
      clear: function() { m = Object.create(null); }
    };
    try { Object.defineProperty(window, 'localStorage', { configurable: true, get: function() { return shim; } }); } catch (_) {}
  }
})();
`;

const pageBackground = `
body { background-color: #f6f8fb; }
#root { background-color: #f6f8fb; direction: rtl; }
/* Follow each text's own script while keeping the Persian app layout RTL. */
#root [dir="auto"] { text-align: start !important; }
`;
