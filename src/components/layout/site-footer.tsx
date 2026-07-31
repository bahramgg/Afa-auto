import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { family } from '@/lib/family';

/* Same list as the header, in the same order — a footer that disagrees with
   the nav is a footer that makes the visitor wonder what they missed. */
const sections = ['approach', 'work', 'impact', 'contact'] as const;

/* Tightened 2026-07-31. Three columns on one strict grid, every list on the
 * same baseline and the same 36px row rhythm; one hairline; one bottom row.
 * The mark anchors the start corner, and the tagline under it is a complete
 * sentence about what this site is, not a slogan fragment. */
export function SiteFooter() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Nav');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-900/60">
      <Container>
        <div className="grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Logo label={nav('home')} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{t('tagline')}</p>
          </div>

          <nav aria-label={t('sectionsLabel')}>
            <p className="eyebrow">
              {t('sectionsLabel')}
            </p>
            <ul className="mt-5">
              {sections.map((id) => (
                <li key={id} className="flex min-h-9 items-center">
                  <a href={`#${id}`} className="text-sm text-muted transition-colors hover:text-ink">
                    {nav(id)}
                  </a>
                </li>
              ))}
              <li className="flex min-h-9 items-center">
                <Link href="/map" className="text-sm text-muted transition-colors hover:text-ink">
                  {nav('mapPage')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t('familyLabel')}>
            <p className="eyebrow">
              {t('familyLabel')}
            </p>
            <ul className="mt-5">
              {family.map((property) => (
                <li key={property.id} className="flex min-h-9 items-center">
                  <a
                    href={property.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {t(`family.${property.id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>{t('rights', { year })}</p>
          <p>{t('note')}</p>
        </div>
      </Container>
    </footer>
  );
}
