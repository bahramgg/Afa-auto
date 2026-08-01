import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, direction, isLocale, type Locale } from '@/i18n/routing';
import { pickClientMessages } from '@/i18n/client-namespaces';
import { siteUrl } from '@/lib/site';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}`]),
  );
  const card = `/og-${locale === 'fa' ? 'fa' : 'en'}.png`;

  return {
    // Absolute base so per-page canonicals and alternates resolve to real URLs
    // in the emitted metadata (plan §14).
    metadataBase: new URL(siteUrl),
    title: {
      default: t('title'),
      template: `%s — AFA`,
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: 'AFA',
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      alternateLocale: locale === 'fa' ? 'en_US' : 'fa_IR',
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      /* Was missing entirely while `twitter.card` already promised a large
         image — so every link shared into WhatsApp, Telegram or X rendered a
         blank card. For a business introduced by forwarded link, that was the
         most expensive omission on the site. Built by `npm run og:build`. */
      images: [{ url: card, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [card],
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function LocaleLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) {
    notFound();
  }
  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const typedLocale: Locale = locale;
  // Only client-used namespaces cross to the browser (plan §14).
  const messages = pickClientMessages(await getMessages());
  const meta = await getTranslations({ locale, namespace: 'Meta' });
  const orgDescription = meta('description');

  return (
    /* data-theme selects which half of the palette paints: the deep-ground
     * block in afa-tokens.css plus this site's own night values, or the day
     * overrides in theme-light.css. It is rendered as "dark" and corrected
     * before first paint by the script below, for a visitor who has chosen
     * otherwise. `suppressHydrationWarning` is what lets that correction
     * survive hydration without React objecting to an attribute it did not
     * write. */
    <html
      lang={typedLocale}
      dir={direction[typedLocale]}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/* The theme, applied BEFORE the first paint. A blocking inline
            script is the one correct place for this: run it from a component
            effect instead and the visitor watches the night ground flash
            before their stored choice arrives. It reads one key and writes one
            attribute, and does nothing at all if the key is absent, which is
            how dark stays the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('afa-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}",
          }}
        />
        {/* Preload only the weight the LCP heading uses, for the active locale
         * — the rest load on demand via font-display: swap (plan §14). */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          /* The face the first paint actually renders: Persian body/UI is
             Sahel as of 2026-07-31 (IRANYekan leads the stack but only
             activates once its licensed files exist), Latin is Manrope.
             Preloading a face the page no longer renders would spend the
             bandwidth while the real one waited its turn. */
          href={typedLocale === 'fa' ? '/fonts/iranyekan-400.woff2' : '/fonts/manrope-400.woff2'}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Organization schema (plan §14). Only facts we can stand behind. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AFA',
              url: `${siteUrl}/${typedLocale}`,
              description: orgDescription,
            }),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <a href="#main" className="sr-only focus:not-sr-only">
            Skip to content
          </a>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {props.children}
            </main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
