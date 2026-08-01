import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';

/* -----------------------------------------------------------------------------
   A day's work, as the system logs it.

   REBUILT 2026-08 on «کنسول عملیات‌ها جاش درست نیست و یا شکل اجراش اشتباه
   هست». Both halves of that were true. It sat wedged between the hero and the
   services with four pixels of air above it, so it read as a strip that had
   fallen off something; and it was dressed as a LIVE feed («۲ دقیقه پیش»)
   while being a hand-written illustration, which only worked at all because a
   label underneath admitted it. That label is gone now, by request, so the
   pretence had to go with it: relative timestamps became clock times and the
   heading names what the reader is looking at — four things a working day
   contains, not four things that just happened.

   It now follows the offer instead of interrupting it: a visitor who has read
   what the system does is exactly the visitor for whom a day of it means
   something. Static markup, server-rendered.
   -------------------------------------------------------------------------- */

const EVENTS = ['brief', 'assistant', 'order', 'invoice'] as const;

export function Pulse() {
  const t = useTranslations('Pulse');

  return (
    <section aria-label={t('label')} className="border-t border-border py-14 sm:py-16">
      <Container>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <h2 className="text-lg font-bold text-ink">{t('label')}</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">{t('lede')}</p>
        </div>

        <ol className="mt-7 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {EVENTS.map((id) => (
            <li key={id} className="bg-[var(--win-bg)] p-5">
              <p className="meta text-xs tabular-nums text-dim">{t(`items.${id}.time`)}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(`items.${id}.text`)}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
