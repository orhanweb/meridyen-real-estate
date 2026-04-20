// src/components/sections/services.tsx
import { useTranslations } from 'next-intl';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { ServiceCard } from '@/components/cards/service-card';
import { SectionHeader } from '@/components/ui/section-header';
import { siteConfig } from '@/config/site.config';

/**
 * Editorial services grid. Layout + reveal orchestration only — the
 * card visuals, hover behaviour and icon mapping live in `ServiceCard`.
 *
 * Why no icon prop here: icons are React component functions, and
 * functions cannot cross the Server → Client boundary in React Server
 * Components. Sending plain string IDs keeps this section RSC-safe and
 * lets `ServiceCard` resolve the icon on the client side.
 */
export function Services() {
  const t = useTranslations('services');
  const services = siteConfig.services;
  const total = services.length;

  return (
    <section id={siteConfig.sections.services} aria-labelledby="services-title" className="relative bg-muted/40 py-24 md:py-32 lg:py-40">
      <div className="container-7xl">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} headingClassName="max-w-3xl" leadClassName="max-w-2xl" />

        <Stagger delayChildren={0.4} staggerChildren={0.1} amount={0.15} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((id, i) => (
            <StaggerItem key={id}>
              <ServiceCard id={id} index={i + 1} total={total} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
