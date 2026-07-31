import { DOMAINS, type DomainId } from '@/lib/capability-map';
import { AfaMark } from './AfaMark';

/* -----------------------------------------------------------------------------
   The mini map — the hero's companion. Light in content, alive in motion.

   Third pass, 2026-07-31, after review:
     · the hub is centred with an inset-0 grid overlay, not translate math —
       the old ltr:/rtl: translate variants do not exist in Tailwind v4, so
       the mark sat off-centre in RTL. A full-bleed grid cannot miss.
     · labels moved OUTSIDE the outer orbit, on the same ray as their node,
       with the viewBox widened to hold them — no label can touch the drawing.

   All motion is CSS keyframes (the `.mini*` rules in capability-map.css); no
   JavaScript, so this stays a server component. Fixed geometry, no hashing:
   the same numbers render on server and client.
   -------------------------------------------------------------------------- */

const W = 660;
const H = 560;
const CX = W / 2;
const CY = H / 2;
const RX = 192;
const RY = 158;

/** Label centre rides the node's ray, pushed past the outer orbit. */
const LABEL_RX = RX + 74;
const LABEL_RY = RY + 62;

type Spot = {
  readonly id: DomainId;
  readonly tone: number;
  readonly x: number;
  readonly y: number;
  readonly lx: number;
  readonly ly: number;
  readonly sats: readonly { x: number; y: number; r: number }[];
};

const r2 = (n: number) => Math.round(n * 100) / 100;

const SPOTS: readonly Spot[] = DOMAINS.map((domain, index) => {
  /* Same 30°-offset ring as the full map, so the two drawings agree. */
  const deg = 30 + index * 60;
  const angle = ((deg - 90) * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = CX + cos * RX;
  const y = CY + sin * RY;

  return {
    id: domain.id,
    tone: domain.tone,
    x: r2(x),
    y: r2(y),
    lx: r2(CX + cos * LABEL_RX),
    ly: r2(CY + sin * LABEL_RY + 5),
    sats: [-64, 38].map((offset, i) => {
      const sa = ((deg + offset - 90) * Math.PI) / 180;
      const sr = i === 0 ? 20 : 15;
      return {
        x: r2(x + Math.cos(sa) * sr),
        y: r2(y + Math.sin(sa) * sr),
        r: i === 0 ? 2.6 : 2,
      };
    }),
  };
});

export function MiniMap({
  labels,
  figureLabel,
}: {
  labels: Readonly<Record<DomainId, string>>;
  figureLabel: string;
}) {
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={figureLabel}
        className="mini h-auto w-full"
      >
        {/* Two orbit rings, dashes marching in opposite directions. */}
        <g aria-hidden="true">
          <ellipse
            className="miniOrbit"
            cx={CX}
            cy={CY}
            rx={RX + 34}
            ry={RY + 28}
            pathLength={100}
          />
          <ellipse
            className="miniOrbit miniOrbitReverse"
            cx={CX}
            cy={CY}
            rx={RX - 52}
            ry={RY - 44}
            pathLength={100}
          />
        </g>

        {SPOTS.map((spot, index) => (
          <g
            key={spot.id}
            className="miniDomain"
            data-tone={spot.tone}
            data-phase={index}
            tabIndex={0}
          >
            <circle className="miniHit" cx={spot.x} cy={spot.y} r={46} />
            <line className="miniSpoke" x1={CX} y1={CY} x2={spot.x} y2={spot.y} />
            <line
              className="miniPulse"
              x1={CX}
              y1={CY}
              x2={spot.x}
              y2={spot.y}
              pathLength={100}
            />
            {spot.sats.map((sat, i) => (
              <circle key={i} className="miniSat" cx={sat.x} cy={sat.y} r={sat.r} />
            ))}
            <circle className="miniHalo" cx={spot.x} cy={spot.y} r={18} />
            <circle className="miniNode" cx={spot.x} cy={spot.y} r={6.5} />
            <text className="miniLabel" x={spot.lx} y={spot.ly}>
              {labels[spot.id]}
            </text>
          </g>
        ))}
      </svg>

      {/* The mark at the heart. A full-bleed grid centres it on every writing
          direction; pointer-events stay off so the domains keep their hover. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="miniHub grid place-items-center rounded-pill border border-border-glass bg-bg-900/85 p-4 backdrop-blur-sm">
          <AfaMark size={46} />
        </span>
      </span>
    </div>
  );
}
