import type { StagedRecord } from '../stage/StageMap';
import { strings, recordName, type Lang } from '../i18n';

interface Props {
  staged: StagedRecord[];
  lang: Lang;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Legend for the indigenous layer: every people in the act, placed or not, each one selectable. */
export function PeoplesLegend({ staged, lang, selectedId, onSelect }: Props) {
  const t = strings[lang];
  const peoples = staged.filter((s) => s.record.kind === 'people');
  if (!peoples.length) return null;
  const placed = peoples.filter((s) => s.record.geometry);
  const unplaced = peoples.filter((s) => !s.record.geometry);
  const chip = (s: StagedRecord) => (
    <li key={s.record.id}>
      <button
        type="button"
        className={`legend-chip${s.record.id === selectedId ? ' is-selected' : ''}`}
        onClick={() => onSelect(s.record.id)}
        aria-pressed={s.record.id === selectedId}
      >
        {recordName(s.record, lang)}
      </button>
    </li>
  );
  return (
    <section className="legend" aria-labelledby="legend-title">
      <div className="legend-head">
        <svg width="28" height="18" aria-hidden="true" className="legend-swatch">
          <rect width="28" height="18" fill="url(#placeholder-pattern)" />
        </svg>
        <h2 id="legend-title" className="panel-title">
          {t.legendTitle}
        </h2>
      </div>
      <p className="legend-note">{t.legendNote}</p>
      <ul className="legend-list">{placed.map(chip)}</ul>
      {unplaced.length > 0 && (
        <>
          <h3 className="legend-subhead">{t.notPlaced}</h3>
          <ul className="legend-list">{unplaced.map(chip)}</ul>
        </>
      )}
    </section>
  );
}
