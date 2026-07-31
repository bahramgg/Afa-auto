/* -----------------------------------------------------------------------------
   The operating map — structure and geometry, with no React and no strings.

   THIRD LAYOUT, 2026-07-31, built to the operator-OS reel AFA supplied
   ("Bennett OS"): a radial MANDALA, not free constellations. The reference
   arranges an agent company as rings — a multicoloured particle core, an
   inner ring of domain hubs, and a double outer orbit of small ring-nodes,
   each sitting inside its domain's arc. Our six domains and twenty-four
   processes map onto that drawing exactly: 6 hubs at 60° spacing, 4 process
   nodes per domain alternating between two orbits inside the domain's sector.

   Everything is CLOSED-FORM: angles and radii computed from indices, no
   randomness anywhere except the centre burst, which hashes stable ids — the
   layout renders identically on server and client, forever.
   -------------------------------------------------------------------------- */

/** Square stage. Panels flank it in the page grid; the drawing stays square. */
export const VIEW = 960;

const C = VIEW / 2;

/** Ring radii. The gaps ARE the hierarchy: core → hubs → double orbit. */
export const R_HUB = 208;
export const R_ORBIT_IN = 318;
export const R_ORBIT_OUT = 382;

/* Process angular offsets inside a domain's 60° sector, paired with orbit
   alternation in-out-in-out — the texture the reference's double ring has. */
const PROCESS_OFFSETS = [-19.5, -6.5, 6.5, 19.5] as const;
const PROCESS_ORBITS = [R_ORBIT_IN, R_ORBIT_OUT, R_ORBIT_IN, R_ORBIT_OUT] as const;

/** Hubs at 30°, 90°, …, 330° — dead top/bottom stay clear for chrome. */
const ANGLE_OFFSET = 30;

export type DomainId =
  | 'sales'
  | 'operations'
  | 'support'
  | 'finance'
  | 'marketing'
  | 'intelligence';

/**
 * The second channel carrying domain identity, so the map is not colour-alone
 * (WCAG 2.1 §1.4.1). Drawn inside the hub ring.
 */
export type Glyph = 'circle' | 'square' | 'diamond' | 'triangle' | 'hexagon' | 'cross';

/** Index into `--map-1…6`. A number so CSS can select on it. */
export type Tone = 1 | 2 | 3 | 4 | 5 | 6;

export interface DomainSpec {
  readonly id: DomainId;
  readonly tone: Tone;
  readonly glyph: Glyph;
  /** Process ids in display order — offsets above are applied in this order. */
  readonly processes: readonly string[];
}

/* The structure itself — six domains, four real processes each. The content
   contract with messages/ is unchanged across all three layouts. */
export const DOMAINS: readonly DomainSpec[] = [
  {
    id: 'sales',
    tone: 1,
    glyph: 'circle',
    processes: ['lead-capture', 'quote', 'deal-followup', 'handoff'],
  },
  {
    id: 'operations',
    tone: 2,
    glyph: 'square',
    processes: ['order-intake', 'stock-check', 'dispatch', 'sla-watch'],
  },
  {
    id: 'intelligence',
    tone: 3,
    glyph: 'cross',
    processes: ['daily-brief', 'anomaly', 'forecast', 'board-pack'],
  },
  {
    id: 'finance',
    tone: 4,
    glyph: 'diamond',
    processes: ['invoice', 'reconcile', 'dunning', 'payout'],
  },
  {
    id: 'support',
    tone: 5,
    glyph: 'triangle',
    processes: ['triage', 'first-reply', 'escalation', 'csat'],
  },
  {
    id: 'marketing',
    tone: 6,
    glyph: 'hexagon',
    processes: ['segment', 'campaign', 'content-queue', 'attribution'],
  },
] as const;

/** Every process id on the map, flattened. Validates the message catalogs. */
export const PROCESS_IDS: readonly string[] = DOMAINS.flatMap((d) => d.processes);

/* ------------------------------------------------------------------- types */

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface ProcessNode extends Point {
  readonly id: string;
  readonly domain: DomainId;
  readonly tone: Tone;
  /** 1-based position inside its domain — the numeral drawn in the ring. */
  readonly index: number;
  /** Which orbit it rides; the component only needs it for the aria order. */
  readonly orbit: number;
  /** Degrees from 12 o'clock. */
  readonly angle: number;
  /** 0–7 animation-delay bucket. */
  readonly phase: number;
}

export interface HubNode extends Point {
  readonly id: DomainId;
  readonly tone: Tone;
  readonly glyph: Glyph;
  readonly angle: number;
  readonly phase: number;
  /** Label anchor, just outside the hub ring on the outward ray. */
  readonly lx: number;
  readonly ly: number;
  readonly processes: readonly ProcessNode[];
}

export interface Mote extends Point {
  readonly r: number;
  readonly phase: number;
  /** 0 = ivory, 1–6 = the map tones. The core is multicoloured. */
  readonly tone: number;
}

export interface MandalaLayout {
  readonly center: Point;
  readonly hubs: readonly HubNode[];
  readonly motes: readonly Mote[];
}

/* ------------------------------------------------------------------ hashing */

/** FNV-1a 32-bit — stable ids, stable picture, no hydration drift. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function unit(input: string): number {
  return hash(input) / 0x100000000;
}

/* ----------------------------------------------------------------- geometry */

function polar(angleDeg: number, radius: number): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: round(C + Math.cos(rad) * radius),
    y: round(C + Math.sin(rad) * radius),
  };
}

/**
 * The particle core — the reference's "company brain". Dense at the middle,
 * thinning outward, every tone plus ivory. Decorative, never announced.
 */
function buildMotes(): Mote[] {
  const COUNT = 110;
  return Array.from({ length: COUNT }, (_, i) => {
    const seed = `mote-${i}`;
    const angle = unit(seed) * 360;
    const radius = 6 + unit(`${seed}r`) ** 1.7 * 132;
    return {
      ...polar(angle, radius),
      r: 1 + unit(`${seed}s`) * 2.4,
      phase: hash(seed) % 8,
      tone: hash(`${seed}t`) % 7,
    };
  });
}

/**
 * Build the mandala. Pure and closed-form — the test calls it twice and
 * asserts identity, and asserts every ring relation stated above.
 */
export function layoutMandala(domains: readonly DomainSpec[] = DOMAINS): MandalaLayout {
  const step = 360 / domains.length;

  const hubs = domains.map((domain, index): HubNode => {
    const angle = ANGLE_OFFSET + index * step;
    const at = polar(angle, R_HUB);
    const label = polar(angle, R_HUB + 52);

    const processes = domain.processes.map((processId, p): ProcessNode => {
      const processAngle = angle + PROCESS_OFFSETS[p]!;
      const orbit = PROCESS_ORBITS[p]!;
      return {
        id: processId,
        domain: domain.id,
        tone: domain.tone,
        index: p + 1,
        orbit,
        angle: processAngle,
        phase: hash(processId) % 8,
        ...polar(processAngle, orbit),
      };
    });

    return {
      id: domain.id,
      tone: domain.tone,
      glyph: domain.glyph,
      angle,
      phase: hash(domain.id) % 8,
      lx: label.x,
      ly: label.y,
      processes,
      ...at,
    };
  });

  return { center: { x: C, y: C }, hubs, motes: buildMotes() };
}

/** Two decimals — sub-pixel at any rendered size, keeps the markup small. */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}
