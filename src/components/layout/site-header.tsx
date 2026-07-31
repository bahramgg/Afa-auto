'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/cn';
import { LocaleSwitch } from './locale-switch';

/* -----------------------------------------------------------------------------
   Transparent over the map, solid once the page moves. The mark sits at the
   start corner (by direct request — the logo lives in header AND footer).

   The nav now has a MOBILE form, 2026-08. It had none: the list was
   `hidden lg:block` with nothing behind it, so a phone got a logo and a
   language switch and no way to reach any section. `Nav.menu` / `Nav.close`
   were already written in both catalogs, waiting for this.

   The old «فهرست کارها» entry is gone. It and «نقشه کامل» pointed at the same
   content, and two names for one thing is the cheapest way to make a visitor
   doubt they have seen everything.
   -------------------------------------------------------------------------- */

const sections = ['approach', 'work', 'impact'] as const;

export function SiteHeader() {
  const t = useTranslations('Nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* An open sheet must not survive a resize into the desktop layout, or the
     page keeps a panel whose trigger is no longer on screen. */
  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia('(min-width: 1024px)');
    const sync = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [open]);

  const link =
    'inline-flex min-h-11 items-center rounded-button px-3 text-sm text-muted transition-colors hover:text-ink';
  const sheetLink =
    'flex min-h-12 items-center text-sm text-muted transition-colors hover:text-ink';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors',
        scrolled || open
          ? 'border-b border-border bg-bg-950/85 backdrop-blur'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container>
        <div className="flex items-center justify-between gap-4 py-3">
          <Logo label={t('home')} />

          <nav aria-label={t('menu')} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {sections.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className={link}>
                    {t(id)}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/map" className={link}>
                  {t('mapPage')}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitch />

            {/* No CTA pill on desktop, by direct request — the header carries
                the mark, the way around, and the language. The ask lives in
                the map hero and the contact form. The phone sheet is the one
                exception: a menu that leads nowhere is not a menu. */}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t('close') : t('menu')}
              className="grid size-10 place-items-center rounded-button border border-border text-ink transition-colors hover:border-border-glass lg:hidden"
            >
              <span aria-hidden className="relative block h-3.5 w-4">
                <span
                  className={cn(
                    'absolute inset-x-0 top-0 block h-px bg-current transition-transform duration-200',
                    open && 'translate-y-[6.5px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-current transition-opacity duration-200',
                    open && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-x-0 bottom-0 block h-px bg-current transition-transform duration-200',
                    open && '-translate-y-[6.5px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* The sheet. One rule per row, full-width targets — a phone menu is a
            list of destinations, not a scaled-down desktop bar. */}
        <nav
          id="site-menu"
          aria-label={t('menu')}
          hidden={!open}
          className="border-t border-border pb-3 lg:hidden"
        >
          <ul>
            {sections.map((id) => (
              <li key={id} className="border-b border-border">
                <a href={`#${id}`} onClick={() => setOpen(false)} className={sheetLink}>
                  {t(id)}
                </a>
              </li>
            ))}
            <li className="border-b border-border">
              <Link href="/map" onClick={() => setOpen(false)} className={sheetLink}>
                {t('mapPage')}
              </Link>
            </li>
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-3 flex min-h-12 items-center justify-center rounded-button bg-brand px-5 text-sm font-semibold text-white shadow-brand"
              >
                {t('contact')}
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
