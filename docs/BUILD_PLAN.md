# Build plan: Tâi-oân: A History in Acts

## Phases
0. Foundations: charter, dataset, source tracker, 30 verified facts.
1. Style prototype: Act IV (Japanese era, 1895 to 1945, focus on 1880s to 1930s rail and irrigation). No music.
2. Partnerships and score (parallel): music rights, indigenous community partnership.
3. Full build: all acts, layers, bilingual UI.
4. Review and soft launch: expert review, corrections log.
5. Public launch.

## Acts
Prologue (deep time, prehistory); I Contact (to 1661); II Zheng and early Qing; III Late Qing; IV Japanese era; V Postwar; VI Democratization to now; Epilogue.

## Layers
Infrastructure, who governed what, peoples and languages, events, facts and myths, sound.

## Phase 1 scope (first Claude Code session)
1. Scaffold Vite + React + TS app. Add `npm run validate:data` (Ajv against `data/schema.json`, checks `data/act-iv.seed.json`).
2. Stage frame: proscenium, painted backdrop, curtain open/close animation.
3. Top-down Taiwan outline (use Natural Earth or OSM-derived public-domain geometry; record license in `docs/SOURCES.md`). Simple stylized SVG is fine.
4. Time slider 1895 to 1945. Records appear/disappear by `start_year`/`end_year`.
5. Stagehand animation: a railway line draws segment by segment; one irrigation canal draws; sugar mill markers pop in.
6. Fact card panel and myth-vs-fact placard from seed records. Draft badge for unverified.
7. Indigenous layer: toggle showing peoples' territories as labeled regions with a distinct paper-cut pattern (placeholder pattern until community consultation).
8. Language toggle EN / 繁體中文 using the name fields.
9. Reduced-motion fallback.

Done when: slider scrubs smoothly, every visible record shows certainty and a source, and `validate:data` passes.

## Later priorities
Dataset ingestion from spreadsheet, other acts, audio engine with captions, partnership workflows, expert review tooling.
