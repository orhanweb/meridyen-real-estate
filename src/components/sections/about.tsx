// src/components/sections/about.tsx
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FadeIn } from '@/components/motion/fade-in';
import { Parallax } from '@/components/motion/parallax';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { SectionHeader } from '@/components/ui/section-header';
import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/cn';

/**
 * Editorial "About" section. Two layers:
 *   1. Two-column narrative — image (left) + header & paragraphs (right).
 *   2. Full-width credentials strip — institutional facts laid out edge-
 *      to-edge across the container, separated from the narrative by a
 *      hairline. Founded year is the dominant display value; the others
 *      sit at body scale. Pattern borrowed from editorial corporate sites
 *      (Bloomberg, Pentagram) where stats earn the page's full width
 *      rather than being squeezed into a copy column.
 */
export function About() {
  const t = useTranslations('about');

  const facts = [
    { key: 'founded', value: String(siteConfig.brand.foundedYear) },
    { key: 'office', value: siteConfig.location.addressLine },
    { key: 'team', value: t('factsValues.team') },
    { key: 'languages', value: t('factsValues.languages') }
  ] as const;

  return (
    <section
      id={siteConfig.sections.about}
      aria-labelledby="about-title"
      className="relative border-b border-border/60 bg-background py-24 md:py-32 lg:py-40"
    >
      {/* Narrative — image + header + paragraphs */}
      <div className="container-7xl grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Image column */}
        <div className="lg:col-span-5">
          <FadeIn duration={0.9} amount={0.2}>
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Parallax offset={60} scale={1.06}>
                <Image
                  src={siteConfig.assets.about.src}
                  alt={t('imageAlt')}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  quality={85}
                  className="object-cover"
                />
              </Parallax>

              {/* Subtle bottom gradient — keeps the EST. badge legible. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background/70 via-background/20 to-transparent"
              />

              {/* EST. badge — anchors the image with brand authority. */}
              <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-md border border-border/80 bg-background/85 px-4 py-2 backdrop-blur-md">
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">Est.</span>
                <span className="font-mono text-sm font-medium text-foreground">{siteConfig.brand.foundedYear}</span>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Content column */}
        <div className="lg:col-span-7 lg:pl-4">
          <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} headingClassName="max-w-2xl" leadClassName="max-w-2xl" />

          <FadeIn delay={0.6} duration={0.8} amount={0.3}>
            <div className="mt-10 grid max-w-2xl gap-6 text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">
              <p>{t('paragraph1')}</p>
              <p>{t('paragraph2')}</p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Credentials strip — full container width.
          Mobile: single column definition list. Each fact stacks label-over-value
          in its own row, separated by a hairline rule. Guarantees zero text wrap
          regardless of viewport, and reads as a formal list — appropriate for
          credentials.
          md+: 1×4 grid with vertical hairline dividers between columns. Founded
          year scales up to a display number; the other facts stay at body scale.
          Sans-serif with tabular-nums so digits align without the cold mono tone. */}
      <div className="container-7xl mt-20 border-t border-border pt-12 md:mt-28 md:pt-16 lg:mt-32">
        <Stagger delayChildren={0.2} staggerChildren={0.1} amount={0.4} className="grid grid-cols-1 md:grid-cols-4 md:divide-x md:divide-border">
          {facts.map((fact, i) => {
            const isFounded = i === 0;

            return (
              <StaggerItem
                key={fact.key}
                className={cn(
                  'flex flex-col gap-4',
                  // Mobile: hairline rule under each row, last row clean
                  'border-b border-border/60 pb-10 last:border-b-0 last:pb-0',
                  // md+: dividers handled by parent's divide-x; reset row spacing
                  'md:border-b-0 md:pb-0',
                  // md+: per-column padding so values breathe inside divider gaps
                  'md:px-8 md:first:pl-0 md:last:pr-0'
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{t(`facts.${fact.key}`)}</span>

                <span
                  className={cn(
                    'tabular-nums tracking-tight text-foreground',
                    // Mobile baseline — uniform body scale across the list
                    'text-xl font-medium leading-snug',
                    // md+: founded scales to display, others stay body
                    isFounded ? 'md:text-4xl md:font-light md:leading-none lg:text-[2.75rem]' : 'md:text-xl'
                  )}
                >
                  {fact.value}
                </span>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
