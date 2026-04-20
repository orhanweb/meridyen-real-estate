// src/app/layout.tsx
import '@/app/globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { headers } from 'next/headers';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { routing } from '@/i18n/routing';
import { buildThemeBootstrapScript } from '@/lib/theme';
import { readResolvedThemeFromCookie, readThemeFromCookie } from '@/lib/theme-server';

/**
 * App-wide root layout — sits above the `[locale]` segment so the providers
 * mounted here survive locale-driven re-renders. Owning `<html>`/`<body>`,
 * the FOUC bootstrap script and the ThemeProvider here is what eliminates
 * React 19's "script tag inside component" warning that kept firing on
 * locale switches when the theme provider lived inside the locale tree.
 *
 * `<html lang>` is set to the default locale because this layer cannot read
 * per-request locale without opting the whole tree into dynamic rendering.
 * `<HtmlLangSync>` mounted in the locale layout patches the attribute at
 * runtime so accessibility tooling stays accurate after hydration.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, resolvedTheme, headerList] = await Promise.all([readThemeFromCookie(), readResolvedThemeFromCookie(), headers()]);
  /** Per-request CSP nonce stamped by `src/proxy.ts`; consumed by the inline FOUC script below. */
  const nonce = headerList.get('x-nonce') ?? undefined;

  return (
    <html
      lang={routing.defaultLocale}
      data-theme={theme}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${resolvedTheme}`}
      style={{ colorScheme: resolvedTheme }}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* FOUC bootstrap — corrects the theme class before first paint when */}
        {/* the cookie-derived class above is stale (e.g. system mode). */}
        {/* `suppressHydrationWarning` is required because the browser hides the */}
        {/* CSP `nonce` attribute from DOM reflection (per HTML spec, to prevent */}
        {/* XSS exfiltration), so React's hydration check sees an empty nonce */}
        {/* on the client and reports a false-positive mismatch. */}
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: buildThemeBootstrapScript() }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <ThemeProvider initialTheme={theme} initialResolvedTheme={resolvedTheme}>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
