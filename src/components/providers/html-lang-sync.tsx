// src/components/providers/html-lang-sync.tsx
'use client';

import { useEffect } from 'react';

type Props = {
  /** Active locale for the current route. */
  locale: string;
};

/**
 * Keeps `<html lang>` in sync with the current locale on the client.
 *
 * The root layout renders `<html lang>` from a static default because it sits
 * above the `[locale]` segment and cannot read the per-request locale without
 * opting the entire tree into dynamic rendering (which would forfeit SSG).
 * This effect patches the attribute on every locale change so screen readers
 * and `:lang()` selectors stay accurate after hydration.
 */
export function HtmlLangSync({ locale }: Props) {
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
