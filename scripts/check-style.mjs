// npm run check:style
// House rule (CLAUDE.md): never use em dashes anywhere. Scans tracked text files.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', 'dist', '.git', '.claude', '.vercel']);
const TEXT = /\.(md|json|csv|ts|tsx|mjs|mts|js|css|html)$/;
const EM_DASH = String.fromCharCode(0x2014);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (TEXT.test(entry.name) && entry.name !== 'package-lock.json') yield full;
  }
}

const hits = [];
for await (const file of walk(root)) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    if (line.includes(EM_DASH)) hits.push(`${path.relative(root, file)}:${i + 1}`);
  });
}
if (hits.length) {
  console.error(`Em dashes found (house style forbids them):\n  ${hits.join('\n  ')}`);
  process.exit(1);
}
console.log('check:style passed: no em dashes.');
