import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { loadData, checkData, selectForBuild } from './scripts/lib/data.mjs';

const VIRTUAL_ID = 'virtual:opera-data';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * Serves the validated dataset as `virtual:opera-data`.
 * Dev server and `--mode review` include drafts (shown with a badge);
 * production builds strip draft and unverified records entirely, so they never
 * reach the bundle (CLAUDE.md rule 5). Invalid data fails the build.
 */
function operaData(): Plugin {
  let root = '';
  let mode = 'production';
  let showDrafts = false;
  return {
    name: 'opera-data',
    configResolved(config) {
      root = config.root;
      mode = config.mode;
      showDrafts = config.command === 'serve' || config.mode === 'review';
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return undefined;
      const data = await loadData(root);
      data.files.forEach((f) => this.addWatchFile(f));
      const { errors } = checkData(data);
      if (errors.length) this.error(`Dataset failed validation:\n${errors.join('\n')}`);
      const out = selectForBuild(data, { showDrafts });
      return [
        `export const records = ${JSON.stringify(out.records)};`,
        `export const sources = ${JSON.stringify(out.sources)};`,
        `export const showDrafts = ${JSON.stringify(showDrafts)};`,
        `export const buildMode = ${JSON.stringify(mode)};`,
      ].join('\n');
    },
    configureServer(server) {
      const dataDir = path.join(root, 'data');
      server.watcher.add(dataDir);
      server.watcher.on('change', (file) => {
        if (!file.startsWith(dataDir)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), operaData()],
  // The preview pane may assign a port through PORT.
  server: { port: Number(process.env.PORT) || 5178 },
});
