// src/components/sections/contact.tsx
import { useTranslations } from 'next-intl';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { SectionHeader } from '@/components/ui/section-header';
import { siteConfig } from '@/config/site.config';

/**
 * Editorial contact section. Two columns on lg+:
 *   left  — section header + dedicated info column (channels, hours, address),
 *   right — interactive form (client component).
 */
export function Contact() {
  const t = useTranslations('contact');

  return (
    <section
      id={siteConfig.sections.contact}
      aria-labelledby="contact-title"
      className="relative border-t border-border/60 bg-background py-24 md:py-32 lg:py-40"
    >
      <div className="container-7xl grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-12 lg:col-span-5">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lead={t('lead', { hours: siteConfig.contact.responseHours })}
            headingClassName="max-w-md"
            leadClassName="max-w-md"
          />
          <ContactInfo />
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
