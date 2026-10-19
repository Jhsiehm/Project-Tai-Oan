// Mirrors data/schema.json. The build validates the data; these types describe it.
export type Act = 'prologue' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'epilogue';
export type Kind = 'infrastructure' | 'governance' | 'people' | 'event' | 'fact' | 'myth-vs-fact';
export type Certainty = 'documented' | 'estimated' | 'disputed';
export type Confidence = 'verified' | 'partly-verified' | 'unverified';
export type Status = 'draft' | 'reviewed' | 'published';
export type SetPiece = 'rail' | 'canal' | 'mill' | 'marker' | 'territory';

export type Position = [lon: number, lat: number];
export type Geometry =
  | { type: 'Point'; coordinates: Position }
  | { type: 'LineString'; coordinates: Position[] }
  | { type: 'Polygon'; coordinates: Position[][] }
  | { type: 'MultiPolygon'; coordinates: Position[][][] };

export interface OperaRecord {
  id: string;
  act: Act;
  kind: Kind;
  names: { en: string; zh?: string; indigenous?: string };
  start_year: number;
  end_year?: number | null;
  date_note?: string;
  geometry?: Geometry | null;
  geometry_note?: string;
  set_piece?: SetPiece;
  certainty: Certainty;
  confidence: Confidence;
  status: Status;
  card: { en: string; zh?: string; myth?: string; fact?: string };
  indigenous_thread?: string;
  sources: string[];
  notes?: string;
  reviewer?: string | null;
}

export interface SourceEntry {
  cite: string;
  url?: string;
  type: string;
  verified_via: string;
  page_refs: string;
}
