// src/components/providers/theme-provider.tsx
'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { THEME_COOKIE_MAX_AGE, THEME_COOKIE_NAME, THEME_STORAGE_KEY, isTheme, resolveTheme, type ResolvedTheme, type Theme } from '@/lib/theme';

type ThemeContextValue = {
  /** User's stored preference: `'light' | 'dark' | 'system'`. */
  theme: Theme;
  /** Concrete theme actually applied to `<html>`: `'light' | 'dark'`. */
  resolvedTheme: ResolvedTheme;
  /** Live `prefers-color-scheme` reading. `null` until first client render. */
  systemPrefersDark: boolean | null;
  /** Update the preference and persist it to cookie + localStorage. */
  setTheme: (next: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';

type Props = {
  /** Server-resolved initial preference (read from the request cookie). */
  initialTheme: Theme;
  /** Server-resolved initial concrete theme (best-effort for system mode). */
  initialResolvedTheme: ResolvedTheme;
  /** Briefly disable CSS transitions when swapping themes. Defaults to true. */
  disableTransitionOnChange?: boolean;
  children: React.ReactNode;
};

function applyThemeToDocument(resolved: ResolvedTheme, preference: Theme): void {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
  root.dataset.theme = preference;
}

function persistThemePreference(theme: Theme): void {
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / disabled storage — cookie is still authoritative.
  }
}

/**
 * Suppress every CSS transition + animation for a single frame. Prevents the
 * smeared mid-transition colours that would otherwise flash when the `<html>`
 * class flips and dozens of tokens change at once.
 */
function suppressTransitionsForOneFrame(): void {
  const style = document.createElement('style');
  style.appendChild(
    document.createTextNode('*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important;}')
  );
  document.head.appendChild(style);
  // Force a reflow so the rule is applied before the class change paints.
  void window.getComputedStyle(document.body);
  window.requestAnimationFrame(() => {
    document.head.removeChild(style);
  });
}

/**
 * App-wide theme provider — fully custom, zero third-party dependency.
 *
 * Architectural notes
 *  - The pre-paint FOUC script lives in the root layout's `<head>` (injected
 *    via `dangerouslySetInnerHTML`); this component never renders a `<script>`
 *    tag itself, which is what removes React 19's "script in component" noise.
 *  - SSR is cookie-aware: the server already applied the right `<html>` class
 *    before this component mounts, so no client-side flicker on hydration.
 *  - System-mode users get live updates from `matchMedia` + cross-tab sync via
 *    the `storage` event.
 */
export function ThemeProvider({ initialTheme, initialResolvedTheme, disableTransitionOnChange = true, children }: Props) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean | null>(initialResolvedTheme === 'dark');
  const isInitialMountRef = useRef(true);

  // Subscribe to OS colour-scheme changes for system-mode users.
  useEffect(() => {
    const mql = window.matchMedia(SYSTEM_DARK_QUERY);
    setSystemPrefersDark(mql.matches);

    function handleChange(event: MediaQueryListEvent) {
      setSystemPrefersDark(event.matches);
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // Cross-tab sync via the storage event — when the user changes the theme in
  // one tab, every other open tab updates without polling.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
        setThemeState(event.newValue);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const resolvedTheme = useMemo<ResolvedTheme>(() => resolveTheme(theme, systemPrefersDark), [theme, systemPrefersDark]);

  // Apply resolved theme to `<html>` whenever it changes. The very first run
  // is a no-op visually because the SSR HTML + FOUC script already applied
  // the same class — we still call it to keep `data-theme` in sync.
  useEffect(() => {
    if (disableTransitionOnChange && !isInitialMountRef.current) {
      suppressTransitionsForOneFrame();
    }
    applyThemeToDocument(resolvedTheme, theme);
    isInitialMountRef.current = false;
  }, [resolvedTheme, theme, disableTransitionOnChange]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    persistThemePreference(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, systemPrefersDark, setTheme }),
    [theme, resolvedTheme, systemPrefersDark, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Read the current theme state. Throws when used outside `ThemeProvider` so
 * integration mistakes surface immediately rather than yielding silent
 * defaults that mask broken UI.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>');
  }
  return ctx;
}
