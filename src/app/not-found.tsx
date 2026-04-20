// src/app/not-found.tsx
import { GeistSans } from 'geist/font/sans';
import '@/app/globals.css';

/** Root-level 404 — used when middleware does not match any locale segment. */
export default function RootNotFound() {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="grid min-h-dvh place-items-center bg-background text-foreground antialiased">
        <main className="flex flex-col items-center gap-4 p-8 text-center">
          <p className="text-sm tracking-widest uppercase text-muted-foreground">404</p>
          <h1 className="text-4xl font-semibold tracking-tight">Not found</h1>
          <a href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Back home
          </a>
        </main>
      </body>
    </html>
  );
}
