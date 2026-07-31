'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { LocaleSwitch } from './locale-switch';

const sections = ['impact', 'work', 'processes'] as const;

/* Transparent over the hero, solid once the page moves. The mark sits at the
 * start corner (by direct request — the logo lives in header AND footer), the
 * one action rides the end corner as a light pill. */
export function SiteHeader() {
  const t = useTranslations('Nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={
        scrolled
          ? 'sticky top-0 z-50 border-b border-border bg-bg-950/85 backdrop-blur transition-colors'
          : 'sticky top-0 z-50 border-b border-transparent bg-transparent transition-colors'
      }
    >
      <Container>
        <div className="flex items-center justify-between gap-4 py-3">
          <Logo label={t('home')} />

          <nav aria-label={t('menu')} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {sections.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex min-h-11 items-center rounded-button px-3 text-sm text-muted transition-colors hover:text-ink"
                  >
                    {t(id)}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/map"
                  className="inline-flex min-h-11 items-center rounded-button px-3 text-sm text-muted transition-colors hover:text-ink"
                >
                  {t('mapPage')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* No CTA pill here, by direct request — the header carries the
              mark, the way around, and the language. The ask lives in the
              hero and the contact form. */}
          <LocaleSwitch />
        </div>
      </Container>
    </header>
  );
}
