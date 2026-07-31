import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { Window } from '@/components/ui/window';

const items = ['restaurant', 'retail', 'services'] as const;

/* Proof, presented as what it is: systems in production. Each case sits in a
 * window frame whose title bar names the business — the visual claim ("this is
 * software that runs") and the verbal one ("we shipped this") are the same
 * claim. Copy is deliberately short: what was happening, what happens now. */
export function Work() {
  const t = useTranslations('Work');

  return (
    <section id="work" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="03" eyebrow={t('eyebrow')} title={t('title')} lede={t('subtitle')} />

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((id) => (
            <li key={id}>
              <Window title={t(`items.${id}.sector`)} padded={false} className="h-full">
                <div className="flex h-full flex-col gap-5 p-6">
                  <h3 className="text-base font-semibold leading-snug text-ink">
                    {t(`items.${id}.title`)}
                  </h3>

                  <dl className="flex flex-1 flex-col gap-4">
                    <div>
                      <dt className="eyebrow">{t('labels.before')}</dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                        {t(`items.${id}.before`)}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-lilac">{t('labels.after')}</dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                        {t(`items.${id}.after`)}
                      </dd>
                    </div>
                  </dl>

                  {/* One line, guaranteed: the scope is a signature, not a
                      paragraph, and a wrapped signature reads as clutter. */}
                  <p className="truncate border-t border-border pt-4 text-xs text-dim">
                    {t(`items.${id}.scope`)}
                  </p>
                </div>
              </Window>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
