import Image from 'next/image';

/* =============================================================================
   AFA mark — THE ARTWORK ITSELF, as of 2026-07-31.

   Three hand-drawn vector approximations were reviewed and rejected, which is
   the correct outcome: a redrawn logo is a different logo. This component now
   renders the company's actual master render (the neon cloud-and-key from
   afa-pay/brand-source), extracted with a luminance-as-alpha matte — every
   pixel keeps its colour and is exactly as opaque as it is bright, so on any
   dark ground it composites pixel-identically to the source, glow included.
   Extraction script: scratchpad/extract_mark.py; asset: /brand/afa-mark.webp
   (320px, 45 KB).

   The trade against the old vector: no per-ground recolouring. This mark IS
   the blue-violet neon and belongs on dark surfaces, which is every surface
   this site has.
   ========================================================================== */

export type AfaMarkProps = {
  /** Rendered box in px, square. The asset is 320×320. */
  size?: number;
  /** Decorative next to a wordmark; give a title only when it stands alone. */
  title?: string;
  className?: string;
};

export function AfaMark({ size = 32, title, className }: AfaMarkProps) {
  return (
    <Image
      src="/brand/afa-mark.webp"
      width={size}
      height={size}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      className={className}
      /* 45 KB decorative asset rendered at ≤48px: the optimizer pipeline would
         cost more than it saves. */
      unoptimized
      priority={false}
    />
  );
}
