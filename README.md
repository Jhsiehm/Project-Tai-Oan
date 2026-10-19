# Tâi-oân: A History in Acts

An educational, non-commercial, interactive time-slider map of Taiwan's history, staged like Taiwanese opera. Eras are acts; construction enters like stagehands moving set pieces.

This repository holds the **Phase 1 style prototype**: Act IV (the Japanese era, 1895 to 1945), with no music. Every record is a draft awaiting expert review. Project rules live in [CLAUDE.md](CLAUDE.md) and the plan in [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md).

## Run it

```bash
npm install
npm run dev
```

The dev server prints its URL (port 5178 by default, or `PORT`).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server. Draft records are shown with a visible draft badge. |
| `npm run validate:data` | Ajv schema check of every `data/*.seed.json` record file, plus source keys, geometry, house rules and the audio rights gate. Run before every commit. |
| `npm run check:style` | Fails on any em dash in the repo (house style). |
| `npm run check` | All of the above plus the TypeScript check. |
| `npm run build` | Production build. Draft and unverified records are stripped from the bundle. Today every record is a draft, so the production stage is empty by design. |
| `npm run build:review` | Build for reviewers that includes drafts, with a "not for publication" banner. |
| `npm run geo:outline` | Regenerates `src/geo/taiwan-outline.json` from Natural Earth. |

## What the prototype does

- Proscenium stage with velvet curtains that open on load and can be closed and reopened.
- Natural Earth coastline of Taiwan and Penghu as a cut-paper island on an indigo sea (Act IV texture).
- Time slider from 1895 to 1945, with cue marks where records begin, and a play button.
- Stagehand animation: the western trunk railway draws in segment by segment, the Chianan canal follows its reservoir, the Qiaotou sugar mill pops in.
- Playbill of what is on stage each year, a fact card for every record (certainty, confidence, draft badge, date notes, map placement note, sources, editor's notes in dev), and a two-sided myth-vs-fact placard.
- Indigenous peoples layer: schematic placeholder areas with a placeholder pattern, a legend listing peoples not yet placed, and a note that areas are not boundaries.
- English and Traditional Chinese interface. Card text without a Chinese version shows the English original with a notice.
- Keyboard access for every control and set piece, `prefers-reduced-motion` honored, plus an in-app "Reduce motion" switch. No sound.

## How the data flows

`data/*.seed.json` (records) and `data/sources.seed.json` are loaded by a small Vite plugin (`vite.config.ts`) that validates them with the same code as `npm run validate:data` and serves them as `virtual:opera-data`. Invalid data fails the dev server and the build. In production the plugin drops every record with `status: draft` or `confidence: unverified` before bundling, so drafts never ship.

Timeline rules (`src/timeline.ts`): events, facts, governance, peoples and placards are on stage from `start_year` to `end_year` (a null `end_year` means that year only). Infrastructure is "under construction" from `start_year` to `end_year`, then stays standing for the rest of the act.

See [docs/DECISIONS.md](docs/DECISIONS.md) for choices made while building, and [docs/SOURCES.md](docs/SOURCES.md) for open source items.
