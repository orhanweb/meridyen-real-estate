// src/components/contact/contact-info.tsx
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/cn';

/**
 * Editorial info column for the contact section. Pure presentational server
 * component — surfaces the fastest channels (phone / WhatsApp / email),
 * office hours, address, and the social row.
 */
export function ContactInfo() {
  const t = useTranslations('contact.info');

  const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, '')}`;
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}`;
  const emailHref = `mailto:${siteConfig.contact.email}`;

  const channels = [
    { id: 'phone', icon: Phone, label: t('callLabel'), value: siteConfig.contact.phoneFormatted, href: phoneHref, external: false },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: t('whatsappLabel'),
      value: siteConfig.contact.whatsappFormatted,
      href: whatsappHref,
      external: true
    },
    { id: 'email', icon: Mail, label: t('emailLabel'), value: siteConfig.contact.email, href: emailHref, external: false }
  ] as const;

  return (
    <div className="flex flex-col gap-10">
      {/* Response promise */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">{t('responseTitle')}</p>
        <p className="mt-3 font-mono text-2xl font-medium text-foreground">{t('responseValue', { hours: siteConfig.contact.responseHours })}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t('responseHint')}</p>
      </div>

      {/* Direct channels */}
      <div className="flex flex-col gap-4">
        <SectionLabel>{t('channelsTitle')}</SectionLabel>
        <ul className="flex flex-col gap-2">
          {channels.map(channel => (
            <li key={channel.id}>
              <a
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'group flex items-center gap-4 rounded-lg border border-transparent p-3 -mx-3',
                  'transition-[background-color,border-color] duration-200 ease-out-expo',
                  'hover:border-border hover:bg-muted/60'
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors group-hover:border-accent group-hover:text-accent"
                >
                  <channel.icon className="size-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{channel.label}</span>
                  <span className="text-sm font-medium text-foreground">{channel.value}</span>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-auto size-4 -translate-x-1 -translate-y-1 text-muted-foreground opacity-0 transition-all duration-200 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Hours + address — stacked at every viewport.
          The mobile layout (full-width horizontal definition rows) reads
          best across breakpoints, so we keep that single layout instead of
          splitting into two columns at sm+. The latter halved the column
          and forced the hours rows to wrap. */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <SectionLabel>
            <Clock className="size-3.5" aria-hidden="true" /> {t('hoursTitle')}
          </SectionLabel>
          <dl className="flex flex-col gap-2 text-sm">
            <HoursRow label={t('hoursWeekdays')} value={siteConfig.contact.hours.weekdays} />
            <HoursRow label={t('hoursSaturday')} value={siteConfig.contact.hours.saturday} />
            <HoursRow label={t('hoursSunday')} value={siteConfig.contact.hours.sunday ?? t('hoursClosed')} muted={!siteConfig.contact.hours.sunday} />
          </dl>
        </div>

        <div className="flex flex-col gap-3">
          <SectionLabel>
            <MapPin className="size-3.5" aria-hidden="true" /> {t('addressTitle')}
          </SectionLabel>
          <p className="text-sm font-medium text-foreground">{siteConfig.location.addressLine}</p>
          <a
            href={siteConfig.location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 text-xs font-medium text-accent underline-offset-4 hover:underline"
          >
            {t('openInMaps')}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">{children}</span>
  );
}

/**
 * Horizontal definition row — label on the left, value on the right, with
 * a hairline rule below. Same layout at every viewport because the parent
 * column is now always full-width.
 */
function HoursRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-1.5 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('font-mono tabular-nums text-sm', muted ? 'text-muted-foreground/70' : 'text-foreground')}>{value}</dd>
    </div>
  );
}
