import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { cn } from '@/lib/cn';

const steps = ['call', 'review', 'proposal', 'build'] as const;
const why = ['fast', 'tools', 'ownership', 'human'] as const;

/* -----------------------------------------------------------------------------
   How the work starts — «how long, how much, what happens next».

   REDRAWN 2026-08 on «فرایند میخوام به شکل واقعی فرایند نشون داده بشه و
   دیزاین بشه / الان ما توی اون قسمت ۲ تا جدول مشابه به هم داریم که زیبا نیست
   از نظر بصری».

   Both halves were the same object: a four-column ruled panel, twice, one
   under the other. Two identical grids do not read as two different ideas,
   they read as a spreadsheet. So the two halves are now drawn as the two
   different things they actually are:

     THE PROCESS is a RAIL. Four numbered nodes on one line, joined by
     connectors that end in an arrow, so the section shows a sequence instead
     of listing one. Below lg the line is vertical, because four nodes side by
     side on a phone is not a sequence either.

     WHY US is a plain checked list on hairlines, no cells and no boxes. It is
     a set of assurances, not an ordered anything, and nothing about it should
     suggest a step.

   No number is invented. The one figure here — two to four weeks — is the
   figure the FAQ already gave, with the same condition attached, and the price
   is still quoted only after the review meeting.
   -------------------------------------------------------------------------- */

export function Start() {
  const t = useTranslations('Start');

  return (
    <section id="start" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="04" eyebrow={t('eyebrow')} title={t('title')} lede={t('lede')} />

        {/* The rail. gap-x is zero on the wide layout on purpose: the
            connector runs to the edge of its own cell, so any horizontal gap
            would leave the line hanging short of the next node. The reading
            gutter is put back as padding inside each cell instead. */}
        <ol className="mt-12 grid gap-y-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-0">
          {steps.map((id, index) => {
            const last = index === steps.length - 1;
            const node = (
              <span className="meta grid size-11 shrink-0 place-items-center rounded-pill border border-border bg-surface-2 text-sm font-semibold tabular-nums text-blue shadow-raise">
                {`0${index + 1}`}
              </span>
            );

            return (
              <li key={id} className="flex gap-4 sm:block lg:pe-8">
                {/* PHONE: the rail is vertical and the copy sits beside it, so
                    the line never runs through the text. */}
                <div aria-hidden className="flex flex-col items-center sm:hidden">
                  {node}
                  {!last ? <span className="mt-2 w-px flex-1 bg-border" /> : null}
                </div>

                {/* WIDE: the rail is horizontal, and the connector points at
                    the next node. Four nodes on one line is the sequence. */}
                <div className="hidden items-center gap-3 sm:flex">
                  {node}
                  {!last ? (
                    <span aria-hidden className="hidden flex-1 items-center gap-1 lg:flex">
                      <span className="h-px flex-1 bg-border" />
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 14 14"
                        className="shrink-0 text-dim rtl:-scale-x-100"
                      >
                        <path
                          d="M5.5 3.5 9 7l-3.5 3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pb-9 sm:pb-0">
                  <h3 className="text-sm font-semibold text-ink sm:mt-5">
                    {t(`steps.${id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`steps.${id}.body`)}
                  </p>

                  {/* Only one step carries a duration, and only because it is
                      the one the FAQ already committed to. */}
                  {id === 'build' ? (
                    <p className="meta mt-4 inline-flex rounded-pill border border-border px-3 py-1.5 text-[11px] text-dim">
                      {t('buildWindow')}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Why us over doing it yourself. Every line is a claim the FAQ and the
            manifesto already made; both of those sections died into this one. */}
        <div className="mt-16 border-t border-border pt-10">
          <h3 className="text-base font-bold text-ink">{t('whyTitle')}</h3>
          <ul className="mt-2 grid sm:grid-cols-2 sm:gap-x-12">
            {why.map((id, index) => (
              <li
                key={id}
                className={cn(
                  'border-b border-border py-5',
                  // The last row of each column carries no rule, so the block
                  // ends on type rather than on a line.
                  index >= why.length - 1 && 'border-b-0',
                  index === why.length - 2 && 'sm:border-b-0',
                )}
              >
                <p className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                  <span
                    aria-hidden
                    className="grid size-4 shrink-0 place-items-center rounded-[3px] border border-success/50 text-success"
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
                  {t(`why.${id}.title`)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(`why.${id}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand px-7 text-sm font-semibold text-bg-950 shadow-brand"
          >
            {t('cta')}
          </a>
        </div>
      </Container>
    </section>
  );
}
