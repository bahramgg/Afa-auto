import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { family } from '@/lib/family';

/* Same list as the header, in the same order — a footer that disagrees with
   the nav is a footer that makes the visitor wonder what they missed. The map
   is appended because it is the one destination that is not a section. */
const sections = ['services', 'impact', 'work', 'start', 'contact'] as const;

/* -----------------------------------------------------------------------------
   ONE BLOCK, 2026-08, on «فوتر یک بخشی باشه و نظمش هم باید بهتر بشه».

   It used to be three bands stacked on the ground: a three-column grid, a
   hairline, a copyright row, and then the ghost wordmark floating below all of
   it with nothing holding it. Three bands is what made it feel disorderly, not
   the contents. Everything now sits inside a single bordered card — mark,
   links, family, rights, and the signature cropped along its foot — so the
   page ends on one object rather than trailing off.

   The line about pricing after an assessment is gone by direct request; the
   free assessment section makes that point where it belongs.
   -------------------------------------------------------------------------- */
export function SiteFooter() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Nav');
  const year = new Date().getFullYear();

  const link = 'text-sm text-muted transition-colors hover:text-ink';

  return (
    <footer className="pb-10 pt-16">
      <Container>
        <div className="overflow-hidden rounded-card border border-border bg-bg-900/60">
          <div className="grid gap-x-10 gap-y-10 p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <Logo label={nav('home')} />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{t('tagline')}</p>
            </div>

            <nav aria-label={t('sectionsLabel')}>
              <p className="eyebrow">{t('sectionsLabel')}</p>
              <ul className="mt-5 grid gap-3">
                {sections.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} className={link}>
                      {nav(id)}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/map" className={link}>
                    {nav('mapPage')}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label={t('familyLabel')}>
              <p className="eyebrow">{t('familyLabel')}</p>
              <ul className="mt-5 grid gap-3">
                {family.map((property) => (
                  <li key={property.id}>
                    <a
                      href={property.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={link}
                    >
                      {t(`family.${property.id}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <p className="border-t border-border px-8 py-5 text-xs text-dim sm:px-10">
            {t('rights', { year })}
          </p>

          {/* The signature, cropped to a sliver of its letterforms so it reads
              as texture along the card's foot rather than a second heading or,
              worse, an empty box. Inside the card now, which is the whole
              point of the rebuild. */}
          <div
            aria-hidden
            className="ghost-word h-[0.24em] overflow-hidden border-t border-border text-center"
          >
            AFA
          </div>
        </div>
      </Container>
    </footer>
  );
}
