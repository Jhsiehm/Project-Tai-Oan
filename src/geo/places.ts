import type { Position } from '../types';

// Orientation labels only: modern names at approximate modern city centers.
// Historical names (for example Takao for Kaohsiung before 1920) belong in
// sourced records, not here.
export interface Place {
  id: string;
  en: string;
  zh: string;
  at: Position;
  anchor: 'start' | 'end';
}

export const PLACES: Place[] = [
  { id: 'keelung', en: 'Keelung', zh: '基隆', at: [121.739, 25.132], anchor: 'start' },
  { id: 'taipei', en: 'Taipei', zh: '臺北', at: [121.517, 25.048], anchor: 'end' },
  { id: 'hsinchu', en: 'Hsinchu', zh: '新竹', at: [120.971, 24.802], anchor: 'end' },
  { id: 'taichung', en: 'Taichung', zh: '臺中', at: [120.685, 24.137], anchor: 'end' },
  { id: 'chiayi', en: 'Chiayi', zh: '嘉義', at: [120.441, 23.479], anchor: 'end' },
  { id: 'tainan', en: 'Tainan', zh: '臺南', at: [120.213, 22.997], anchor: 'end' },
  { id: 'kaohsiung', en: 'Kaohsiung', zh: '高雄', at: [120.302, 22.64], anchor: 'end' },
  { id: 'hualien', en: 'Hualien', zh: '花蓮', at: [121.607, 23.976], anchor: 'start' },
  { id: 'taitung', en: 'Taitung', zh: '臺東', at: [121.146, 22.756], anchor: 'start' },
  { id: 'penghu', en: 'Penghu', zh: '澎湖', at: [119.566, 23.57], anchor: 'end' },
];
