import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { Window } from '@/components/ui/window';

// Split out of the initial bundle — the sliders are below the first paint.
const ImpactCalculator = dynamic(() =>
  import('@/components/tools/impact-calculator').then((m) => m.ImpactCalculator),
);

/* Screen two, by direct request: the visitor meets the calculator immediately
 * after the claim, because a number from their own business is the fastest
 * possible proof the claim concerns them. The tool sits inside a window frame
 * — it IS a running program, and the chrome says so. */
export function Impact() {
  const t = useTranslations('Impact');

  return (
    <section id="impact" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="01" eyebrow={t('eyebrow')} title={t('title')} lede={t('subtitle')} />

        {/* The tool alone in its window. The CTA strip that used to close it
            was removed by direct request; the only asks left on the page are
            the hero button and the form itself. */}
        <Window title={t('windowTitle')} className="mt-12">
          <ImpactCalculator />
        </Window>
      </Container>
    </section>
  );
}
