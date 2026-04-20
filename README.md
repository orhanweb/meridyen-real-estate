# Meridyen Gayrimenkul — Landing

Premium, multilingual, white-label-ready real estate landing page for **Meridyen Gayrimenkul / Meridyen Real Estate** (Ankara). Built as a sellable template — change `src/config/site.config.ts` + replace assets to rebrand.

## Tech stack

| Layer      | Choice                                      | Version |
| ---------- | ------------------------------------------- | ------- |
| Framework  | Next.js (App Router, Turbopack)             | 16.2.x  |
| Runtime    | React                                       | 19.2.x  |
| Language   | TypeScript (strict)                         | 6.0.x   |
| Styling    | Tailwind CSS v4 (CSS-first, OKLCH tokens)   | 4.2.x   |
| Animation  | Motion (formerly Framer Motion)             | 12.38.x |
| i18n       | next-intl (Server Components first)         | 4.9.x   |
| Theming    | In-house, cookie-aware (class-based)        | —       |
| Icons      | lucide-react                                | 1.8.x   |
| Forms      | react-hook-form + zod + @hookform/resolvers | latest  |
| Email      | Resend                                      | 6.x     |
| Rate limit | @upstash/ratelimit + @upstash/redis         | latest  |
| Toasts     | sonner                                      | 2.x     |
| Fonts      | Geist Sans / Geist Mono via `next/font`     | 1.7.x   |

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — Turkish (default) at `/`, English at `/en`.

## Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start dev server with Turbopack |
| `npm run build`     | Production build                |
| `npm start`         | Start production server         |
| `npm run lint`      | Lint with Next.js config        |
| `npm run typecheck` | TypeScript check (no emit)      |

## Project structure

```
src/
  app/
    layout.tsx          Root layout (html/body, theme provider, FOUC, analytics)
    [locale]/
      layout.tsx        Locale layout (i18n provider, lang sync, toaster)
      page.tsx          Home page (sections will land here)
      not-found.tsx
    not-found.tsx       Root 404 (no locale matched)
    globals.css         Tailwind v4 + OKLCH tokens + dark mode

  components/
    providers/
      theme-provider.tsx
      html-lang-sync.tsx
    ui/                 Atomic primitives (Button, ThemeToggle, LocaleToggle, …)
    sections/           Page sections (Hero, About, Services, …)  [WIP]
    motion/             Reusable motion wrappers (FadeIn, …)

  config/
    site.config.ts      Brand, contact, SEO single source of truth

  i18n/
    routing.ts          Locale config — add a locale here
    request.ts          Server-side message loading
    navigation.ts       Locale-aware Link / router / pathname
    messages/
      tr.json           Turkish (default)
      en.json           English

  lib/
    cn.ts               Class merger (clsx + tailwind-merge)
    env.ts              Server-only env validation (zod)

  proxy.ts              Next.js 16 Proxy (was middleware) — i18n routing
```

## Design tokens

Colors are defined in `src/app/globals.css` using **OKLCH** for perceptually uniform palettes. Semantic tokens only — never use raw `bg-blue-500` style classes.

| Token                         | Light          | Dark                  |
| ----------------------------- | -------------- | --------------------- |
| `background`                  | warm cream     | deep navy             |
| `foreground`                  | deep navy      | warm cream            |
| `primary`                     | deep navy      | warm cream (inverted) |
| `accent`                      | champagne gold | bright gold           |
| `surface`                     | white          | elevated navy         |
| `muted` / `subtle` / `border` | warm neutrals  | navy neutrals         |

Dark mode is class-based (`html.dark`), driven by an in-house cookie-aware theme provider (`src/components/providers/theme-provider.tsx`). The pre-paint bootstrap script lives in the root layout's `<head>`, so SSR ships the right class on first byte and there is no FOUC. System preference is respected by default and synced across tabs via the `storage` event.

## Internationalization

- Routing: prefix `as-needed` — TR (default) at `/`, EN at `/en`.
- Add a locale: edit `src/i18n/routing.ts` + create `src/i18n/messages/{locale}.json`.
- Translations are typed; nested keys autocomplete via `useTranslations()`.

## Security

- CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy headers configured in `next.config.ts`.
- Server env validated with zod (`src/lib/env.ts`).
- Contact form (Step 5) will use honeypot + time-trap + Upstash rate-limit + Zod schema validation + Resend.
- React 19 escapes by default; `dangerouslySetInnerHTML` is forbidden.

## White-label hand-off

To rebrand for another client:

1. Update `src/config/site.config.ts` (brand, contact, social).
2. Replace logo / OG image in `public/`.
3. Adjust 5–6 OKLCH values in `src/app/globals.css` `@theme`.
4. Translate `src/i18n/messages/*.json`.
5. Deploy to a new Vercel project + bind custom domain.

## Deployment

Designed for **Vercel**. Push to GitHub → import → set env vars → done.
Required env vars (production):

- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

## License

Proprietary. © Meridyen Gayrimenkul Danışmanlık.
