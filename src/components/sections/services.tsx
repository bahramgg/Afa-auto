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

/* Seven offers as of 2026-08. The phone operator, the loyalty club and
   content production were added by direct request; the tones are the same
   ones their domains carry on the map, so the two drawings agree. */
const ITEMS = [
  { id: 'voice', tone: 7 },
  { id: 'assistant', tone: 1 },
  { id: 'automation', tone: 2 },
  { id: 'store', tone: 6 },
  { id: 'loyalty', tone: 8 },
  { id: 'content', tone: 9 },
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

/** The framed card every demo sits in, with the honesty tag in its head.
 *  `live` adds the reference's green online dot; `note` its status line. */
function DemoCard({
  id,
  live,
  note,
  children,
}: {
  id: ServiceId;
  live?: string;
  note?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations('Services');
  return (
    <div className="tmapPanel">
      <p className="tmapPanelHead flex items-center justify-between gap-4">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate">{t(`items.${id}.title`)}</span>
          {note ? <span className="hidden truncate opacity-70 sm:inline">· {note}</span> : null}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {live ? (
            <span className="flex items-center gap-1.5 rounded-pill border border-success/40 px-2 py-0.5 text-[9px] text-success">
              <span aria-hidden className="pulseDot !size-1.5" />
              {live}
            </span>
          ) : null}
          <span className="rounded-pill border border-border px-2 py-0.5 text-[9px] normal-case tracking-normal opacity-80">
            {t('demoTag')}
          </span>
        </span>
      </p>
      <div className="p-4">{children}</div>
    </div>
  );
}

/** The green check every "this happened" row on the page uses. */
function Tick() {
  return (
    <span
      aria-hidden
      className="grid size-3.5 shrink-0 place-items-center rounded-pill border border-success/60 text-success"
    >
      <svg width="7" height="7" viewBox="0 0 10 10">
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
      q2: t('play.q2'),
      a2: t('play.a2'),
      actionsLabel: t('play.actionsLabel'),
      acts1: [t('play.acts1.a'), t('play.acts1.b'), t('play.acts1.c')],
      acts2: [t('play.acts2.a'), t('play.acts2.b'), t('play.acts2.c')],
      replay: t('play.replay'),
    };
    return (
      <DemoCard id={id} live={t('play.online')} note={t('play.replies')}>
        <AssistantDemo copy={play} />
      </DemoCard>
    );
  }

  if (id === 'automation') {
    /* The reference's workflow canvas, miniature: trigger and decision nodes
       with a fan of actions, then the last-run log. The run ENDS on the
       waiting-for-you row; the pause is the product. */
    return (
      <DemoCard id={id} live={t('flow.active')}>
        <div className="flex items-stretch gap-2 text-center">
          <div className="flex-1 rounded-field border border-border bg-surface px-2 py-2.5">
            <p className="text-xs font-semibold text-ink">{t('flow.n1')}</p>
            <p className="meta mt-0.5 text-[9px] text-dim">{t('flow.n1k')}</p>
          </div>
          <span aria-hidden className="self-center text-dim rtl:-scale-x-100">→</span>
          <div className="flex-1 rounded-field border border-[color-mix(in_srgb,var(--tone)_55%,transparent)] bg-surface px-2 py-2.5">
            <p className="text-xs font-semibold text-ink">{t('flow.n2')}</p>
            <p className="meta mt-0.5 text-[9px] text-[var(--tone)]">{t('flow.n2k')}</p>
          </div>
          <span aria-hidden className="self-center text-dim rtl:-scale-x-100">→</span>
          <div className="flex flex-1 flex-col justify-center gap-1">
            {(['n3', 'n4', 'n5'] as const).map((node) => (
              <p key={node} className="rounded-field border border-border bg-surface px-2 py-1 text-[10.5px] text-muted">
                {t(`flow.${node}`)}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-3 border-t border-border pt-3">
          <p className="meta text-[10px] uppercase text-dim">{t('flow.lastRun')}</p>
          <ul className="mt-1.5 grid gap-1">
            {(['e1', 'e2', 'e3', 'e4'] as const).map((event) => (
              <li key={event} className="flex items-center gap-2 text-xs text-muted">
                <span aria-hidden className="grid size-3.5 shrink-0 place-items-center rounded-pill border border-success/60 text-success">
                  <svg width="7" height="7" viewBox="0 0 10 10">
                    <path d="M1.6 5.2 3.8 7.4 8.4 2.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t(`flow.${event}`)}
              </li>
            ))}
            <li className="mt-1 flex items-center gap-2 border-s-2 border-success bg-success/5 py-1.5 ps-2.5 text-xs text-ink">
              <span aria-hidden className="size-3 shrink-0 rounded-[2px] border-[1.5px] border-success" />
              {t('flow.hold')}
            </li>
          </ul>
        </div>
      </DemoCard>
    );
  }

  if (id === 'voice') {
    /* The reference's call dashboard, miniature: who is on the line, two
       lines of transcript, then what the call actually produced. */
    return (
      <DemoCard id={id} live={t('demos.voice.live')}>
        <p className="meta border-b border-border pb-2.5 text-xs text-ink">
          {t('demos.voice.caller')}
        </p>
        <div className="mt-3 grid gap-2 text-sm leading-relaxed">
          <p className="me-8 w-fit rounded-card rounded-ss-[4px] border border-border bg-surface px-3.5 py-2 text-muted">
            {t('demos.voice.t1')}
          </p>
          <p className="ms-8 w-fit justify-self-end rounded-card rounded-se-[4px] border border-[color-mix(in_srgb,var(--tone)_45%,transparent)] bg-[color-mix(in_srgb,var(--tone)_12%,transparent)] px-3.5 py-2 text-ink">
            {t('demos.voice.t2')}
          </p>
        </div>
        <ul className="mt-3 grid gap-1 border-t border-border pt-3">
          {(['a1', 'a2', 'a3'] as const).map((act) => (
            <li key={act} className="flex items-center gap-2 text-xs text-muted">
              <Tick />
              {t(`demos.voice.${act}`)}
            </li>
          ))}
        </ul>
      </DemoCard>
    );
  }

  if (id === 'loyalty') {
    return (
      <DemoCard id={id}>
        <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2.5">
          <p className="meta text-xs text-ink">{t('demos.loyalty.member')}</p>
          <p className="meta text-xs text-[var(--tone)]">{t('demos.loyalty.points')}</p>
        </div>
        <ul className="mt-1 grid text-sm">
          {(['r1', 'r2', 'r3'] as const).map((row) => (
            <li key={row} className="flex items-center gap-3 py-2 text-muted">
              <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-[var(--tone)]" />
              {t(`demos.loyalty.${row}`)}
            </li>
          ))}
        </ul>
      </DemoCard>
    );
  }

  if (id === 'content') {
    return (
      <DemoCard id={id}>
        <p className="meta text-xs text-ink">{t('demos.content.week')}</p>
        <ul className="mt-2 grid gap-px overflow-hidden rounded-field bg-border">
          {(['c1', 'c2', 'c3'] as const).map((row) => (
            <li
              key={row}
              className="flex items-center gap-3 bg-[var(--win-bg)] px-3 py-2.5 text-sm text-muted"
            >
              <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-[var(--tone)]" />
              {t(`demos.content.${row}`)}
            </li>
          ))}
        </ul>
        {/* The queue stops at you, same as every other run on this page. */}
        <p className="mt-3 flex items-center gap-2 border-s-2 border-success ps-2.5 text-xs text-ink">
          <span aria-hidden className="size-3 shrink-0 rounded-[2px] border-[1.5px] border-success" />
          {t('demos.content.wait')}
        </p>
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
