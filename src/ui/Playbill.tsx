import type { StagedRecord } from '../stage/StageMap';
import { strings, recordName, type Lang } from '../i18n';
import { CertaintyBadge, DraftBadge } from './badges';

interface Props {
  staged: StagedRecord[];
  year: number;
  lang: Lang;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** The program for the current year: what is on stage, and which set pieces are standing. */
export function Playbill({ staged, year, lang, selectedId, onSelect }: Props) {
  const t = strings[lang];
  const cast = staged.filter((s) => s.record.kind !== 'people');
  const inScene = cast.filter((s) => s.phase !== 'built' || s.record.end_year === year || s.record.start_year === year);
  const standing = cast.filter((s) => !inScene.includes(s));

  const item = (s: StagedRecord) => (
    <li key={s.record.id}>
      <button
        type="button"
        className={`playbill-item${s.record.id === selectedId ? ' is-selected' : ''}${s.record.start_year === year ? ' is-new' : ''}`}
        onClick={() => onSelect(s.record.id)}
        aria-pressed={s.record.id === selectedId}
      >
        <span className="playbill-name">{recordName(s.record, lang)}</span>
        <span className="playbill-meta">
          <span>{t.kind[s.record.kind]}</span>
          <span aria-hidden="true">·</span>
          <span>{t.years(s.record.start_year, s.record.end_year)}</span>
          <span aria-hidden="true">·</span>
          <span>
            {s.record.sources.length} {t.sources.toLowerCase()}
          </span>
        </span>
        <span className="playbill-badges">
          <CertaintyBadge record={s.record} lang={lang} />
          <DraftBadge record={s.record} lang={lang} />
        </span>
      </button>
    </li>
  );

  return (
    <nav className="playbill" aria-label={t.playbill}>
      <h2 className="panel-title">{t.playbill}</h2>
      <h3 className="playbill-heading">{t.inScene(year)}</h3>
      {inScene.length ? <ul className="playbill-list">{inScene.map(item)}</ul> : <p className="playbill-empty">{t.nothingThisYear}</p>}
      {standing.length > 0 && (
        <>
          <h3 className="playbill-heading">{t.standing}</h3>
          <ul className="playbill-list">{standing.map(item)}</ul>
        </>
      )}
    </nav>
  );
}
