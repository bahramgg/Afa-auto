/* -----------------------------------------------------------------------------
   Build the social-share cards into `public/og-{fa,en}.png`.

   Why a script and not `opengraph-image.tsx`: Next's ImageResponse needs a
   font BUFFER, and this project's self-hosted faces are woff2, which satori
   cannot parse. Rasterising here — from the same tokens, the same fonts and
   the same map geometry the site uses — keeps one source of truth and ships a
   static file, which is also the only thing that renders reliably inside
   Iranian messenger previews.

   Run: `npm run og:build` with `npm run dev` (or `start`) already serving.
   The output is committed; this is not part of `next build`.
   -------------------------------------------------------------------------- */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE = process.env.OG_BASE_URL ?? 'http://localhost:3000';
const OUT = path.join(process.cwd(), 'public');
const LOCALES = ['fa', 'en'];

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? undefined,
});

await mkdir(OUT, { recursive: true });

for (const locale of LOCALES) {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  /* Load the real page so the card inherits the real fonts and tokens, then
     strip it down to the one composition a share card can carry: the claim,
     the mark, and the map. */
  await page.goto(`${BASE}/${locale}?og=1`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('header, footer, section:not(#top)').forEach((el) => el.remove());
    const hero = document.querySelector('#top');
    if (hero instanceof HTMLElement) {
      hero.style.minHeight = '630px';
      hero.style.borderBottom = 'none';
    }
    /* Interactive chrome has no meaning in a still: the fullscreen chip, the
       domain stepper and the click hint are all instructions for a cursor. */
    document
      .querySelectorAll('.tmapChip, .tmapStepper, .tmapShell + p')
      .forEach((el) => el.remove());
    document.body.style.overflow = 'hidden';
  });
  await page.waitForTimeout(2200); // let the map finish its entrance

  await page.screenshot({
    path: path.join(OUT, `og-${locale}.png`),
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  await page.close();
  console.log(`wrote public/og-${locale}.png`);
}

await browser.close();
