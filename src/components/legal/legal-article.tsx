// src/components/legal/legal-article.tsx
import { ArrowLeft, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Section = {
  heading: string;
  paragraphs: readonly string[];
};

type Props = {
  /** Sub-namespace under `legal.*`, e.g. `'privacy'`, `'cookies'`, `'terms'`. */
  slug: 'privacy' | 'cookies' | 'terms';
};

/**
 * Renders an editorial-style legal article from the `legal.<slug>` namespace.
 * Server component: no client JS, fully static, indexable.
 */
export function LegalArticle({ slug }: Props) {
  const t = useTranslations('legal');
  const tPage = useTranslations(`legal.${slug}`);
  const sections = tPage.raw('sections') as readonly Section[];

  return (
    <article className="container-7xl py-24 md:py-32 lg:py-40">
      <div className="mx-auto flex max-w-3xl flex-col">
        {/* Back link */}
        <Link
          href="/"
          className="group mb-10 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:-translate-x-1" />
          {t('backToHome')}
        </Link>

        {/* Title block */}
        <header className="flex flex-col gap-6 border-b border-border pb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">{t('lastUpdated')}</p>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {tPage('title')}
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{tPage('lead')}</p>

          {/* Template notice — visible reminder for whoever owns the deploy. */}
          <div className="mt-2 flex items-start gap-3 rounded-md border border-border/70 bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            <p>{t('templateNotice')}</p>
          </div>
        </header>

        {/* Body sections */}
        <div className="mt-12 flex flex-col gap-12 md:gap-14">
          {sections.map(section => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground md:text-2xl">{section.heading}</h2>
              <div className="flex flex-col gap-4 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base md:leading-[1.7]">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
