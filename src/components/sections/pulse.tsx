import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';

/* -----------------------------------------------------------------------------
   The operations console strip — the thin band between the hero and the
   services, modelled on the reference's live-activity feed.

   Four events, one per service, each the kind of line the real console
   prints: a DM answered, an order queued, a transfer matched, a brief sent.
   It reads like telemetry because that is the promise — «every graph is a
   live view of the real system».

   It is NOT live, and it says so in its own head: «نمونهٔ نمایشی · داده
   واقعی نیست». The no-fabricated-metrics rule is exactly why the label is
   non-negotiable — the strip earns its realism from the honesty tag, not in
   spite of it. Static markup, server-rendered; the only motion is a CSS
   pulse on the dots, which reduced-motion stills.
   -------------------------------------------------------------------------- */

const EVENTS = ['assistant', 'order', 'invoice', 'brief'] as const;

export function Pulse() {
  const t = useTranslations('Pulse');

  return (
    <section aria-label={t('label')} className="border-t border-border bg-bg-900/40">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pt-4">
          <p className="tmapPanelHead border-0 !bg-transparent !p-0">{t('label')}</p>
          <p className="meta text-[10px] text-dim opacity-80">{t('demo')}</p>
        </div>

        <ul className="mt-3 grid gap-px overflow-hidden rounded-card border border-border bg-border mb-6 sm:grid-cols-2 xl:grid-cols-4">
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
