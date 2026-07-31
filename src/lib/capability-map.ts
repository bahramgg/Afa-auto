/* -----------------------------------------------------------------------------
   The operating map — structure and geometry, with no React and no strings.

   FOURTH LAYOUT, 2026-07-31, built to the operator-console reel AFA supplied
   ("OPTIMAL ENGINE"). Two drawings, not one, because the reference has two:

     RADIAL — the whole system at once. A particle core inside a thin ring,
     then THREE orbits outward: six domain badges, twenty-four process nodes,
     and a dense outer ring of stage nodes. Reading outward is reading down
     the hierarchy, and the crowd on the outside is the point — it is what
     makes the drawing look like a company rather than a diagram.

     FAN — one domain, opened. The reference drops the chosen domain to the
     bottom of the stage with its own particle seed, fans dotted rays up to a
     row of square task nodes, runs one vertical line from each square up to
     its agent, and lets the agents fan wide into a top row of tool nodes.
     Ours is the same drawing with AFA's own four fields on it: the domain,
     its four HUMAN CHECKPOINTS as the squares, its four PROCESSES as the
     circles, and the three machine stages of each process as the top row.

   Everything is CLOSED-FORM: angles and radii computed from indices, no
   randomness anywhere except the two particle fields, which hash stable ids —
   the layout renders identically on server and client, forever.
   -------------------------------------------------------------------------- */

/* ------------------------------------------------------------ radial stage */

/** Square stage. Panels flank it in the page grid; the drawing stays square. */
export const VIEW = 1120;

const C = VIEW / 2;

/** Orbit radii. The gaps ARE the hierarchy: core → domains → processes → stages. */
export const R_CORE = 92;
export const R_DOMAIN = 172;
export const R_PROCESS_IN = 300;
export const R_PROCESS_OUT = 348;
export const R_STAGE_IN = 436;
export const R_STAGE_OUT = 464;

/* Process angular offsets inside a domain's 60° sector, paired with orbit
   alternation in-out-in-out — the texture the reference's double ring has. */
const PROCESS_OFFSETS = [-21, -7, 7, 21] as const;
const PROCESS_ORBITS = [R_PROCESS_IN, R_PROCESS_OUT, R_PROCESS_IN, R_PROCESS_OUT] as const;

/** Twelve stage nodes per domain, evenly spread across its sector. */
const STAGE_STEP = 4.6;

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
 * The three MACHINE stages of a process, in order. They are the outer ring of
 * the radial drawing and the top row of the fan. The fourth field — the human
 * checkpoint — is deliberately not one of them: it is drawn as its own square,
 * because on this map the human is a different kind of node, not a fourth step.
 */
export const STAGES = ['trigger', 'decision', 'action'] as const;
export type StageId = (typeof STAGES)[number];

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
   contract with messages/ is unchanged across all four layouts. */
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

/** What the legend counts. Real numbers, read off the structure — never typed. */
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

/** One machine stage of one process — the outer ring / the fan's top row. */
export interface StageNode extends Point {
  readonly id: string;
  readonly stage: StageId;
  readonly process: string;
  readonly domain: DomainId;
  readonly tone: Tone;
  readonly phase: number;
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
  readonly stages: readonly StageNode[];
}

export interface HubNode extends Point {
  readonly id: DomainId;
  readonly tone: Tone;
  readonly glyph: Glyph;
  readonly angle: number;
  readonly phase: number;
  /** Label anchor, just under the badge — the reference sets it there. */
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

/** A filament between two motes — the web running through the reference's core. */
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
 * A particle field — the reference's "company brain". Dense at the middle,
 * thinning outward, every tone plus ivory. Decorative, never announced.
 * `seed` keeps two fields on the same page from being the same picture.
 */
function buildMotes(count: number, spread: number, seed: string, cx = C, cy = C): Mote[] {
  return Array.from({ length: count }, (_, i) => {
    const key = `${seed}-${i}`;
    const angle = unit(key) * 360;
    const radius = spread * 0.05 + unit(`${key}r`) ** 1.55 * spread;
    return {
      ...polar(angle, radius, cx, cy),
      r: 0.8 + unit(`${key}s`) * 1.9,
      phase: hash(key) % 8,
      /* Half the field is ivory. An evenly-mixed core reads as confetti; the
         reference's brain is a pale mass with colour running through it. */
      tone: Math.max(0, (hash(`${key}t`) % 12) - 5),
    };
  });
}

/**
 * The web through the core. The reference's brain is not a spray of dots, it
 * is a MESH — take that away and the middle of the map reads as noise. Each
 * mote reaches for a fixed, co-prime-strided neighbour and keeps the link only
 * if it is short, which is a closed-form stand-in for nearest-neighbour and
 * costs no sort.
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
 * Build the radial map. Pure and closed-form — the test calls it twice and
 * asserts identity, and asserts every ring relation stated above.
 */
export function layoutMandala(domains: readonly DomainSpec[] = DOMAINS): MandalaLayout {
  const step = 360 / domains.length;

  const hubs = domains.map((domain, index): HubNode => {
    const angle = ANGLE_OFFSET + index * step;
    const at = polar(angle, R_DOMAIN);

    const processes = domain.processes.map((processId, p): ProcessNode => {
      const processAngle = angle + PROCESS_OFFSETS[p]!;
      const orbit = PROCESS_ORBITS[p]!;

      /* Stages are laid out ACROSS the domain's whole sector, grouped by stage
         rather than by process — so a process's three lines splay wide and
         cross its neighbours'. That crossing is the reference's texture; three
         stages bunched over their own process would read as a comb. */
      const stages = STAGES.map((stage, s): StageNode => {
        const k = s * domain.processes.length + p;
        const stageAngle = angle + (k - 5.5) * STAGE_STEP;
        const id = `${processId}:${stage}`;
        return {
          id,
          stage,
          process: processId,
          domain: domain.id,
          tone: domain.tone,
          phase: hash(id) % 8,
          ...polar(stageAngle, k % 2 === 0 ? R_STAGE_IN : R_STAGE_OUT),
        };
      });

      return {
        id: processId,
        domain: domain.id,
        tone: domain.tone,
        index: p + 1,
        orbit,
        angle: processAngle,
        phase: hash(processId) % 8,
        stages,
        ...polar(processAngle, orbit),
      };
    });

    return {
      id: domain.id,
      tone: domain.tone,
      glyph: domain.glyph,
      angle,
      phase: hash(domain.id) % 8,
      lx: at.x,
      ly: round(at.y + 42),
      processes,
      ...at,
    };
  });

  const motes = buildMotes(340, 80, 'core');

  return {
    center: { x: C, y: C },
    hubs,
    motes,
    filaments: buildFilaments(motes, 34),
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
