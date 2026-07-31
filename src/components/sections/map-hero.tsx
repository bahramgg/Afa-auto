import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Eyebrow } from '@/components/ui/editorial';
import {
  CapabilityMap,
  type CapabilityMapCopy,
  type DomainCopy,
  type ProcessCopy,
} from '@/components/tools/capability-map';
import { DOMAINS, PROCESS_IDS, type DomainId } from '@/lib/capability-map';

/* -----------------------------------------------------------------------------
   The first viewport — the REAL map, 2026-08.

   Until now the homepage opened with a decorative six-dot mini map and the
   working one lived a click away on /map. That is backwards: the map is the
   only thing on this site nobody else has, and it was the one thing behind a
   navigation step. The original brief («minimal, and the map is the point»)
   said so; the site had drifted off it.

   So: the claim on the start side, the working map on the end side, both
   inside the first screen. Same drawing and same interactions as /map, minus
   the reading rails — /map keeps those, plus all twenty-four write-ups.

   Strings resolve HERE, on the server, and travel as props. The `Map` catalog
   is the largest thing in either message file and must never enter the client
   bundle (the same rule /map follows).
   -------------------------------------------------------------------------- */

export function MapHero() {
  const t = useTranslations('Hero');
  const map = useTranslations('Map');
  const page = useTranslations('MapPage');

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
    directoryLabel: page('directory'),
    legendLabel: page('legend'),
    domainsLabel: page('domains'),
    typeDomain: page('typeDomain'),
    typeProcess: page('typeProcess'),
    typeStage: page('typeStage'),
    typeHuman: page('typeHuman'),
    backAll: page('backAll'),
    fullscreen: page('fullscreen'),
    fullscreenExit: page('fullscreenExit'),
    statusline: page('statusline'),
    prevDomain: page('prevDomain'),
    nextDomain: page('nextDomain'),
    domains,
    processes,
  };

  const action =
    'inline-flex min-h-12 items-center justify-center rounded-button px-6 text-sm font-semibold transition-colors';

  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="relative mx-auto flex w-full max-w-[92rem] flex-col justify-center px-4 py-12 sm:px-6 lg:min-h-[calc(100svh-4rem)] lg:py-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-12">
          <div>
            <Eyebrow>{t('eyebrow')}</Eyebrow>

            {/* No gradient on the headline. The house rule gives the brand
                gradient to the primary action and nothing else — it is the one
                rule keeping this page off the 2024 AI-landing template. */}
            <h1 className="display-hero mt-5 text-ink">{t('title')}</h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {t('sub')}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className={`${action} bg-brand text-white shadow-brand`}>
                {t('ctaPrimary')}
              </a>
              <Link
                href="/map"
                className={`${action} border border-border text-ink hover:border-border-glass`}
              >
                {t('ctaSecondary')}
              </Link>
            </div>

            <p className="tmapStatus mt-8">{page('statusline')}</p>
          </div>

          <div>
            <CapabilityMap copy={copy} variant="hero" />
            <p className="mt-3 text-center text-xs text-dim">{t('mapHint')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
