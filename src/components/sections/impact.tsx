import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { Window } from '@/components/ui/window';

// Split out of the initial bundle — the sliders are below the first paint.
const ImpactCalculator = dynamic(() =>
  import('@/components/tools/impact-calculator').then((m) => m.ImpactCalculator),
);

/* -----------------------------------------------------------------------------
   The calculator, moved to screen FOUR (2026-08).

   It used to be the second thing on the page, which asked a stranger to move
   four sliders before they knew what we do — effort before value. It now sits
   after the map and the proof, where a visitor already has a reason to spend
   the effort.

   It also has an ask again. The moment the number lands is the highest-intent
   moment on the whole page, and it was a dead end: the tool printed «۱۴۰ ساعت»
   and offered nothing to do about it.

   The window frame stays HERE and only here. It is the one element on the page
   that is genuinely a running program, so the chrome is a statement rather
   than decoration — which is exactly why it cannot also be on the case
   studies, the FAQ and the form.
   -------------------------------------------------------------------------- */

export function Impact() {
  const t = useTranslations('Impact');

  return (
    <section id="impact" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="02" eyebrow={t('eyebrow')} title={t('title')} lede={t('subtitle')} />

        <Window title={t('windowTitle')} className="mt-12">
          <ImpactCalculator />
        </Window>

        {/* The ask, on the rule directly under the result. */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-relaxed text-muted">{t('ctaNote')}</p>
          <a
            href="#contact"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-button border border-border px-6 text-sm font-semibold text-ink transition-colors hover:border-border-glass"
          >
            {t('cta')}
          </a>
        </div>
      </Container>
    </section>
  );
}
