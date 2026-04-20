// src/lib/theme-server.ts
import 'server-only';

import { cookies } from 'next/headers';
import { DEFAULT_THEME, THEME_COOKIE_NAME, isTheme, resolveTheme, type ResolvedTheme, type Theme } from './theme';

/**
 * Read the theme preference from the incoming request cookie. Falls back to
 * `DEFAULT_THEME` ('system') when no valid cookie is present so first-time
 * visitors enter the system-preference path.
 */
export async function readThemeFromCookie(): Promise<Theme> {
  const store = await cookies();
  const value = store.get(THEME_COOKIE_NAME)?.value;
  return isTheme(value) ? value : DEFAULT_THEME;
}

/**
 * Best-effort resolved theme on the server: explicit `'light'`/`'dark'`
 * preferences resolve to themselves; `'system'` collapses to the configured
 * fallback because the OS preference is not visible to the server. The FOUC
 * bootstrap script always corrects the class before first paint.
 */
export async function readResolvedThemeFromCookie(): Promise<ResolvedTheme> {
  const theme = await readThemeFromCookie();
  return resolveTheme(theme, null);
}
