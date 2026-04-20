// src/components/sections/header.tsx
'use client';

import { Menu, Phone, X } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { BrandMark } from '@/components/ui/brand-mark';
import { Button } from '@/components/ui/button';
import { LocaleToggle } from '@/components/ui/locale-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/cn';

const NAV_KEYS = ['about', 'services', 'regions', 'testimonials', 'faq', 'contact'] as const;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Sticky, scroll-aware header. Transparent over hero, gains backdrop blur
 * once the user scrolls. Includes mobile drawer.
 */
export function Header() {
  const t = useTranslations('nav');
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useMotionValueEvent(scrollY, 'change', latest => {
    setScrolled(latest > 24);
  });

  /** Body scroll lock + focus trap + Escape-to-close while drawer is open. */
  useEffect(() => {
    if (!open) {
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
      return;
    }

    restoreFocusRef.current = triggerRef.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const drawer = drawerRef.current;
    const focusables = drawer ? Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    focusables[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
      >
        {t('skipToContent')}
      </a>

      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'oklch(from var(--color-background) l c h / 0.78)' : 'transparent',
          borderColor: scrolled ? 'oklch(from var(--color-border) l c h / 0.6)' : 'oklch(from var(--color-border) l c h / 0)',
          boxShadow: scrolled ? '0 1px 0 0 oklch(from var(--color-border) l c h / 0.4)' : '0 0 0 0 transparent'
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn('fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md supports-backdrop-filter:bg-transparent', 'transition-[backdrop-filter]')}
      >
        <div className="container-7xl flex h-(--header-height) items-center justify-between gap-4">
          <BrandMark />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV_KEYS.map(key => (
              <a
                key={key}
                href={`#${siteConfig.sections[key]}`}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground',
                  'transition-colors duration-200 hover:text-foreground'
                )}
              >
                {t(key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <LocaleToggle />
              <ThemeToggle />
            </div>
            <Button asChild size="sm" variant="primary" className="hidden sm:inline-flex">
              <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}>
                <Phone />
                {t('callNow')}
              </a>
            </Button>
            <Button
              ref={triggerRef}
              variant="ghost"
              size="icon"
              aria-label={open ? t('closeMenu') : t('openMenu')}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen(v => !v)}
              className="lg:hidden"
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <motion.div
        ref={drawerRef}
        id="mobile-drawer"
        initial={false}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className={cn(
          'fixed inset-y-0 right-0 z-40 flex w-full flex-col gap-1',
          'sm:max-w-sm sm:border-l sm:border-border',
          'overflow-y-auto overscroll-contain',
          'bg-surface px-6 pt-6 pb-[max(env(safe-area-inset-bottom),2rem)] shadow-2xl',
          'lg:hidden'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t('openMenu')}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-end pb-4">
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label={t('closeMenu')}>
            <X />
          </Button>
        </div>

        <nav aria-label="Mobile" className="flex flex-col">
          {NAV_KEYS.map(key => (
            <a
              key={key}
              href={`#${siteConfig.sections[key]}`}
              onClick={() => setOpen(false)}
              className="border-b border-border/50 py-4 text-base font-medium text-foreground transition-colors hover:text-accent"
            >
              {t(key)}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between pt-6">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <Button asChild size="lg" variant="primary" className="mt-4">
          <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}>
            <Phone />
            {t('callNow')}
          </a>
        </Button>
      </motion.div>
    </>
  );
}
