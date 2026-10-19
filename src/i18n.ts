import type { Certainty, Confidence, Kind, OperaRecord, Status } from './types';
import type { Phase } from './timeline';

export type Lang = 'en' | 'zh';

// Vocabulary choices are deliberate (CLAUDE.md charter). See docs/VOCABULARY.md.
const en = {
  title: 'Tâi-oân',
  subtitle: 'A History in Acts',
  act: 'Act IV',
  actTitle: 'The Japanese Era, 1895 to 1945',
  langToggle: '中文',
  langToggleLabel: 'Switch language to Traditional Chinese',
  peoplesLayer: 'Indigenous peoples',
  placesLayer: 'Place names (modern)',
  reduceMotion: 'Reduce motion',
  openCurtain: 'Open curtain',
  closeCurtain: 'Close curtain',
  play: 'Play',
  pause: 'Pause',
  year: 'Year',
  sliderLabel: 'Year on stage',
  onStageCount: (n: number) => (n === 1 ? '1 record on stage' : `${n} records on stage`),
  playbill: 'Playbill',
  inScene: (y: number) => `In ${y}`,
  standing: 'Standing set pieces',
  nothingThisYear: 'Nothing new on stage this year.',
  prodEmpty: 'No reviewed records yet. Draft records appear only in development and review builds.',
  devBanner: 'Development build. Draft records are shown with a badge and are left out of production builds.',
  reviewBanner: 'Review build. Draft records are shown for reviewers. Not for publication.',
  draft: 'Draft',
  selectPrompt: 'Choose a set piece, a marker or a playbill entry to read its card.',
  when: 'When',
  certainty: 'Certainty',
  confidence: 'Confidence',
  indigenousThread: 'Indigenous thread',
  mapPlacement: 'Map placement',
  notMapped: 'Not on the map yet.',
  sources: 'Sources',
  sourcePending: 'Source pending',
  verifiedVia: 'Checked via',
  pageRefs: 'Pages',
  editorNotes: "Editor's notes",
  zhFallback: '',
  myth: 'Myth',
  fact: 'Fact',
  showFact: 'Show the fact side',
  showMyth: 'Show the myth side',
  closeCard: 'Close card',
  legendTitle: 'Peoples (placeholder areas)',
  legendNote:
    'Schematic areas and a placeholder pattern, pending sources and consultation with each community. Not boundaries. The pattern is not taken from any people’s designs.',
  notPlaced: 'Not yet placed',
  phase: { hidden: 'Off stage', active: 'On stage', building: 'Under construction', built: 'Standing' } as Record<Phase, string>,
  years: (a: number, b?: number | null) => (b != null && b !== a ? `${a} to ${b}` : `${a}`),
  kind: {
    infrastructure: 'Infrastructure',
    governance: 'Governance',
    people: 'People',
    event: 'Event',
    fact: 'Fact',
    'myth-vs-fact': 'Myth vs fact',
  } as Record<Kind, string>,
  certaintyValue: { documented: 'Documented', estimated: 'Estimated', disputed: 'Disputed' } as Record<Certainty, string>,
  confidenceValue: {
    verified: 'Verified',
    'partly-verified': 'Partly verified',
    unverified: 'Unverified',
  } as Record<Confidence, string>,
  statusValue: { draft: 'Draft', reviewed: 'Reviewed', published: 'Published' } as Record<Status, string>,
  footer:
    'Educational and non-commercial. Phase 1 style prototype: every card is a draft awaiting expert review. Coastline: Natural Earth (public domain).',
  mapLabel: 'Stage map of Taiwan for the selected year',
  stageControls: 'Stage controls',
};

type Strings = typeof en;

const zh: Strings = {
  title: 'Tâi-oân 台灣',
  subtitle: '一部分幕上演的歷史',
  act: '第四幕',
  actTitle: '日本時代，1895 至 1945',
  langToggle: 'English',
  langToggleLabel: '切換為英文',
  peoplesLayer: '原住民族',
  placesLayer: '地名（今名）',
  reduceMotion: '減少動態',
  openCurtain: '開幕',
  closeCurtain: '閉幕',
  play: '播放',
  pause: '暫停',
  year: '年份',
  sliderLabel: '舞台年份',
  onStageCount: (n: number) => `台上共 ${n} 筆紀錄`,
  playbill: '節目單',
  inScene: (y: number) => `${y} 年`,
  standing: '已立布景',
  nothingThisYear: '本年沒有新登場的紀錄。',
  prodEmpty: '尚無已審閱的紀錄。草稿紀錄只在開發版與審閱版中顯示。',
  devBanner: '開發版：草稿紀錄附有標記顯示，正式版不會收錄。',
  reviewBanner: '審閱版：顯示草稿紀錄供審閱者查看，請勿公開。',
  draft: '草稿',
  selectPrompt: '點選布景、標記或節目單項目，即可閱讀說明卡。',
  when: '時間',
  certainty: '確定程度',
  confidence: '查證程度',
  indigenousThread: '原住民族觀點',
  mapPlacement: '地圖位置',
  notMapped: '尚未標示於地圖。',
  sources: '資料來源',
  sourcePending: '來源待補',
  verifiedVia: '查證方式',
  pageRefs: '頁碼',
  editorNotes: '編輯備註',
  zhFallback: '尚無中文版本，以下為英文原文。',
  myth: '迷思',
  fact: '史實',
  showFact: '翻到史實面',
  showMyth: '翻到迷思面',
  closeCard: '關閉說明卡',
  legendTitle: '族群（示意範圍）',
  legendNote: '範圍與紋樣皆為暫用示意，待補資料來源並與各族群諮詢後修正；並非邊界。紋樣並非取自任何族群的圖紋。',
  notPlaced: '尚未標示',
  phase: { hidden: '未登場', active: '登場中', building: '興建中', built: '已完工' },
  years: (a: number, b?: number | null) => (b != null && b !== a ? `${a} 至 ${b}` : `${a}`),
  kind: {
    infrastructure: '基礎建設',
    governance: '治理',
    people: '族群',
    event: '事件',
    fact: '史實',
    'myth-vs-fact': '迷思與史實',
  },
  certaintyValue: { documented: '有文獻記載', estimated: '估計', disputed: '有爭議' },
  confidenceValue: { verified: '已查證', 'partly-verified': '部分查證', unverified: '未查證' },
  statusValue: { draft: '草稿', reviewed: '已審閱', published: '已發布' },
  footer: '教育用途，非商業。第一階段風格原型：所有說明卡皆為草稿，尚待專家審閱。海岸線：Natural Earth（公共領域）。',
  mapLabel: '所選年份的台灣舞台地圖',
  stageControls: '舞台控制',
};

export const strings: Record<Lang, Strings> = { en, zh };

export function recordName(record: OperaRecord, lang: Lang): string {
  return lang === 'zh' ? (record.names.zh ?? record.names.en) : record.names.en;
}

/** Card text in the chosen language, falling back to English with a flag. */
export function cardText(record: OperaRecord, lang: Lang): { text: string; fallback: boolean } {
  if (lang === 'zh' && record.card.zh) return { text: record.card.zh, fallback: false };
  return { text: record.card.en, fallback: lang === 'zh' };
}
