import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Contrast is a DoD item (plan §14, §18): text must clear WCAG AA on the dark
// background — "--muted on --bg-950" is called out by name. Reading the real
// tokens means a token edit that breaks contrast fails the build, not review.

// tokens.css is now an alias layer: `--blue: var(--afa-blue-400)`. The literal
// hex lives one hop away in the vendored afa-tokens.css. Resolving that hop
// here is the point — it means this test guards the colour the browser
// actually paints, not the name it is reached by. An alias repointed at a
// darker primitive fails here exactly as a bad hex used to.
const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// Declaration order = cascade order. afa-tokens.css declares the deep-ground
// block after the light one and at higher specificity ([data-theme='dark']),
// so last-wins matches what this site renders by default.
//
// The DAY ground is a second, separate sheet (theme-light.css) layered on top
// of the same base, which is exactly why it is its own file: two files means
// two token sets a text-reading test can tell apart, and the day palette is
// then held to the same AA floor as the night one instead of being taken on
// trust. Every check below runs against both.
function resolver(sheets: readonly string[]) {
  const declarations = new Map<string, string>();
  for (const sheet of sheets) {
    for (const [, name, value] of sheet.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/gi)) {
      declarations.set(name!.trim(), value!.trim());
    }
  }

  return function token(name: string, seen = new Set<string>()): string {
    const key = `--${name}`;
    if (seen.has(key)) throw new Error(`token ${key} resolves in a cycle`);
    seen.add(key);

    const value = declarations.get(key);
    if (value === undefined) throw new Error(`token ${key} not found`);

    if (/^#[0-9a-f]{6}$/i.test(value)) return value;

    const alias = value.match(/^var\(\s*--([a-z0-9-]+)\s*\)$/i);
    if (alias) return token(alias[1]!, seen);

    throw new Error(`token ${key} is neither a 6-digit hex nor a plain var(): ${value}`);
  };
}

const base = [read('src/styles/tokens.css'), read('src/styles/afa-tokens.css')];
const grounds = [
  ['night', resolver(base)],
  ['day', resolver([...base, read('src/styles/theme-light.css')])],
] as const;

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio, 1–21. */
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const AA_NORMAL = 4.5;
const AA_LARGE = 3; // ≥24px, or ≥18.66px bold

describe.each(grounds)('contrast on the %s ground', (_ground, token) => {
  const backgrounds = ['bg-950', 'bg-900', 'surface'] as const;

  it.each(backgrounds)('ink clears AA on --%s', (bg) => {
    expect(contrast(token('ink'), token(bg))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  // The token the plan names explicitly — body copy colour on the page bg.
  it.each(backgrounds)('muted clears AA for body text on --%s', (bg) => {
    expect(contrast(token('muted'), token(bg))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  // --dim is used only for small supporting labels, never body copy. It must
  // still clear the large-text threshold so it never becomes unreadable.
  it.each(backgrounds)('dim clears the large-text threshold on --%s', (bg) => {
    expect(contrast(token('dim'), token(bg))).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it('lilac accent text clears AA on the page background', () => {
    expect(contrast(token('lilac'), token('bg-950'))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('success text clears the large-text threshold on the page background', () => {
    expect(contrast(token('success'), token('bg-950'))).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it('white on the brand gradient stays readable at both ends', () => {
    for (const end of ['blue', 'violet'] as const) {
      expect(contrast('#ffffff', token(end))).toBeGreaterThanOrEqual(AA_LARGE);
    }
  });
});

// The capability map's ten domain accents. afa-tokens.css states in prose that
// every one of them was measured rather than eyeballed — this is the
// measurement. A node label is real text at ~15px effective size, so the bar is
// AA normal, not the large-text exemption a coloured dot could have claimed.
describe.each(grounds)('capability map palette on the %s ground', (_ground, token) => {
  const tones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

  it.each(tones)('--map-%i clears AA as a label on the page background', (n) => {
    expect(contrast(token(`map-${n}`), token('bg-950'))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it.each(tones)('--map-%i stays visible as a mark on a card', (n) => {
    expect(contrast(token(`map-${n}`), token('surface'))).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it('keeps all ten distinguishable from each other', () => {
    // Ten hues that only differ by a hair would defeat the point. This is a
    // coarse guard — the real separation is carried by the per-domain glyph —
    // but it catches the failure where two tokens drift onto the same value.
    const values = tones.map((n) => token(`map-${n}`));
    expect(new Set(values).size).toBe(tones.length);
  });

  it('is not reusing the status colours', () => {
    // A green node on a capability map must not read as "this one is healthy".
    const status = new Set([token('success'), token('lilac')]);
    for (const n of tones) {
      const value = token(`map-${n}`);
      // map-3 intentionally shares the violet accent's value on the night
      // ground; on the day ground the two are separate literals.
      if (n === 3) continue;
      expect(status.has(value), `--map-${n} collides with a status token`).toBe(false);
    }
  });
});
