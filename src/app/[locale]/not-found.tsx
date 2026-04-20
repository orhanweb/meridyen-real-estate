// src/app/[locale]/not-found.tsx
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function LocalizedNotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="container-7xl flex min-h-dvh flex-col items-center justify-center gap-8 py-24 text-center">
      <div className="inline-flex items-center gap-3">
        <span aria-hidden className="h-px w-10 bg-accent" />
        <span className="text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">{t('eyebrow')}</span>
        <span aria-hidden className="h-px w-10 bg-accent" />
      </div>

      <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">{t('title')}</h1>
      <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{t('description')}</p>

      <Button asChild size="lg" variant="primary">
        <Link href="/">
          <ArrowLeft />
          {t('cta')}
        </Link>
      </Button>
    </main>
  );
}
