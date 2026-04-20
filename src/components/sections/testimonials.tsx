// src/components/sections/testimonials.tsx
import { useTranslations } from 'next-intl';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { SectionHeader } from '@/components/ui/section-header';
import { siteConfig } from '@/config/site.config';

/**
 * "Testimonials" — editorial 2x2 quote grid.
 *
 * Deliberate choice over a carousel: in a luxury/advisory positioning, silent
 * editorial typography reads as more credible than auto-rotating motion. All
 * quotes are visible at once; the visitor can scan and stop on whichever
 * persona matches them (architect, investor, first-time buyer, business owner).
 *
 * Card visuals + hover behaviour live in `TestimonialCard`; this section is
 * layout + reveal orchestration only.
 */
export function Testimonials() {
  const t = useTranslations('testimonials');
  const items = siteConfig.testimonials;

  return (
    <section
      id={siteConfig.sections.testimonials}
      aria-labelledby="testimonials-title"
      className="relative border-b border-border/60 bg-background py-24 md:py-32 lg:py-40"
    >
      <div className="container-7xl">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} headingClassName="max-w-3xl" leadClassName="max-w-2xl" />

        <Stagger delayChildren={0.4} staggerChildren={0.15} amount={0.15} className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {items.map(id => (
            <StaggerItem key={id}>
              <TestimonialCard id={id} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
