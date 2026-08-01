import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './container';

/* -----------------------------------------------------------------------------
   The three primitives that carry the AFA look.

   They are deliberately tiny. afa-site and afa-pay implement the same three in
   CSS Modules, and the only reason three separate implementations can stay in
   agreement is that there is very little to disagree about
   (afa-brand/ARCHITECTURE.md, D3 — share the design language, not the code).
   -------------------------------------------------------------------------- */

/** Small, wide-tracked label. Sits above a heading, never alone. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('eyebrow', className)}>{children}</p>;
}

/**
 * Section opener. Start-aligned rather than centred: centred headings force the
 * eye to re-find the left edge on every line, and this site is read in two
 * directions, where "left" is not a fixed idea anyway.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  index,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  /** Optional running number, e.g. "02". Editorial, and it aids orientation. */
  index?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      {/* The opener sits in a chip, 2026-08, on «بهتره توی کادر بیاد تا طراحی
          بهتر بشه» — the same raised pill the header rail uses, so a section
          announces itself in the page's own vocabulary instead of as two loose
          words on the ground. The numeral keeps its own raised square inside
          it: the running index is the one bit a reader scans for. */}
      <div className="inline-flex items-center gap-2.5 rounded-pill border border-border bg-surface/70 p-1.5 pe-4">
        {index ? (
          <span
            aria-hidden
            className="meta grid h-7 min-w-7 place-items-center rounded-pill bg-surface-2 px-2 text-[11px] font-semibold tabular-nums text-blue shadow-raise"
          >
            {index}
          </span>
        ) : null}
        <Eyebrow className={index ? undefined : 'ps-2.5'}>{eyebrow}</Eyebrow>
      </div>
      <h2 className="display mt-4 text-[clamp(1.75rem,3.4vw,2.6rem)] text-ink">{title}</h2>
      {lede ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{lede}</p> : null}
    </div>
  );
}

/**
 * The ruled panel — the single most recognisable thing about an AFA page.
 *
 * A group of related items is ONE bordered block subdivided by hairlines, not
 * a row of floating cards with gaps. Gaps say "these are unrelated things"; a
 * shared rule says "these are facets of one thing", which is what they are.
 *
 * The hairlines come from a 1px grid gap over a border-coloured background
 * rather than per-cell borders. That means no index arithmetic, and the rules
 * stay correct when the column count changes at a breakpoint — which is where
 * the border-on-every-cell approach always breaks.
 */
export function RuledPanel({
  children,
  columns = 2,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const grid = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div
      className={cn(
        'grid gap-px overflow-hidden rounded-card border border-border bg-border',
        grid,
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A cell inside a RuledPanel. Opaque, so the 1px gap reads as a rule. */
export function RuledCell({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  return (
    <Tag className={cn('bg-bg-950 p-6 transition-colors sm:p-8', className)}>{children}</Tag>
  );
}

/** A figure with its label below it. Tabular figures so columns of them align. */
export function Stat({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) {
  return (
    <div>
      <p className="display text-[clamp(1.6rem,2.6vw,2.2rem)] tabular-nums text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
      {note ? <p className="mt-1 text-xs text-dim">{note}</p> : null}
    </div>
  );
}

/** Full-bleed section wrapper with the standard vertical rhythm and top rule. */
export function Section({
  id,
  children,
  className,
  ruled = true,
  contained = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  ruled?: boolean;
  contained?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-24 py-16 sm:py-24',
        ruled && 'border-t border-border',
        className,
      )}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
