'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/cn';
import { LocaleSwitch } from './locale-switch';

/* -----------------------------------------------------------------------------
   Transparent over the hero, solid once the page moves. The mark sits at the
   start corner (by direct request — the logo lives in header AND footer).

   REBUILT 2026-08, on «منوی بالا صفحه هم از نظر محتوا مشکل داره و تکراریه …
   دکمه‌ها رنگی و یا برجسته بشن».

   CONTENT. The bar carried four prose labels, and two of them said what the
   page already said elsewhere: «اتوماسیون‌های اجراشده» is the section's own
   heading dragged into a menu, and «نقشه کامل» is the hero's secondary button
   repeated word for word two centimetres above itself. A menu is an index, not
   a second copy of the page. Every label is now the SHORTEST NOUN that names
   its destination, and the calculator — the most interactive thing on the site
   and previously unreachable from the header — finally has an entry. `impact`
   was already written in both catalogs, waiting.

   FORM. The four in-page anchors live in ONE rail: a single pill, hairlined,
   subdivided by nothing. The section you are actually reading is the raised,
   filled chip inside it, so the bar answers "where am I" without a word.

   The /map chip and the free-assessment pill were BOTH removed a day later,
   by direct request. The bar is now the four sections and nothing else: /map
   is reached from the hero's own secondary button, from the services footer
   and from the site footer, and the ask lives where the visitor is already
   convinced rather than where they have just arrived.
   -------------------------------------------------------------------------- */

/** In-page anchors, in reading order. These, and only these, get scroll-spy. */
const sections = ['services', 'impact', 'work', 'start'] as const;

export function SiteHeader() {
  const t = useTranslations('Nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Scroll-spy. The band is the middle of the viewport: a section counts as
     "the one being read" only while it crosses the centre line, so short
     sections cannot claim the bar on their way past, and exactly one entry is
     ever lit. Nothing is lit at the very top, where the hero is not in the
     menu at all. */
  useEffect(() => {
    const nodes = sections
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target.id);
          else seen.delete(entry.target.id);
        }
        const current = sections.find((id) => seen.has(id)) ?? null;
        setActive(current);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
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

  const chip =
    'inline-flex min-h-9 items-center rounded-pill px-3.5 text-sm transition-colors';
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

          {/* The rail. One pill holding four chips; the read section is the
              raised one. */}
          <nav aria-label={t('menu')} className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-pill border border-border bg-surface/70 p-1 backdrop-blur">
              {sections.map((id) => {
                const isActive = active === id;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        chip,
                        isActive
                          ? 'bg-surface-2 font-semibold text-ink shadow-raise'
                          : 'text-muted hover:text-ink',
                      )}
                    >
                      {t(id)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitch />

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
            list of destinations, not a scaled-down desktop bar. Same four
            entries as the rail, and only those. */}
        <nav
          id="site-menu"
          aria-label={t('menu')}
          hidden={!open}
          className="border-t border-border pb-3 lg:hidden"
        >
          <ul>
            {sections.map((id, index) => (
              <li key={id} className={cn(index > 0 && 'border-t border-border')}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === id ? 'true' : undefined}
                  className={cn(sheetLink, active === id && 'font-semibold text-ink')}
                >
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
