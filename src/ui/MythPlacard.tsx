import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { OperaRecord } from '../types';
import { strings, recordName, type Lang } from '../i18n';
import { useReducedMotion } from '../motion';
import { CertaintyBadge, DraftBadge } from './badges';

interface Props {
  record: OperaRecord;
  lang: Lang;
  onOpen: (id: string) => void;
  /** "stage" hangs on the stage (wide screens); "inline" sits below it (phones). CSS shows one. */
  variant: 'stage' | 'inline';
}

/** A two-sided placard hanging on the stage: the myth on one side, the fact on the other. */
export function MythPlacard({ record, lang, onOpen, variant }: Props) {
  const [showFact, setShowFact] = useState(false);
  const reduced = useReducedMotion();
  const faceRef = useRef<HTMLDivElement>(null);
  const t = strings[lang];
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (reduced || !faceRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(faceRef.current, { rotateY: 90 }, { rotateY: 0, duration: 0.45, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, [showFact, reduced]);

  const side = showFact ? record.card.fact : record.card.myth;
  return (
    <aside className={`placard placard-${variant}`} aria-label={recordName(record, lang)}>
      <div className="placard-cord" aria-hidden="true" />
      <div ref={faceRef} className={`placard-face ${showFact ? 'is-fact' : 'is-myth'}`}>
        <div className="placard-head">
          <span className="placard-side">{showFact ? t.fact : t.myth}</span>
          <CertaintyBadge record={record} lang={lang} />
          <DraftBadge record={record} lang={lang} />
        </div>
        <p className="placard-text" lang="en">
          {side}
        </p>
        <div className="placard-actions">
          <button type="button" className="btn btn-small" onClick={() => setShowFact((v) => !v)} aria-pressed={showFact}>
            {showFact ? t.showMyth : t.showFact}
          </button>
          <button type="button" className="btn btn-small btn-quiet" onClick={() => onOpen(record.id)}>
            {t.sources}
          </button>
        </div>
      </div>
    </aside>
  );
}
