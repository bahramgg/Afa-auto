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
   links, family, rights, and the signature along its foot — so the
   page ends on one object rather than trailing off.

   The line about pricing after an assessment is gone by direct request; the
   free assessment section makes that point where it belongs. So is the
   copyright's own row: it is one short sentence and it did not need a rule and
   a band to itself, so it sits under the mark with the rest of the identity
   column. The tagline is the page's own headline now, rather than a second
   slogan competing with it.
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
              <p className="mt-6 text-xs text-dim">{t('rights', { year })}</p>
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

          {/* The signature, WHOLE. It used to be cropped to a sliver of its
              letterforms, which on a bounded card read as a word that had been
              cut in half rather than as ground. Outline type at this size is
              quiet enough not to need the crop. */}
          <div
            aria-hidden
            data-size="sm"
            className="ghost-word border-t border-border py-6 text-center"
          >
            AFA
          </div>
        </div>
      </Container>
    </footer>
  );
}
