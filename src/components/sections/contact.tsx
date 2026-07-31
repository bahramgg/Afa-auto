import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { Window } from '@/components/ui/window';
import { LeadForm } from '@/components/tools/lead-form';

const faqItems = ['timeline', 'wrong', 'data', 'tools', 'pricing', 'exit'] as const;

/* The form and the pre-call questions, side by side in two MATCHED window
 * frames — same chrome, same row, same top edge. The section head spans both,
 * so the pair reads as one composition rather than a form with a sidebar. */
export function Contact() {
  const t = useTranslations('Contact');
  const faq = useTranslations('Faq');

  return (
    <section id="contact" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="05" eyebrow={t('eyebrow')} title={t('title')} lede={t('subtitle')} />

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
          <Window title={t('windowTitle')} className="h-full">
            <h3 className="sr-only">{t('formTitle')}</h3>
            <LeadForm />
          </Window>

          <Window title={faq('windowTitle')} padded={false} className="h-full">
            {faqItems.map((id, index) => (
              <details
                key={id}
                name="faq"
                className={index > 0 ? 'group border-t border-border' : 'group'}
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 text-start text-sm font-semibold text-ink marker:content-none">
                  {faq(`items.${id}.q`)}
                  <span
                    aria-hidden
                    className="relative size-3.5 shrink-0 text-dim transition-colors group-open:text-blue"
                  >
                    <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-current" />
                    <span className="absolute inset-y-0 start-1/2 block w-px -translate-x-1/2 bg-current transition-opacity group-open:opacity-0" />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                  {faq(`items.${id}.a`)}
                </p>
              </details>
            ))}
          </Window>
        </div>
      </Container>
    </section>
  );
}
