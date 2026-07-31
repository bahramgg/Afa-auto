import { describe, expect, it } from 'vitest';
import fa from '../messages/fa.json';
import en from '../messages/en.json';

// Collect every leaf key path (e.g. "Nav.services") so the two locales can be
// compared structurally — a missing translation is a build-time failure, not a
// runtime surprise (plan §9, §18: no untranslated text).
function keyPaths(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe('message catalogs', () => {
  const faKeys = keyPaths(fa).sort();
  const enKeys = keyPaths(en).sort();

  it('fa and en have identical key sets', () => {
    expect(faKeys).toEqual(enKeys);
  });

  it('no dash characters anywhere, by direct request', () => {
    // «هیچ جای سایت نباید ام دش استفاده بشه» is a standing owner rule. The
    // guard covers en/em dashes in BOTH catalogs; the Persian voice uses
    // «؛» or a full stop where a dash would have gone.
    for (const [locale, catalog] of [['fa', fa], ['en', en]] as const) {
      for (const path of keyPaths(catalog)) {
        const value = String(
          path
            .split('.')
            .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)[k], catalog),
        );
        expect(value.includes('\u2014'), `${locale}:${path} contains an em dash`).toBe(false);
        expect(value.includes('\u2013'), `${locale}:${path} contains an en dash`).toBe(false);
      }
    }
  });

  it('no message value is empty', () => {
    for (const catalog of [fa, en]) {
      for (const path of keyPaths(catalog)) {
        const value = path
          .split('.')
          .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)[k], catalog);
        expect(String(value).trim().length).toBeGreaterThan(0);
      }
    }
  });
});
