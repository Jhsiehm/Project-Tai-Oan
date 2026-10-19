import { useCallback, useEffect, useMemo, useState } from 'react';
import { records, sources, showDrafts, buildMode } from 'virtual:opera-data';
import { ACT_IV, cueYears, phaseAt } from './timeline';
import { strings, type Lang } from './i18n';
import { ReducedMotionContext, useSystemReducedMotion } from './motion';
import { StageMap, type StagedRecord } from './stage/StageMap';
import { Curtain } from './stage/Curtain';
import { MythPlacard } from './ui/MythPlacard';
import { FactCard } from './ui/FactCard';
import { Playbill } from './ui/Playbill';
import { TimeSlider } from './ui/TimeSlider';
import { PeoplesLegend } from './ui/PeoplesLegend';

const actRecords = records.filter((r) => r.act === 'IV');
const cues = cueYears(actRecords);

export default function App() {
  const [year, setYear] = useState<number>(ACT_IV.start);
  const [lang, setLang] = useState<Lang>('en');
  const [showPeoples, setShowPeoples] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);
  const [userReduced, setUserReduced] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => actRecords.find((r) => r.kind !== 'people' && phaseAt(r, ACT_IV.start) !== 'hidden')?.id ?? null,
  );
  const reduced = useSystemReducedMotion() || userReduced;
  const t = strings[lang];

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    document.title = lang === 'zh' ? 'Tâi-oân 台灣：一部分幕上演的歷史' : 'Tâi-oân: A History in Acts';
  }, [lang]);

  // Raise the curtain shortly after the page loads.
  useEffect(() => {
    const id = window.setTimeout(() => setCurtainOpen(true), reduced ? 0 : 500);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const staged: StagedRecord[] = useMemo(
    () =>
      actRecords
        .map((record) => ({ record, phase: phaseAt(record, year) }))
        .filter((s) => s.phase !== 'hidden')
        .sort((a, b) => a.record.start_year - b.record.start_year),
    [year],
  );

  const selected = selectedId ? actRecords.find((r) => r.id === selectedId) : undefined;
  const myths = staged.filter((s) => s.record.kind === 'myth-vs-fact');
  const onStageCount = staged.filter((s) => s.record.kind !== 'people').length;
  const select = useCallback((id: string) => setSelectedId(id), []);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      <div className={`app${reduced ? ' reduce-motion' : ''}`} data-act="IV">
        <header className="masthead">
          <div className="masthead-title">
            <h1>
              {t.title}
              <span className="masthead-subtitle">{t.subtitle}</span>
            </h1>
            <p className="masthead-act">
              <span className="act-plaque">{t.act}</span> {t.actTitle}
            </p>
          </div>
          <div className="masthead-controls" role="group" aria-label={t.stageControls}>
            <button type="button" className="btn" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} aria-label={t.langToggleLabel} lang={lang === 'en' ? 'zh-Hant' : 'en'}>
              {t.langToggle}
            </button>
            <label className="toggle">
              <input type="checkbox" checked={showPeoples} onChange={(e) => setShowPeoples(e.target.checked)} />
              <span>{t.peoplesLayer}</span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={showPlaces} onChange={(e) => setShowPlaces(e.target.checked)} />
              <span>{t.placesLayer}</span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={reduced} onChange={(e) => setUserReduced(e.target.checked)} />
              <span>{t.reduceMotion}</span>
            </label>
            <button type="button" className="btn" onClick={() => setCurtainOpen((v) => !v)} aria-pressed={!curtainOpen}>
              {curtainOpen ? t.closeCurtain : t.openCurtain}
            </button>
          </div>
        </header>

        {showDrafts && <p className="build-banner">{buildMode === 'review' ? t.reviewBanner : t.devBanner}</p>}

        <main className="theatre">
          <section className="proscenium" aria-label={`${t.act}: ${t.actTitle}`}>
            <div className="proscenium-valance" aria-hidden="true" />
            <div className="wings">
              <div className="stage">
                <StageMap
                  staged={staged}
                  year={year}
                  lang={lang}
                  selectedId={selectedId}
                  onSelect={select}
                  showPeoples={showPeoples}
                  showPlaces={showPlaces}
                />
                <div className="stage-year" aria-hidden="true">
                  {year}
                </div>
                {myths.map((s) => (
                  <MythPlacard key={s.record.id} record={s.record} lang={lang} onOpen={select} variant="stage" />
                ))}
                {actRecords.length === 0 && <p className="stage-empty">{t.prodEmpty}</p>}
                <Curtain open={curtainOpen} lang={lang} />
              </div>
            </div>
            <div className="proscenium-floor" aria-hidden="true" />
            {myths.map((s) => (
              <MythPlacard key={s.record.id} record={s.record} lang={lang} onOpen={select} variant="inline" />
            ))}
          </section>

          <aside className="side">
            <Playbill staged={staged} year={year} lang={lang} selectedId={selectedId} onSelect={select} />
            {selected ? (
              <FactCard
                key={selected.id}
                record={selected}
                phase={phaseAt(selected, year)}
                sources={sources}
                lang={lang}
                showNotes={showDrafts}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <p className="card-empty">{t.selectPrompt}</p>
            )}
            {showPeoples && <PeoplesLegend staged={staged} lang={lang} selectedId={selectedId} onSelect={select} />}
          </aside>
        </main>

        <footer className="footer">
          <TimeSlider
            year={year}
            onYear={setYear}
            cues={cues}
            onStageCount={onStageCount}
            playing={playing}
            onPlaying={setPlaying}
            lang={lang}
          />
          <p className="footer-note">{t.footer}</p>
        </footer>
      </div>
    </ReducedMotionContext.Provider>
  );
}
