import type { OperaRecord, SourceEntry } from '../types';
import type { Phase } from '../timeline';
import { strings, recordName, cardText, type Lang } from '../i18n';
import { CertaintyBadge, DraftBadge } from './badges';

interface Props {
  record: OperaRecord;
  phase: Phase;
  sources: Record<string, SourceEntry>;
  lang: Lang;
  showNotes: boolean;
  onClose: () => void;
}

export function FactCard({ record, phase, sources, lang, showNotes, onClose }: Props) {
  const t = strings[lang];
  const { text, fallback } = cardText(record, lang);
  const secondaryName = lang === 'en' ? record.names.zh : record.names.en !== recordName(record, lang) ? record.names.en : undefined;

  return (
    <article className="card" aria-labelledby={`card-title-${record.id}`}>
      <header className="card-head">
        <p className="card-kind">
          {t.kind[record.kind]} · {t.phase[phase]}
        </p>
        <h2 id={`card-title-${record.id}`} className="card-title">
          {recordName(record, lang)}
        </h2>
        {secondaryName && (
          <p className="card-subtitle" lang={lang === 'en' ? 'zh-Hant' : 'en'}>
            {secondaryName}
          </p>
        )}
        <div className="card-badges">
          <CertaintyBadge record={record} lang={lang} />
          <span className={`badge badge-confidence confidence-${record.confidence}`}>{t.confidenceValue[record.confidence]}</span>
          <DraftBadge record={record} lang={lang} />
        </div>
        <button type="button" className="card-close" onClick={onClose} aria-label={t.closeCard}>
          ×
        </button>
      </header>

      <dl className="card-meta">
        <div>
          <dt>{t.when}</dt>
          <dd>
            {t.years(record.start_year, record.end_year)}
            {record.date_note && (
              <span className="card-date-note" lang="en">
                {' '}
                ({record.date_note})
              </span>
            )}
          </dd>
        </div>
      </dl>

      {fallback && <p className="card-fallback">{t.zhFallback}</p>}
      <p className="card-text" lang={fallback || lang === 'en' ? 'en' : 'zh-Hant'}>
        {text}
      </p>

      {record.kind === 'myth-vs-fact' && record.card.myth && record.card.fact && (
        <div className="card-myth" lang="en">
          <p>
            <strong>{t.myth}:</strong> {record.card.myth}
          </p>
          <p>
            <strong>{t.fact}:</strong> {record.card.fact}
          </p>
        </div>
      )}

      {record.indigenous_thread && (
        <section className="card-section card-thread">
          <h3>{t.indigenousThread}</h3>
          <p lang="en">{record.indigenous_thread}</p>
        </section>
      )}

      <section className="card-section">
        <h3>{t.mapPlacement}</h3>
        <p lang="en">{record.geometry ? (record.geometry_note ?? '') : t.notMapped}</p>
      </section>

      <section className="card-section">
        <h3>{t.sources}</h3>
        <ol className="card-sources">
          {record.sources.map((key) => {
            const s = sources[key];
            if (!s) return null;
            const pending = s.type === 'pending';
            return (
              <li key={key} className={pending ? 'is-pending' : undefined} lang="en">
                {pending && <span className="badge badge-pending">{t.sourcePending}</span>}{' '}
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer noopener">
                    {s.cite}
                  </a>
                ) : (
                  s.cite
                )}
                {!pending && (
                  <span className="source-meta">
                    {' '}
                    {t.verifiedVia}: {s.verified_via}. {t.pageRefs}: {s.page_refs}.
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {showNotes && record.notes && (
        <details className="card-section card-notes">
          <summary>{t.editorNotes}</summary>
          <p lang="en">{record.notes}</p>
        </details>
      )}
    </article>
  );
}
