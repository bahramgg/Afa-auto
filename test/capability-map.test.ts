import { describe, expect, it } from 'vitest';
import {
  DOMAINS,
  PROCESS_IDS,
  VIEW,
  R_HUB,
  R_ORBIT_IN,
  R_ORBIT_OUT,
  layoutMandala,
  type HubNode,
  type ProcessNode,
} from '@/lib/capability-map';
import fa from '../messages/fa.json';
import en from '../messages/en.json';

// Third geometry, third contract. The mandala is closed-form, so these tests
// are mostly exact equalities rather than tolerances — which is the point of
// a closed-form layout. The invariants that survived all three layouts are
// the ones that matter most: determinism, bounds, collision, and that both
// catalogs describe every node in full.

const layout = layoutMandala();

const allProcesses: ProcessNode[] = layout.hubs.flatMap((h) => [...h.processes]);
const interactive: (HubNode | ProcessNode)[] = [...layout.hubs, ...allProcesses];

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

describe('operating mandala — structure', () => {
  it('lays out every declared domain and process', () => {
    expect(layout.hubs).toHaveLength(DOMAINS.length);
    expect(allProcesses).toHaveLength(PROCESS_IDS.length);
    expect(allProcesses.map((p) => p.id).sort()).toEqual([...PROCESS_IDS].sort());
  });

  it('gives every domain a distinct tone and a distinct glyph', () => {
    expect(new Set(DOMAINS.map((d) => d.tone)).size).toBe(DOMAINS.length);
    expect(new Set(DOMAINS.map((d) => d.glyph)).size).toBe(DOMAINS.length);
  });

  it('numbers each domain volume 1..4 in declared order', () => {
    for (const hub of layout.hubs) {
      expect(hub.processes.map((p) => p.index)).toEqual([1, 2, 3, 4]);
      const spec = DOMAINS.find((d) => d.id === hub.id)!;
      expect(hub.processes.map((p) => p.id)).toEqual([...spec.processes]);
    }
  });
});

describe('operating mandala — geometry', () => {
  it('is deterministic, so the server and the browser draw the same picture', () => {
    expect(layoutMandala()).toEqual(layoutMandala());
  });

  it('keeps every node inside the stage', () => {
    const points = [...interactive, ...layout.motes];
    for (const p of points) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(VIEW);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(VIEW);
    }
  });

  it('spaces the hubs evenly at 60°, avoiding dead top and bottom', () => {
    expect(layout.hubs.map((h) => h.angle)).toEqual([30, 90, 150, 210, 270, 330]);
  });

  it('rides exactly the three declared radii', () => {
    for (const hub of layout.hubs) {
      expect(distance(hub, layout.center)).toBeCloseTo(R_HUB, 0);
      for (const process of hub.processes) {
        expect(distance(process, layout.center)).toBeCloseTo(process.orbit, 0);
        expect([R_ORBIT_IN, R_ORBIT_OUT]).toContain(process.orbit);
      }
      // Orbit alternation in-out-in-out — the double-ring texture.
      expect(hub.processes.map((p) => p.orbit)).toEqual([
        R_ORBIT_IN,
        R_ORBIT_OUT,
        R_ORBIT_IN,
        R_ORBIT_OUT,
      ]);
    }
  });

  it('keeps every process inside its own domain sector', () => {
    // A node wandering into the neighbouring arc would visually re-assign it.
    for (const hub of layout.hubs) {
      for (const process of hub.processes) {
        expect(Math.abs(process.angle - hub.angle)).toBeLessThan(30);
      }
    }
  });

  it('never lets two interactive nodes crowd each other', () => {
    // Hubs draw at r≈26, process rings at r≈14, both with 44px hit targets at
    // display size. 34 viewBox units is the floor before halos collide.
    for (let i = 0; i < interactive.length; i += 1) {
      for (let j = i + 1; j < interactive.length; j += 1) {
        expect(distance(interactive[i]!, interactive[j]!)).toBeGreaterThan(34);
      }
    }
  });

  it('keeps the particle core clear of the hub ring', () => {
    for (const mote of layout.motes) {
      expect(distance(mote, layout.center)).toBeLessThan(R_HUB - 40);
    }
  });

  it('colours the core with the full palette', () => {
    const tones = new Set(layout.motes.map((m) => m.tone));
    expect(tones.size).toBe(7);
  });

  it('spreads animation phases across the buckets', () => {
    const phases = new Set([...interactive, ...layout.motes].map((n) => n.phase));
    expect(phases.size).toBeGreaterThanOrEqual(6);
    for (const n of [...interactive, ...layout.motes]) {
      expect(n.phase).toBeGreaterThanOrEqual(0);
      expect(n.phase).toBeLessThan(8);
    }
  });
});

describe('operating mandala — content', () => {
  // The map is only as good as the copy behind it. A node with no strings
  // renders as an unlabelled ring, which is worse than not shipping it.
  const REQUIRED = ['title', 'trigger', 'decision', 'action', 'human'] as const;

  it.each([
    ['fa', fa],
    ['en', en],
  ])('%s describes every domain and process in full', (_locale, catalog) => {
    const map = (catalog as Record<string, unknown>).Map as {
      domains: Record<string, Record<string, string>>;
      processes: Record<string, Record<string, string>>;
    };

    for (const domain of DOMAINS) {
      const entry = map.domains[domain.id];
      expect(entry, `Map.domains.${domain.id} is missing`).toBeTruthy();
      for (const field of ['title', 'summary', 'tags'] as const) {
        expect(String(entry?.[field] ?? '').trim().length).toBeGreaterThan(0);
      }
    }
    for (const id of PROCESS_IDS) {
      const entry = map.processes[id];
      expect(entry, `Map.processes.${id} is missing`).toBeTruthy();
      for (const field of REQUIRED) {
        expect(String(entry?.[field] ?? '').trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has no orphan copy for a node that is not on the map', () => {
    const declared = new Set<string>(PROCESS_IDS);
    const written = Object.keys(
      (fa as unknown as { Map: { processes: Record<string, unknown> } }).Map.processes,
    );
    expect(written.filter((id) => !declared.has(id))).toEqual([]);
  });
});
