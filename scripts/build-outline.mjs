// Builds src/geo/taiwan-outline.json from Natural Earth 1:10m land polygons
// (public domain), redistributed as TopoJSON by the world-atlas package (ISC).
// Keeps whole polygons whose centroid falls inside the Taiwan / Penghu box, so
// Kinmen, Matsu and the Fujian coast are excluded (they were not part of
// colonial Taiwan in Act IV). Run with: npm run geo:outline
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { feature } from 'topojson-client';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const topo = JSON.parse(
  await readFile(path.join(root, 'node_modules/world-atlas/land-10m.json'), 'utf8'),
);

const BOX = { west: 119.2, east: 122.2, south: 21.8, north: 25.4 };
const ROUND = 1e4; // about 10 m precision, plenty for a stylized stage map

const land = feature(topo, topo.objects.land);
const polygons = land.features.flatMap((f) =>
  f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates,
);

function centroid(ring) {
  let x = 0;
  let y = 0;
  for (const [lon, lat] of ring) {
    x += lon;
    y += lat;
  }
  return [x / ring.length, y / ring.length];
}

const kept = polygons
  .filter((poly) => {
    const [lon, lat] = centroid(poly[0]);
    const inBox = lon >= BOX.west && lon <= BOX.east && lat >= BOX.south && lat <= BOX.north;
    // An islet off the Fujian coast (about 119.5 E, 25.2 N) falls inside the box.
    const fujianCoast = lat > 24.5 && lon < 120.5;
    return inBox && !fujianCoast;
  })
  .map((poly) =>
    poly.map((ring) => ring.map(([lon, lat]) => [Math.round(lon * ROUND) / ROUND, Math.round(lat * ROUND) / ROUND])),
  );

const out = {
  type: 'Feature',
  properties: {
    name: 'Taiwan, Penghu and nearby islands (land)',
    source: 'Natural Earth 1:10m land, v4.1.0, via world-atlas@2 (TopoJSON). Public domain.',
    generated_by: 'scripts/build-outline.mjs',
  },
  geometry: { type: 'MultiPolygon', coordinates: kept },
};

await mkdir(path.join(root, 'src/geo'), { recursive: true });
await writeFile(path.join(root, 'src/geo/taiwan-outline.json'), JSON.stringify(out));

const summary = kept.map((p) => {
  const [lon, lat] = centroid(p[0]);
  return `${lon.toFixed(2)},${lat.toFixed(2)} (${p[0].length} pts)`;
});
console.log(`Kept ${kept.length} polygons:\n  ${summary.join('\n  ')}`);
