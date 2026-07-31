'use client';

import { useCallback, useId, useMemo, useState } from 'react';
import {
  DOMAINS,
  VIEW,
  R_HUB,
  R_ORBIT_IN,
  R_ORBIT_OUT,
  layoutMandala,
  type DomainId,
  type Glyph,
  type HubNode,
  type ProcessNode,
} from '@/lib/capability-map';
import { cn } from '@/lib/cn';

/* -----------------------------------------------------------------------------
   The operating map, operator-OS edition — rebuilt 2026-07-31 to the reel AFA
   supplied. The composition is the reference's, one to one:

     [ directory panel ]  [ blueprint stage: the mandala ]  [ legend panel ]
                              drawer overlays the stage
                          [ ‹ domain stepper › ]  [ statusline ]

   Every string arrives resolved from the server; the Map catalog never enters
   the client bundle. Selection semantics are unchanged from the first build:
   click a hub → its volume opens and the rest recede; click a ring → the
   process drawer; click again or Esc → closed. The LIST view stays — the
   screen-reader's, printer's and skimmer's fair deal.
   -------------------------------------------------------------------------- */

export interface ProcessCopy {
  readonly title: string;
  readonly trigger: string;
  readonly decision: string;
  readonly action: string;
  readonly human: string;
}

export interface DomainCopy {
  readonly title: string;
  readonly summary: string;
  readonly tags: string;
}

export interface CapabilityMapCopy {
  readonly hub: string;
  readonly hubNote: string;
  readonly viewMap: string;
  readonly viewList: string;
  readonly viewLabel: string;
  readonly reset: string;
  readonly close: string;
  readonly stepTrigger: string;
  readonly stepDecision: string;
  readonly stepAction: string;
  readonly stepHuman: string;
  readonly processesLabel: string;
  readonly figureLabel: string;
  /** Operator-OS chrome. */
  readonly directoryLabel: string;
  readonly legendLabel: string;
  readonly statusline: string;
  readonly prevDomain: string;
  readonly nextDomain: string;
  readonly domains: Readonly<Record<DomainId, DomainCopy>>;
  readonly processes: Readonly<Record<string, ProcessCopy>>;
}

type Selection =
  | { readonly kind: 'domain'; readonly domain: DomainId }
  | { readonly kind: 'process'; readonly domain: DomainId; readonly process: string }
  | null;

const layout = layoutMandala();

const HUB_R = 26;
const PROC_R = 14;
const HIT_R = 30;

export function CapabilityMap({ copy }: { copy: CapabilityMapCopy }) {
  const [selection, setSelection] = useState<Selection>(null);
  const [view, setView] = useState<'map' | 'list'>('map');
  const titleId = useId();

  const activeDomain = selection?.domain ?? null;
  const activeTone = activeDomain
    ? DOMAINS.find((d) => d.id === activeDomain)?.tone
    : undefined;

  const select = useCallback((next: Selection) => {
    setSelection((current) => {
      if (
        current &&
        current.kind === next?.kind &&
        current.domain === next?.domain &&
        (current.kind !== 'process' ||
          (next.kind === 'process' && current.process === next.process))
      ) {
        return null;
      }
      return next;
    });
  }, []);

  /* The ‹ › stepper cycles domains, reference-style. From nothing it opens
     the first; from a process it steps to the neighbouring DOMAIN. */
  const step = useCallback(
    (direction: 1 | -1) => {
      const ids = DOMAINS.map((d) => d.id);
      const at = activeDomain ? ids.indexOf(activeDomain) : direction === 1 ? -1 : 0;
      const next = ids[(at + direction + ids.length) % ids.length]!;
      setSelection({ kind: 'domain', domain: next });
    },
    [activeDomain],
  );

  const detail = useMemo(() => {
    if (!selection) return null;
    if (selection.kind === 'process') {
      const process = copy.processes[selection.process];
      return process
        ? { kind: 'process' as const, id: selection.process, domain: selection.domain, process }
        : null;
    }
    return {
      kind: 'domain' as const,
      id: selection.domain,
      domain: copy.domains[selection.domain],
    };
  }, [selection, copy]);

  return (
    <div
      onKeyDown={(event) => {
        if (event.key === 'Escape') setSelection(null);
      }}
    >
      <div className="mb-4 flex items-center justify-center lg:justify-start">
        <ViewToggle copy={copy} view={view} onChange={setView} />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)_14rem]">
        {/* DIRECTORY — every process, one row each, reference-left. */}
        <aside className={cn('tmapPanel order-2 lg:order-1', view === 'list' && 'hidden')}>
          <p className="tmapPanelHead">{copy.directoryLabel}</p>
          <ul className="max-h-[26rem] overflow-y-auto p-2 lg:max-h-[34rem]">
            {DOMAINS.map((domain) =>
              domain.processes.map((processId, index) => (
                <li key={processId} className="cmap" data-tone={domain.tone}>
                  <button
                    type="button"
                    onClick={() =>
                      select({ kind: 'process', domain: domain.id, process: processId })
                    }
                    aria-pressed={
                      selection?.kind === 'process' && selection.process === processId
                    }
                    className={cn(
                      'flex min-h-9 w-full items-center gap-2.5 rounded-field px-2.5 text-start text-xs transition-colors',
                      selection?.kind === 'process' && selection.process === processId
                        ? 'bg-ink/10 text-ink'
                        : 'text-muted hover:bg-ink/5 hover:text-ink',
                    )}
                  >
                    <span
                      aria-hidden
                      className="grid size-5 shrink-0 place-items-center rounded-pill border border-[var(--tone)] font-mono text-[9px] text-dim"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {copy.processes[processId]?.title}
                    </span>
                  </button>
                </li>
              )),
            )}
          </ul>
        </aside>

        {/* THE STAGE. */}
        <div className="order-1 lg:order-2">
          <div className={cn('tmapStage', view === 'list' && 'hidden')}>
            <svg
              className="tmap relative"
              viewBox={`0 0 ${VIEW} ${VIEW}`}
              role="group"
              aria-labelledby={titleId}
              data-focus={activeDomain ?? undefined}
              data-tone={activeTone}
            >
              <title id={titleId}>{copy.figureLabel}</title>

              <g className="tmapScene">
                {/* Orbit guides. */}
                <g aria-hidden="true">
                  {[R_HUB, R_ORBIT_IN, R_ORBIT_OUT].map((radius) => (
                    <circle
                      key={radius}
                      className="tmapGuide"
                      cx={layout.center.x}
                      cy={layout.center.y}
                      r={radius}
                    />
                  ))}
                </g>

                {/* The particle core. */}
                <g aria-hidden="true">
                  {layout.motes.map((mote, index) => (
                    <circle
                      key={index}
                      className="tmapMote tmapIn"
                      data-mote={mote.tone}
                      data-phase={mote.phase}
                      cx={mote.x}
                      cy={mote.y}
                      r={mote.r}
                    />
                  ))}
                </g>

                {layout.hubs.map((hub) => (
                  <DomainVolume
                    key={hub.id}
                    hub={hub}
                    copy={copy}
                    selection={selection}
                    isActive={activeDomain === hub.id}
                    onSelect={select}
                  />
                ))}
              </g>
            </svg>

            {/* The drawer, over the stage on desktop, reference-style. */}
            <div
              aria-live="polite"
              className={cn(
                'lg:absolute lg:inset-y-4 lg:start-4 lg:w-[21.5rem] lg:overflow-y-auto',
                !detail && 'hidden lg:block lg:pointer-events-none',
              )}
            >
              {detail && (
                <Drawer copy={copy} detail={detail} onSelect={select} onClear={() => setSelection(null)} step={step} />
              )}
            </div>

            {/* The ‹ domain › stepper, bottom-centre. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
              <div className="pointer-events-auto flex items-center gap-1 rounded-pill border border-border-glass bg-bg-950/80 px-1.5 py-1 backdrop-blur">
                <StepButton label={copy.prevDomain} onClick={() => step(-1)} glyphPath="M8.5 3.5 5 7l3.5 3.5" />
                <span className="min-w-[7.5rem] text-center font-mono text-xs font-semibold uppercase tracking-[0.1em] text-ink">
                  {activeDomain ? copy.domains[activeDomain].title : copy.hub}
                </span>
                <StepButton label={copy.nextDomain} onClick={() => step(1)} glyphPath="M5.5 3.5 9 7l-3.5 3.5" />
              </div>
            </div>
          </div>

          <p className={cn('tmapStatus mt-2.5 text-center lg:text-start', view === 'list' && 'hidden')}>
            {copy.statusline}
          </p>

          <div className={cn('tmapList', view === 'map' && 'hidden')}>
            <ListView copy={copy} />
          </div>
        </div>

        {/* LEGEND — six domains, reference-right. */}
        <aside className={cn('tmapPanel order-3', view === 'list' && 'hidden')}>
          <p className="tmapPanelHead">{copy.legendLabel}</p>
          <ul className="p-2">
            {DOMAINS.map((domain) => (
              <li key={domain.id} className="cmap" data-tone={domain.tone}>
                <button
                  type="button"
                  onClick={() => select({ kind: 'domain', domain: domain.id })}
                  aria-pressed={activeDomain === domain.id}
                  className={cn(
                    'flex min-h-10 w-full items-center gap-3 rounded-field px-2.5 text-start text-sm transition-colors',
                    activeDomain === domain.id
                      ? 'bg-ink/10 text-ink'
                      : 'text-muted hover:bg-ink/5 hover:text-ink',
                  )}
                >
                  <span aria-hidden className="size-2.5 shrink-0 rounded-pill bg-[var(--tone)]" />
                  <span className="min-w-0 flex-1 truncate">{copy.domains[domain.id].title}</span>
                  <span aria-hidden className="font-mono text-[10px] text-dim">
                    4
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-dim">
            {copy.hubNote}
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ toggle */

function ViewToggle({
  copy,
  view,
  onChange,
}: {
  copy: CapabilityMapCopy;
  view: 'map' | 'list';
  onChange: (next: 'map' | 'list') => void;
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-field border border-border bg-[var(--win-bar)] p-1"
      role="group"
      aria-label={copy.viewLabel}
    >
      {(['map', 'list'] as const).map((candidate) => (
        <button
          key={candidate}
          type="button"
          onClick={() => onChange(candidate)}
          aria-pressed={view === candidate}
          className={cn(
            'min-h-9 rounded-[8px] px-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
            view === candidate ? 'bg-ink text-bg-950' : 'text-dim hover:text-muted',
          )}
        >
          {candidate === 'map' ? copy.viewMap : copy.viewList}
        </button>
      ))}
    </div>
  );
}

function StepButton({
  label,
  onClick,
  glyphPath,
}: {
  label: string;
  onClick: () => void;
  glyphPath: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-9 place-items-center rounded-pill text-dim transition-colors hover:text-ink"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="rtl:-scale-x-100">
        <path d={glyphPath} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* -------------------------------------------------------------- one domain */

function DomainVolume({
  hub,
  copy,
  selection,
  isActive,
  onSelect,
}: {
  hub: HubNode;
  copy: CapabilityMapCopy;
  selection: Selection;
  isActive: boolean;
  onSelect: (next: Selection) => void;
}) {
  const domainCopy = copy.domains[hub.id];

  return (
    <g className="tmapDomain" data-tone={hub.tone} data-active={isActive}>
      <g aria-hidden="true">
        <line className="tmapSpokeHub" x1={layout.center.x} y1={layout.center.y} x2={hub.x} y2={hub.y} />
        <g data-phase={hub.phase}>
          <line
            className="tmapPulse"
            x1={layout.center.x}
            y1={layout.center.y}
            x2={hub.x}
            y2={hub.y}
            pathLength={100}
          />
        </g>
        {hub.processes.map((process) => (
          <line
            key={process.id}
            className="tmapSpokeProc"
            x1={hub.x}
            y1={hub.y}
            x2={process.x}
            y2={process.y}
          />
        ))}
      </g>

      {hub.processes.map((process) => (
        <ProcessRing
          key={process.id}
          node={process}
          title={copy.processes[process.id]?.title ?? process.id}
          selected={selection?.kind === 'process' && selection.process === process.id}
          reachable={isActive}
          onSelect={() => onSelect({ kind: 'process', domain: hub.id, process: process.id })}
        />
      ))}

      <g
        className="tmapNode"
        data-phase={hub.phase}
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        aria-label={domainCopy.title}
        onClick={() => onSelect({ kind: 'domain', domain: hub.id })}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect({ kind: 'domain', domain: hub.id });
          }
        }}
      >
        <circle className="tmapHit" cx={hub.x} cy={hub.y} r={HIT_R + 8} />
        <g className="tmapIn">
          <circle className="tmapAura" cx={hub.x} cy={hub.y} r={HUB_R + 10} />
          <circle className="tmapHubRing" cx={hub.x} cy={hub.y} r={HUB_R} />
          <HubGlyph glyph={hub.glyph} x={hub.x} y={hub.y} r={HUB_R * 0.42} />
          <text className="tmapHubLabel" x={hub.lx} y={hub.ly + 6}>
            {domainCopy.title}
          </text>
        </g>
        <circle className="tmapFocusRing" cx={hub.x} cy={hub.y} r={HUB_R + 6} />
      </g>
    </g>
  );
}

function ProcessRing({
  node,
  title,
  selected,
  reachable,
  onSelect,
}: {
  node: ProcessNode;
  title: string;
  selected: boolean;
  reachable: boolean;
  onSelect: () => void;
}) {
  return (
    <g
      className="tmapNode"
      role="button"
      tabIndex={reachable ? 0 : -1}
      aria-pressed={selected}
      aria-label={title}
      aria-hidden={reachable ? undefined : true}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <circle className="tmapHit" cx={node.x} cy={node.y} r={HIT_R} />
      <g className="tmapIn" data-phase={node.phase}>
        <circle className="tmapProcRing" cx={node.x} cy={node.y} r={PROC_R} />
        <text className="tmapProcNum" x={node.x} y={node.y}>
          {node.index}
        </text>
      </g>
      <circle className="tmapFocusRing" cx={node.x} cy={node.y} r={PROC_R + 6} />
    </g>
  );
}

/* -------------------------------------------------------------- hub glyphs */

function HubGlyph({ glyph, x, y, r }: { glyph: Glyph; x: number; y: number; r: number }) {
  const cls = 'tmapHubGlyph';
  switch (glyph) {
    case 'circle':
      return <circle className={cls} cx={x} cy={y} r={r} />;
    case 'square': {
      const s = r * 0.92;
      return <rect className={cls} x={x - s} y={y - s} width={s * 2} height={s * 2} rx={2} />;
    }
    case 'diamond': {
      const s = r * 1.2;
      return <path className={cls} d={`M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`} />;
    }
    case 'triangle': {
      const s = r * 1.25;
      return (
        <path
          className={cls}
          d={`M${x} ${y - s}L${x + s * 0.87} ${y + s * 0.5}L${x - s * 0.87} ${y + s * 0.5}Z`}
        />
      );
    }
    case 'hexagon': {
      const s = r * 1.14;
      const points = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${(x + Math.cos(a) * s).toFixed(2)} ${(y + Math.sin(a) * s).toFixed(2)}`;
      });
      return <path className={cls} d={`M${points.join('L')}Z`} />;
    }
    case 'cross': {
      const s = r * 1.15;
      return <path className={cls} d={`M${x - s} ${y}H${x + s}M${x} ${y - s}V${y + s}`} />;
    }
  }
}

/* ------------------------------------------------------------------ drawer */

function Drawer({
  copy,
  detail,
  onSelect,
  onClear,
  step,
}: {
  copy: CapabilityMapCopy;
  detail:
    | { kind: 'domain'; id: DomainId; domain: DomainCopy }
    | { kind: 'process'; id: string; domain: DomainId; process: ProcessCopy };
  onSelect: (next: Selection) => void;
  onClear: () => void;
  step: (direction: 1 | -1) => void;
}) {
  const spec = DOMAINS.find((d) =>
    detail.kind === 'domain' ? d.id === detail.id : d.id === detail.domain,
  );
  const domainTitle = spec ? copy.domains[spec.id].title : '';

  return (
    <aside
      data-tone={spec?.tone}
      className="cmap rounded-card border border-border-glass bg-bg-950/90 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-md"
    >
      {/* Breadcrumb bar: ‹ › steps neighbouring domains, × closes. */}
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <StepButton label={copy.prevDomain} onClick={() => step(-1)} glyphPath="M8.5 3.5 5 7l3.5 3.5" />
        <StepButton label={copy.nextDomain} onClick={() => step(1)} glyphPath="M5.5 3.5 9 7l-3.5 3.5" />
        <span className="min-w-0 flex-1 truncate text-center font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-dim">
          {domainTitle}
        </span>
        <button
          type="button"
          onClick={onClear}
          aria-label={copy.close}
          className="grid size-9 shrink-0 place-items-center rounded-pill text-dim transition-colors hover:text-ink"
        >
          <span aria-hidden className="relative block size-3">
            <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <div className="p-5">
        {detail.kind === 'domain' && (
          <>
            <h3 className="text-base font-bold text-ink">{detail.domain.title}</h3>
            <p className="mt-1 text-xs text-dim">{detail.domain.tags}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{detail.domain.summary}</p>

            <p className="tmapPanelHead mt-5 rounded-field border border-border">
              {copy.processesLabel}
            </p>
            <ul className="mt-2 space-y-0.5">
              {(spec?.processes ?? []).map((processId, index) => (
                <li key={processId}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelect({ kind: 'process', domain: detail.id, process: processId })
                    }
                    className="flex min-h-10 w-full items-center gap-2.5 rounded-field px-2.5 text-start text-sm text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <span aria-hidden className="font-mono text-[10px] text-dim">
                      0{index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {copy.processes[processId]?.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {detail.kind === 'process' && (
          <>
            <h3 className="text-base font-bold text-ink">{detail.process.title}</h3>

            <dl className="mt-4 space-y-3.5">
              <DrawerStep label={copy.stepTrigger} value={detail.process.trigger} />
              <DrawerStep label={copy.stepDecision} value={detail.process.decision} />
              <DrawerStep label={copy.stepAction} value={detail.process.action} />
            </dl>

            {/* The human checkpoint — the reference highlights its active
                ladder row with a side rule; ours is the row that matters. */}
            <div className="mt-4 border-s-2 border-[var(--tone)] bg-ink/[0.04] p-3 ps-3.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">
                {copy.stepHuman}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-success">{detail.process.human}</p>
            </div>

            <button
              type="button"
              onClick={() => onSelect({ kind: 'domain', domain: detail.domain })}
              className="mt-4 min-h-10 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-dim transition-colors hover:text-ink"
            >
              {copy.reset}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

function DrawerStep({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-muted">{value}</dd>
    </div>
  );
}

/* ---------------------------------------------------------------- list view */

function ListView({ copy }: { copy: CapabilityMapCopy }) {
  return (
    <div className="overflow-hidden rounded-card border border-border">
      {DOMAINS.map((domain, index) => (
        <section
          key={domain.id}
          data-tone={domain.tone}
          className={cn('cmap p-6', index > 0 && 'border-t border-border')}
        >
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
            {copy.domains[domain.id].title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {copy.domains[domain.id].summary}
          </p>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {domain.processes.map((processId) => {
              const process = copy.processes[processId];
              if (!process) return null;
              return (
                <li key={processId} className="rounded-field border border-border p-4">
                  <h4 className="text-sm font-semibold text-ink">{process.title}</h4>
                  <dl className="mt-3 space-y-2">
                    <ListStep label={copy.stepTrigger} value={process.trigger} />
                    <ListStep label={copy.stepDecision} value={process.decision} />
                    <ListStep label={copy.stepAction} value={process.action} />
                    <ListStep label={copy.stepHuman} value={process.human} />
                  </dl>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ListStep({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 text-xs leading-relaxed">
      <dt className="font-semibold uppercase tracking-[0.1em] text-dim">{label}</dt>
      <dd className="text-muted">{value}</dd>
    </div>
  );
}
