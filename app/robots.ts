import type {MetadataRoute} from 'next';
import {SITE_IS_LIVE, SITE_URL} from '@/lib/site-config';

/**
 * Until a real domain is configured (NEXT_PUBLIC_SITE_URL), everything is
 * closed to crawlers — a preview deployment must never be indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_IS_LIVE) {
    return {rules: [{userAgent: '*', disallow: '/'}]};
  }
  return {
    rules: [{userAgent: '*', allow: '/', disallow: ['/api/']}],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  };
}
