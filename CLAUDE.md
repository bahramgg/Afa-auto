# CLAUDE.md — AFA site

Bilingual (fa/en) **single-page introduction site** for AFA, which automates
repetitive business processes. `docs/afa-services-site-plan-fa.md` is the
original plan and is now largely superseded — where it and this file disagree,
this file wins.

## What the site is

REBUILT 2026-07-30 to the brief "minimal, and the map is the point" — modelled
on the operating-map reference AFA supplied (constellation chart, serif tracked
labels, "Book a call" pill) and the NodeSpark pattern ("every graph is a live
view of the real system"). One page, FIVE stops:

1. **MapHero** — the operating map fills the first viewport. Six domains,
   twenty-four processes, drawn as ivory constellations around a multicolour
   particle burst, animated and clickable. The claim is a caption over the map
   («کسب‌وکار شما، روی نقشه» / "YOUR BUSINESS, MAPPED"), not a section before
   it. `sections/map-hero.tsx` resolves all strings server-side.
2. **Manifesto** (01) — one display statement + the four constraints as a
   ruled row + the method as one numbered line. Replaced three sections
   (Principles, Method, Benefits): the map now carries the breadth they were
   explaining in prose.
3. **Work** (02) — three before/after examples. No metrics we cannot source.
4. **Impact tool** (03) — four sliders from the visitor's own business.
5. **Contact** — the form, with the six pre-call FAQ items folded in beside
   it as `<details>`. Nothing earlier asks for details.

There are no other routes. Don't add sections back without being asked —
anything that repeats what the map already shows was deleted, not moved.

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

No scroll-reveal animation: it left below-fold sections invisible in print and
full-page captures. The capability map animates on its own timeline instead,
and stops entirely under `prefers-reduced-motion`.

## The operating map

- `src/lib/capability-map.ts` — structure and geometry. Pure, no React, no
  strings. Landscape stage (1200×900); domains on an ellipse at 30°…330° (the
  30° offset keeps top-centre clear for the headline overlay); each domain
  grows THREE branches — chains that step along an outward ray and zigzag
  around it. **All scatter comes from a hash of each node's id, never
  `Math.random()`** — the map renders on the server and again in the browser,
  and two different pictures is a hydration error.
- `src/components/tools/capability-map.tsx` — the client component. Holds no
  arithmetic. Domain labels sit on the INWARD ray (compass-rose around the
  burst) because outward is where the chains live.
- `src/styles/capability-map.css` — all visuals. The chains are IVORY and
  quiet; colour appears only at the badge ring, its satellites, and the centre
  burst — that restraint is what makes it a star chart, not a dashboard.
  State via `data-*` attributes; animation delays are CSS phase buckets, never
  inline styles. Entrance stagger runs once via `.cmapEnter`.
- `test/capability-map.test.ts` — determinism, bounds, collision, outward
  monotonicity, and that both catalogs describe every node in full (including
  each domain's `tags` descriptor line).

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

## Tools ↔ ownership (plan §5 — the anti-confusion spine)

| Tool | Home | Route | Service |
|---|---|---|---|
| Lost-sales calculator | ✅ (start) | `/tools/roi` | — |
| Online-presence scan | | `/tools/audit` | website |
| Live assistant demo | | `/tools/demo` | assistant |
| Repeat-customer calculator | | `/tools/roi` (sibling) | automation |
| Package configurator | | `/tools/scope` | (closer) |

One service = one tool. Never render two tools at once on a page.
