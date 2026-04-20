// src/app/[locale]/page.tsx
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { Faq } from '@/components/sections/faq';
import { Footer } from '@/components/sections/footer';
import { Header } from '@/components/sections/header';
import { Hero } from '@/components/sections/hero';
import { Regions } from '@/components/sections/regions';
import { Services } from '@/components/sections/services';
import { Testimonials } from '@/components/sections/testimonials';
import { StructuredData } from '@/components/seo/structured-data';
import { routing } from '@/i18n/routing';

type RouteParams = { locale: string };

export default async function HomePage({ params }: { params: Promise<RouteParams> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <StructuredData locale={locale} />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Regions />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
