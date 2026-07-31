import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { RuledCell, RuledPanel, SectionHead } from '@/components/ui/editorial';

const steps = ['call', 'review', 'proposal', 'build'] as const;
const notes = ['ownership', 'tools', 'exit'] as const;

/* -----------------------------------------------------------------------------
   New section, 2026-08 — «how long, how much, what happens next».

   Every one of these was already true and already written; it was just buried.
   "How much does it cost" and "how long does it take" are a stranger's first
   and second questions, and both were closed rows in an accordion at the very
   bottom of the page. Nothing here is a new claim: the four steps and the
   three assurances are the FAQ's own answers, promoted to where they are asked.

   No number is invented. The one figure on the page — two to four weeks — is
   the figure the FAQ already gave, with the same condition attached, and the
   price stays exactly as honest as it was: it is quoted after the review
   meeting, and anything before that is a guess.
   -------------------------------------------------------------------------- */

export function Start() {
  const t = useTranslations('Start');

  return (
    <section id="start" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="04" eyebrow={t('eyebrow')} title={t('title')} lede={t('lede')} />

        <RuledPanel columns={4} className="mt-12">
          {steps.map((id, index) => (
            <RuledCell key={id} as="li" className="list-none">
              <p className="meta text-xs text-blue">{`0${index + 1}`}</p>
              <h3 className="mt-4 text-sm font-semibold text-ink">{t(`steps.${id}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(`steps.${id}.body`)}</p>
              {/* Only one step carries a duration, and only because it is the
                  one the FAQ already committed to. */}
              {id === 'build' ? (
                <p className="meta mt-4 border-t border-border pt-3 text-[11px] text-dim">
                  {t('buildWindow')}
                </p>
              ) : null}
            </RuledCell>
          ))}
        </RuledPanel>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <ul className="grid gap-2.5">
            {notes.map((id) => (
              <li key={id} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                <span
                  aria-hidden
                  className="mt-1 grid size-4 shrink-0 place-items-center rounded-[3px] border border-success/50 text-success"
                >
                  <svg width="9" height="9" viewBox="0 0 10 10">
                    <path
                      d="M1.6 5.2 3.8 7.4 8.4 2.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {t(`notes.${id}`)}
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand px-7 text-sm font-semibold text-white shadow-brand"
          >
            {t('cta')}
          </a>
        </div>
      </Container>
    </section>
  );
}
