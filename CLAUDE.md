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

1. **Hero** (`sections/hero.tsx`) — the claim on the start side, the working
   wheel on the end side, both on the first screen. What had to go was never
   the diagram, it was the BACKGROUND under it: no grid, no frame, no panel
   fill, and the body's old violet halo is deleted outright. The wheel here is
   a PICTURE as of 2026-08: nothing on it selects, steps or opens, and the
   stepper pill is gone with the eyebrow above the headline. Typography, the
   ROTATING job line (`ui/rotating-words.tsx`, joined-script-safe), the white
   primary button, and the structural counts over one hairline.
2. **Services** (01) — the heart, and the section directly under the hero.
   TEN offers, one per domain on the map, in the wheel's own reading order:
   phone operator, assistant, support, operations automation, website/store,
   SEO, content, loyalty club, finance, reporting. Each carries the tone its
   domain has on the map, so the two drawings agree item for item.

   COLLAPSED. Ten full articles is six screens of reading, so the section is a
   grid of closed cards, two abreast, every one the same size; opening one
   produces its SCENE (the situation, no adjectives), its SYSTEM (what gets
   deployed), its OUTCOME (one bold line) and a sample run. The disclosure is a
   plain `<details>` — no state, no client component, and every card is open in
   print and in a full-page capture. The assistant card is PLAYABLE
   (`tools/assistant-demo.tsx`); the automation card is a miniature workflow
   canvas (trigger → decision → actions) with a LAST RUN log that ends on
   «منتظر تأیید شما» — the pause is the product. Copy arrives as props; the
   client ships no catalog.
3. **Pulse** — the operations console strip («کنسول عملیات»), after the offer
   rather than before it. The live-looking treatment is back by direct request:
   pulsing dots, relative timestamps, the console voice. What does NOT come
   back is the honesty tag, which is deleted site-wide; the strip shows four
   KINDS of line the console prints and never a volume, a total or a rate.
4. **Impact** (02, «محاسبه‌گر») — the calculator, straight after the offer;
   the interactive moments ARE the argument, so they come early.
5. **Work** (03) — proof as before → what was deployed → after.
6. **Start** (04) — the process, drawn as a PROCESS: four numbered nodes on
   one rail, joined by connectors that end in an arrow (vertical on a phone,
   horizontal from lg). «چرا ما» sits under it as a plain checked list on
   hairlines, deliberately NOT a second grid — two identical four-column panels
   read as a spreadsheet, which is what this section was. It absorbed the old
   Manifesto and the checkmark notes; one home for those claims, not three.
7. **Contact** (05) — reframed as the FREE ASSESSMENT («ارزیابی رایگان
   فرایندها») — the RAS conversion device; every CTA on the page converges
   here or on /map.

The HEADER is four section anchors in one raised rail, with the read section
lit by scroll-spy, plus the language and the night/day switch. /map and the
free assessment were both removed from it by direct request. The FOOTER is ONE
bordered block — mark, tagline (the page's own headline, not a second slogan),
rights, links, family and the whole ghost wordmark inside a single card. The
copyright has no band of its own: it is one short sentence and it sits under
the mark.

`/map` is the only other route. The ghost wordmark (`.ghost-word` — Latin
display always; it is the logotype, not a word being read) signs off inside
the footer card.

## Copy voice

SHORT. Headlines ≤ 12 words, descriptions ≤ 2 sentences (the Lindy/Make
discipline); no metaphors a shop owner wouldn't use («خلبان خودکار» died for
this) and NO QUESTIONS in the hero — a headline that asks makes the visitor
do the work. «نمونه‌کار» is out too: the section is
«اتوماسیون‌های اجراشده», which says what it is. Scenario first, outcome last,
zero adjectives in between.

The scene is IMPERSONAL, present tense («تلفن زنگ می‌خورد و کسی نیست…»): the
section describes a situation rather than pointing at the reader, on «مخاطب
قرار نده کاربر رو». Recognition is what "feeling real" means, and a situation
is recognisable without a «شما» in it. Second person survives only where the
copy genuinely addresses the visitor: the form, the calculator, and the human
checkpoint («به تأیید شما می‌رسد»).

Claims may only restate what the case studies and FAQ already establish;
performance numbers (RAS shows «25hrs saved») are exactly what we may NOT
invent — structural counts and the visitor's own calculator output carry that
load instead. The «نمونه نمایشی · داده واقعی نیست» tags are GONE from the
whole site by direct request; what keeps the mocks honest now is restraint in
the mocks themselves — no relative timestamps, no green ONLINE pills on a
static picture, no counters. A sample run may show the SHAPE of the work and
never a volume.

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

**TWO GROUNDS as of 2026-08** («میخوام حالت روز هم به سایت اضافه کنی»). The
night ground is the default and the brand; `src/styles/theme-light.css` is a
DAY override of the same site-local names under `:root[data-theme='light']`,
and components never learn which one they are on. The switch
(`layout/theme-switch.tsx`) writes one attribute and the cascade does the rest;
a blocking script in the layout re-applies the stored choice before first
paint, so a returning visitor never sees the other ground flash. The system
preference is NOT consulted — a laptop in light mode has not asked for a
different brand. The day palette is a separate FILE precisely so
`test/contrast.test.ts` can resolve both token sets independently and hold the
day ground to the same AA floor, ten map tones included.

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

REDRAWN 2026-08 on the note «قشنگ‌تر و تمیزتر و حرفه‌ای‌تر». The console
pastiche (blueprint grid, four dashed guides, seventy-two stage nodes, a
hundred crossing hairlines) is gone: dense, but it read as static at any real
size. Two drawings remain:

- **THE WHEEL** — three rings and nothing else. TEN domains as of 2026-08
  (SEO joined the phone operator, the loyalty club and content production, all
  by direct request), 36° per sector, started on the HALF-STEP so no badge sits
  at 180° where the stepper floats, or on any other clock hand. A particle core
  inside one thin circle; ten domain badges on the inner ring, each labelled
  INWARD into the empty annulus; forty process rings on the outer ring, four
  per sector, reached by a QUADRATIC BEZIER that leaves the badge along its own
  ray and bows into place. Curves, not spokes — that bow is what makes ten
  identical sectors look designed rather than generated. One marching orbit is
  the only ambient motion; the scene itself holds still.

  EVERY LABEL SITS IN A BOX («هر کلمه توی یک کادر مناسب قرار بگیرن»). The chip
  is real HTML inside a `<foreignObject>`, never an SVG `<text>` with a guessed
  rect behind it: the browser measures the string, so one rule fits both
  scripts. The label ring's radius is the compromise between two collisions
  that pull opposite ways — outward spreads neighbours apart, inward keeps a
  box off its own badge at 3 and 9 o'clock, where the box grows toward the
  badge by its half-WIDTH. Both are checked in a real browser, not eyeballed.

  The palette grew with it: `--map-7/8/9/10` are site-local literals in
  tokens.css, because the shared family ships six and afa-tokens.css is
  vendored under a hash pin. Ten glyphs, ten tones, all through the contrast
  test.
- **THE FAN** — one domain, opened. The domain drops to the foot of the stage
  over its own particle seed, dotted rays climb to the four HUMAN CHECKPOINTS
  (squares, green, the only status colour on the map), a plumb line runs from
  each up to its PROCESS, and the processes splay into the twelve machine
  stages across the top, grouped by stage so the branches cross.

**NO GROUND UNDER EITHER.** No grid, no page halo, no panel fill; the hero
stage is frameless entirely and only /map keeps a hairline, because there it
sits between two rails. The hundred and twenty stage nodes live in the fan,
where they are labelled and readable, and `COUNTS` still counts them for the
legend. /map's stage reserves dead space at its foot for the stepper pill,
because at ten domains the wheel's lowest process rings reach into it.

Rules that hold across both:

- `src/lib/capability-map.ts` — structure and geometry. Pure, no React, no
  strings; `layoutMandala()` and `layoutFan()` are closed-form, so every fan is
  built once at module scope. **All scatter comes from a hash of each node's
  id, never `Math.random()`** — the map renders on the server and again in the
  browser, and two different pictures is a hydration error. `unit()` runs the
  lowbias32 finaliser over FNV: raw FNV on sequential keys scatters in visible
  spokes, not a cloud.
- `src/components/tools/capability-map.tsx` — the client component, no
  arithmetic. `variant="hero"` drops the reading rails, the fullscreen chip,
  the stepper AND every interaction: on the landing page the wheel is scenery,
  so its nodes carry no role, no tab stop and no handler. A `hidden` utility
  cannot hide `.tmapChip`, which sets display itself and wins the cascade, so
  that one is a conditional render.
- Selecting a DOMAIN opens the fan and nothing else; only a PROCESS opens the
  detail window.
- `src/styles/capability-map.css` — all visuals. State via `data-*`
  attributes; animation delays are CSS phase buckets, never inline styles.
- `test/capability-map.test.ts` — determinism, bounds, ring radii, that every
  link actually BOWS (a control point on the chord would be a spoke), that
  labels clear both the core and their own badge and each other, collision,
  and that both catalogs describe every node in full.

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
  `shadow-brand`, `rounded-card`, …) or the `--*` variables. A new colour needs
  a value on BOTH grounds and must clear AA on both; the token names do not
  change, only what they resolve to.
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
- `src/styles/` — `tokens.css` (source of truth), `theme-light.css` (the day
  overrides), `fonts.css`, `globals.css`.
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
