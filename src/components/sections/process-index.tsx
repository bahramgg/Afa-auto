import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/editorial';
import { DOMAINS } from '@/lib/capability-map';

/* -----------------------------------------------------------------------------
   The index — redesigned 2026-07-31 from a plain ruled grid into six
   constellation cards.

   Each card is a fragment of the map itself: the domain's tone burns in a
   hairline across the top, its title sits beside a glowing node, its tag line
   runs underneath, and the four processes hang off a vertical chain whose
   dots catch the tone on hover — the same grammar the map draws with, so the
   index reads as the map folded into a list. Every entry links into /map,
   where the full write-ups live.
   -------------------------------------------------------------------------- */

export function ProcessIndex() {
  const t = useTranslations('ProcessIndex');
  const map = useTranslations('Map');

  return (
    <section id="processes" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Container>
        <SectionHead index="04" eyebrow={t('eyebrow')} title={t('title')} lede={t('lede')} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain) => (
            <Link
              key={domain.id}
              href={`/map#${domain.id}`}
              className="cmap group relative overflow-hidden rounded-card border border-border bg-surface/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-border-glass"
              data-tone={domain.tone}
            >
              {/* The tone hairline — this domain's colour, straight off the map. */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-[var(--tone)] opacity-60 transition-opacity group-hover:opacity-100"
              />
              {/* A soft pool of the tone, revealed on hover. */}
              <span
                aria-hidden
                className="absolute -end-10 -top-10 size-36 rounded-pill bg-[var(--tone)] opacity-[0.05] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.13]"
              />

              <span className="relative flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-pill border border-[var(--tone)]"
                >
                  <span className="size-2 rounded-pill bg-[var(--tone)]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-ink">
                    {map(`domains.${domain.id}.title`)}
                  </span>
                  <span className="block truncate text-xs text-dim">
                    {map(`domains.${domain.id}.tags`)}
                  </span>
                </span>
              </span>

              {/* The mini chain: four processes hanging off one line, their
                  dots catching the tone when the card is hovered. */}
              <ul className="relative mt-5 ms-4 space-y-2.5 border-s border-border ps-5">
                {domain.processes.map((processId) => (
                  <li key={processId} className="relative">
                    <span
                      aria-hidden
                      className="absolute -start-[25px] top-1/2 size-2 -translate-y-1/2 rounded-pill bg-border transition-colors duration-200 group-hover:bg-[var(--tone)]"
                    />
                    <span className="block text-sm leading-relaxed text-muted transition-colors group-hover:text-ink">
                      {map(`processes.${processId}.title`)}
                    </span>
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            href="/map"
            className="inline-flex min-h-12 items-center rounded-button border border-border px-7 text-sm font-semibold text-ink transition-colors hover:border-border-glass"
          >
            {t('cta')}
          </Link>
        </div>
      </Container>
    </section>
  );
}
