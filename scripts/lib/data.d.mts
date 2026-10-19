export interface LoadedData {
  schema: object;
  sources: Record<string, Record<string, unknown>>;
  records: { record: Record<string, unknown> & { sources: string[] }; file: string }[];
  parseErrors: string[];
  files: string[];
}

export function loadData(root: string): Promise<LoadedData>;
export function checkData(data: LoadedData): { errors: string[]; warnings: string[] };
export function isDraft(record: { status: string; confidence: string }): boolean;
export function selectForBuild(
  data: LoadedData,
  options: { showDrafts: boolean },
): { records: unknown[]; sources: Record<string, unknown> };
export function checkAudio(root: string): Promise<{ errors: string[]; files: number }>;
