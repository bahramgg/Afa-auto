import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';

const principles = ['human', 'ownership', 'auditable', 'reversible'] as const;

/* -----------------------------------------------------------------------------
   One section where three used to be.

   The rebuild's brief was MINIMAL: the map already shows the breadth, so the
   old Principles strip, Method grid and Benefits panel collapsed into a single
   statement section — the claim in display type, the four constraints as one
   ruled row, the four steps as one numbered line. Everything a visitor needs
   between the map and the proof, on one screen.
   -------------------------------------------------------------------------- */

export function Manifesto() {
  const t = useTranslations('Manifesto');

  return (
    <section id="approach" className="scroll-mt-24 border-t border-border py-20 sm:py-28">
      <Container>
        <div className="flex items-center gap-3">
          <span className="eyebrow tabular-nums text-blue" aria-hidden>
            01
          </span>
          <p className="eyebrow">{t('eyebrow')}</p>
        </div>

        {/* The claim — the one display-type moment outside the hero. */}
        <p className="display-statement mt-8 max-w-4xl text-ink">{t('statement')}</p>

        {/* Four commitments, one ruled row, and nothing under them. The method
            steps that used to follow were cut by direct request: the statement
            and the four boxes say everything this section owes. */}
        <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((id) => (
            <li key={id} className="bg-bg-950 p-6">
              <h2 className="text-sm font-semibold text-ink">{t(`principles.${id}.title`)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(`principles.${id}.body`)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
