// src/app/global-error.tsx
'use client';

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Last-resort error boundary that catches failures in the root layout.
 * MUST render its own <html> + <body> tags. Kept dependency-free and
 * inline-styled because the design system may itself be the failing piece.
 */
export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#0e1422',
          color: '#fafaf7',
          textAlign: 'center'
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(250,250,247,0.6)',
            margin: 0
          }}
        >
          Critical error
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>The site crashed unexpectedly.</h1>
        <p style={{ maxWidth: '32rem', fontSize: '1rem', lineHeight: 1.6, color: 'rgba(250,250,247,0.7)', margin: 0 }}>
          We could not recover from this error. Please try reloading. If the problem persists, contact us at orhan.stack@gmail.com.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            cursor: 'pointer',
            border: '1px solid rgba(250,250,247,0.2)',
            background: '#c8a35c',
            color: '#0e1422',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.02em'
          }}
        >
          Reload page
        </button>
        {error.digest ? (
          <p style={{ fontSize: '0.6875rem', fontFamily: 'ui-monospace, SFMono-Regular, monospace', color: 'rgba(250,250,247,0.4)', margin: 0 }}>
            ID: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  );
}
