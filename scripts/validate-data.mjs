// npm run validate:data
// Validates every data/*.seed.json record file against data/schema.json (Ajv),
// cross-checks source keys, geometry and house rules, and checks that any
// audio in public/audio is cleared in data/music_tracker.csv.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData, checkData, checkAudio, isDraft } from './lib/data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = await loadData(root);
const { errors, warnings } = checkData(data);
const audio = await checkAudio(root);
errors.push(...audio.errors);

const total = data.records.length;
const drafts = data.records.filter(({ record }) => isDraft(record)).length;

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(
  `\n${total} records in ${data.files.length - 2} files, ${drafts} draft or unverified (hidden in production), ` +
    `${Object.keys(data.sources).length} sources, ${audio.files} audio files.`,
);
if (errors.length) {
  console.error(`validate:data failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`validate:data passed${warnings.length ? ` with ${warnings.length} warning(s)` : ''}.`);
