import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { LeadForm } from '@/components/tools/lead-form';

/* The two questions everyone asks first — how much, how long — were promoted
   out of here into the Start section. What is left is the detail: what happens
   if it gets something wrong, where the data lives, whether you have to
   replace your tools, and how to walk away. */
const faqItems = ['wrong', 'data', 'tools', 'exit'] as const;

/* -----------------------------------------------------------------------------
   The form and the remaining questions, side by side.

   Restyled 2026-08: the two mac window frames are gone. Both halves are now
   ruled panels with a mono head, so this section speaks the same language as
   the map, the directory and the legend rather than a fourth one.
   -------------------------------------------------------------------------- */

export function Contact() {
  const t = useTranslations('Contact');
  const faq = useTranslations('Faq');

  return (
    <section id="contact" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="05" eyebrow={t('eyebrow')} title={t('title')} lede={t('subtitle')} />

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-2">
          <div className="tmapPanel h-full">
            <p className="tmapPanelHead">{t('formTitle')}</p>
            <div className="p-6 sm:p-7">
              <LeadForm />
            </div>
          </div>

          <div className="tmapPanel h-full">
            <p className="tmapPanelHead">{faq('eyebrow')}</p>
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
          </div>
        </div>
      </Container>
    </section>
  );
}
