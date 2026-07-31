import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';

// Two pages per locale — the landing and /map — with reciprocal hreflang.
const routes = [
  { path: '', priority: 1 },
  { path: '/map', priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route.path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteUrl}/${l}${route.path}`]),
        ),
      },
    })),
  );
}
