import type { OperaRecord } from '../types';
import { strings, type Lang } from '../i18n';
import { isDraft } from '../timeline';

/** Visible on every draft or unverified record (CLAUDE.md rule 5). */
export function DraftBadge({ record, lang }: { record: OperaRecord; lang: Lang }) {
  if (!isDraft(record)) return null;
  const t = strings[lang];
  const label = record.confidence === 'unverified' ? `${t.draft} · ${t.confidenceValue.unverified}` : t.draft;
  return <span className="badge badge-draft">{label}</span>;
}

/** Certainty is always shown next to a record, so uncertainty is never hidden. */
export function CertaintyBadge({ record, lang }: { record: OperaRecord; lang: Lang }) {
  const t = strings[lang];
  return (
    <span className={`badge badge-certainty certainty-${record.certainty}`} title={t.certainty}>
      {t.certaintyValue[record.certainty]}
    </span>
  );
}
