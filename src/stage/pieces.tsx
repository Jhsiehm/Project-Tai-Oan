import { useLayoutEffect, useMemo, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { gsap } from 'gsap';
import type { OperaRecord, Position } from '../types';
import type { Phase } from '../timeline';
import { strings, recordName, type Lang } from '../i18n';
import { linePath, polygonPath, multiPolygonPath, project, ringCenter, VIEW } from '../geo/projection';
import { useReducedMotion } from '../motion';

export interface PieceProps {
  record: OperaRecord;
  phase: Phase;
  selected: boolean;
  lang: Lang;
  onSelect: (id: string) => void;
}

/** Shared wrapper: makes a set piece focusable and selectable by mouse or keyboard. */
function Selectable({ record, phase, selected, lang, onSelect, className, children }: PieceProps & { className: string; children: ReactNode }) {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(record.id);
    }
  };
  return (
    <g
      className={`piece ${className} phase-${phase}${selected ? ' is-selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${recordName(record, lang)}. ${strings[lang].phase[phase]}.`}
      onClick={() => onSelect(record.id)}
      onKeyDown={onKeyDown}
    >
      {children}
    </g>
  );
}

/** A small stagehand in dark clothes who carries the brush that lays track or canal. Origin = brush tip. */
function Stagehand({ handRef }: { handRef: React.RefObject<SVGGElement | null> }) {
  return (
    <g ref={handRef} className="stagehand" aria-hidden="true" opacity={0}>
      <g transform="scale(1.7)">
        <line x1="-9" y1="-19" x2="0" y2="0" className="stagehand-pole" />
        <path d="M-15,-5 L-11,-22 L-6,-22 L-3,-5 Z" className="stagehand-body" />
        <circle cx="-8.5" cy="-26.5" r="4.6" className="stagehand-body" />
        <circle cx="0" cy="0" r="2.2" className="stagehand-tip" />
      </g>
    </g>
  );
}

/** Rail line or canal, drawn in segment by segment by a stagehand when it first comes on stage. */
export function LinePiece(props: PieceProps) {
  const { record } = props;
  const reduced = useReducedMotion();
  const coords = (record.geometry as { coordinates: Position[] }).coordinates;
  const d = useMemo(() => linePath(coords), [coords]);
  const pts = useMemo(() => coords.map(project), [coords]);
  const revealRef = useRef<SVGPathElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const reservoirRef = useRef<SVGGElement>(null);
  const isCanal = record.set_piece === 'canal';
  const maskId = `reveal-${record.id}`;

  useLayoutEffect(() => {
    const reveal = revealRef.current;
    const hand = handRef.current;
    if (!reveal || !hand) return;
    const cum = pts.reduce<number[]>((acc, p, i) => {
      acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]));
      return acc;
    }, []);
    const total = cum[cum.length - 1];
    const ctx = gsap.context(() => {
      gsap.set(reveal, { attr: { 'stroke-dasharray': total, 'stroke-dashoffset': reduced ? 0 : total } });
      if (reduced) return;
      const drawn = { len: 0 };
      const follow = () => {
        reveal.setAttribute('stroke-dashoffset', String(total - drawn.len));
        const pt = reveal.getPointAtLength(drawn.len);
        gsap.set(hand, { x: pt.x, y: pt.y });
      };
      const tl = gsap.timeline();
      if (reservoirRef.current)
        tl.from(reservoirRef.current, { scale: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' });
      tl.set(hand, { x: pts[0][0], y: pts[0][1] - 40, opacity: 0 });
      tl.to(hand, { y: pts[0][1], opacity: 1, duration: 0.3, ease: 'power2.out' });
      for (let i = 1; i < cum.length; i++) {
        tl.to(drawn, { len: cum[i], duration: 0.15 + (cum[i] - cum[i - 1]) / 380, ease: 'power1.inOut', onUpdate: follow });
        // The stagehand sets each piece down before moving on.
        tl.to(hand, { scaleY: 0.8, transformOrigin: '50% 100%', duration: 0.07, yoyo: true, repeat: 1 });
      }
      tl.to(hand, { y: '-=30', opacity: 0, duration: 0.35, ease: 'power1.in' });
    });
    return () => ctx.revert();
    // Draw-in runs once per entrance on stage; phase changes are handled in CSS.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Selectable {...props} className={isCanal ? 'canal' : 'rail'}>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW.width} height={VIEW.height}>
        <path ref={revealRef} d={d} className="reveal" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <g className="scaffold">
          <path d={d} className="line-under" />
          <path d={d} className="line-main" />
        </g>
        <g className="finished">
          <path d={d} className="line-under" />
          {!isCanal && <path d={d} className="line-ties" />}
          <path d={d} className="line-main" />
        </g>
      </g>
      {isCanal && (
        <g ref={reservoirRef} transform={`translate(${pts[0][0]},${pts[0][1]})`}>
          <ellipse rx="15" ry="9" className="reservoir" />
        </g>
      )}
      <path d={d} className="hit" />
      <Stagehand handRef={handRef} />
    </Selectable>
  );
}

/** A sugar mill: a paper-cut factory that pops onto the stage. */
export function MillPiece(props: PieceProps) {
  const reduced = useReducedMotion();
  const ref = useRef<SVGGElement>(null);
  const smokeRef = useRef<SVGGElement>(null);
  const [x, y] = project((props.record.geometry as { coordinates: Position }).coordinates);

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(ref.current, { scale: 0, y: -36, transformOrigin: '50% 100%', duration: 0.6, ease: 'back.out(2.4)' });
      tl.fromTo(
        smokeRef.current!.children,
        { opacity: 0, y: 8, scale: 0.4 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.18, duration: 0.5 },
        '-=0.15',
      );
      tl.to(smokeRef.current!.children, { opacity: 0, y: -14, stagger: 0.18, duration: 0.9 });
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Selectable {...props} className="mill">
      <g transform={`translate(${x},${y})`}>
        <g ref={ref}>
          <g ref={smokeRef} className="smoke">
            <circle cx="9" cy="-30" r="4" />
            <circle cx="12" cy="-38" r="5" />
          </g>
          <path d="M-14,0 L-14,-12 L-8,-17 L-8,-12 L-2,-17 L-2,-12 L4,-17 L4,-12 L6,-12 L6,-26 L11,-26 L11,-12 L14,-12 L14,0 Z" className="mill-body" />
          <circle r="22" cy="-10" className="hit hit-area" />
        </g>
      </g>
    </Selectable>
  );
}

/** An event marker: a plain lozenge, no color coding. */
export function MarkerPiece(props: PieceProps) {
  const reduced = useReducedMotion();
  const ref = useRef<SVGGElement>(null);
  const [x, y] = project((props.record.geometry as { coordinates: Position }).coordinates);
  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { scale: 0, rotate: -45, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2)' });
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Selectable {...props} className="marker">
      <g transform={`translate(${x},${y})`}>
        <g ref={ref}>
          <circle r="15" className="marker-ring" />
          <path d="M0,-9 L9,0 L0,9 L-9,0 Z" className="marker-body" />
          <circle r="20" className="hit hit-area" />
        </g>
      </g>
    </Selectable>
  );
}

/** A people's placeholder area: schematic shape with the placeholder pattern. */
export function TerritoryPiece(props: PieceProps) {
  const g = props.record.geometry!;
  const d = g.type === 'Polygon' ? polygonPath(g.coordinates) : g.type === 'MultiPolygon' ? multiPolygonPath(g.coordinates) : '';
  return (
    <Selectable {...props} className="territory">
      <path d={d} className="territory-area" clipPath="url(#island-clip)" />
    </Selectable>
  );
}

/** Label for a people's area, drawn above the set pieces so markers never hide a name. */
export function TerritoryLabel({ record, lang }: { record: OperaRecord; lang: Lang }) {
  const g = record.geometry!;
  const ring = g.type === 'Polygon' ? g.coordinates[0] : g.type === 'MultiPolygon' ? g.coordinates[0][0] : [];
  const [cx, cy] = ringCenter(ring);
  return (
    <text x={cx} y={cy} className="territory-label" textAnchor="middle" dominantBaseline="middle">
      {recordName(record, lang)}
    </text>
  );
}
