// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
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
  // The Vite codebase is plain JSX. tsconfig is intentionally loose for the
  // migration; we let Next compile rather than enforce strict types here.
  // Tighten back in a later phase once typing is added pass-by-pass.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
