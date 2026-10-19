import { useEffect } from 'react';
import { ACT_IV } from '../timeline';
import { strings, type Lang } from '../i18n';

interface Props {
  year: number;
  onYear: (year: number) => void;
  cues: number[];
  onStageCount: number;
  playing: boolean;
  onPlaying: (playing: boolean) => void;
  lang: Lang;
}

const span = ACT_IV.end - ACT_IV.start;
const pct = (y: number) => `${((y - ACT_IV.start) / span) * 100}%`;
const DECADES = [1895, 1905, 1915, 1925, 1935, 1945];

export function TimeSlider({ year, onYear, cues, onStageCount, playing, onPlaying, lang }: Props) {
  const t = strings[lang];

  useEffect(() => {
    if (!playing) return;
    if (year >= ACT_IV.end) {
      onPlaying(false);
      return;
    }
    const id = window.setTimeout(() => onYear(year + 1), 900);
    return () => window.clearTimeout(id);
  }, [playing, year, onYear, onPlaying]);

  return (
    <div className="timeline">
      <button
        type="button"
        className="btn btn-play"
        onClick={() => {
          if (!playing && year >= ACT_IV.end) onYear(ACT_IV.start);
          onPlaying(!playing);
        }}
        aria-pressed={playing}
      >
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span> {playing ? t.pause : t.play}
      </button>
      <div className="timeline-year" aria-live="polite">
        <span className="timeline-year-number">{year}</span>
        <span className="timeline-year-count">{t.onStageCount(onStageCount)}</span>
      </div>
      <div className="timeline-track">
        <input
          type="range"
          min={ACT_IV.start}
          max={ACT_IV.end}
          step={1}
          value={year}
          onChange={(e) => {
            onPlaying(false);
            onYear(Number(e.target.value));
          }}
          aria-label={t.sliderLabel}
          aria-valuetext={`${year}. ${t.onStageCount(onStageCount)}`}
          className="timeline-input"
        />
        <div className="timeline-cues" aria-hidden="true">
          {cues.map((y) => (
            <span key={y} className={`timeline-cue${y === year ? ' is-current' : ''}`} style={{ left: pct(y) }} title={String(y)} />
          ))}
        </div>
        <div className="timeline-ticks" aria-hidden="true">
          {DECADES.map((y) => (
            <span key={y} style={{ left: pct(y) }}>
              {y}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
