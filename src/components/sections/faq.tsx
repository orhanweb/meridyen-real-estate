// src/components/sections/faq.tsx
import { useTranslations } from 'next-intl';
import { Accordion, type AccordionItem } from '@/components/ui/accordion';
import { SectionHeader } from '@/components/ui/section-header';
import { siteConfig } from '@/config/site.config';

/**
 * Editorial FAQ — sticky header column on the left, accordion on the right.
 * Server component prepares translated items and hands them to the client
 * Accordion primitive; the rest of the section renders on the server.
 */
export function Faq() {
  const t = useTranslations('faq');

  const items: AccordionItem[] = siteConfig.faq.map(id => ({
    id,
    question: t(`items.${id}.question`),
    answer: t(`items.${id}.answer`)
  }));

  return (
    <section id={siteConfig.sections.faq} aria-labelledby="faq-title" className="relative bg-muted/40 py-24 md:py-32 lg:py-40">
      <div className="container-7xl grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left — sticky section header */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} headingClassName="max-w-md" leadClassName="max-w-md" />
          </div>
        </div>

        {/* Right — accordion */}
        <div className="lg:col-span-7">
          <Accordion items={items} type="single" />
        </div>
      </div>
    </section>
  );
}
