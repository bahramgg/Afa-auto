# CLAUDE.md — AFA site

Bilingual (fa/en) **single-page introduction site** for AFA, which automates
repetitive business processes. `docs/afa-services-site-plan-fa.md` is the
original plan and is now largely superseded — where it and this file disagree,
this file wins.

## What the site is

REBUILT 2026-08 on the rasai.ca structure («ras را الگو قرار بدیم اما به سبک
خودمون»): scenario-led services, shown-not-described product, proof as
before/deployed/after — carried in this site's own voice (navy, the map, the
mono console). One page, the RAS spine:

1. **Hero** (`sections/hero.tsx`), TEXT ONLY on the bare ground; the owner
   said «هیرو نباید بکگراند داشته باشه» twice, and the second time meant the
   map panel too. Typography, the ROTATING job line
   (`ui/rotating-words.tsx`, joined-script-safe), the white primary button,
   and the structural counts as a hairline stat strip. The body's old violet
   halo is deleted; the ground is flat.
1b. **LiveMap** (`sections/live-map.tsx`) — the working map, one scroll in:
   the slot rasai.ca gives its live dashboard. Same interactions as /map,
   no rails.
2. **Pulse** — the operations-console strip: four telemetry lines, one per
   service, ALWAYS tagged «نمونهٔ نمایشی · داده واقعی نیست». The strip earns
   its realism from that tag; removing it turns the section into a fabricated
   metric.
3. **Services** (01) — the heart. Four offers (assistant, operations
   automation, website/store, reports). The assistant card is PLAYABLE
   (`tools/assistant-demo.tsx`) and closes with the reference's ACTIONS
   TRIGGERED check-list; the automation card is a miniature workflow canvas
   (trigger → decision → actions) with a LAST RUN log that ends on
   «منتظر تأیید شما» — the pause is the product. Demo cards carry a green
   ONLINE pill plus the «نمونه نمایشی» honesty tag. Copy arrives as props;
   the client ships no catalog. Each offer: the SCENE (a
   moment the visitor recognises, present tense), the SYSTEM (what gets
   deployed, no adjectives), the OUTCOME (one bold line). A console card
   beside each shows the thing itself — chat exchange, run with its human
   checkpoint, receipt, morning brief — every card tagged «نمونه نمایشی».
   The four services are the four things the case studies prove were shipped.
4. **Impact** (02, «تجربه کنید») — the calculator, straight after the offer;
   the interactive moments ARE the argument, so they come early.
6. **Work** (03) — proof as before → what was deployed → after.
7. **Start** (04) — four steps + «چرا ما» differentiators (absorbed the old
   Manifesto and the checkmark notes; one home for those claims, not three).
7. **Contact** (05) — reframed as the FREE ASSESSMENT («ارزیابی رایگان
   فرایندها») — the RAS conversion device; every CTA on the page converges
   here or on /map.

`/map` is the only other route. The footer signs off with the ghost wordmark
(`.ghost-word` — Latin display always; it is the logotype, not a word being
read).

## Copy voice

SHORT. Headlines ≤ 12 words, descriptions ≤ 2 sentences (the Lindy/Make
discipline); no metaphors a shop owner wouldn't use — «خلبان خودکار» died for
this. Scenario first, outcome last, zero adjectives in between. The scene is second
person, present tense («ساعت ۱۱ شب است. مشتری در دایرکت قیمت می‌پرسد…») —
recognition is what "feeling real" means. Claims may only restate what the
case studies and FAQ already establish; performance numbers (RAS shows «25hrs
saved») are exactly what we may NOT invent — structural counts and the
visitor's own calculator output carry that load instead.

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
3. **Rationed light.** The ground stays deep. The brand gradient appears on
   the primary action only — no gradient headlines. Glow at most three times
   per page.

**REPALETTED 2026-08** by direct request: warm black ground + a single
ember-amber accent (`#b45309 → #d97416`, pale `#ffc46b` for focus/accent
text), warm ivory ink. The change lives ENTIRELY in tokens.css — the alias
layer repoints, afa-tokens.css stays vendored and untouched, and `--blue`
now paints amber because the token name is a slot, not a hue. Every value
went through test/contrast.test.ts. Latin display switched Cormorant → 
**Manrope 800** (the console voice is a geometric sans, not a garalde);
Persian display unchanged. The dotted hero background is gone by direct
request. The raster logo keeps its own neon — a recoloured logo is a
different logo (AfaMark.tsx).

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
