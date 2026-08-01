import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/editorial';
import {
  CapabilityMap,
  type CapabilityMapCopy,
  type DomainCopy,
  type ProcessCopy,
} from '@/components/tools/capability-map';
import { DOMAINS, PROCESS_IDS, type DomainId } from '@/lib/capability-map';
import { localeAlternates } from '@/lib/seo';

/* -----------------------------------------------------------------------------
   /map — the full operating map, on its own page.

   Moved here from the homepage by direct request: on the landing it was too
   much; as a destination it is the payoff. The homepage shows the light
   version and a table of contents; whoever wants the whole picture clicks
   through and gets the celestial map at full size, clickable, plus every
   process written out below — one anchored block per domain, so the index on
   the homepage can deep-link (`/map#finance`).

   All strings resolve here on the server; the Map namespace never enters the
   client bundle (same rule as always).
   -------------------------------------------------------------------------- */

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'MapPage' });
  return {
    title: t('title'),
    description: t('lede'),
    alternates: localeAlternates(locale, '/map'),
  };
}

export default async function MapPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <MapPageBody />;
}

function MapPageBody() {
  const t = useTranslations('MapPage');
  const map = useTranslations('Map');

  const domains = Object.fromEntries(
    DOMAINS.map((domain) => [
      domain.id,
      {
        title: map(`domains.${domain.id}.title`),
        summary: map(`domains.${domain.id}.summary`),
        tags: map(`domains.${domain.id}.tags`),
      } satisfies DomainCopy,
    ]),
  ) as Record<DomainId, DomainCopy>;

  const processes = Object.fromEntries(
    PROCESS_IDS.map((id) => [
      id,
      {
        title: map(`processes.${id}.title`),
        trigger: map(`processes.${id}.trigger`),
        decision: map(`processes.${id}.decision`),
        action: map(`processes.${id}.action`),
        human: map(`processes.${id}.human`),
      } satisfies ProcessCopy,
    ]),
  ) as Record<string, ProcessCopy>;

  const copy: CapabilityMapCopy = {
    hub: map('hub'),
    hubNote: map('hubNote'),
    viewMap: map('viewMap'),
    viewList: map('viewList'),
    viewLabel: map('viewLabel'),
    reset: map('reset'),
    close: map('close'),
    stepTrigger: map('stepTrigger'),
    stepDecision: map('stepDecision'),
    stepAction: map('stepAction'),
    stepHuman: map('stepHuman'),
    ladderLabel: map('ladderLabel'),
    figureLabel: map('figureLabel'),
    directoryLabel: t('directory'),
    legendLabel: t('legend'),
    domainsLabel: t('domains'),
    typeDomain: t('typeDomain'),
    typeProcess: t('typeProcess'),
    typeStage: t('typeStage'),
    typeHuman: t('typeHuman'),
    backAll: t('backAll'),
    fullscreen: t('fullscreen'),
    fullscreenExit: t('fullscreenExit'),
    statusline: t('statusline'),
    prevDomain: t('prevDomain'),
    nextDomain: t('nextDomain'),
    domains,
    processes,
  };

  const steps = ['stepTrigger', 'stepDecision', 'stepAction', 'stepHuman'] as const;
  const fieldOf = {
    stepTrigger: 'trigger',
    stepDecision: 'decision',
    stepAction: 'action',
    stepHuman: 'human',
  } as const;

  return (
    <>
      {/* The stage. Full width, dark sky, no competing copy.

          The header is the reference's console masthead: a comment-style
          eyebrow, the title with a live cursor after it, and the lede parked
          on the far side rather than centred under it — so the drawing starts
          as high on the screen as it can. */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative z-10 mx-auto w-full max-w-[90rem] px-3 pb-16 pt-20 sm:px-6">
          {/* The lede that used to sit opposite the title is gone, by direct
              request. The drawing under it says the same thing better, and the
              string stays in the catalog because the page's meta description
              is built from it. */}
          <header className="mb-8">
            <Eyebrow className="tmapMasthead">{t('eyebrow')}</Eyebrow>
            <h1 className="display-hero mt-4 text-ink">
              {t('title')}
              <span aria-hidden className="tmapCursor" />
            </h1>
          </header>

          <CapabilityMap copy={copy} />
        </div>
      </section>

      {/* The write-ups: one anchored block per domain, CLOSED.

          «قسمت جزئیات خوبه اما شبیه به جزوه و مقاله شده» — ten domains times
          four processes times four steps is a hundred and sixty paragraphs,
          and printed all at once that is a booklet, not a page. Each domain is
          a card that opens, the same disclosure the homepage's offer list
          uses, so the reader chooses what to read. Deep links still work: a
          <details> with an id is a valid anchor target, and the browser opens
          it when it is the fragment. */}
      <section className="py-16 sm:py-24">
        <Container>
          <Eyebrow>{t('detailsEyebrow')}</Eyebrow>
          <h2 className="display-statement mt-4 text-ink">{t('detailsTitle')}</h2>

          <div className="mt-12 grid gap-4">
            {DOMAINS.map((domain) => (
              <details
                key={domain.id}
                id={domain.id}
                data-tone={domain.tone}
                className="cmap group scroll-mt-28 overflow-hidden rounded-card border border-border bg-surface/40 transition-colors open:bg-surface/70 hover:border-border-glass"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-pill border border-[color-mix(in_srgb,var(--tone)_45%,transparent)]"
                  >
                    <span className="size-2.5 rounded-pill bg-[var(--tone)]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-base font-bold text-ink">
                        {domains[domain.id].title}
                      </span>
                      <span className="meta text-[11px] text-[var(--tone)]">
                        {domains[domain.id].tags}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-dim">
                      {domains[domain.id].summary}
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

                {/* One hairline grid, not four floating cards. */}
                <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
                  {domain.processes.map((processId, index) => {
                    const process = processes[processId];
                    if (!process) return null;
                    return (
                      <div key={processId} className="bg-bg-950 p-5 sm:p-6">
                        <h3 className="flex items-baseline gap-3 text-sm font-bold text-ink">
                          <span aria-hidden className="meta text-[11px] text-[var(--tone)]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {process.title}
                        </h3>

                        {/* Label above value, not beside it: a fixed label
                            column forces every line to break at the same
                            narrow width, which is what made this read like a
                            printed reference rather than a screen. The human
                            checkpoint keeps its green rule and closes each
                            process, because it is the last word on it. */}
                        <dl className="mt-4 grid gap-3">
                          {steps.map((step) => {
                            const human = step === 'stepHuman';
                            return (
                              <div
                                key={step}
                                className={
                                  human ? 'mt-1 border-s-2 border-success ps-3' : undefined
                                }
                              >
                                <dt className="meta text-[10px] uppercase text-dim">
                                  {copy[step]}
                                </dt>
                                <dd
                                  className={`mt-1 text-xs leading-relaxed ${
                                    human ? 'text-success' : 'text-muted'
                                  }`}
                                >
                                  {process[fieldOf[step]]}
                                </dd>
                              </div>
                            );
                          })}
                        </dl>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-16 flex justify-center border-t border-border pt-10">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center rounded-button border border-border px-7 text-sm font-semibold text-ink transition-colors hover:border-border-glass"
            >
              {t('back')}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
