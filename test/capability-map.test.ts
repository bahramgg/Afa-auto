import { describe, expect, it } from 'vitest';
import {
  COUNTS,
  DOMAINS,
  PROCESS_IDS,
  STAGES,
  VIEW,
  R_CORE,
  R_DOMAIN,
  R_PROCESS,
  FAN_W,
  FAN_H,
  layoutFan,
  layoutMandala,
  type HubNode,
  type ProcessNode,
} from '@/lib/capability-map';
import fa from '../messages/fa.json';
import en from '../messages/en.json';

// Fourth geometry, fourth contract. Both drawings are closed-form, so these
// tests are mostly exact equalities rather than tolerances — which is the
// point of a closed-form layout. The invariants that survived all four
// layouts are the ones that matter most: determinism, bounds, collision, and
// that both catalogs describe every node in full.

const layout = layoutMandala();

const allProcesses: ProcessNode[] = layout.hubs.flatMap((h) => [...h.processes]);
const interactive: (HubNode | ProcessNode)[] = [...layout.hubs, ...allProcesses];

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

describe('operating map — structure', () => {
  it('lays out every declared domain and process', () => {
    expect(layout.hubs).toHaveLength(DOMAINS.length);
    expect(allProcesses).toHaveLength(PROCESS_IDS.length);
    expect(allProcesses.map((p) => p.id).sort()).toEqual([...PROCESS_IDS].sort());
  });

  it('publishes counts that match the model, so the legend cannot drift', () => {
    // The wheel no longer DRAWS the stages (they are the fan's top row), but
    // the legend counts the model across both views.
    expect(COUNTS.domains).toBe(layout.hubs.length);
    expect(COUNTS.processes).toBe(allProcesses.length);
    expect(COUNTS.stages).toBe(allProcesses.length * STAGES.length);
    expect(COUNTS.humans).toBe(allProcesses.length);
  });

  it('gives every domain a distinct tone and a distinct glyph', () => {
    expect(new Set(DOMAINS.map((d) => d.tone)).size).toBe(DOMAINS.length);
    expect(new Set(DOMAINS.map((d) => d.glyph)).size).toBe(DOMAINS.length);
  });

  it('gives every domain a tone the stylesheet can actually paint', () => {
    // --map-1…9 exist; a tenth domain would render untoned.
    for (const domain of DOMAINS) {
      expect(domain.tone).toBeGreaterThanOrEqual(1);
      expect(domain.tone).toBeLessThanOrEqual(9);
    }
  });

  it('numbers each domain volume 1..4 in declared order', () => {
    for (const hub of layout.hubs) {
      expect(hub.processes.map((p) => p.index)).toEqual([1, 2, 3, 4]);
      const spec = DOMAINS.find((d) => d.id === hub.id)!;
      expect(hub.processes.map((p) => p.id)).toEqual([...spec.processes]);
    }
  });

  it('keeps the human checkpoint out of the machine stages', () => {
    // The human is drawn as its own kind of node in the fan, never as a
    // fourth step. If it ever creeps in here the drawing lies about the model.
    expect(STAGES).not.toContain('human');
    expect(STAGES).toHaveLength(3);
  });
});

describe('operating map — radial geometry', () => {
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

  it('spaces the domains evenly at 40°, leaving 180° free for the stepper', () => {
    expect(layout.hubs.map((h) => h.angle)).toEqual([0, 40, 80, 120, 160, 200, 240, 280, 320]);
  });

  it('rides exactly the two declared rings', () => {
    for (const hub of layout.hubs) {
      expect(distance(hub, layout.center)).toBeCloseTo(R_DOMAIN, 0);
      for (const process of hub.processes) {
        expect(distance(process, layout.center)).toBeCloseTo(R_PROCESS, 0);
      }
    }
  });

  it('bows every link instead of drawing a spoke', () => {
    // A control point ON the straight line would render as a spoke, which is
    // the drawing this layout replaced.
    for (const hub of layout.hubs) {
      for (const process of hub.processes) {
        const control = { x: process.cx, y: process.cy };
        expect(distance(control, layout.center)).toBeGreaterThan(R_DOMAIN);
        expect(distance(control, layout.center)).toBeLessThan(R_PROCESS);
        // Distance from the control point to the hub→process chord.
        const dx = process.x - hub.x;
        const dy = process.y - hub.y;
        const len = Math.hypot(dx, dy);
        const off =
          Math.abs(dx * (hub.y - control.y) - (hub.x - control.x) * dy) / len;
        expect(off).toBeGreaterThan(2);
      }
    }
  });

  it('reads outward as the hierarchy reads downward', () => {
    // core ring < domains < processes. If this inverts, the drawing stops
    // meaning anything.
    expect(R_CORE).toBeLessThan(R_DOMAIN);
    expect(R_DOMAIN).toBeLessThan(R_PROCESS);
    // And the whole wheel has to leave a margin inside the stage.
    expect(R_PROCESS + 20).toBeLessThan(VIEW / 2);
  });

  it('keeps every process inside its own domain sector', () => {
    // A node wandering into the neighbouring arc would visually re-assign it.
    for (const hub of layout.hubs) {
      for (const process of hub.processes) {
        expect(Math.abs(process.angle - hub.angle)).toBeLessThan(20);
      }
    }
  });

  it('labels each domain inward, clear of the core and its own badge', () => {
    for (const hub of layout.hubs) {
      const r = distance({ x: hub.lx, y: hub.ly }, layout.center);
      expect(r).toBeGreaterThan(R_CORE + 40);
      expect(r).toBeLessThan(R_DOMAIN - 20);
    }
    // Six labels on one ring must not run into each other.
    for (let i = 0; i < layout.hubs.length; i += 1) {
      for (let j = i + 1; j < layout.hubs.length; j += 1) {
        const a = layout.hubs[i]!;
        const b = layout.hubs[j]!;
          expect(distance({ x: a.lx, y: a.ly }, { x: b.lx, y: b.ly })).toBeGreaterThan(90);
      }
    }
  });

  it('never lets two interactive nodes crowd each other', () => {
    // Domains draw at r≈21, process rings at r≈13, both with 44px hit targets
    // at display size. 34 viewBox units is the floor before halos collide.
    for (let i = 0; i < interactive.length; i += 1) {
      for (let j = i + 1; j < interactive.length; j += 1) {
        expect(distance(interactive[i]!, interactive[j]!)).toBeGreaterThan(34);
      }
    }
  });

  it('keeps the particle core inside its ring', () => {
    for (const mote of layout.motes) {
      expect(distance(mote, layout.center)).toBeLessThan(R_CORE);
    }
  });

  it('webs the core together instead of leaving a spray of dots', () => {
    expect(layout.filaments.length).toBeGreaterThan(60);
    for (const f of layout.filaments) {
      // Both ends are motes, so both ends are inside the ring — and a filament
      // long enough to cross the core would read as a stray line, not a mesh.
      expect(distance({ x: f.x1, y: f.y1 }, layout.center)).toBeLessThan(R_CORE);
      expect(distance({ x: f.x2, y: f.y2 }, layout.center)).toBeLessThan(R_CORE);
      expect(distance({ x: f.x1, y: f.y1 }, { x: f.x2, y: f.y2 })).toBeLessThan(17);
    }
  });

  it('colours the core with the full palette', () => {
    // Ivory plus all nine domain tones.
    const tones = new Set(layout.motes.map((m) => m.tone));
    expect(tones.size).toBe(10);
  });

  it('spreads animation phases across the buckets', () => {
    const nodes = [...interactive, ...layout.motes];
    const phases = new Set(nodes.map((n) => n.phase));
    expect(phases.size).toBeGreaterThanOrEqual(6);
    for (const n of nodes) {
      expect(n.phase).toBeGreaterThanOrEqual(0);
      expect(n.phase).toBeLessThan(8);
    }
  });
});

describe('operating map — the opened domain', () => {
  const fans = DOMAINS.map((d) => layoutFan(d.id));

  it('is deterministic', () => {
    for (const domain of DOMAINS) {
      expect(layoutFan(domain.id)).toEqual(layoutFan(domain.id));
    }
  });

  it('draws every process of the domain it was asked for, and nothing else', () => {
    for (const domain of DOMAINS) {
      const fan = layoutFan(domain.id);
      expect(fan.domain).toBe(domain.id);
      expect(fan.tone).toBe(domain.tone);
      expect(fan.processes.map((p) => p.id)).toEqual([...domain.processes]);
      for (const process of fan.processes) {
        expect(process.stages.map((s) => s.stage)).toEqual([...STAGES]);
        expect(process.stages.map((s) => s.process)).toEqual([
          process.id,
          process.id,
          process.id,
        ]);
      }
    }
  });

  it('keeps every node inside the landscape stage', () => {
    for (const fan of fans) {
      const points = [
        fan.hub,
        fan.seed,
        ...fan.motes,
        ...fan.processes,
        ...fan.processes.map((p) => ({ x: p.hx, y: p.hy })),
        ...fan.processes.flatMap((p) => [...p.stages]),
      ];
      for (const p of points) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(FAN_W);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(FAN_H);
      }
    }
  });

  it('stacks the rows in reading order: stages, processes, checkpoints, domain', () => {
    for (const fan of fans) {
      for (const process of fan.processes) {
        for (const stage of process.stages) {
          expect(stage.y).toBeLessThan(process.y);
        }
        expect(process.y).toBeLessThan(process.hy);
        expect(process.hy).toBeLessThan(fan.hub.y);
        // The checkpoint hangs directly under its process — the plumb line.
        expect(process.hx).toBe(process.x);
      }
      expect(fan.hub.y).toBeLessThan(fan.seed.y);
    }
  });

  it('spaces the fan rows so no two labels sit on top of each other', () => {
    for (const fan of fans) {
      const xs = fan.processes.map((p) => p.x).sort((a, b) => a - b);
      for (let i = 1; i < xs.length; i += 1) {
        expect(xs[i]! - xs[i - 1]!).toBeGreaterThanOrEqual(120);
      }
      const stages = fan.processes.flatMap((p) => [...p.stages]);
      const sx = stages.map((s) => s.x).sort((a, b) => a - b);
      for (let i = 1; i < sx.length; i += 1) {
        expect(sx[i]! - sx[i - 1]!).toBeGreaterThanOrEqual(60);
      }
      // Twelve labels in one row only fit because they stagger onto two lines.
      expect(new Set(stages.map((s) => s.ly)).size).toBe(2);
    }
  });

  it('splays each process across the row instead of bunching its own three', () => {
    // Adjacent stage nodes must belong to DIFFERENT processes — that crossing
    // is the whole texture of the reference's fan.
    for (const fan of fans) {
      const row = fan.processes
        .flatMap((p) => p.stages.map((s) => ({ x: s.x, process: p.id })))
        .sort((a, b) => a.x - b.x);
      for (let i = 1; i < row.length; i += 1) {
        expect(row[i]!.process).not.toBe(row[i - 1]!.process);
      }
    }
  });
});

describe('operating map — content', () => {
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

  it('every drawn stage has a label to draw', () => {
    // The fan writes the stage name under each of its twelve top nodes; a
    // stage with no key in the catalog would render an empty label.
    const labels = (fa as unknown as { Map: Record<string, string> }).Map;
    for (const stage of STAGES) {
      const key = `step${stage[0]!.toUpperCase()}${stage.slice(1)}`;
      expect(String(labels[key] ?? '').trim().length).toBeGreaterThan(0);
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
