// src/components/ui/locale-toggle.tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/cn';

/** Minimal TR/EN switcher. Preserves current pathname. */
export function LocaleToggle() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div role="group" aria-label={t('languageToggle')} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface/50 p-1">
      {routing.locales.map(loc => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            disabled={isPending || isActive}
            onClick={() =>
              startTransition(() => {
                router.replace(pathname, { locale: loc });
              })
            }
            className={cn(
              'h-7 rounded-sm px-2 text-xs font-medium uppercase tracking-wider',
              'transition-colors duration-200',
              isActive ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
