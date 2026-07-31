import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Eyebrow } from '@/components/ui/editorial';
import { RotatingWords } from '@/components/ui/rotating-words';

/* -----------------------------------------------------------------------------
   The hero, rasai.ca structure, 2026-08 by direct request and on the second
   telling: TEXT ONLY on the bare navy-black. No map beside it, no framed
   panel, no ground texture; the reference's hero is typography, stats and one
   button, and the live view is its own section BELOW. The motion the owner
   asked for is the rotating job line; the map brings more the moment the
   visitor scrolls once.
   -------------------------------------------------------------------------- */

export function Hero() {
  const t = useTranslations('Hero');

  const action =
    'inline-flex min-h-12 items-center justify-center rounded-button px-7 text-sm font-semibold transition-colors';

  return (
    <section id="top">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[calc(88svh-4rem)] lg:py-12">
        <Eyebrow>{t('eyebrow')}</Eyebrow>

        <h1 className="display-hero mt-5 max-w-4xl text-ink">{t('title')}</h1>

        {/* The moving line. Each word is one block, so joined Persian stays
            joined; reduced-motion freezes it on the first word. */}
        <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
          {t('rotPrefix')}{' '}
          <RotatingWords words={[t('rot1'), t('rot2'), t('rot3'), t('rot4')]} />
        </p>

        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{t('sub')}</p>

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

        {/* The reference's under-hero stats, on numbers we can stand behind:
            the structure itself. Hairlines only; no card, no ground. */}
        <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-8 border-t border-border pt-8 sm:grid-cols-4">
          {(['domains', 'processes', 'stages', 'human'] as const).map((stat) => (
            <div key={stat}>
              <dd className="text-3xl font-extrabold tabular-nums text-ink sm:text-4xl">
                {t(`stats.${stat}.value`)}
              </dd>
              <dt className="mt-1.5 text-xs leading-snug text-dim">{t(`stats.${stat}.label`)}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
