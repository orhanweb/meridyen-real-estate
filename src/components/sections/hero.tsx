// src/components/sections/hero.tsx
import { ArrowRight, MoveDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { FadeIn } from '@/components/motion/fade-in';
import { Parallax } from '@/components/motion/parallax';
import { RevealText } from '@/components/motion/reveal-text';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import { siteConfig } from '@/config/site.config';

/**
 * Editorial full-bleed hero. Cinematic background with parallax + scale,
 * monumental brand wordmark, mask-revealed display headline, stats strip,
 * and scroll cue. The filled accent wordmark anchors the composition while
 * staying subordinate to the cream-foreground headline beneath it.
 */
export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  /** Locale-aware uppercase keeps Turkish casing correct (dotted İ). */
  const brandWordmark = siteConfig.brand.shortName.toLocaleUpperCase(locale);

  return (
    <section id="main" aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Background image with scroll-driven parallax + scale */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <Parallax offset={140} scale={1.12}>
          <Image
            src={siteConfig.assets.hero.src}
            alt={siteConfig.assets.hero.alt}
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
        </Parallax>
      </div>

      {/* Layered overlays — directional gradient + bottom fade into background */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-br from-background/85 via-background/60 to-background/30" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-background via-background/85 to-transparent" />
      {/* Subtle film grain via radial — keeps imagery from looking flat */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-40 mix-blend-overlay [background:radial-gradient(circle_at_30%_20%,oklch(from_var(--color-accent)_l_c_h/0.18),transparent_55%)]"
      />

      {/* Content */}
      <div className="container-7xl relative flex flex-1 flex-col justify-center pt-32 pb-24 md:pt-40 md:pb-32">
        <FadeIn delay={0.05} duration={0.8}>
          <div className="mb-6 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-accent" />
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">{t('eyebrow')}</span>
          </div>
        </FadeIn>

        {/* Brand seal lockup — solid accent wordmark + hairline rule. The
            gold fill gives the wordmark presence without competing with the
            cream-foreground headline below; the rule reads as a "stamp" that
            anchors the lockup to the eyebrow's accent line above. Capped at
            5rem so the headline (max 6rem) remains the dominant value prop. */}
        <FadeIn delay={0.18} duration={0.85}>
          <div className="brand-display mb-7 flex max-w-5xl flex-col items-start">
            <p className="select-none font-semibold leading-[0.92] tracking-[0.05em] text-[clamp(2rem,6.5vw,5rem)]">{brandWordmark}</p>
            <span aria-hidden className="mt-4 block h-px w-24 bg-current opacity-70 sm:w-32" />
          </div>
        </FadeIn>

        <RevealText
          as="h1"
          className="block max-w-5xl text-balance font-semibold leading-[1.02] tracking-tight text-foreground text-[clamp(2.75rem,7vw,6rem)]"
          delay={0.32}
        >
          {t('title')}
        </RevealText>

        <FadeIn delay={0.6} duration={0.8}>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">{t('subtitle')}</p>
        </FadeIn>

        <FadeIn delay={0.75} duration={0.8}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="xl" variant="primary">
              <a href={`#${siteConfig.sections.contact}`}>
                {t('primaryCta')}
                <ArrowRight />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href={`#${siteConfig.sections.services}`}>{t('secondaryCta')}</a>
            </Button>
          </div>
        </FadeIn>

        {/* Stats strip — Stagger orchestrates fade-in; Counters share the same
            delay timing so the count animation runs *with* each item, not before. */}
        <Stagger delayChildren={0.95} staggerChildren={0.18} amount={0.3} className="mt-20 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {(
            [
              { value: siteConfig.stats.yearsOfExperience, suffix: '+', label: t('stats.experience') },
              { value: siteConfig.stats.propertiesSold, suffix: '+', label: t('stats.transactions') },
              { value: siteConfig.stats.happyClientsPercent, suffix: '%', label: t('stats.satisfaction') }
            ] as const
          ).map((stat, i) => (
            <StaggerItem key={stat.label} className="border-l border-accent/60 pl-5">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                amount={0.3}
                duration={2.6}
                delay={0.95 + i * 0.18}
                className="block text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
              />
              <p className="mt-2 text-sm tracking-wide text-muted-foreground">{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Scroll cue */}
      <FadeIn
        delay={1.2}
        duration={0.8}
        className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto flex w-fit items-center gap-2 text-xs uppercase tracking-[0.32em] text-muted-foreground"
      >
        <MoveDown className="size-3 animate-bounce" />
        <span>{t('scrollHint')}</span>
      </FadeIn>
    </section>
  );
}
