import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/editorial';
import { MiniMap } from '@/components/ui/mini-map';
import { DOMAINS, type DomainId } from '@/lib/capability-map';
import { cn } from '@/lib/cn';

/* The claim on one side, the living mini map on the other. The title's second
 * half carries the page's single gradient moment; a soft light pools behind
 * the map so the two halves read as one composition rather than a split. */
export function Hero() {
  const t = useTranslations('Hero');
  const map = useTranslations('Map');

  const labels = Object.fromEntries(
    DOMAINS.map((domain) => [domain.id, map(`domains.${domain.id}.title`)]),
  ) as Record<DomainId, string>;

  const anchor =
    'inline-flex min-h-12 items-center justify-center rounded-button px-6 text-sm font-semibold transition-colors';

  return (
    <section id="top" className="relative overflow-hidden">
      <span aria-hidden className="dot-field dot-fade absolute inset-0" />

      <Container className="relative">
        <div className="grid items-center gap-12 py-16 sm:py-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10 lg:py-10">
          <div>
            <Eyebrow>{t('eyebrow')}</Eyebrow>

            <h1 className="display-hero mt-6 text-ink">
              {t('titleLead')}{' '}
              <span className="text-gradient">{t('titleAccent')}</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {t('sub')}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className={cn(anchor, 'bg-brand text-white shadow-brand')}>
                {t('ctaPrimary')}
              </a>
              <Link
                href="/map"
                className={cn(anchor, 'border border-border text-ink hover:border-border-glass')}
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* The pooled light behind the map — the page's one glow. */}
            <span aria-hidden className="brand-halo absolute -inset-10 rounded-pill opacity-70" />
            <MiniMap labels={labels} figureLabel={map('figureLabel')} />
          </div>
        </div>
      </Container>
    </section>
  );
}
