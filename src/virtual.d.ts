// Served by the opera-data plugin in vite.config.ts.
declare module 'virtual:opera-data' {
  import type { OperaRecord, SourceEntry } from './types';
  export const records: OperaRecord[];
  export const sources: Record<string, SourceEntry>;
  /** True in the dev server and in `--mode review`; false in production builds. */
  export const showDrafts: boolean;
  export const buildMode: string;
}
