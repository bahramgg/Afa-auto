import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost';

// No `focus-visible:outline-none` here: suppressing it removed the global focus
// ring and left keyboard users with no indicator on the primary CTAs. The
// site-wide :focus-visible outline in globals.css applies instead.
const base =
  'inline-flex items-center justify-center gap-2 rounded-button px-5 py-3 text-sm font-semibold transition-[transform,box-shadow,background-color] duration-200 will-change-transform hover:-translate-y-0.5';

const variants: Record<Variant, string> = {
  // Primary = brand gradient + glow (plan §2). The hover glow is a token, not
  // an arbitrary value: the literal rgba this replaced held the pre-migration
  // blue and would have kept #4d69ff on the page after the palette moved.
  primary: 'bg-brand text-white shadow-brand hover:shadow-brand-hover',
  // Secondary = ghost with a token border.
  ghost: 'border border-border text-ink hover:border-border-glass hover:bg-surface/50',
};

// Locale-aware CTA. Wraps next-intl's <Link> so hrefs stay under the active
// locale. Text is passed in (never hardcoded) per CLAUDE.md.
export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: { variant?: Variant } & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props} />
  );
}
