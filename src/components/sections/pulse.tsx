import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';

/* -----------------------------------------------------------------------------
   The operations console strip.

   Restored 2026-08 by direct request («اون قسمت یک روز کاری میخوام مثل حالت
   قبل باشه که انگار لایو بود، تایتلش هم مثل قبل»): the console voice, the
   pulsing dots and the relative timestamps are back, and so is the name it
   had. It reads like telemetry because that is what the section is for.

   What does NOT come back is the «نمونهٔ نمایشی · داده واقعی نیست» tag, which
   was deleted from the whole site earlier and stays deleted. The strip shows
   the SHAPE of a console — four kinds of line the real one prints — and never
   a volume, a total or a rate, which is the part the no-fabricated-metrics
   rule actually guards.

   It sits after the offer rather than before it, which is where it moved when
   its old slot was called out. Static markup, server-rendered; the only motion
   is a CSS pulse on the dots, which reduced-motion stills.
   -------------------------------------------------------------------------- */

const EVENTS = ['assistant', 'order', 'invoice', 'brief'] as const;

export function Pulse() {
  const t = useTranslations('Pulse');

  return (
    <section aria-label={t('label')} className="border-t border-border bg-bg-900/40 py-10">
      <Container>
        <p className="tmapPanelHead border-0 !bg-transparent !p-0">{t('label')}</p>

        <ul className="mt-3 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {EVENTS.map((id) => (
            <li key={id} className="flex items-start gap-3 bg-[var(--win-bg)] p-4">
              <span aria-hidden className="pulseDot mt-1.5" />
              <span className="min-w-0">
                <span className="block text-xs leading-relaxed text-muted">
                  {t(`items.${id}.text`)}
                </span>
                <span className="meta mt-1 block text-[10px] text-dim">
                  {t(`items.${id}.time`)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
