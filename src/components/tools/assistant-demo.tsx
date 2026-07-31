'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/* -----------------------------------------------------------------------------
   The assistant, playable — the research's one consistent finding (Lindy's
   task loop, RAS's live transcript): a demo the visitor OPERATES beats any
   screenshot. The visitor plays the customer, picks one of two messages, and
   watches the assistant answer and file the result.

   Scripted, not live — two fixed exchanges, clearly tagged «نمونه نمایشی» by
   the card that hosts it. All strings arrive as props from the server parent;
   this component ships no catalog.
   -------------------------------------------------------------------------- */

export interface AssistantPlayCopy {
  readonly prompt: string;
  readonly q1: string;
  readonly a1: string;
  readonly q2: string;
  readonly a2: string;
  /** The reference's "ACTIONS TRIGGERED" list, three per branch. */
  readonly actionsLabel: string;
  readonly acts1: readonly [string, string, string];
  readonly acts2: readonly [string, string, string];
  readonly replay: string;
}

type Stage = 'idle' | 'typing' | 'answered';

export function AssistantDemo({ copy }: { copy: AssistantPlayCopy }) {
  const [choice, setChoice] = useState<1 | 2 | null>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const send = (next: 1 | 2) => {
    if (stage === 'typing') return;
    setChoice(next);
    setStage('typing');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStage('answered'), 900);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setChoice(null);
    setStage('idle');
  };

  const question = choice === 1 ? copy.q1 : copy.q2;
  const answer = choice === 1 ? copy.a1 : copy.a2;
  const acts = choice === 1 ? copy.acts1 : copy.acts2;

  return (
    <div className="grid gap-2.5 text-sm leading-relaxed" aria-live="polite">
      {choice === null ? (
        <>
          <p className="text-xs text-dim">{copy.prompt}</p>
          <div className="flex flex-wrap gap-2">
            {([1, 2] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => send(option)}
                className="min-h-10 rounded-pill border border-border px-4 text-sm text-ink transition-colors hover:border-[var(--tone)] hover:text-[var(--tone)]"
              >
                {option === 1 ? copy.q1 : copy.q2}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="me-8 w-fit rounded-card rounded-ss-[4px] border border-border bg-surface px-3.5 py-2 text-muted">
            {question}
          </p>

          {stage === 'typing' ? (
            <p
              aria-hidden
              className="ms-8 flex w-fit items-center gap-1 justify-self-end rounded-card rounded-se-[4px] border border-border px-3.5 py-2.5"
            >
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="size-1.5 animate-pulse rounded-pill bg-dim"
                  style={{ animationDelay: `${dot * 160}ms` }}
                />
              ))}
            </p>
          ) : (
            <>
              <p className="ms-8 w-fit justify-self-end rounded-card rounded-se-[4px] border border-[color-mix(in_srgb,var(--tone)_45%,transparent)] bg-[color-mix(in_srgb,var(--tone)_12%,transparent)] px-3.5 py-2 text-ink">
                {answer}
              </p>
              <div className="border-t border-border pt-3">
                <p className="meta text-[10px] uppercase text-dim">{copy.actionsLabel}</p>
                <ul className="mt-1.5 grid gap-1">
                  {acts.map((act) => (
                    <li key={act} className="flex items-center gap-2 text-xs text-muted">
                      <span aria-hidden className="grid size-3.5 shrink-0 place-items-center rounded-pill border border-success/60 text-success">
                        <svg width="7" height="7" viewBox="0 0 10 10">
                          <path d="M1.6 5.2 3.8 7.4 8.4 2.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={reset}
                  className={cn(
                    'meta shrink-0 rounded-pill border border-border px-3 py-1 text-[10px] text-dim',
                    'transition-colors hover:border-border-glass hover:text-ink',
                  )}
                >
                  {copy.replay}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
