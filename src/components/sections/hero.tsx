import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Eyebrow } from '@/components/ui/editorial';
import { RotatingWords } from '@/components/ui/rotating-words';
import {
  CapabilityMap,
  type CapabilityMapCopy,
  type DomainCopy,
  type ProcessCopy,
} from '@/components/tools/capability-map';
import { DOMAINS, PROCESS_IDS, type DomainId } from '@/lib/capability-map';

/* -----------------------------------------------------------------------------
   The hero: the claim on the start side, the working wheel on the end side,
   both inside the first screen.

   The diagram belongs HERE, by direct request; what had to go was the
   BACKGROUND under it. So the stage is frameless now: no blueprint grid, no
   border, no panel fill, no page halo. The wheel is drawn straight onto the
   ground, and nothing behind it competes.

   The motion is the rotating job line plus the wheel's own marching orbit;
   nothing wobbles.

   Strings resolve here, on the server, and travel as props. The `Map` catalog
   is the largest thing in either message file and must never enter the client
   bundle (the same rule /map follows).
   -------------------------------------------------------------------------- */

export function Hero() {
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
    'inline-flex min-h-12 items-center justify-center rounded-button px-7 text-sm font-semibold transition-colors';

  return (
    <section id="top">
      <div className="mx-auto w-full max-w-[86rem] px-4 py-12 sm:px-6 lg:min-h-[calc(100svh-4rem)] lg:py-8">
        <div className="grid h-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <Eyebrow>{t('eyebrow')}</Eyebrow>

            <h1 className="display-hero mt-5 text-ink">{t('title')}</h1>

            {/* The moving line. Each word is one block, so joined Persian
                stays joined; reduced-motion freezes it on the first word. */}
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {t('rotPrefix')}{' '}
              <RotatingWords words={[t('rot1'), t('rot2'), t('rot3'), t('rot4'), t('rot5'), t('rot6')]} />
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className={`${action} bg-brand text-bg-950 shadow-brand`}>
                {t('ctaPrimary')}
              </a>
              <Link
                href="/map"
                className={`${action} border border-border text-ink hover:border-border-glass`}
              >
                {t('ctaSecondary')}
              </Link>
            </div>

            {/* Structural counts, over one hairline. No cards.

                They carry a lead-in now: on their own «۹ بخش کسب‌وکار» is a
                number with no referent, and the first reader of this hero said
                exactly that. Naming the map turns three abstract figures into
                a caption for the drawing beside them. */}
            <p className="mt-10 border-t border-border pt-6 text-xs text-dim">
              {t('statsLead')}
            </p>
            <dl className="mt-4 grid max-w-lg grid-cols-3 gap-x-8 gap-y-6">
              {(['domains', 'processes', 'stages'] as const).map((stat) => (
                <div key={stat}>
                  <dd className="text-2xl font-extrabold tabular-nums text-ink sm:text-3xl">
                    {t(`stats.${stat}.value`)}
                  </dd>
                  <dt className="mt-1 text-[11px] leading-snug text-dim">
                    {t(`stats.${stat}.label`)}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <CapabilityMap copy={copy} variant="hero" />
            <p className="mt-2 text-center text-xs text-dim">{t('mapHint')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
