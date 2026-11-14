import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /* Lets a dev server run beside a production build without the two
     overwriting each other's output: NEXT_DIST_DIR=.next-dev next dev */
  distDir: process.env.NEXT_DIST_DIR || '.next',

  /* Server-only and CommonJS: required at runtime instead of being walked by
     the bundler on every change. Next still traces it into the deployment. */
  serverExternalPackages: ['@aws-sdk/client-ses'],

  /* Metadata belongs in <head> for every visitor. Next 15 otherwise streams it
     into <body> for crawlers it does not list as "limited", and Google ignores
     rel="canonical" and hreflang outside <head>. */
  htmlLimitedBots: /.*/,

  /**
   * Response headers for every route.
   *
   * The policy can be this tight because the site loads nothing from anywhere
   * else: fonts are self-hosted by next/font, there are no third-party
   * scripts, no analytics and no embedded media. The interest form posts to
   * this origin (/api/interest).
   *
   * script-src and style-src keep 'unsafe-inline' because Next emits its own
   * inline bootstrap and the page uses a small pre-paint script. 'unsafe-eval'
   * is dev-only: React Refresh needs it, the production runtime does not.
   */
  async headers() {
    const dev = process.env.NODE_ENV === 'development';
    const csp = [
      "default-src 'self'",
      // In development Vercel Analytics loads a debug script from its own host;
      // in production it is served from this origin (/_vercel/insights).
      `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
      // Framing is refused in production. In development the site may frame
      // itself, which is how narrow layouts are previewed side by side.
      `frame-ancestors ${dev ? "'self'" : "'none'"}`,
      `frame-src ${dev ? "'self'" : "'none'"}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          {key: 'Content-Security-Policy', value: csp},
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'X-Frame-Options', value: dev ? 'SAMEORIGIN' : 'DENY'},
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
          {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
