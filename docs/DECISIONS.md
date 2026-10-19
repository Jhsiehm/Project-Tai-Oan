# Decisions log

Choices made while building the Phase 1 prototype, for the owner to confirm or reverse.

## Data and schema

- **Two optional schema fields.** `geometry_note` (how a shape was drawn and how far to trust it, shown on every card) and `set_piece` (`rail`, `canal`, `mill`, `marker`, `territory`: which stage piece draws the geometry). Both optional; existing records stay valid.
- **New Act IV records come only from the Blueprint.** Qiaotou sugar mill (1902), sugar railways (April 1908), the parliamentary petition movement (1921 to 1934) and Taiwanese in Japan's armed forces (1937 to 1945) are taken from the Blueprint Chronology and its Sources tab, with the sources it lists. All are drafts with TODOs for page references.
- **Seed TODOs partly filled from the Blueprint Sources tab.** Chianan now cites the Chianan Management Office history and the NTHU Hatta Yoichi page (confidence raised to partly-verified on that basis); `todo-chianan` now tracks the still-missing academic source on labor and water fees. Bangchunfeng cites the Taipei Times and Taiwan Today items; `todo-bangchunfeng` tracks the rights check. No new facts were added beyond what the Blueprint states.
- **Geometry is schematic and says so.** The railway is straight segments between approximate modern station locations; the canal is one stylized line north from Wushantou; the mill and the Musha marker are approximate points. Each carries a `geometry_note` and cites `todo-geometry` where a sourced historical map is still needed. The route through Taichung for the 1908 line is an assumption to confirm.
- **Pending sources are visible.** Source entries with `type: pending` render as "Source pending" on cards and are refused by the validator on any `published` record.

## Indigenous peoples layer

- **Placeholder areas only, all drafts.** `data/peoples-iv.seed.json` holds one record per people with a schematic ellipse (`certainty: estimated`, `confidence: unverified`), so none can reach production. Areas are clipped to the coastline, drawn with a dashed edge, and labeled as not boundaries.
- **Who is shown.** The five peoples the Blueprint names for Act IV (Atayal, Truku, Seediq, Bunun, Paiwan) plus Saisiyat, Thao, Tsou, Rukai, Puyuma, Amis and Tao, so the east coast and Orchid Island are not shown empty. Kavalan, Sakizaya, Hla'alua, Kanakanavu and the plains peoples (Pingpu, including Siraya) are listed as "not yet placed" rather than guessed at.
- **Names.** Today's recognized English and Chinese names; colonial-era classifications grouped peoples differently, recorded as a TODO in each record. No endonyms until consultation (`names.indigenous` left out).
- **Pattern.** A generic hatch-and-dot placeholder, not derived from any people's designs, labeled as such in the legend.
- **Musha.** Shown only as a plain placeholder marker. The Blueprint stages the uprising in its own scene with Seediq voices approved by community advisors; that is Phase 3 work.

## Language and vocabulary

- **Era name in Chinese: 日本時代.** A direct rendering of "the Japanese Era" in the seed. Alternatives 日治 and 日據 carry different political readings; this needs the owner's call.
- **Chinese subtitle: 一部分幕上演的歷史** ("a history performed in acts"). The romanized title Tâi-oân stays in both languages.
- **Card text is not machine translated.** Records have no `card.zh` yet; the Chinese interface shows the English original with a notice until reviewed translations exist.
- **Place labels are modern names** at approximate modern locations, labeled "Place names (modern)". Historical names (for example Takao for Kaohsiung before 1920) belong in sourced records.

## Build and assets

- **Stack as decided:** Vite, React, TypeScript, GSAP, Ajv. Custom SVG stage instead of MapLibre, as the plan allows. No Howler yet (no audio in Phase 1).
- **No images, fonts or audio added.** Textures are SVG filters and CSS gradients; fonts are system font stacks with Traditional Chinese fallbacks.
- **Coastline:** Natural Earth 1:10m land (public domain) via the `world-atlas` package (ISC). Only polygons whose centers fall in the Taiwan and Penghu box are kept, so Kinmen, Matsu and the Fujian coast are excluded for Act IV.
- **Production builds are empty today** because every record is a draft. `npm run build:review` makes a reviewer build with drafts and a "not for publication" banner.
