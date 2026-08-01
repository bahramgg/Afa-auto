/* -----------------------------------------------------------------------------
   The operating map — structure and geometry, with no React and no strings.

   FIFTH LAYOUT, 2026-08, redrawn from scratch on the note «قشنگ‌تر و تمیزتر و
   حرفه‌ای‌تر». The fourth was an operator-console pastiche: a blueprint grid,
   four dashed guide circles, seventy-two stage nodes and a hundred crossing
   hairlines. Dense, but noisy — at any real rendered size it read as static.

   What replaced it is a WHEEL with three rings and nothing else:

     · a small particle core inside one thin circle;
     · six domain badges on the inner ring, each labelled INWARD, into the
       empty annulus between core and ring — the one part of the drawing
       nothing else wants;
     · twenty-four process rings on the outer ring, four inside each domain's
       60° sector, reached by a QUADRATIC BEZIER that leaves the badge along
       its own ray and bows into place. Curves, not spokes: the fan a curve
       draws is what makes six identical sectors look designed rather than
       generated.

   The seventy-two stage nodes are gone from this view. They still exist in
   the model and are drawn, labelled, in the opened-domain fan below — which
   is where a visitor can actually read them. The crowd was costing the
   drawing its hierarchy and buying nothing back.

   Everything is CLOSED-FORM: angles and radii computed from indices, no
   randomness anywhere except the two particle fields, which hash stable ids —
   the layout renders identically on server and client, forever.
   -------------------------------------------------------------------------- */

/* ------------------------------------------------------------ radial stage */

/** Square stage, sized so the drawing fills it with one clear margin. */
export const VIEW = 860;

const C = VIEW / 2;

/** Three radii, and only three. The gaps ARE the hierarchy. */
export const R_CORE = 52;
export const R_DOMAIN = 240;
export const R_PROCESS = 370;

/* Where a domain's name sits: inward, in the empty annulus. The inset has to
   clear HALF A LABEL plus the badge, or the two domains at 3 and 9 o'clock
   print their names straight through their own badges — the first draft of
   this layout did exactly that. */
const LABEL_INSET = 80;

/** Process angular offsets inside a domain's 40° sector. */
const PROCESS_OFFSETS = [-15, -5, 5, 15] as const;

/** The bezier's control point: outward of the badge, barely off its ray. */
const CURVE_RADIUS = 300;
const CURVE_LEAN = 0.34;

/* Nine domains at 0°, 40°, …, 320°. Zero rather than a half-step offset
   because 40° × 9 puts NO domain at 180°, which is where the stepper pill
   floats; a domain there would print its label straight through the control. */
const ANGLE_OFFSET = 0;

export type DomainId =
  | 'sales'
  | 'voice'
  | 'support'
  | 'operations'
  | 'finance'
  | 'loyalty'
  | 'marketing'
  | 'content'
  | 'intelligence';

/**
 * The three MACHINE stages of a process, in order. They are the top row of
 * the opened-domain fan. The fourth field — the human checkpoint — is
 * deliberately not one of them: it is drawn as its own square, because on
 * this map the human is a different kind of node, not a fourth step.
 */
export const STAGES = ['trigger', 'decision', 'action'] as const;
export type StageId = (typeof STAGES)[number];

/**
 * The second channel carrying domain identity, so the map is not colour-alone
 * (WCAG 2.1 §1.4.1). Drawn inside the badge ring.
 */
export type Glyph =
  | 'circle'
  | 'square'
  | 'diamond'
  | 'triangle'
  | 'hexagon'
  | 'cross'
  | 'pentagon'
  | 'chevron'
  | 'bars';

/** Index into `--map-1…9`. A number so CSS can select on it. */
export type Tone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface DomainSpec {
  readonly id: DomainId;
  readonly tone: Tone;
  readonly glyph: Glyph;
  /** Process ids in display order — offsets above are applied in this order. */
  readonly processes: readonly string[];
}

/* The structure itself. NINE domains as of 2026-08, four real processes each:
   the phone operator, the loyalty club and content production were added by
   direct request, alongside everything that already ran without a person in
   the loop. The content contract with messages/ is otherwise unchanged.

   Order is the reading order round the wheel, clockwise from the top. */
export const DOMAINS: readonly DomainSpec[] = [
  {
    id: 'sales',
    tone: 1,
    glyph: 'circle',
    processes: ['lead-capture', 'quote', 'deal-followup', 'handoff'],
  },
  {
    id: 'voice',
    tone: 7,
    glyph: 'chevron',
    processes: ['call-answer', 'call-book', 'call-route', 'call-log'],
  },
  {
    id: 'support',
    tone: 5,
    glyph: 'triangle',
    processes: ['triage', 'first-reply', 'escalation', 'csat'],
  },
  {
    id: 'operations',
    tone: 2,
    glyph: 'square',
    processes: ['order-intake', 'stock-check', 'dispatch', 'sla-watch'],
  },
  {
    id: 'finance',
    tone: 4,
    glyph: 'diamond',
    processes: ['invoice', 'reconcile', 'dunning', 'payout'],
  },
  {
    id: 'loyalty',
    tone: 8,
    glyph: 'pentagon',
    processes: ['club-join', 'club-points', 'club-winback', 'club-occasion'],
  },
  {
    id: 'marketing',
    tone: 6,
    glyph: 'hexagon',
    processes: ['segment', 'campaign', 'content-queue', 'attribution'],
  },
  {
    id: 'content',
    tone: 9,
    glyph: 'bars',
    processes: ['content-plan', 'content-draft', 'content-publish', 'content-review'],
  },
  {
    id: 'intelligence',
    tone: 3,
    glyph: 'cross',
    processes: ['daily-brief', 'anomaly', 'forecast', 'board-pack'],
  },
] as const;

/** Every process id on the map, flattened. Validates the message catalogs. */
export const PROCESS_IDS: readonly string[] = DOMAINS.flatMap((d) => d.processes);

/** What the legend counts, across BOTH drawings. Read off the structure. */
export const COUNTS = {
  domains: DOMAINS.length,
  processes: PROCESS_IDS.length,
  stages: PROCESS_IDS.length * STAGES.length,
  humans: PROCESS_IDS.length,
} as const;

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
  /** Degrees from 12 o'clock. */
  readonly angle: number;
  /** 0–7 animation-delay bucket. */
  readonly phase: number;
  /** Quadratic control point for the badge → process curve. */
  readonly cx: number;
  readonly cy: number;
}

export interface HubNode extends Point {
  readonly id: DomainId;
  readonly tone: Tone;
  readonly glyph: Glyph;
  readonly angle: number;
  readonly phase: number;
  /** Label anchor — inward, between the core and the badge ring. */
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

/** A filament between two motes — the web running through the core. */
export interface Filament {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export interface MandalaLayout {
  readonly center: Point;
  readonly hubs: readonly HubNode[];
  readonly motes: readonly Mote[];
  readonly filaments: readonly Filament[];
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

/**
 * FNV alone is not good enough to scatter WITH. Its low bits are fine but the
 * high bits of short sequential keys ("core-0", "core-1", …) stay correlated,
 * and a particle field built straight off them comes out in visible spokes
 * rather than a cloud. Running the classic lowbias32 finaliser over it costs
 * three multiplies and buys an even distribution.
 */
function unit(input: string): number {
  let h = hash(input);
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return (h >>> 0) / 0x100000000;
}

/* ----------------------------------------------------------------- geometry */

function polar(angleDeg: number, radius: number, cx = C, cy = C): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: round(cx + Math.cos(rad) * radius),
    y: round(cy + Math.sin(rad) * radius),
  };
}

/**
 * A particle field — the company brain at the centre. Dense at the middle,
 * thinning outward, mostly ivory with the tones running through it.
 * Decorative, never announced. `seed` keeps two fields on the same page from
 * being the same picture.
 */
function buildMotes(count: number, spread: number, seed: string, cx = C, cy = C): Mote[] {
  return Array.from({ length: count }, (_, i) => {
    const key = `${seed}-${i}`;
    const angle = unit(key) * 360;
    const radius = spread * 0.05 + unit(`${key}r`) ** 1.55 * spread;
    return {
      ...polar(angle, radius, cx, cy),
      r: 0.7 + unit(`${key}s`) * 1.5,
      phase: hash(key) % 8,
      /* Half the field is ivory. An evenly-mixed core reads as confetti; a
         brain is a pale mass with colour running through it. */
      tone: Math.max(0, (hash(`${key}t`) % 18) - 8),
    };
  });
}

/**
 * The web through the core. Take it away and the middle reads as a spray of
 * dots. Each mote reaches for a fixed, co-prime-strided neighbour and keeps
 * the link only if it is short — a closed-form stand-in for nearest-neighbour
 * that costs no sort.
 */
function buildFilaments(motes: readonly Mote[], reach: number): Filament[] {
  const out: Filament[] = [];
  for (let i = 0; i < motes.length; i += 1) {
    for (const stride of [7, 23]) {
      const a = motes[i]!;
      const b = motes[(i * stride + 5) % motes.length]!;
      if (Math.hypot(a.x - b.x, a.y - b.y) < reach) {
        out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }
    }
  }
  return out;
}

/**
 * Build the wheel. Pure and closed-form — the test calls it twice and asserts
 * identity, and asserts every ring relation stated above.
 */
export function layoutMandala(domains: readonly DomainSpec[] = DOMAINS): MandalaLayout {
  const step = 360 / domains.length;

  const hubs = domains.map((domain, index): HubNode => {
    const angle = ANGLE_OFFSET + index * step;
    const at = polar(angle, R_DOMAIN);
    const label = polar(angle, R_DOMAIN - LABEL_INSET);

    const processes = domain.processes.map((processId, p): ProcessNode => {
      const offset = PROCESS_OFFSETS[p]!;
      const processAngle = angle + offset;
      const control = polar(angle + offset * CURVE_LEAN, CURVE_RADIUS);

      return {
        id: processId,
        domain: domain.id,
        tone: domain.tone,
        index: p + 1,
        angle: processAngle,
        phase: hash(processId) % 8,
        cx: control.x,
        cy: control.y,
        ...polar(processAngle, R_PROCESS),
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

  const motes = buildMotes(200, 38, 'core');

  return {
    center: { x: C, y: C },
    hubs,
    motes,
    filaments: buildFilaments(motes, 17),
  };
}

/* --------------------------------------------------------------- the fan */

/** Landscape stage for the opened domain. */
export const FAN_W = 1120;
export const FAN_H = 840;

const FAN_CX = FAN_W / 2;

/** Row baselines, top to bottom: stages · processes · humans · the domain. */
export const FAN_Y_STAGE = 140;
export const FAN_Y_PROCESS = 326;
export const FAN_Y_HUMAN = 470;
export const FAN_Y_DOMAIN = 600;
export const FAN_Y_SEED = 716;

const FAN_STAGE_STEP = 84;
const FAN_PROCESS_STEP = 176;

export interface FanStage extends Point {
  readonly id: string;
  readonly stage: StageId;
  readonly process: string;
  readonly index: number;
  readonly phase: number;
  /** Labels stagger on two lines so twelve of them can sit side by side. */
  readonly ly: number;
}

export interface FanProcess extends Point {
  readonly id: string;
  readonly index: number;
  readonly phase: number;
  /** The human checkpoint hanging under it. */
  readonly hx: number;
  readonly hy: number;
  readonly stages: readonly FanStage[];
}

export interface FanLayout {
  readonly domain: DomainId;
  readonly tone: Tone;
  readonly glyph: Glyph;
  readonly hub: Point;
  readonly seed: Point;
  readonly processes: readonly FanProcess[];
  readonly motes: readonly Mote[];
  readonly filaments: readonly Filament[];
}

/** Build the opened-domain drawing. Pure, closed-form, deterministic. */
export function layoutFan(domainId: DomainId, domains: readonly DomainSpec[] = DOMAINS): FanLayout {
  const spec = domains.find((d) => d.id === domainId) ?? domains[0]!;
  const n = spec.processes.length;

  const processes = spec.processes.map((processId, p): FanProcess => {
    const x = round(FAN_CX + (p - (n - 1) / 2) * FAN_PROCESS_STEP);

    const stages = STAGES.map((stage, s): FanStage => {
      const k = s * n + p;
      const id = `${processId}:${stage}`;
      return {
        id,
        stage,
        process: processId,
        index: k,
        phase: hash(id) % 8,
        x: round(FAN_CX + (k - (n * STAGES.length - 1) / 2) * FAN_STAGE_STEP),
        y: FAN_Y_STAGE,
        ly: FAN_Y_STAGE + (k % 2 === 0 ? 30 : 52),
      };
    });

    return {
      id: processId,
      index: p + 1,
      phase: hash(processId) % 8,
      x,
      y: FAN_Y_PROCESS,
      hx: x,
      hy: FAN_Y_HUMAN,
      stages,
    };
  });

  const motes = buildMotes(150, 38, `seed-${spec.id}`, FAN_CX, FAN_Y_SEED);

  return {
    domain: spec.id,
    tone: spec.tone,
    glyph: spec.glyph,
    hub: { x: FAN_CX, y: FAN_Y_DOMAIN },
    seed: { x: FAN_CX, y: FAN_Y_SEED },
    processes,
    motes,
    filaments: buildFilaments(motes, 17),
  };
}

/** Two decimals — sub-pixel at any rendered size, keeps the markup small. */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}
