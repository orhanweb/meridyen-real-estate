// src/components/ui/theme-toggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/components/providers/theme-provider';
import { Button } from './button';

/**
 * Single-tap theme toggle. Switches between explicit `'light'` and `'dark'`
 * preferences based on what is currently resolved on the document. The
 * cookie-aware SSR means `resolvedTheme` is correct from the very first
 * paint, so no `mounted` guard or skeleton swap is needed.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('nav');
  const isDark = resolvedTheme === 'dark';

  return (
    <Button type="button" variant="ghost" size="icon" aria-label={t('themeToggle')} onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
