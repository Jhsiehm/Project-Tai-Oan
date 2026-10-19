import type { Position } from '../types';

// Simple equirectangular projection scaled for Taiwan's latitude. Good enough
// for a stylized stage map; not for measurement.
export const VIEW = { width: 1200, height: 1000 } as const;
const CENTER: Position = [120.65, 23.6];
const SCALE = 270; // SVG units per degree of latitude
const K = Math.cos((CENTER[1] * Math.PI) / 180);

export function project([lon, lat]: Position): [number, number] {
  return [VIEW.width / 2 + (lon - CENTER[0]) * K * SCALE, VIEW.height / 2 - (lat - CENTER[1]) * SCALE];
}

const fmt = (n: number) => Math.round(n * 10) / 10;

export function linePath(coords: Position[]): string {
  return coords.map((c, i) => `${i ? 'L' : 'M'}${project(c).map(fmt).join(',')}`).join('');
}

export function ringPath(ring: Position[]): string {
  return `${linePath(ring)}Z`;
}

export function polygonPath(polygon: Position[][]): string {
  return polygon.map(ringPath).join('');
}

export function multiPolygonPath(polygons: Position[][][]): string {
  return polygons.map(polygonPath).join('');
}

/** Average of a ring's vertices, in SVG units. Fine for label placement. */
export function ringCenter(ring: Position[]): [number, number] {
  const pts = ring.slice(0, -1).map(project);
  const x = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const y = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [x, y];
}
