import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { strings, type Lang } from '../i18n';
import { useReducedMotion } from '../motion';

interface Props {
  open: boolean;
  lang: Lang;
}

/** Two velvet panels that part to reveal the stage, with the act title on the closed curtain. */
export function Curtain({ open, lang }: Props) {
  const reduced = useReducedMotion();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const t = strings[lang];

  useLayoutEffect(() => {
    const duration = reduced ? 0 : 1.4;
    const ctx = gsap.context(() => {
      // Open = drapes gathered at the edges of the stage, not removed.
      gsap.to(leftRef.current, { scaleX: open ? 0.06 : 1, transformOrigin: '0% 50%', duration, ease: 'power3.inOut' });
      gsap.to(rightRef.current, { scaleX: open ? 0.06 : 1, transformOrigin: '100% 50%', duration, ease: 'power3.inOut' });
      gsap.to(titleRef.current, { autoAlpha: open ? 0 : 1, duration: reduced ? 0 : open ? 0.3 : 0.6, delay: open || reduced ? 0 : 0.9 });
    });
    return () => ctx.kill();
  }, [open, reduced]);

  return (
    <div className="curtain" aria-hidden="true">
      <div ref={leftRef} className="curtain-panel curtain-left" />
      <div ref={rightRef} className="curtain-panel curtain-right" />
      <div ref={titleRef} className="curtain-title">
        <span className="curtain-act">{t.act}</span>
        <span className="curtain-name">{t.actTitle}</span>
      </div>
    </div>
  );
}
