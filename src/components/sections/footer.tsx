// src/components/sections/footer.tsx
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ComponentType, SVGProps } from 'react';
import { BrandMark } from '@/components/ui/brand-mark';
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from '@/components/ui/brand-icons';
import { siteConfig } from '@/config/site.config';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

const NAV_KEYS = ['about', 'services', 'regions', 'testimonials', 'faq', 'contact'] as const;
const LEGAL_LINKS = [
  { key: 'privacy', href: '/privacy' },
  { key: 'cookies', href: '/cookies' },
  { key: 'terms', href: '/terms' }
] as const;

type GlyphComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Editorial site footer.
 *  - Four-column on lg+, single-column stacked on mobile.
 *  - Mirrors header nav (anchor links) and contact-info channels for instant
 *    parity, but reorganised into the visual rhythm of a footer.
 *  - Pure server component: no JS, no client effects. Hover micro-interactions
 *    are CSS-only to keep the route lean and Lighthouse-clean.
 *  - White-label: legal links resolve to '#' placeholders, designer credit is
 *    toggled by `siteConfig.designer.enabled` per deployment.
 */
export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();
  const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, '')}`;
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}`;
  const emailHref = `mailto:${siteConfig.contact.email}`;

  return (
    <footer className="relative border-t border-border/60 bg-surface text-foreground">
      <div className="container-7xl py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <BrandMark variant="full" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t('pitch')}</p>

            <div className="flex flex-col gap-3 pt-2">
              <ColumnLabel>{t('social.follow')}</ColumnLabel>
              <div className="flex items-center gap-2">
                <SocialIcon href={siteConfig.social.instagram} label="Instagram" icon={InstagramIcon} />
                <SocialIcon href={siteConfig.social.linkedin} label="LinkedIn" icon={LinkedinIcon} />
                <SocialIcon href={siteConfig.social.youtube} label="YouTube" icon={YoutubeIcon} />
              </div>
            </div>
          </div>

          {/* Site map */}
          <nav aria-label="Footer" className="flex flex-col gap-4 lg:col-span-2">
            <ColumnLabel>{t('columns.explore')}</ColumnLabel>
            <ul className="flex flex-col gap-2.5">
              {NAV_KEYS.map(key => (
                <li key={key}>
                  <a href={`#${siteConfig.sections[key]}`} className="footer-link">
                    {tNav(key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <ColumnLabel>{t('columns.contact')}</ColumnLabel>
            <ul className="flex flex-col gap-3 text-sm">
              <ContactRow icon={Phone} href={phoneHref} value={siteConfig.contact.phoneFormatted} />
              <ContactRow icon={MessageCircle} href={whatsappHref} value={siteConfig.contact.whatsappFormatted} external />
              <ContactRow icon={Mail} href={emailHref} value={siteConfig.contact.email} />
              <ContactRow icon={MapPin} href={siteConfig.location.googleMapsUrl} value={siteConfig.location.addressLine} external />
            </ul>
          </div>

          {/* Legal column */}
          <nav aria-label="Legal" className="flex flex-col gap-4 lg:col-span-3">
            <ColumnLabel>{t('columns.legal')}</ColumnLabel>
            <ul className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map(link => (
                <li key={link.key}>
                  <Link href={link.href} className="footer-link">
                    {t(`legal.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom strip — row layout kicks in at the smallest width that
          comfortably fits the legal block + designer pill side by side
          (custom 896px breakpoint, between md and lg). Below that, both
          stack and the pill is centered on its own row. */}
      <div className="border-t border-border/60">
        <div
          className={cn(
            'container-7xl flex flex-col gap-4 py-6',
            'min-[896px]:flex-row min-[896px]:items-center min-[896px]:justify-between min-[896px]:gap-6'
          )}
        >
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <p>
              © {year} {siteConfig.brand.legalEntity}. {t('bottom.rights')}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground/80">
              {t('bottom.mersis')}: {siteConfig.legal.mersis} · {t('bottom.taxOffice')}: {siteConfig.legal.taxOffice} · {siteConfig.legal.taxNumber}
            </p>
          </div>

          {siteConfig.designer.enabled ? (
            <a
              href={siteConfig.designer.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t('bottom.designerPrefix')}: ${siteConfig.designer.name}`}
              className={cn(
                /* Single source of truth for pill size: ONE clamped font-size.
                   Padding, gap and inner labels are all expressed in em so they
                   ride the same scale — when the font shrinks, the whole chip
                   shrinks proportionally as one piece. */
                'group inline-flex max-w-full shrink items-center gap-[0.6em] self-center whitespace-nowrap rounded-full',
                'border border-border/70 bg-background/40',
                'px-[1.35em] py-[0.65em]',
                'text-[clamp(0.625rem,0.55rem+0.3vw,0.75rem)] text-foreground/90',
                'transition-colors duration-200 hover:border-accent hover:text-accent min-[896px]:self-auto',
                'pulse-heartbeat'
              )}
            >
              <span className="text-[0.85em] font-semibold uppercase tracking-[0.22em] leading-none text-muted-foreground transition-colors group-hover:text-accent/80">
                {t('bottom.designerPrefix')}
              </span>
              <span className="font-medium leading-none">{siteConfig.designer.name}</span>
              <ArrowUpRight
                aria-hidden="true"
                className={cn(
                  'size-[1.15em] -translate-x-0.5 -translate-y-0.5 opacity-70',
                  'transition-transform duration-200 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100'
                )}
              />
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">{children}</span>;
}

function ContactRow({ icon: Icon, href, value, external = false }: { icon: GlyphComponent; href: string; value: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="group inline-flex items-start gap-3 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background/60 text-muted-foreground',
            'transition-colors duration-200 group-hover:border-accent group-hover:text-accent'
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <span className="leading-relaxed">{value}</span>
      </a>
    </li>
  );
}

function SocialIcon({ href, label, icon: Icon }: { href: string; label: string; icon: GlyphComponent }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-md border border-border/70 bg-background/60 text-muted-foreground',
        'transition-colors duration-200 hover:border-accent hover:text-accent'
      )}
    >
      <Icon className="size-4" />
    </a>
  );
}
