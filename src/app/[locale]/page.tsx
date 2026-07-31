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
 *   MapHero       the working map + the claim («روی خلبان خودکار»)
 *   Pulse         the operations console strip — four telemetry lines,
 *                 honestly tagged «نمونهٔ نمایشی»
 *   Services 01   four offers, each opened by a scene the visitor recognises
 *                 and closed by an outcome line, with a console card beside it
 *   Impact   02   the calculator — «تجربه کنید», straight after the offer
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
      <Pulse />
      <Services />
      <Impact />
      <Work />
      <Start />
      <Contact />
    </>
  );
}
