import { AfaMark } from './AfaMark';

/* The real AFA mark — the cloud-and-key, redrawn as vector in AfaMark.tsx and
 * vendored from afa-brand — beside the wordmark. It replaced a placeholder "A"
 * tile on 2026-07-31 by direct request: the logo belongs in the header and the
 * footer, and it is the one asset a visitor can carry between the three AFA
 * properties.
 *
 * The mark reads its two gradient stops from `--afa-mark-from/to`, which the
 * ground defines — this component never knows which surface it is on. */
export function Logo({ label }: { label: string }) {
  return (
    <a
      href="#top"
      aria-label={label}
      className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-ink"
    >
      <AfaMark size={34} />
      <span className="leading-none">
        AFA<span className="text-violet">.</span>
      </span>
    </a>
  );
}
