'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

/* -----------------------------------------------------------------------------
   Night / day, 2026-08.

   The switch writes one attribute — `data-theme` on <html> — and the entire
   palette follows from theme-light.css. No component subscribes to it, nothing
   re-renders, and there is no context: a CSS custom-property cascade is the
   cheapest theme mechanism there is, and the one that cannot get out of sync.

   The choice is remembered in localStorage and re-applied by a blocking script
   in <head> (see the layout), so a returning visitor never sees the other
   ground flash first. DARK IS THE DEFAULT and the system preference is not
   consulted: the deep ground is what this company looks like, and a visitor
   whose laptop happens to be in light mode has not asked for a different
   brand. Once they press this, the choice sticks.

   `mounted` exists because the server cannot know the stored value. Until the
   effect runs, the button renders its label but not its pressed state, which
   keeps the markup identical on both sides of hydration.
   -------------------------------------------------------------------------- */

type Theme = 'dark' | 'light';

export function ThemeSwitch() {
  const t = useTranslations('ThemeSwitch');
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem('afa-theme', next);
    } catch {
      /* Private mode, or storage disabled. The switch still works for this
         visit; only the memory of it is lost. */
    }
    setTheme(next);
  };

  const isLight = mounted && theme === 'light';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={mounted ? isLight : undefined}
      aria-label={isLight ? t('toDark') : t('toLight')}
      title={isLight ? t('toDark') : t('toLight')}
      className="grid size-10 place-items-center rounded-pill border border-border text-muted transition-colors hover:border-border-glass hover:text-ink"
    >
      {/* One glyph, two states: the moon fills in on the day ground and the
          sun on the night one, so the button always shows where pressing it
          takes you. */}
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
        <g className={cn(isLight ? 'hidden' : undefined)}>
          <path
            d="M16.2 12.4A6.6 6.6 0 0 1 7.6 3.8 6.6 6.6 0 1 0 16.2 12.4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
        <g className={cn(isLight ? undefined : 'hidden')}>
          <circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M10 1.8v2.2M10 16v2.2M18.2 10H16M4 10H1.8M15.8 4.2 14.2 5.8M5.8 14.2 4.2 15.8M15.8 15.8 14.2 14.2M5.8 5.8 4.2 4.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </button>
  );
}
