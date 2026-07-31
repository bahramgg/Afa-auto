'use client';

import { useEffect, useState } from 'react';

/* -----------------------------------------------------------------------------
   The hero's moving line, by direct request («باید به صورت متحرک باشه») and on
   the Lindy pattern: a fixed prefix, then the jobs the system takes, cycling
   one at a time. Each word is its own block, never letter-spaced, so joined
   Persian stays joined.

   SSR renders the first word and the cycle starts client-side, so there is
   nothing to hydrate wrong. Under prefers-reduced-motion the line simply
   stays on the first word.
   -------------------------------------------------------------------------- */

const PERIOD_MS = 2200;

export function RotatingWords({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, PERIOD_MS);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span aria-live="off" className="rotWrap">
      {/* The longest word reserves the box, so the line never reflows. */}
      <span aria-hidden className="invisible">
        {words.reduce((a, b) => (b.length > a.length ? b : a), '')}
      </span>
      {words.map((word, i) => (
        <span key={word} className="rotWord" data-on={i === index || undefined}>
          {word}
        </span>
      ))}
    </span>
  );
}
