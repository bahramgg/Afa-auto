import { setRequestLocale } from 'next-intl/server';
import { MapHero } from '@/components/sections/map-hero';
import { Manifesto } from '@/components/sections/manifesto';
import { Work } from '@/components/sections/work';
import { Impact } from '@/components/sections/impact';
import { Start } from '@/components/sections/start';
import { Contact } from '@/components/sections/contact';

/* Fourth draft, 2026-08 — reordered around one question: what does a stranger
 * need, in what order, before they will pick up the phone?
 *
 *   MapHero       the working map, first screen. The claim sits beside it,
 *                 not in front of it. This is the thing nobody else has, and
 *                 it used to be a click away behind a decorative stand-in.
 *   Approach 01   what we will and will not do with your business
 *   Work     02   three systems in production — proof before effort
 *   Impact   03   THEN the calculator. Asking a visitor to move four sliders
 *                 before they know what you do is asking for effort before
 *                 value; it used to be the second thing on the page.
 *   Start    04   how much, how long, and what happens after you send the form
 *   Contact  05   the form, with the remaining questions beside it
 *
 * The old ProcessIndex section is gone. It was a table of contents for the
 * map, and the map is now the first thing on the page — a list of what the
 * drawing above already shows is the definition of a section that repeats
 * itself.
 */
export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <MapHero />
      <Manifesto />
      <Work />
      <Impact />
      <Start />
      <Contact />
    </>
  );
}
