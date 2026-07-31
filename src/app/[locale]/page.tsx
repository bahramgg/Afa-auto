import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/hero';
import { Impact } from '@/components/sections/impact';
import { Manifesto } from '@/components/sections/manifesto';
import { Work } from '@/components/sections/work';
import { ProcessIndex } from '@/components/sections/process-index';
import { Contact } from '@/components/sections/contact';

/* Third draft, 2026-07-31 — reordered to the direct feedback:
 *
 *   Hero          claim + the LIGHT mini-map beside it (full map moved to /map)
 *   Impact   01   the calculator, on screen two — a number from the visitor's
 *                 own business is the fastest proof the claim concerns them
 *   Approach 02   one statement, four promises, the method in one line
 *   Work     03   three systems in production, in window frames
 *   Index    04   the table of contents only; depth lives on /map
 *   Contact       the form, with the pre-call questions beside it
 */
export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Impact />
      <Manifesto />
      <Work />
      <ProcessIndex />
      <Contact />
    </>
  );
}
