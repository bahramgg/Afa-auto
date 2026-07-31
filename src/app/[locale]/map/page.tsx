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
    processesLabel: map('processesLabel'),
    figureLabel: map('figureLabel'),
    directoryLabel: t('directory'),
    legendLabel: t('legend'),
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
      {/* The stage. Full width, dark sky, no competing copy. */}
      <section className="relative overflow-hidden border-b border-border">
        <span aria-hidden className="dot-field dot-fade absolute inset-0" />

        <header className="relative z-10 mx-auto max-w-3xl px-5 pb-2 pt-20 text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="display-hero mt-5 text-ink">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {t('lede')}
          </p>
        </header>

        <div className="relative z-0 mx-auto w-full max-w-[90rem] px-3 pb-16 sm:px-6">
          <CapabilityMap copy={copy} />
        </div>
      </section>

      {/* The write-ups: one anchored block per domain, four processes each.
          This is where the homepage index deep-links to. */}
      <section className="py-16 sm:py-24">
        <Container>
          <Eyebrow>{t('detailsEyebrow')}</Eyebrow>
          <h2 className="display-statement mt-4 text-ink">{t('detailsTitle')}</h2>

          <div className="mt-12 space-y-14">
            {DOMAINS.map((domain) => (
              <article key={domain.id} id={domain.id} className="cmap scroll-mt-28" data-tone={domain.tone}>
                <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-4">
                  <h3 className="flex items-center gap-3 text-lg font-bold text-ink">
                    <span aria-hidden className="size-2.5 rounded-pill bg-[var(--tone)]" />
                    {domains[domain.id].title}
                  </h3>
                  <p className="text-sm text-dim">{domains[domain.id].summary}</p>
                </header>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {domain.processes.map((processId) => {
                    const process = processes[processId];
                    if (!process) return null;
                    return (
                      <div key={processId} className="rounded-card border border-border bg-surface/50 p-5">
                        <h4 className="text-sm font-semibold text-ink">{process.title}</h4>
                        <dl className="mt-3 space-y-2.5">
                          {steps.map((step) => (
                            <div
                              key={step}
                              className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 text-xs leading-relaxed"
                            >
                              <dt className="font-semibold text-dim">{copy[step]}</dt>
                              <dd
                                className={
                                  step === 'stepHuman' ? 'text-success' : 'text-muted'
                                }
                              >
                                {process[fieldOf[step]]}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    );
                  })}
                </div>
              </article>
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
