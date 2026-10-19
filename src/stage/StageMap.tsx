import { useMemo } from 'react';
import outline from '../geo/taiwan-outline.json';
import type { OperaRecord, Position } from '../types';
import type { Phase } from '../timeline';
import { strings, type Lang } from '../i18n';
import { multiPolygonPath, project, VIEW } from '../geo/projection';
import { PLACES } from '../geo/places';
import { LinePiece, MarkerPiece, MillPiece, TerritoryLabel, TerritoryPiece, type PieceProps } from './pieces';

export interface StagedRecord {
  record: OperaRecord;
  phase: Phase;
}

interface Props {
  staged: StagedRecord[];
  year: number;
  lang: Lang;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showPeoples: boolean;
  showPlaces: boolean;
}

const islandPath = multiPolygonPath(outline.geometry.coordinates as Position[][][]);

export function StageMap({ staged, year, lang, selectedId, onSelect, showPeoples, showPlaces }: Props) {
  const t = strings[lang];
  const mapped = useMemo(() => staged.filter((s) => s.record.geometry && s.record.set_piece), [staged]);
  const territories = mapped.filter((s) => s.record.set_piece === 'territory');
  const pieces = mapped.filter((s) => s.record.set_piece !== 'territory');

  const pieceProps = (s: StagedRecord): PieceProps => ({
    record: s.record,
    phase: s.phase,
    selected: s.record.id === selectedId,
    lang,
    onSelect,
  });

  return (
    <svg
      className="stage-map"
      viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label={`${t.mapLabel}: ${year}`}
    >
      <defs>
        <filter id="paper-cut" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="cut" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.14  0.55 0 0 0 -0.18"
            result="fibres"
          />
          <feComposite in="fibres" in2="cut" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="cut" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
        <filter id="cut-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <pattern id="sea-ripples" width="48" height="26" patternUnits="userSpaceOnUse">
          <path d="M2,18 Q12,8 22,18 M26,8 Q36,-2 46,8" className="ripple" />
        </pattern>
        <radialGradient id="sea-light" cx="50%" cy="42%" r="70%">
          <stop offset="0%" className="sea-light-center" />
          <stop offset="100%" className="sea-light-edge" />
        </radialGradient>
        <pattern id="placeholder-pattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="16" height="16" className="tp-bg" />
          <line x1="0" y1="0" x2="0" y2="16" className="tp-line" />
          <circle cx="8" cy="8" r="1.5" className="tp-dot" />
        </pattern>
        <clipPath id="island-clip">
          <path d={islandPath} />
        </clipPath>
      </defs>

      <rect width={VIEW.width} height={VIEW.height} className="sea" />
      <rect width={VIEW.width} height={VIEW.height} fill="url(#sea-ripples)" />
      <rect width={VIEW.width} height={VIEW.height} fill="url(#sea-light)" />

      <g className="island" aria-hidden="true">
        <path d={islandPath} className="island-shadow" transform="translate(6,9)" filter="url(#cut-shadow)" />
        <path d={islandPath} className="island-paper" filter="url(#paper-cut)" />
        <path d={islandPath} className="island-registration" transform="translate(-2.5,-1.5)" />
        <path d={islandPath} className="island-edge" />
      </g>

      <g className={`layer layer-peoples${showPeoples ? ' is-on' : ''}`} aria-hidden={!showPeoples}>
        {showPeoples &&
          territories.map((s) => <TerritoryPiece key={s.record.id} {...pieceProps(s)} />)}
      </g>

      {showPlaces && (
        <g className="layer layer-places" aria-hidden="true">
          {PLACES.map((p) => {
            const [x, y] = project(p.at);
            const dx = p.anchor === 'end' ? -9 : 9;
            return (
              <g key={p.id} transform={`translate(${x},${y})`}>
                <circle r="3.2" className="place-dot" />
                <text x={dx} y="5" textAnchor={p.anchor} className="place-label">
                  {lang === 'zh' ? p.zh : p.en}
                </text>
              </g>
            );
          })}
        </g>
      )}

      <g className="layer layer-pieces">
        {pieces.map((s) => {
          // Keyed by entrance, so a piece re-draws when it comes back on stage.
          const props = pieceProps(s);
          switch (s.record.set_piece) {
            case 'rail':
            case 'canal':
              return <LinePiece key={s.record.id} {...props} />;
            case 'mill':
              return <MillPiece key={s.record.id} {...props} />;
            case 'marker':
              return <MarkerPiece key={s.record.id} {...props} />;
            default:
              return null;
          }
        })}
      </g>

      {showPeoples && (
        <g className="layer layer-peoples-labels" aria-hidden="true">
          {territories.map((s) => (
            <TerritoryLabel key={s.record.id} record={s.record} lang={lang} />
          ))}
        </g>
      )}
    </svg>
  );
}
