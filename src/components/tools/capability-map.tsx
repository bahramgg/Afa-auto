'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  COUNTS,
  DOMAINS,
  STAGES,
  VIEW,
  R_CORE,
  R_PROCESS,
  FAN_W,
  FAN_H,
  layoutFan,
  layoutMandala,
  type DomainId,
  type FanProcess,
  type Filament,
  type Glyph,
  type HubNode,
  type Mote,
  type ProcessNode,
  type StageId,
} from '@/lib/capability-map';
import { cn } from '@/lib/cn';

/* -----------------------------------------------------------------------------
   The operating map, operator-console edition — rebuilt 2026-07-31 to the
   "OPTIMAL ENGINE" reel AFA supplied. The composition is the reference's:

     [ directory ]  [ stage ]                       [ legend · domains ]
                    ├ ⟵ all domains        fullscreen ⤢
                    ├ RADIAL: core → domains → processes → stages
                    │   click a domain →
                    ├ FAN: the domain at the foot of the stage, its human
                    │   checkpoints as squares, its processes as circles, and
                    │   every machine stage fanned across the top row
                    ├ the detail window, floating over the stage
                    └ [ ‹ domain › ]

   Every string arrives resolved from the server; the Map catalog never enters
   the client bundle. Selection semantics are unchanged from the first build:
   click a domain → it opens; click a process → the detail window; click again
   or Esc → closed. The LIST view stays — the screen-reader's, printer's and
   skimmer's fair deal.
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
  readonly ladderLabel: string;
  readonly figureLabel: string;
  /** Operator-console chrome. */
  readonly directoryLabel: string;
  readonly legendLabel: string;
  readonly domainsLabel: string;
  readonly typeDomain: string;
  readonly typeProcess: string;
  readonly typeStage: string;
  readonly typeHuman: string;
  readonly backAll: string;
  readonly fullscreen: string;
  readonly fullscreenExit: string;
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

/** Every fan is closed-form, so all six can be built once at module scope. */
const FANS = Object.fromEntries(DOMAINS.map((d) => [d.id, layoutFan(d.id)])) as Record<
  DomainId,
  ReturnType<typeof layoutFan>
>;

const HUB_R = 21;
const PROC_R = 14;
const STAGE_R = 8;
const HUMAN_R = 9;
const HIT_R = 28;

const STAGE_LABEL_KEY = {
  trigger: 'stepTrigger',
  decision: 'stepDecision',
  action: 'stepAction',
} as const satisfies Record<StageId, keyof CapabilityMapCopy>;

/**
 * `full` is the /map page: rails, list view, everything written out.
 * `hero` is the homepage's first viewport — the same drawing and the same
 * interactions, but no directory, no legend and no list toggle. The rails are
 * a reading apparatus; the hero's job is to be looked at.
 */
export type MapVariant = 'full' | 'hero';

export function CapabilityMap({
  copy,
  variant = 'full',
}: {
  copy: CapabilityMapCopy;
  variant?: MapVariant;
}) {
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

  /* Only a PROCESS opens the window. Selecting a domain opens the fan, and the
     fan already carries the domain's name, tags and summary across its head —
     the reference works the same way, and a panel over the drawing you just
     asked to see is the one thing it never does. */
  const detail = useMemo(() => {
    if (selection?.kind !== 'process') return null;
    const process = copy.processes[selection.process];
    return process
      ? { id: selection.process, domain: selection.domain, process }
      : null;
  }, [selection, copy]);

  const stage = (
    <Stage
      copy={copy}
      titleId={titleId}
      hidden={view === 'list'}
      fit={variant === 'hero' ? 'height' : 'width'}
      activeDomain={activeDomain}
      activeTone={activeTone}
      selection={selection}
      detail={detail}
      onSelect={select}
      onClear={() => setSelection(null)}
      step={step}
    />
  );

  if (variant === 'hero') {
    return (
      <div
        className="tmapShell"
        onKeyDown={(event) => {
          if (event.key === 'Escape') setSelection(null);
        }}
      >
        {stage}
      </div>
    );
  }

  return (
    <div
      className="tmapShell"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setSelection(null);
      }}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ViewToggle copy={copy} view={view} onChange={setView} />
        <p className={cn('tmapStatus', view === 'list' && 'hidden')}>{copy.statusline}</p>
      </div>

      <div className="grid items-start gap-3 xl:grid-cols-[15.5rem_minmax(0,1fr)_15.5rem]">
        {/* DIRECTORY — every process, one row each, with its domain in the
            right-hand column. Reference-left. */}
        <aside className={cn('tmapPanel order-2 xl:order-1', view === 'list' && 'hidden')}>
          <p className="tmapPanelHead">{copy.directoryLabel}</p>
          <ul className="max-h-[22rem] overflow-y-auto p-1.5 xl:max-h-[38rem]">
            {DOMAINS.map((domain) =>
              domain.processes.map((processId) => {
                const on = selection?.kind === 'process' && selection.process === processId;
                return (
                  <li key={processId} className="cmap" data-tone={domain.tone}>
                    <button
                      type="button"
                      onClick={() =>
                        select({ kind: 'process', domain: domain.id, process: processId })
                      }
                      aria-pressed={on}
                      className={cn(
                        'tmapRow',
                        on ? 'bg-ink/10 text-ink' : 'text-muted hover:bg-ink/5 hover:text-ink',
                      )}
                    >
                      <span aria-hidden className="tmapDot" />
                      <span className="min-w-0 flex-1 truncate">
                        {copy.processes[processId]?.title}
                      </span>
                      <span aria-hidden className="tmapRowTag">
                        {copy.domains[domain.id].title}
                      </span>
                    </button>
                  </li>
                );
              }),
            )}
          </ul>
        </aside>

        {/* THE STAGE. */}
        <div className="order-1 xl:order-2">
          {stage}

          <div className={cn('tmapList', view === 'map' && 'hidden')}>
            <ListView copy={copy} />
          </div>
        </div>

        {/* LEGEND + DOMAINS — reference-right. */}
        <div className={cn('order-3 grid gap-3', view === 'list' && 'hidden')}>
          <aside className="tmapPanel">
            <p className="tmapPanelHead">{copy.legendLabel}</p>
            <ul className="p-3">
              <LegendRow label={copy.typeDomain} count={COUNTS.domains}>
                <span className="tmapKeyRing" />
              </LegendRow>
              <LegendRow label={copy.typeProcess} count={COUNTS.processes}>
                <span className="tmapKeyProc" />
              </LegendRow>
              <LegendRow label={copy.typeStage} count={COUNTS.stages}>
                <span className="tmapKeyStage" />
              </LegendRow>
              <LegendRow label={copy.typeHuman} count={COUNTS.humans}>
                <span className="tmapKeyHuman" />
              </LegendRow>
            </ul>
          </aside>

          <aside className="tmapPanel">
            <p className="tmapPanelHead">{copy.domainsLabel}</p>
            <ul className="p-1.5">
              {DOMAINS.map((domain) => (
                <li key={domain.id} className="cmap" data-tone={domain.tone}>
                  <button
                    type="button"
                    onClick={() => select({ kind: 'domain', domain: domain.id })}
                    aria-pressed={activeDomain === domain.id}
                    className={cn(
                      'tmapRow',
                      activeDomain === domain.id
                        ? 'bg-ink/10 text-ink'
                        : 'text-muted hover:bg-ink/5 hover:text-ink',
                    )}
                  >
                    <span aria-hidden className="tmapBadge">
                      <svg viewBox="-12 -12 24 24" width="14" height="14">
                        <HubGlyph glyph={domain.glyph} x={0} y={0} r={7} />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 truncate">{copy.domains[domain.id].title}</span>
                    <span aria-hidden className="tmapRowNum">
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
    </div>
  );
}

/* ------------------------------------------------------------------- stage */

function Stage({
  copy,
  titleId,
  hidden,
  fit,
  activeDomain,
  activeTone,
  selection,
  detail,
  onSelect,
  onClear,
  step,
}: {
  copy: CapabilityMapCopy;
  titleId: string;
  hidden: boolean;
  /** `height` bounds the stage by the viewport; `width` lets the column set it. */
  fit: 'width' | 'height';
  activeDomain: DomainId | null;
  activeTone: number | undefined;
  selection: Selection;
  detail: DetailModel;
  onSelect: (next: Selection) => void;
  onClear: () => void;
  step: (direction: 1 | -1) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  /* The reference's ⤢ Fullscreen. Real API, no fake chrome — and the button
     hides itself where the browser has no fullscreen to give. */
  useEffect(() => {
    const sync = () => setExpanded(document.fullscreenElement === stageRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void stageRef.current?.requestFullscreen?.();
    }
  }, []);

  const fan = activeDomain ? FANS[activeDomain] : null;

  return (
    <div
      ref={stageRef}
      className={cn('tmapStage', hidden && 'hidden')}
      data-fit={fit}
      data-view={fan ? 'fan' : 'radial'}
      data-tone={activeTone}
    >
      {/* Stage toolbar — ⟵ all domains on the start edge, ⤢ on the end. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3">
        <button
          type="button"
          onClick={onClear}
          className={cn('tmapChip pointer-events-auto', !activeDomain && 'invisible')}
        >
          <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden className="rtl:-scale-x-100">
            <path
              d="M11 7H3.5M6.5 3.5 3 7l3.5 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {copy.backAll}
        </button>

        {/* No fullscreen chip on the hero: with the stage frameless there is
            no panel for it to belong to, and it reads as a button floating in
            space. A `hidden` utility cannot do this job — `.tmapChip` sets
            display itself and wins the cascade. */}
        {fit === 'width' ? (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="tmapChip pointer-events-auto"
            aria-pressed={expanded}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M5 1.5H1.5V5M9 1.5h3.5V5M5 12.5H1.5V9M9 12.5h3.5V9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {expanded ? copy.fullscreenExit : copy.fullscreen}
          </button>
        ) : (
          <span />
        )}
      </div>

      {fan ? (
        <FanView
          copy={copy}
          titleId={titleId}
          domain={activeDomain!}
          fan={fan}
          selection={selection}
          onSelect={onSelect}
        />
      ) : (
        <RadialView copy={copy} titleId={titleId} selection={selection} onSelect={onSelect} />
      )}

      {/* The detail window, over the stage on desktop, reference-style. */}
      <div
        aria-live="polite"
        className={cn(
          'relative z-10 xl:absolute xl:inset-y-14 xl:start-4 xl:w-[22rem] xl:overflow-y-auto',
          !detail && 'hidden xl:block xl:pointer-events-none',
        )}
      >
        {detail && (
          <DetailWindow
            copy={copy}
            detail={detail}
            onSelect={onSelect}
            onClear={onClear}
            step={step}
          />
        )}
      </div>

      {/* The ‹ domain › stepper, bottom-centre. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center">
        <div className="tmapStepper pointer-events-auto">
          <StepButton
            label={copy.prevDomain}
            onClick={() => step(-1)}
            glyphPath="M8.5 3.5 5 7l3.5 3.5"
          />
          <span className="meta min-w-[8rem] text-center text-xs font-semibold uppercase text-ink">
            {activeDomain ? copy.domains[activeDomain].title : copy.hub}
          </span>
          <StepButton
            label={copy.nextDomain}
            onClick={() => step(1)}
            glyphPath="M5.5 3.5 9 7l-3.5 3.5"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ radial view */

function RadialView({
  copy,
  titleId,
  selection,
  onSelect,
}: {
  copy: CapabilityMapCopy;
  titleId: string;
  selection: Selection;
  onSelect: (next: Selection) => void;
}) {
  return (
    <svg className="tmap" viewBox={`0 0 ${VIEW} ${VIEW}`} role="group" aria-labelledby={titleId}>
      <title id={titleId}>{copy.figureLabel}</title>

      <g className="tmapScene">
        <g aria-hidden="true">
          {/* ONE marching ring, not four dashed guides. */}
          <circle
            className="tmapOrbit"
            cx={layout.center.x}
            cy={layout.center.y}
            r={R_PROCESS}
            pathLength={100}
          />
          <circle className="tmapCoreRing" cx={layout.center.x} cy={layout.center.y} r={R_CORE} />
        </g>

        <MoteField motes={layout.motes} filaments={layout.filaments} />

        {layout.hubs.map((hub) => (
          <DomainVolume
            key={hub.id}
            hub={hub}
            copy={copy}
            selection={selection}
            onSelect={onSelect}
          />
        ))}
      </g>
    </svg>
  );
}

function MoteField({
  motes,
  filaments,
}: {
  motes: readonly Mote[];
  filaments: readonly Filament[];
}) {
  return (
    <g aria-hidden="true">
      {filaments.map((f, index) => (
        <line
          key={`f${index}`}
          className="tmapFilament"
          x1={f.x1}
          y1={f.y1}
          x2={f.x2}
          y2={f.y2}
        />
      ))}
      {motes.map((mote, index) => (
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
  );
}

function DomainVolume({
  hub,
  copy,
  selection,
  onSelect,
}: {
  hub: HubNode;
  copy: CapabilityMapCopy;
  selection: Selection;
  onSelect: (next: Selection) => void;
}) {
  const domainCopy = copy.domains[hub.id];

  return (
    <g className="tmapDomain" data-tone={hub.tone}>
      {/* Badge → process: a quadratic that leaves along the domain's own ray
          and bows into place. The bow is the whole difference between this
          and a bicycle wheel. */}
      <g aria-hidden="true">
        {hub.processes.map((process) => (
          <path
            key={process.id}
            className="tmapLink"
            d={`M${hub.x} ${hub.y}Q${process.cx} ${process.cy} ${process.x} ${process.y}`}
          />
        ))}
      </g>

      {hub.processes.map((process) => (
        <ProcessRing
          key={process.id}
          node={process}
          title={copy.processes[process.id]?.title ?? process.id}
          selected={selection?.kind === 'process' && selection.process === process.id}
          onSelect={() => onSelect({ kind: 'process', domain: hub.id, process: process.id })}
        />
      ))}

      <g
        className="tmapNode"
        data-phase={hub.phase}
        role="button"
        tabIndex={0}
        aria-pressed={selection?.domain === hub.id}
        aria-label={domainCopy.title}
        onClick={() => onSelect({ kind: 'domain', domain: hub.id })}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect({ kind: 'domain', domain: hub.id });
          }
        }}
      >
        <circle className="tmapHit" cx={hub.x} cy={hub.y} r={HIT_R + 10} />
        <g className="tmapIn">
          <circle className="tmapAura" cx={hub.x} cy={hub.y} r={HUB_R + 9} />
          <circle className="tmapHubRing" cx={hub.x} cy={hub.y} r={HUB_R} />
          <HubGlyph glyph={hub.glyph} x={hub.x} y={hub.y} r={HUB_R * 0.4} />
          {/* Inward, into the empty annulus — the one place nothing else
              wants, so the name never fights a node or a curve.

              At nine domains the label arc is ~112 units wide, which is about
              nine Latin capitals. `data-long` drops the size a step for
              anything over that, so a long name shrinks instead of printing
              into its neighbour (which is exactly what «Loyalty club» did). */}
          <text
            className="tmapHubLabel"
            data-long={domainCopy.title.length > 10 || undefined}
            x={hub.lx}
            y={hub.ly + 5}
          >
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
  onSelect,
}: {
  node: ProcessNode;
  title: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <g
      className="tmapNode"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={title}
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

/* --------------------------------------------------------------- fan view */

function FanView({
  copy,
  titleId,
  domain,
  fan,
  selection,
  onSelect,
}: {
  copy: CapabilityMapCopy;
  titleId: string;
  domain: DomainId;
  fan: ReturnType<typeof layoutFan>;
  selection: Selection;
  onSelect: (next: Selection) => void;
}) {
  const domainCopy = copy.domains[domain];

  return (
    <svg
      className="tmap tmapFan"
      viewBox={`0 0 ${FAN_W} ${FAN_H}`}
      role="group"
      aria-labelledby={titleId}
      data-tone={fan.tone}
    >
      <title id={titleId}>{domainCopy.title}</title>

      <text className="tmapFanTitle" x={FAN_W / 2} y={58}>
        {domainCopy.title}
      </text>
      <text className="tmapFanTags" x={FAN_W / 2} y={84}>
        {domainCopy.tags}
      </text>
      <text className="tmapFanSummary" x={FAN_W / 2} y={112}>
        {domainCopy.summary}
      </text>

      <g aria-hidden="true">
        {fan.processes.map((process) => (
          <g key={process.id}>
            {/* Domain → checkpoint: dotted rays, the reference's converging fan. */}
            <line
              className="tmapFanRay"
              x1={fan.hub.x}
              y1={fan.hub.y - HUB_R}
              x2={process.hx}
              y2={process.hy + HUMAN_R}
            />
            {/* Checkpoint → process: one straight vertical. */}
            <line
              className="tmapFanStem"
              x1={process.hx}
              y1={process.hy - HUMAN_R}
              x2={process.x}
              y2={process.y + PROC_R}
            />
            {/* Process → its three machine stages, splayed across the top. */}
            {process.stages.map((stage) => (
              <line
                key={stage.id}
                className="tmapFanBranch"
                x1={process.x}
                y1={process.y - PROC_R}
                x2={stage.x}
                y2={stage.y + STAGE_R}
              />
            ))}
          </g>
        ))}
      </g>

      {/* Top row: every machine stage of every process in this domain. */}
      <g aria-hidden="true">
        {fan.processes.flatMap((process) =>
          process.stages.map((stage) => (
            <g key={stage.id} className="tmapIn" data-phase={stage.phase}>
              <circle className="tmapStageRing" cx={stage.x} cy={stage.y} r={STAGE_R} />
              <StageGlyph stage={stage.stage} x={stage.x} y={stage.y} />
              <text className="tmapFanStageLabel" x={stage.x} y={stage.ly}>
                {copy[STAGE_LABEL_KEY[stage.stage]]}
              </text>
            </g>
          )),
        )}
      </g>

      {/* Middle row: the processes. Bottom row of squares: their human checks. */}
      {fan.processes.map((process) => (
        <FanNode
          key={process.id}
          copy={copy}
          domain={domain}
          process={process}
          selected={selection?.kind === 'process' && selection.process === process.id}
          onSelect={onSelect}
        />
      ))}

      {/* The domain itself, at the foot of the stage, over its particle seed. */}
      <g className="tmapFanHub" data-phase={0}>
        <g aria-hidden="true">
          <circle className="tmapSeedRing" cx={fan.seed.x} cy={fan.seed.y} r={46} />
          <MoteField motes={fan.motes} filaments={fan.filaments} />
        </g>
        <circle className="tmapAura" cx={fan.hub.x} cy={fan.hub.y} r={HUB_R + 10} />
        <circle className="tmapHubRing" cx={fan.hub.x} cy={fan.hub.y} r={HUB_R} />
        <HubGlyph glyph={fan.glyph} x={fan.hub.x} y={fan.hub.y} r={HUB_R * 0.42} />
        <text className="tmapHubLabel" x={fan.hub.x} y={fan.hub.y + 42}>
          {domainCopy.title}
        </text>
      </g>
    </svg>
  );
}

function FanNode({
  copy,
  domain,
  process,
  selected,
  onSelect,
}: {
  copy: CapabilityMapCopy;
  domain: DomainId;
  process: FanProcess;
  selected: boolean;
  onSelect: (next: Selection) => void;
}) {
  const title = copy.processes[process.id]?.title ?? process.id;
  const open = () => onSelect({ kind: 'process', domain, process: process.id });

  return (
    <g
      className="tmapNode"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={title}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
    >
      <circle className="tmapHit" cx={process.x} cy={process.y} r={HIT_R + 6} />
      <rect
        className="tmapHit"
        x={process.hx - 26}
        y={process.hy - 20}
        width={52}
        height={40}
      />

      <g className="tmapIn" data-phase={process.phase}>
        <circle className="tmapProcRing" cx={process.x} cy={process.y} r={PROC_R} />
        <text className="tmapProcNum" x={process.x} y={process.y}>
          {process.index}
        </text>
        <text className="tmapFanProcLabel" x={process.x} y={process.y + 40}>
          {title}
        </text>

        {/* The human checkpoint — a square, never a ring: on this map the
            human is a different kind of node, not one more machine step. */}
        <rect
          className="tmapHumanBox"
          x={process.hx - HUMAN_R}
          y={process.hy - HUMAN_R}
          width={HUMAN_R * 2}
          height={HUMAN_R * 2}
          rx={3}
        />
        <path
          className="tmapHumanTick"
          d={`M${process.hx - 4.4} ${process.hy}l3 3.2 5.6-6`}
        />
        <text className="tmapFanHumanLabel" x={process.hx} y={process.hy + 26}>
          {copy.stepHuman}
        </text>
      </g>

      <circle className="tmapFocusRing" cx={process.x} cy={process.y} r={PROC_R + 6} />
    </g>
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
    <div className="tmapTabs" role="group" aria-label={copy.viewLabel}>
      {(['map', 'list'] as const).map((candidate) => (
        <button
          key={candidate}
          type="button"
          onClick={() => onChange(candidate)}
          aria-pressed={view === candidate}
          className={cn('tmapTab', view === candidate && 'tmapTabOn')}
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
        <path
          d={glyphPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function LegendRow({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2.5 py-1.5 text-xs text-muted">
      <span aria-hidden className="grid size-4 shrink-0 place-items-center">
        {children}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="meta text-[10px] tabular-nums text-dim">{count}</span>
    </li>
  );
}

/* ------------------------------------------------------------------ glyphs */

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
      return (
        <path className={cls} d={`M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`} />
      );
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
    case 'pentagon': {
      const s = r * 1.18;
      const points = Array.from({ length: 5 }, (_, i) => {
        const a = ((Math.PI * 2) / 5) * i - Math.PI / 2;
        return `${(x + Math.cos(a) * s).toFixed(2)} ${(y + Math.sin(a) * s).toFixed(2)}`;
      });
      return <path className={cls} d={`M${points.join('L')}Z`} />;
    }
    case 'chevron': {
      const s = r * 1.15;
      return (
        <path
          className={cls}
          d={`M${x - s} ${y - s * 0.55}L${x} ${y + s * 0.3}L${x + s} ${y - s * 0.55}`}
        />
      );
    }
    case 'bars': {
      const s = r * 1.1;
      return (
        <path
          className={cls}
          d={`M${x - s * 0.7} ${y + s}V${y - s * 0.1}M${x} ${y + s}V${y - s}M${x + s * 0.7} ${y + s}V${y - s * 0.55}`}
        />
      );
    }
  }
}

/** Three stage marks, so the outer ring is not read by colour alone either. */
function StageGlyph({ stage, x, y }: { stage: StageId; x: number; y: number }) {
  const d =
    stage === 'trigger'
      ? `M${x - 3.4} ${y}h6.8M${x + 0.6} ${y - 2.6}L${x + 3.4} ${y}l-2.8 2.6`
      : stage === 'decision'
        ? `M${x - 3.2} ${y - 3.2}L${x + 3.2} ${y + 3.2}M${x + 3.2} ${y - 3.2}L${x - 3.2} ${y + 3.2}`
        : `M${x} ${y - 3.4}v6.8M${x - 2.6} ${y + 0.6}L${x} ${y + 3.4}l2.6 -2.8`;
  return <path className="tmapStageGlyph" d={d} />;
}

/* ---------------------------------------------------------- detail window */

type DetailModel = { id: string; domain: DomainId; process: ProcessCopy } | null;

function DetailWindow({
  copy,
  detail,
  onSelect,
  onClear,
  step,
}: {
  copy: CapabilityMapCopy;
  detail: NonNullable<DetailModel>;
  onSelect: (next: Selection) => void;
  onClear: () => void;
  step: (direction: 1 | -1) => void;
}) {
  const spec = DOMAINS.find((d) => d.id === detail.domain);
  const domainTitle = copy.domains[detail.domain].title;

  return (
    <aside data-tone={spec?.tone} className="cmap tmapWindow">
      {/* Breadcrumb bar: ← back to the domain, then ‹ ›, then ×. */}
      <div className="tmapWindowBar">
        <button
          type="button"
          onClick={() => onSelect({ kind: 'domain', domain: detail.domain })}
          className="tmapCrumb"
        >
          <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden className="rtl:-scale-x-100">
            <path
              d="M11 7H3.5M6.5 3.5 3 7l3.5 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {copy.reset}
        </button>
        <span aria-hidden className="tmapCrumbSep">
          ·
        </span>
        <span className="tmapCrumbNow">{domainTitle}</span>

        <span className="flex-1" />
        <StepButton
          label={copy.prevDomain}
          onClick={() => step(-1)}
          glyphPath="M8.5 3.5 5 7l3.5 3.5"
        />
        <StepButton
          label={copy.nextDomain}
          onClick={() => step(1)}
          glyphPath="M5.5 3.5 9 7l-3.5 3.5"
        />
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
        <h3 className="tmapWindowTitle">{detail.process.title}</h3>
        <p className="tmapWindowSub">
          {domainTitle} · {copy.domains[detail.domain].tags}
        </p>

        {/* The ladder. The reference rules its active row; here every row is
            real, and the last one is the row that matters. */}
        <p className="tmapSectionHead">{copy.ladderLabel}</p>
        <dl className="mt-1.5">
          {STAGES.map((stage) => (
            <div key={stage} className="tmapLadderRow">
              <dt className="tmapLadderKey">{copy[STAGE_LABEL_KEY[stage]]}</dt>
              <dd className="text-sm leading-relaxed text-muted">{detail.process[stage]}</dd>
            </div>
          ))}
        </dl>

        <div className="tmapHumanBlock">
          <p className="tmapLadderKey">{copy.stepHuman}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-success">{detail.process.human}</p>
        </div>
      </div>
    </aside>
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
