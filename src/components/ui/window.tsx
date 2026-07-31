import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* -----------------------------------------------------------------------------
   The window frame — a card drawn as a desktop app window.

   Second pass, 2026-07-31, after review:
     · the frame is BLACK (`--win-bg` / `--win-bar`), solid, darker than any
       other surface, so the windows read as objects sitting on the page;
     · the title moved out of the centre. Centred titles collided with the
       traffic lights on narrow cards and mixed-direction strings (a Latin
       filename inside a Persian page) shuffled around the bar. It now sits
       start-aligned beside the dots, `dir="auto"` so each title lays out by
       its own script, and nothing can overlap anything.
   -------------------------------------------------------------------------- */

export function Window({
  title,
  children,
  className,
  padded = true,
}: {
  /** Shown in the title bar. Keep it short: a filename, not a sentence. */
  title: string;
  children: ReactNode;
  className?: string;
  /** Switch off when the body manages its own padding (e.g. ruled lists). */
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border border-border-glass bg-[var(--win-bg)] shadow-[0_18px_50px_rgba(0,0,0,0.5)]',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-[var(--win-bar)] px-4 py-2.5">
        <span aria-hidden className="flex shrink-0 items-center gap-1.5">
          <span className="size-2.5 rounded-pill bg-[var(--win-dot-close)]" />
          <span className="size-2.5 rounded-pill bg-[var(--win-dot-min)]" />
          <span className="size-2.5 rounded-pill bg-[var(--win-dot-max)]" />
        </span>
        <span dir="auto" className="min-w-0 truncate text-xs font-medium text-dim">
          {title}
        </span>
      </div>
      <div className={padded ? 'p-6 sm:p-7' : undefined}>{children}</div>
    </div>
  );
}
