// src/app/[locale]/(legal)/layout.tsx
import { Footer } from '@/components/sections/footer';
import { Header } from '@/components/sections/header';

/** Shared shell for all legal pages: header + content slot + footer. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
