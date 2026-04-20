// src/components/sections/regions.tsx
import { useTranslations } from 'next-intl';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { RegionCard } from '@/components/cards/region-card';
import { SectionHeader } from '@/components/ui/section-header';
import { siteConfig } from '@/config/site.config';

/**
 * "Regions we cover" — editorial dark-spotlight section.
 *
 * Wrapped in `dark` to invert the OKLCH tokens locally; the rest of the page
 * stays in the user's chosen theme. Creates a single high-contrast moment
 * mid-page (about → services → REGIONS → testimonials → ...) without dragging
 * the global theme into a heavier mood.
 *
 * Card visuals + hover sync (image scale + chrome lift on the same Framer
 * variant tree) live in `RegionCard`; this component is layout only.
 */
export function Regions() {
  const t = useTranslations('regions');
  const regions = siteConfig.regions;
  const total = regions.length;

  return (
    <section
      id={siteConfig.sections.regions}
      aria-labelledby="regions-title"
      className="dark relative bg-background py-24 text-foreground md:py-32 lg:py-40"
    >
      {/* Decorative top-right accent glow — anchors the dark mood. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_85%_-10%,oklch(from_var(--color-accent)_l_c_h/0.18),transparent_55%)]"
      />

      <div className="container-7xl relative">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} headingClassName="max-w-3xl" leadClassName="max-w-2xl" />

        <Stagger delayChildren={0.4} staggerChildren={0.1} amount={0.15} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((id, i) => (
            <StaggerItem key={id}>
              <RegionCard id={id} index={i + 1} total={total} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
