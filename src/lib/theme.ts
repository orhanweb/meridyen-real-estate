// src/lib/theme.ts

/**
 * Cookie + localStorage key under which the user's theme preference is stored.
 * Same name on both surfaces so the FOUC bootstrap script and the React client
 * read from a single source of truth.
 */
export const THEME_COOKIE_NAME = 'theme';
export const THEME_STORAGE_KEY = 'theme';

/** Cookie max-age in seconds — one year. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Theme preference values exposed to the user. */
export const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];

/** Concrete theme actually applied to the document. */
export type ResolvedTheme = 'light' | 'dark';

/** Default preference when the user has never picked one. */
export const DEFAULT_THEME: Theme = 'system';

/**
 * Visual fallback used on the server when the resolved theme cannot be
 * inferred from the cookie alone (i.e. preference is `'system'`). The FOUC
 * bootstrap script corrects the class synchronously before first paint, so
 * this only affects the SSR HTML payload itself.
 */
export const FALLBACK_RESOLVED_THEME: ResolvedTheme = 'light';

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

/**
 * Map a preference + system signal to a concrete `'light' | 'dark'`.
 * On the server the system signal is unknown (`null`) and we return the
 * configured fallback; on the client we pass the live `matchMedia` result.
 */
export function resolveTheme(theme: Theme, systemPrefersDark: boolean | null): ResolvedTheme {
  if (theme === 'light' || theme === 'dark') return theme;
  if (systemPrefersDark === null) return FALLBACK_RESOLVED_THEME;
  return systemPrefersDark ? 'dark' : 'light';
}

/**
 * Inline pre-paint bootstrap script. Lives directly inside `<head>` and runs
 * synchronously before the body paints to set the right theme class on
 * `<html>`. Cookie is the ground truth (mirrors the SSR class), localStorage
 * is a defence-in-depth fallback, and `prefers-color-scheme` resolves
 * `'system'`.
 *
 * Returned as a raw string and injected via `dangerouslySetInnerHTML` so the
 * `<script>` element never enters React's render tree on the client — this
 * is what side-steps React 19's "script tag inside component" warning that
 * `next-themes` triggers on locale-driven re-renders.
 */
export function buildThemeBootstrapScript(): string {
  // Hand-minified IIFE; no optional chaining for maximum runtime portability.
  return [
    '(function(){try{',
    'var d=document.documentElement;',
    `var m=document.cookie.match(/(?:^|; )${THEME_COOKIE_NAME}=([^;]+)/);`,
    'var t=m?decodeURIComponent(m[1]):null;',
    `if(t!=='light'&&t!=='dark'&&t!=='system'){try{t=localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){}}`,
    `if(t!=='light'&&t!=='dark'&&t!=='system'){t='${DEFAULT_THEME}';}`,
    "var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;",
    "d.classList.remove('light','dark');d.classList.add(r);",
    'd.style.colorScheme=r;d.dataset.theme=t;',
    '}catch(e){}})();'
  ].join('');
}
