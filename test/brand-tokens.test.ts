import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// `src/styles/afa-tokens.css` is vendored from afa-brand/tokens — the shared
// design language for afa-site, afa-pay and this site. It is copied, not
// installed from a registry, precisely so that changing it is a reviewable
// diff of hex values rather than a version bump nobody reads
// (afa-brand/ARCHITECTURE.md, D3).
//
// These tests are what makes "vendored" mean something. Without them the copy
// silently drifts from the source and the three sites stop matching again.

const dir = join(process.cwd(), 'src/styles');
const vendored = readFileSync(join(dir, 'afa-tokens.css'), 'utf8');

describe('vendored brand tokens', () => {
  it('matches the SHA256 recorded beside it', () => {
    const recorded = readFileSync(join(dir, 'afa-tokens.sha256'), 'utf8').trim().split(/\s+/)[0];
    const actual = createHash('sha256').update(vendored).digest('hex');

    // If this fails, the vendored file was edited in place. Don't update the
    // hash to match — make the change in afa-brand/tokens, re-vendor, and
    // update both in one commit.
    expect(actual).toBe(recorded);
  });

  it('reaches no origin AFA does not control', () => {
    // A design-token file has no reason to make a network request. An @import
    // or url() here would be a fetch the CSP must then permit, on every page
    // including the ones that handle money.
    //
    // Comments are stripped first: the file documents this rule in prose, and
    // matching the word inside its own warning would fail for the wrong reason.
    const code = vendored.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/@import/);
    expect(code).not.toMatch(/url\(/);
  });

  it('declares every primitive the local alias layer points at', () => {
    const local = readFileSync(join(dir, 'tokens.css'), 'utf8');
    const declared = new Set(
      [...vendored.matchAll(/(--afa-[a-z0-9-]+):/gi)].map(([, name]) => name!),
    );

    const referenced = [...local.matchAll(/var\(\s*(--afa-[a-z0-9-]+)\s*\)/gi)].map(
      ([, name]) => name!,
    );

    expect(referenced.length).toBeGreaterThan(0);
    expect(referenced.filter((name) => !declared.has(name))).toEqual([]);
  });
});
