import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/hero';
import { Pulse } from '@/components/sections/pulse';
import { Services } from '@/components/sections/services';
import { Work } from '@/components/sections/work';
import { Impact } from '@/components/sections/impact';
import { Start } from '@/components/sections/start';
import { Contact } from '@/components/sections/contact';

/* Fifth draft, 2026-08 — rebuilt on the rasai.ca structure, our style:
 *
 *   Hero          the still wheel + the claim
 *   Services 01   ten offers, collapsed; each opens onto its scene, its
 *                 system, its outcome and a sample run
 *   Pulse         one working day, four entries
 *   Impact   02   the calculator, straight after the offer
 *   Work     03   proof: before → what was deployed → after
 *   Start    04   process + «چرا ما» differentiators (absorbed the Manifesto)
 *   Contact  05   the free assessment form, remaining questions beside it
 */
export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Services />
      <Pulse />
      <Impact />
      <Work />
      <Start />
      <Contact />
    </>
  );
}
