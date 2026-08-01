import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AssistantDemo, type AssistantPlayCopy } from '@/components/tools/assistant-demo';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { cn } from '@/lib/cn';

/* -----------------------------------------------------------------------------
   Services — the heart of the page.

   REBUILT 2026-08 on «شکل نمایش خدمات اشتباه و شلوغه / باید به صورت جمع شده
   باشه / و وقتی کاربر خواست روش کلیک کنه تا باقی اطلاعات و نمونه به نمایش در
   بیاد / باید منظم کنار هم باشن».

   It used to be a stack of full-height articles, each with its console card
   beside it: ten of those is roughly six screens of unbroken reading before
   the page moves on. Now the section is a GRID OF CLOSED CARDS, two abreast,
   every one the same size — so the offer can be taken in at a glance — and
   opening a card is what produces its scene, its system, its outcome and its
   sample run.

   The disclosure is a plain <details>. No state, no client component, no
   hydration: the section stays server-rendered, it works before JavaScript
   arrives, and every card is open in print and in a full-page capture.

   TEN offers, one per domain on the map, in the wheel's own reading order, so
   the two drawings finally agree item for item.

   The «نمونه نمایشی» tags are gone from every card, by direct request. What
   replaced them is restraint in the mocks themselves: no timestamps that imply
   a live feed, no green ONLINE pills on a static picture, no counters. A
   sample run that shows only the SHAPE of the work is not a claim about
   volume, which is the thing the no-fabricated-metrics rule actually guards.
   -------------------------------------------------------------------------- */

const ITEMS = [
  { id: 'voice', tone: 7 },
  { id: 'assistant', tone: 1 },
  { id: 'support', tone: 5 },
  { id: 'automation', tone: 2 },
  { id: 'store', tone: 6 },
  { id: 'seo', tone: 10 },
  { id: 'content', tone: 9 },
  { id: 'loyalty', tone: 8 },
  { id: 'finance', tone: 4 },
  { id: 'reports', tone: 3 },
] as const;

type ServiceId = (typeof ITEMS)[number]['id'];

export function Services() {
  const t = useTranslations('Services');

  return (
    <section id="services" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="01" eyebrow={t('eyebrow')} title={t('title')} lede={t('lede')} />

        {/* items-start, so opening one card never stretches its neighbour. */}
        <div className="mt-12 grid items-start gap-4 lg:grid-cols-2">
          {ITEMS.map((item, index) => (
            <details
              key={item.id}
              data-tone={item.tone}
              className="cmap group overflow-hidden rounded-card border border-border bg-surface/40 transition-colors open:bg-surface/70 hover:border-border-glass"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className="meta grid size-9 shrink-0 place-items-center rounded-pill border border-[color-mix(in_srgb,var(--tone)_45%,transparent)] text-xs font-semibold text-[var(--tone)]"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-ink">
                    {t(`items.${item.id}.title`)}
                  </span>
                  <span className="mt-1 line-clamp-1 text-sm text-dim">
                    {t(`items.${item.id}.outcome`)}
                  </span>
                </span>

                <span className="meta hidden shrink-0 items-center gap-2 text-[11px] text-dim sm:flex">
                  {t('more')}
                  <svg
                    aria-hidden
                    width="11"
                    height="11"
                    viewBox="0 0 14 14"
                    className="transition-transform duration-200 group-open:rotate-180"
                  >
                    <path
                      d="M3 5.5 7 9.5l4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>

              <div className="border-t border-border p-5">
                <Field label={t('scenarioLabel')} value={t(`items.${item.id}.scenario`)} />
                <Field
                  label={t('solutionLabel')}
                  value={t(`items.${item.id}.solution`)}
                  className="mt-4"
                />
                <p className="meta mt-4 text-[11px] uppercase text-dim">{t('outcomeLabel')}</p>
                <p className="mt-1.5 border-s-2 border-[var(--tone)] ps-3 text-sm font-semibold leading-relaxed text-ink">
                  {t(`items.${item.id}.outcome`)}
                </p>

                <div className="mt-6">
                  <Demo id={item.id} />
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
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

/** One labelled paragraph. Every open card has the same three, in this order. */
function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="meta text-[11px] uppercase text-dim">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------- demo cards */

/** The framed card every sample run sits in. */
function DemoCard({ id, children }: { id: ServiceId; children: React.ReactNode }) {
  const t = useTranslations('Services');
  return (
    <div className="tmapPanel">
      <p className="tmapPanelHead truncate">{t(`items.${id}.title`)}</p>
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

/** A plain list of rows, tone-dotted. Four of the ten demos are exactly this. */
function Rows({ rows }: { rows: readonly string[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-field bg-border">
      {rows.map((row) => (
        <li
          key={row}
          className="flex items-center gap-3 bg-[var(--win-bg)] px-3 py-2.5 text-sm text-muted"
        >
          <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-[var(--tone)]" />
          {row}
        </li>
      ))}
    </ul>
  );
}

function Demo({ id }: { id: ServiceId }) {
  const t = useTranslations('Services');

  if (id === 'assistant') {
    /* The one demo the visitor can OPERATE. Strings resolve here on the server
       and travel as props; the client component ships no catalog. */
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
      <DemoCard id={id}>
        <AssistantDemo copy={play} />
      </DemoCard>
    );
  }

  if (id === 'automation') {
    /* A workflow canvas, miniature: trigger and decision nodes with a fan of
       actions, then the last-run log. The run ENDS on the waiting-for-you row;
       the pause is the product. */
    return (
      <DemoCard id={id}>
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
              <p
                key={node}
                className="rounded-field border border-border bg-surface px-2 py-1 text-[10.5px] text-muted"
              >
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
                <Tick />
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
    /* A call, miniature: who is on the line, two lines of transcript, then
       what the call actually produced. */
    return (
      <DemoCard id={id}>
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

  if (id === 'support') {
    return (
      <DemoCard id={id}>
        <p className="meta border-b border-border pb-2.5 text-xs text-ink">
          {t('demos.support.queue')}
        </p>
        <ul className="mt-3 grid gap-1.5">
          {(['r1', 'r2', 'r3'] as const).map((row) => (
            <li key={row} className="flex items-center gap-2 text-xs text-muted">
              <Tick />
              {t(`demos.support.${row}`)}
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
        <div className="mt-3">
          <Rows rows={[t('demos.loyalty.r1'), t('demos.loyalty.r2'), t('demos.loyalty.r3')]} />
        </div>
      </DemoCard>
    );
  }

  if (id === 'content') {
    return (
      <DemoCard id={id}>
        <p className="meta text-xs text-ink">{t('demos.content.week')}</p>
        <div className="mt-2">
          <Rows rows={[t('demos.content.c1'), t('demos.content.c2'), t('demos.content.c3')]} />
        </div>
        {/* The queue stops at you, same as every other run on this page. */}
        <p className="mt-3 flex items-center gap-2 border-s-2 border-success ps-2.5 text-xs text-ink">
          <span aria-hidden className="size-3 shrink-0 rounded-[2px] border-[1.5px] border-success" />
          {t('demos.content.wait')}
        </p>
      </DemoCard>
    );
  }

  if (id === 'store') {
    return (
      <DemoCard id={id}>
        <p className="meta border-b border-border pb-2.5 text-xs text-ink">
          {t('demos.store.order')}
        </p>
        <div className="mt-3">
          <Rows rows={[t('demos.store.paid'), t('demos.store.sms'), t('demos.store.crm')]} />
        </div>
      </DemoCard>
    );
  }

  const list = {
    seo: ['demos.seo.title', 'demos.seo.r1', 'demos.seo.r2', 'demos.seo.r3'],
    finance: ['demos.finance.title', 'demos.finance.r1', 'demos.finance.r2', 'demos.finance.r3'],
    reports: ['demos.reports.title', 'demos.reports.l1', 'demos.reports.l2', 'demos.reports.l3'],
  }[id];

  return (
    <DemoCard id={id}>
      <p className={cn('meta text-xs text-ink')}>{t(list[0]!)}</p>
      <div className="mt-2">
        <Rows rows={[t(list[1]!), t(list[2]!), t(list[3]!)]} />
      </div>
    </DemoCard>
  );
}
