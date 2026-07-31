import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { RuledCell, RuledPanel, SectionHead } from '@/components/ui/editorial';

const items = ['restaurant', 'retail', 'services'] as const;

/* -----------------------------------------------------------------------------
   Proof, presented as what it is: systems in production.

   Restyled 2026-08 from three floating window frames into ONE ruled panel.
   The house rule is explicit — a group of related items is one bordered block
   subdivided by hairlines, never a row of cards with gaps — and this section
   was the loudest violation of it: three drop-shadowed frames with mac traffic
   lights, on a page that already used the same frame three more times. A
   device used four times is not a device, it is a texture.

   The window frame survives in exactly one place now (the calculator), where
   it means something: that one IS a running program.

   Copy is deliberately short: what was happening, what happens now.
   -------------------------------------------------------------------------- */

export function Work() {
  const t = useTranslations('Work');

  return (
    <section id="work" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="02" eyebrow={t('eyebrow')} title={t('title')} lede={t('subtitle')} />

        <RuledPanel columns={3} className="mt-12">
          {items.map((id) => (
            <RuledCell key={id} as="article" className="flex flex-col gap-5">
              <div>
                <p className="eyebrow">{t(`items.${id}.sector`)}</p>
                <h3 className="mt-2 text-base font-semibold leading-snug text-ink">
                  {t(`items.${id}.title`)}
                </h3>
              </div>

              {/* Before and after as one ruled pair: the rule between them is
                  the change, which is the whole point of the section. */}
              <dl className="flex flex-1 flex-col">
                <div className="border-t border-border py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dim">
                    {t('labels.before')}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-dim">
                    {t(`items.${id}.before`)}
                  </dd>
                </div>
                <div className="flex-1 border-t border-border py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
                    {t('labels.after')}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t(`items.${id}.after`)}
                  </dd>
                </div>
              </dl>

              {/* One line, guaranteed: the scope is a signature, not a
                  paragraph, and a wrapped signature reads as clutter. */}
              <p className="meta truncate border-t border-border pt-4 text-[11px] text-dim">
                {t(`items.${id}.scope`)}
              </p>
            </RuledCell>
          ))}
        </RuledPanel>
      </Container>
    </section>
  );
}
