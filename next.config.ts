// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const ONE_YEAR = 60 * 60 * 24 * 365;
const ONE_MONTH = 60 * 60 * 24 * 31;

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Allowlist quality values — required from Next 16.
    qualities: [60, 70, 75, 85],
    // Keep optimized variants in the CDN for ~31 days instead of 4 hours.
    minimumCacheTTL: ONE_MONTH,
    remotePatterns: [
      { protocol: 'https', hostname: 'api.thesurferweligama.com' },
      // YouTube thumbnail CDN — proxied through Next's image optimizer so the
      // browser sees the image coming from our own origin instead of
      // i.ytimg.com. Edge's Tracking Prevention flags i.ytimg.com as a
      // tracker; routing through /_next/image bypasses the flag.
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  // Long-lived Cache-Control for /public assets — Amplify's default 5s TTL
  // forces re-fetches of large hero photos and the homepage MP4 on every visit.
  // (Next.js already sets proper immutable headers on /_next/static and uses
  // `minimumCacheTTL` above for /_next/image, so we don't touch those here.)
  async headers() {
    const immutable = [
      { key: 'Cache-Control', value: `public, max-age=${ONE_YEAR}, immutable` },
    ];
    return [
      { source: '/videos/:path*', headers: immutable },
      { source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|mp4)', headers: immutable },
    ];
  },
  // The Vite codebase is plain JSX. tsconfig is intentionally loose for the
  // migration; we let Next compile rather than enforce strict types here.
  // Tighten back in a later phase once typing is added pass-by-pass.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
