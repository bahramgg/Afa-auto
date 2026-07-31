import { useTranslations } from 'next-intl';
import {
  CapabilityMap,
  type CapabilityMapCopy,
  type DomainCopy,
  type ProcessCopy,
} from '@/components/tools/capability-map';
import { DOMAINS, PROCESS_IDS, type DomainId } from '@/lib/capability-map';

/* -----------------------------------------------------------------------------
   The live view, straight after the hero; the slot rasai.ca gives its
   dashboard. The hero is text only, by direct request, so the map lives HERE:
   one scroll in, full working interactions, the Pulse strip right beneath it
   reading as the same console.

   Strings resolve on the server and travel as props; the Map catalog never
   enters the client bundle (the standing rule).
   -------------------------------------------------------------------------- */

export function LiveMap() {
  const t = useTranslations('Live');
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

  return (
    <section id="live" className="scroll-mt-24 border-t border-border py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[92rem] px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="display mt-4 text-[clamp(1.6rem,3vw,2.3rem)] text-ink">{t('title')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t('hint')}</p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <CapabilityMap copy={copy} variant="hero" />
        </div>
      </div>
    </section>
  );
}
