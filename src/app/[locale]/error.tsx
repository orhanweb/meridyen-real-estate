// src/app/[locale]/error.tsx
'use client';

import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Locale-aware route error boundary. Caught by Next when any child route
 * throws. Logs the error to the console (also surfaces via Vercel runtime
 * logs in production) and offers retry + home actions.
 */
export default function LocalizedError({ error, reset }: Props) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error('[route-error]', error);
  }, [error]);

  return (
    <main className="container-7xl flex min-h-dvh flex-col items-center justify-center gap-8 py-24 text-center">
      <div className="inline-flex items-center gap-3">
        <span aria-hidden className="h-px w-10 bg-accent" />
        <span className="text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">{t('eyebrow')}</span>
        <span aria-hidden className="h-px w-10 bg-accent" />
      </div>

      <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight md:text-5xl">{t('title')}</h1>
      <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{t('description')}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} size="lg" variant="primary">
          <RotateCcw />
          {t('retry')}
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <ArrowLeft />
            {t('home')}
          </Link>
        </Button>
      </div>

      {error.digest ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground/70">
          {t('digestPrefix')}: {error.digest}
        </p>
      ) : null}
    </main>
  );
}
