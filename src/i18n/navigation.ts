// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation primitives.
 * Always import `Link`, `redirect`, `usePathname`, `useRouter` from here
 * to keep locale prefixes (`as-needed`) correct across navigation.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
