import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AssistantDemo, type AssistantPlayCopy } from '@/components/tools/assistant-demo';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { cn } from '@/lib/cn';

/* -----------------------------------------------------------------------------
   Services — new section, 2026-08, and the heart of the RAS-modelled rewrite.

   The old page never said what AFA actually SELLS; it showed a map and a
   manifesto and hoped. This section does what rasai.ca does with each
   offering, in three beats:

     the SCENE      a moment the visitor recognises («ساعت ۱۱ شب. مشتری در
                    دایرکت قیمت می‌پرسد…») — second person, present tense,
                    because recognition is what "feeling real" is;
     the SYSTEM     one paragraph of what gets deployed, no adjectives;
     the OUTCOME    one bold line, the domain's colour on its rule.

   Beside each, a small CONSOLE CARD shows the thing itself — a chat exchange,
   a run with its human checkpoint, a receipt, a morning brief. Every card is
   tagged «نمونه نمایشی»: the no-fabricated-data rule applies to pictures as
   much as to copy, and an unlabelled mockup is a fabricated metric with
   extra steps.

   The four services are the four things the case studies already prove were
   shipped — assistant, operations chain, online store, reports. Nothing here
   is a new claim.
   -------------------------------------------------------------------------- */

const ITEMS = [
  { id: 'assistant', tone: 1 },
  { id: 'automation', tone: 2 },
  { id: 'store', tone: 6 },
  { id: 'reports', tone: 3 },
] as const;

type ServiceId = (typeof ITEMS)[number]['id'];

export function Services() {
  const t = useTranslations('Services');

  return (
    <section id="services" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="01" eyebrow={t('eyebrow')} title={t('title')} lede={t('lede')} />

        <div className="mt-12 overflow-hidden rounded-card border border-border">
          {ITEMS.map((item, index) => (
            <article
              key={item.id}
              data-tone={item.tone}
              className={cn(
                'cmap grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-12',
                index > 0 && 'border-t border-border',
              )}
            >
              <div className={cn(index % 2 === 1 && 'lg:order-2')}>
                <h3 className="flex items-baseline gap-3 text-lg font-bold text-ink">
                  <span aria-hidden className="meta text-xs text-[var(--tone)]">
                    {`0${index + 1}`}
                  </span>
                  {t(`items.${item.id}.title`)}
                </h3>

                <p className="meta mt-6 text-[11px] uppercase text-dim">{t('scenarioLabel')}</p>
                {/* The scene is the hook, so it gets the display voice — the
                    one place body copy borrows the headline's type. */}
                <p className="mt-2 max-w-xl text-base font-medium leading-relaxed text-ink sm:text-lg">
                  {t(`items.${item.id}.scenario`)}
                </p>

                <p className="meta mt-5 text-[11px] uppercase text-dim">{t('solutionLabel')}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {t(`items.${item.id}.solution`)}
                </p>

                <p className="mt-6 border-s-2 border-[var(--tone)] ps-3 text-sm font-semibold leading-relaxed text-ink">
                  {t(`items.${item.id}.outcome`)}
                </p>
              </div>

              <div className={cn('self-center', index % 2 === 1 && 'lg:order-1')}>
                <Demo id={item.id} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/map"
            className="inline-flex min-h-12 items-center rounded-button border border-border px-7 text-sm font-semibold text-ink transition-colors hover:border-border-glass"
          >
            {t('mapCta')}
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------- demo cards */

/** The framed card every demo sits in, with the honesty tag in its head. */
function DemoCard({ id, children }: { id: ServiceId; children: React.ReactNode }) {
  const t = useTranslations('Services');
  return (
    <div className="tmapPanel">
      <p className="tmapPanelHead flex items-center justify-between gap-4">
        <span className="truncate">{t(`items.${id}.title`)}</span>
        <span className="shrink-0 rounded-pill border border-border px-2 py-0.5 text-[9px] normal-case tracking-normal opacity-80">
          {t('demoTag')}
        </span>
      </p>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Demo({ id }: { id: ServiceId }) {
  const t = useTranslations('Services');

  if (id === 'assistant') {
    /* The one demo the visitor can OPERATE — every reference site's strongest
       move. Strings resolve here on the server and travel as props; the
       client component ships no catalog. */
    const play: AssistantPlayCopy = {
      prompt: t('play.prompt'),
      q1: t('play.q1'),
      a1: t('play.a1'),
      b1: t('play.b1'),
      q2: t('play.q2'),
      a2: t('play.a2'),
      b2: t('play.b2'),
      replay: t('play.replay'),
    };
    return (
      <DemoCard id={id}>
        <AssistantDemo copy={play} />
      </DemoCard>
    );
  }

  if (id === 'automation') {
    const done = ['s1', 's2', 's3'] as const;
    return (
      <DemoCard id={id}>
        <ol className="grid gap-0.5 text-sm">
          {done.map((step) => (
            <li key={step} className="flex items-center gap-3 py-1.5 text-muted">
              <span
                aria-hidden
                className="grid size-4 shrink-0 place-items-center rounded-pill border border-[color-mix(in_srgb,var(--tone)_60%,transparent)] text-[var(--tone)]"
              >
                <svg width="8" height="8" viewBox="0 0 10 10">
                  <path
                    d="M1.6 5.2 3.8 7.4 8.4 2.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {t(`demos.automation.${step}`)}
            </li>
          ))}
          {/* The fourth step is the argument: the chain STOPS for the human. */}
          <li className="mt-1.5 flex items-center gap-3 border-s-2 border-success bg-success/5 py-2 ps-3 text-ink">
            <span aria-hidden className="size-3 shrink-0 rounded-[2px] border-[1.5px] border-success" />
            <span className="min-w-0">
              {t('demos.automation.s4')}
              <span className="meta ms-2 text-[10px] text-success">
                {t('demos.automation.hold')}
              </span>
            </span>
          </li>
        </ol>
      </DemoCard>
    );
  }

  if (id === 'store') {
    const rows = ['paid', 'sms', 'crm'] as const;
    return (
      <DemoCard id={id}>
        <p className="meta border-b border-border pb-2.5 text-xs text-ink">
          {t('demos.store.order')}
        </p>
        <ul className="mt-1 grid text-sm">
          {rows.map((row) => (
            <li key={row} className="flex items-center gap-3 py-2 text-muted">
              <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-[var(--tone)]" />
              {t(`demos.store.${row}`)}
            </li>
          ))}
        </ul>
      </DemoCard>
    );
  }

  return (
    <DemoCard id={id}>
      <p className="meta text-xs text-ink">{t('demos.reports.title')}</p>
      <ul className="mt-2 grid gap-px overflow-hidden rounded-field bg-border">
        {(['l1', 'l2', 'l3'] as const).map((line) => (
          <li key={line} className="flex items-center gap-3 bg-[var(--win-bg)] px-3 py-2.5 text-sm text-muted">
            <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-[var(--tone)]" />
            {t(`demos.reports.${line}`)}
          </li>
        ))}
      </ul>
    </DemoCard>
  );
}
