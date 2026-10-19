// Shared data loading and checks, used by `npm run validate:data` and by the
// Vite plugin that serves the dataset to the app. Rules come from CLAUDE.md.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';

const EM_DASH = String.fromCharCode(0x2014);
const BOUNDS = { west: 118.0, east: 123.0, south: 21.0, north: 26.5 };
const GEOMETRY_FOR_PIECE = {
  rail: ['LineString'],
  canal: ['LineString'],
  mill: ['Point'],
  marker: ['Point'],
  territory: ['Polygon', 'MultiPolygon'],
};

/** Loads schema, every record file (data/*.seed.json except sources) and the source list. */
export async function loadData(root) {
  const dataDir = path.join(root, 'data');
  const schema = JSON.parse(await readFile(path.join(dataDir, 'schema.json'), 'utf8'));
  const sourcesFile = path.join(dataDir, 'sources.seed.json');
  const sources = JSON.parse(await readFile(sourcesFile, 'utf8'));
  const recordFiles = (await readdir(dataDir))
    .filter((f) => f.endsWith('.seed.json') && f !== 'sources.seed.json')
    .sort()
    .map((f) => path.join(dataDir, f));
  const records = [];
  const parseErrors = [];
  for (const file of recordFiles) {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    if (!Array.isArray(parsed)) {
      parseErrors.push(`${path.basename(file)}: expected an array of records`);
      continue;
    }
    for (const record of parsed) records.push({ record, file: path.basename(file) });
  }
  return {
    schema,
    sources,
    records,
    parseErrors,
    files: [path.join(dataDir, 'schema.json'), sourcesFile, ...recordFiles],
  };
}

function* strings(value, at = '') {
  if (typeof value === 'string') yield [at, value];
  else if (Array.isArray(value)) for (let i = 0; i < value.length; i++) yield* strings(value[i], `${at}[${i}]`);
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) yield* strings(v, at ? `${at}.${k}` : k);
}

function* positions(geometry) {
  const walk = function* (c) {
    if (typeof c[0] === 'number') yield c;
    else for (const inner of c) yield* walk(inner);
  };
  yield* walk(geometry.coordinates);
}

/** Returns { errors, warnings } for the loaded dataset. Errors fail the build. */
export function checkData({ schema, sources, records, parseErrors }) {
  const errors = [...parseErrors];
  const warnings = [];
  const ajv = new Ajv2020({ allErrors: true, allowUnionTypes: true });
  const validate = ajv.compile(schema);
  const seen = new Map();
  const usedSources = new Set();

  for (const { record, file } of records) {
    const where = `${file} ${record?.id ?? '(no id)'}`;
    if (!validate(record)) {
      for (const e of validate.errors) errors.push(`${where}: ${e.instancePath || '/'} ${e.message}`);
      continue;
    }
    if (seen.has(record.id)) errors.push(`${where}: duplicate id (also in ${seen.get(record.id)})`);
    seen.set(record.id, file);

    if (record.end_year != null && record.end_year < record.start_year)
      errors.push(`${where}: end_year ${record.end_year} is before start_year ${record.start_year}`);

    for (const key of record.sources) {
      usedSources.add(key);
      if (!sources[key]) errors.push(`${where}: unknown source key "${key}"`);
    }

    if (record.geometry) {
      for (const [lon, lat] of positions(record.geometry)) {
        if (!(lon >= BOUNDS.west && lon <= BOUNDS.east && lat >= BOUNDS.south && lat <= BOUNDS.north))
          errors.push(`${where}: coordinate [${lon}, ${lat}] is outside the Taiwan area (check lon/lat order)`);
      }
      if (!record.set_piece) warnings.push(`${where}: has geometry but no set_piece, so the stage will not draw it`);
      else if (!GEOMETRY_FOR_PIECE[record.set_piece].includes(record.geometry.type))
        errors.push(`${where}: set_piece "${record.set_piece}" cannot draw a ${record.geometry.type}`);
      if (!record.geometry_note) warnings.push(`${where}: geometry has no geometry_note saying how it was drawn`);
    }

    if (record.confidence === 'unverified' && !/TODO/.test(record.notes ?? ''))
      warnings.push(`${where}: unverified record should leave a TODO in notes`);

    if (record.status === 'published') {
      if (!record.reviewer) errors.push(`${where}: published record needs a reviewer`);
      if (record.confidence === 'unverified') errors.push(`${where}: published record cannot be unverified`);
      for (const key of record.sources)
        if (sources[key]?.type === 'pending') errors.push(`${where}: published record cites pending source "${key}"`);
    }

    for (const [at, text] of strings(record))
      if (text.includes(EM_DASH)) errors.push(`${where}: em dash in ${at} (house style forbids em dashes)`);
  }

  for (const [key, s] of Object.entries(sources)) {
    for (const field of ['cite', 'type', 'verified_via', 'page_refs'])
      if (typeof s[field] !== 'string') errors.push(`sources ${key}: missing "${field}"`);
    if (s.url != null && !/^https:\/\//.test(s.url)) errors.push(`sources ${key}: url must be https`);
    if (/wikipedia\.org/i.test(`${s.url ?? ''} ${s.cite ?? ''}`))
      errors.push(`sources ${key}: Wikipedia is orientation only and cannot be cited`);
    for (const [at, text] of strings(s))
      if (text.includes(EM_DASH)) errors.push(`sources ${key}: em dash in ${at}`);
    if (!usedSources.has(key)) warnings.push(`sources ${key}: not cited by any record`);
  }

  return { errors, warnings };
}

/** Draft or unverified records never reach a production build (CLAUDE.md rule 5). */
export function isDraft(record) {
  return record.status === 'draft' || record.confidence === 'unverified';
}

/** Records and the sources they cite, filtered for the build mode. */
export function selectForBuild({ records, sources }, { showDrafts }) {
  const kept = records.map((r) => r.record).filter((r) => showDrafts || !isDraft(r));
  const cited = {};
  for (const r of kept) for (const key of r.sources) cited[key] = sources[key];
  return { records: kept, sources: cited };
}

/** Audio may ship only when music_tracker.csv marks it cleared (CLAUDE.md rule 3). */
export async function checkAudio(root) {
  const errors = [];
  const audioDir = path.join(root, 'public', 'audio');
  if (!existsSync(audioDir)) return { errors, files: 0 };
  const csv = await readFile(path.join(root, 'data', 'music_tracker.csv'), 'utf8');
  const [header, ...rows] = csv.trim().split(/\r?\n/);
  const cols = header.split(',');
  const idCol = cols.indexOf('id');
  const clearedCol = cols.indexOf('cleared');
  const cleared = new Set(
    rows.map((r) => r.split(',')).filter((c) => c[clearedCol]?.trim() === 'yes').map((c) => c[idCol]),
  );
  const files = (await readdir(audioDir)).filter((f) => !f.startsWith('.'));
  for (const f of files) {
    const id = f.replace(/\.[^.]+$/, '');
    if (!cleared.has(id)) errors.push(`public/audio/${f}: no music_tracker.csv row "${id}" with cleared = yes`);
  }
  return { errors, files: files.length };
}
