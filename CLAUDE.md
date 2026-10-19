# Tâi-oân: A History in Acts (working repo name: taiwan-opera-map)

Project rules for Claude Code.

## What this is
An educational, non-commercial, interactive top-down time-slider map of Taiwan's history, staged like Taiwanese opera (gezaixi / budaixi). Eras are acts. Each act has its own paper-cut, painted map texture. Construction (rail, irrigation, ports) animates like stagehands moving set pieces. Music is optional, opt-in, captioned, and rights-cleared. Indigenous peoples are present in every act with their own visual and musical language.

Owner: Joshua (GWU Elliott School). Source of truth for content: the Claude Docs artifact "Taiwan Opera Map: Project Blueprint" (tabs: Blueprint, Chronology, Sources), https://claude.ai/code/artifact/a5f6688f-4052-46d2-b0dd-d386dd34ba57. The files in `data/` are a seed, not the full dataset.

## Title
Public title: **Tâi-oân: A History in Acts** (台灣, Hokkien Pe̍h-ōe-jī romanization). Use "Tayouan" in the Act I intro, with a fact card on the name's origin (Siraya-linked, meaning debated). Do not use "Formosa" as the project name; use it only as a historical name with attribution.

## Hard rules
1. Writing: never use em dashes anywhere (UI copy, docs, comments, commit messages).
2. Editorial charter (apply to every record and card):
   - Say who did it, when, and by what means.
   - Separate record from interpretation.
   - No one-ethnicity timeline. Indigenous, Hoklo, Hakka, waishengren, new immigrants all appear.
   - Primary and academic sources first. Never cite Wikipedia in published content (orientation only).
   - Vocabulary is deliberate (e.g. "annexation/cession", "pacification", "incident"). Record the term choice in `notes`.
   - Show contested status debates; do not settle them.
   - No moral coding through face-paint colors or costume palettes.
   - Show uncertainty: every record has `certainty` (documented, estimated, disputed) and `confidence`.
   - Expert review before publish. Keep a public corrections log.
3. Music rights tiers (citation is not a license):
   1. Public-domain composition with a new recording.
   2. Openly licensed or archival recording with a verified license.
   3. Permission required (modern recordings, protected lyrics, all indigenous material).
   4. Replace with a commissioned original.
   Nothing ships in `public/audio` unless `music_tracker.csv` shows `cleared = yes`. Default for unknown is NOT cleared.
4. Indigenous material: no audio, pattern, or name used without community partnership and consent recorded in the tracker. Use placeholder tones and clearly marked stand-ins until then. Use endonyms where known.
5. Records with `status: draft` or `confidence: unverified` must render with a visible "draft" badge in dev and must not appear in production builds.
6. Never invent facts, dates, numbers, or quotes. If a source is missing, mark `unverified` and leave a TODO in `notes`.
7. Accessibility: keyboard navigation, captions for any sound, `prefers-reduced-motion` honored, English and Traditional Chinese toggle.

## Stack (decided unless the owner changes it)
Vite + React + TypeScript, MapLibre GL or custom SVG/canvas stage, GSAP for animation, Howler.js for audio (streamed, opt-in), JSON master dataset validated by JSON Schema (Ajv) at build time, Vercel hosting.

## Working agreement
- Start with `docs/BUILD_PLAN.md`. Build the Phase 1 prototype first (Act IV only, no music).
- Validate data with `npm run validate:data` before every commit.
- Small commits. Ask the owner before adding any asset (image, audio, font) that is not clearly licensed.
- Unverified items are listed in `docs/SOURCES.md`. Do not promote them to `documented` without a source.
