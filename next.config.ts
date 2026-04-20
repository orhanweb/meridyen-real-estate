// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** Strict, security-hardened, image-optimized Next.js config. */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Allow LAN devices (phones, tablets) to consume dev resources over the
  // local network. Without this, Next.js 16 blocks HMR / RSC chunks from
  // non-localhost origins for safety, which causes hydration to stall on
  // mobile and leaves motion-driven content stuck in its initial state.
  // Dev-only flag; ignored in production builds.
  allowedDevOrigins: ['192.168.1.116', '192.168.1.*', '10.0.0.*'],

  experimental: {
    optimizePackageImports: ['lucide-react', 'motion']
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 80, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com'
      }
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30
  },

  /**
   * Static security headers. CSP is intentionally NOT here — it is generated
   * per request by `src/proxy.ts` so it can carry a unique nonce. Next.js
   * merges `headers()` output with proxy-set headers, so both sets ship.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
