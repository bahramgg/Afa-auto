# CLAUDE.md — AFA site

Bilingual (fa/en) **single-page introduction site** for AFA, which automates
repetitive business processes. `docs/afa-services-site-plan-fa.md` is the
original plan and is now largely superseded — where it and this file disagree,
this file wins.

## What the site is

RESTRUCTURED 2026-08 around one question: what does a stranger need, in what
order, before they will pick up the phone? One page, SIX stops:

1. **MapHero** — the WORKING map fills the first viewport, the claim beside it.
   Until now the homepage showed a decorative six-dot mini map and the real one
   lived a click away on `/map`; the only thing on this site nobody else has
   was the one thing behind a navigation step. `sections/map-hero.tsx` resolves
   every string server-side and renders `<CapabilityMap variant="hero">`.
2. **Manifesto** (01) — one display statement + the four constraints as a
   ruled row. What we will and will not do with someone's business.
3. **Work** (02) — three before/after examples. Proof before effort. No
   metrics we cannot source.
4. **Impact** (03) — four sliders from the visitor's own business, and an ask
   under the result. It used to be section two, which asked a stranger for
   effort before they knew what we do, and it used to be a dead end.
5. **Start** (04) — how long, how it is priced, what happens after the form.
   Those were the first two questions anyone asks and they were closed rows in
   an accordion at the bottom of the page. Every line restates a claim the FAQ
   already made; nothing here is new.
6. **Contact** (05) — the form, with the four remaining questions beside it.

`/map` is the only other route: the same map with its reading rails, plus all
twenty-four processes written out. Don't add sections back without being asked
— the old ProcessIndex was a table of contents for a map that is now the first
thing on the page, and that is the definition of a section repeating itself.

## Tone

Formal Persian, second-person plural («شما», «کنید»). No colloquialism, no
«تو». English is a rewrite: shorter, technical, no Persian courtesies.

## Design — the shared editorial system

Redesigned 2026-07-30. The look now comes from `afa-brand/tokens` LAYER 5 and
is implemented identically (in three different styling systems) across
afa-site, afa-pay and this site. Three moves carry it:

1. **The ruled panel.** A group of related items is ONE bordered block
   subdivided by hairlines — never a row of floating cards with gaps. Use
   `<RuledPanel>` / `<RuledCell>` from `components/ui/editorial.tsx`. The
   hairlines are a 1px grid gap over a border-coloured background, so no cell
   needs index arithmetic and the rules stay correct across breakpoints.
2. **The tracked eyebrow.** Every section opens with `.eyebrow` above the
   heading, plus a running index (`01`…`06`).
3. **Rationed light.** Deep navy stays deep. The brand gradient appears on the
   primary action only — no gradient headlines. Glow at most three times per
   page.

**Bilingual display type is not one mechanism.** Latin gets uppercase + open
tracking; Persian gets weight 800 and a tighter block, and **zero tracking** —
Arabic-script letters join, and spacing them severs the joins. Both are in
`--display-*` tokens, so a component never has to know which script it is
rendering. Never set `letter-spacing` on Persian text.

**Two ways to break Persian, not one.** Never set `letter-spacing` on Persian
text — and never put the raw `font-mono` utility on a translated string
either. The mono stack carries no Arabic-script glyphs, so Persian falls back
per character and the letters stop joining: the same failure, a different
door. Small technical labels use `.meta` (globals.css), which keeps mono for
Latin and hands Persian `--font-fa` with zero tracking, so a component never
has to know which script it is setting.

**The window frame is used ONCE**, on the calculator, because that one is
genuinely a running program. It was on the case studies, the FAQ and the form
as well; a device used four times is not a device, it is a texture.

No scroll-reveal animation: it left below-fold sections invisible in print and
full-page captures. The capability map animates on its own timeline instead,
and stops entirely under `prefers-reduced-motion`.

## The operating map

Rebuilt 2026-07-31 to the **"OPTIMAL ENGINE"** operator-console reel AFA
supplied. It is now TWO drawings, because the reference has two, and the whole
design depends on the move between them:

- **RADIAL** — the whole system at once. A particle core inside a thin ring,
  then three orbits outward: six domain badges, twenty-four process rings, and
  a crowd of seventy-two stage nodes. Reading outward is reading down the
  hierarchy, and the crowd is the point — it is what makes the drawing look
  like a company rather than a diagram.
- **FAN** — one domain, opened. The domain drops to the foot of the stage over
  its own particle seed, dotted rays climb to the four HUMAN CHECKPOINTS
  (squares, green — the only status colour on the map), one plumb line runs
  from each up to its PROCESS, and the processes splay wide into the twelve
  machine stages across the top. Stages are grouped by stage, not by process,
  so the branches cross: that crossing is the reference's texture.

Rules that hold across both:

- `src/lib/capability-map.ts` — structure and geometry. Pure, no React, no
  strings; `layoutMandala()` and `layoutFan()` are closed-form, so every fan is
  built once at module scope. **All scatter comes from a hash of each node's
  id, never `Math.random()`** — the map renders on the server and again in the
  browser, and two different pictures is a hydration error. `unit()` runs the
  lowbias32 finaliser over FNV: raw FNV on sequential keys scatters in visible
  spokes, not a cloud. `COUNTS` is read off the structure, so the legend can
  never drift from the drawing.
- `src/components/tools/capability-map.tsx` — the client component. Holds no
  arithmetic. Domain labels sit directly under the badge in the domain's own
  colour, the one place a label is not ivory.
- Selecting a DOMAIN opens the fan and nothing else; only a PROCESS opens the
  detail window. The fan already carries the domain's name, tags and summary
  across its head, and a panel over the drawing you just asked to see is the
  one thing the reference never does.
- `src/styles/capability-map.css` — all visuals. Colour is rationed: it burns
  at the domain badge, the process ring and the core; the outer crowd and the
  connectors stay ivory-quiet. State via `data-*` attributes; animation delays
  are CSS phase buckets, never inline styles.
- `test/capability-map.test.ts` — determinism, bounds, collision, outward
  monotonicity, row order in the fan, the no-two-adjacent-stages-share-a-process
  rule, and that both catalogs describe every node in full (including each
  domain's `tags` descriptor line).

Strings are resolved **on the server** in `sections/map-hero.tsx` and passed
as props. Do not move them into a client namespace: `Map` is the largest thing
in the catalog and would double the JSON on every page.

## Display type

Latin display is **Cormorant Garamond** (self-hosted, 500/600), caps with wide
tracking — the reference's OPERATIONS/INTELLIGENCE voice. Persian display is
**Vazirmatn 300**: joined script is never letter-spaced, so lightness at size
carries what tracking carries in Latin. Both ride `--font-display` /
`--display-*` in tokens.css, swapped by `html[lang]` — components never ask
which script they are rendering. Cormorant is display-only, never body.

## Non-negotiable rules

- **TypeScript strict. No `any`.** (enforced by ESLint)
- **All color/spacing come from `src/styles/tokens.css`.** No hardcoded hex in
  components — use the mapped Tailwind utilities (`bg-bg-950`, `text-ink`,
  `shadow-brand`, `rounded-card`, …) or the `--*` variables.
- **Logical CSS only.** Use `ms-/me-/ps-/pe-/start-/end-`; `ml-/mr-/pl-/pr-/
  left-/right-` are banned by ESLint so the site mirrors cleanly in RTL.
- **No literal strings in JSX.** Every user-facing string comes from
  `messages/{locale}.json`. Keep `fa.json` and `en.json` key sets identical
  (a test enforces this).
- **Each tool = one standalone component** with typed props + a unit test for
  its calculation logic (plan §5).
- **Secrets only in Workers** (`wrangler secret`); never in the client bundle.
  If a model key is ever visible client-side, the build must fail.
- **No Google Fonts, no external CDN.** Fonts are self-hosted in
  `public/fonts` (synced by `scripts/sync-fonts.mjs`).
- **No unsourced numbers.** Estimates are labeled "تخمینی/estimated". The live
  signal bar is removed when there's no real data — never fabricate a metric.
- **EN is a rewrite, not a translation.** Shorter, technical, no Persian
  courtesies (plan §15).

## Stack

- Next.js 15 (App Router) + TypeScript, Tailwind v4 (CSS tokens), next-intl
  (`[locale]`, fa=RTL default, en=LTR), MDX content, Cloudflare
  Workers/Pages/KV/D1 for the dynamic bits. Vercel is intentionally avoided
  (access from Iran). See plan §10.

## Layout

- `src/app/[locale]/` — routes. The `[locale]/layout.tsx` renders `<html>`.
- `src/components/{ui,layout,sections,tools}/` — see plan §11.
- `src/i18n/` — routing, navigation, request config.
- `src/styles/` — `tokens.css` (source of truth), `fonts.css`, `globals.css`.
- `messages/{fa,en}.json` — all UI strings.
- `content/{fa,en}/work/*.mdx` — case studies.
- `workers/` — Cloudflare Workers (demo proxy, audit scan, lead intake).

## Commands

- `npm run dev` · `npm run build` · `npm run start`
- `npm run lint` · `npm run typecheck` · `npm test`
- `npm run fonts:sync` — refresh self-hosted fonts from @fontsource.
- `npm run og:build` — rasterise `public/og-{fa,en}.png` from the live hero
  (needs a server running; set `OG_BASE_URL`). The output is COMMITTED. Next's
  `ImageResponse` needs a font buffer and this project's faces are woff2, which
  satori cannot parse — so the card is built from the real page instead, which
  also keeps it on the real tokens and the real map geometry.

## Tools ↔ ownership (plan §5 — the anti-confusion spine)

| Tool | Home | Route | Service |
|---|---|---|---|
| Lost-sales calculator | ✅ (start) | `/tools/roi` | — |
| Online-presence scan | | `/tools/audit` | website |
| Live assistant demo | | `/tools/demo` | assistant |
| Repeat-customer calculator | | `/tools/roi` (sibling) | automation |
| Package configurator | | `/tools/scope` | (closer) |

One service = one tool. Never render two tools at once on a page.
