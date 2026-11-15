import { SejongZoneUnit } from '../types/atlas';
import { UNITS_PART_1 } from './unitsPart1';
import { UNITS_PART_2 } from './unitsPart2';

export const SEJONG_UNITS: SejongZoneUnit[] = [...UNITS_PART_1, ...UNITS_PART_2].sort(
  (a, b) => a.threadNo - b.threadNo,
);

export const UNIT_BY_ID: Record<string, SejongZoneUnit> = Object.fromEntries(
  SEJONG_UNITS.map((u) => [u.id, u]),
);

// 인구 순위 (인구 > 0 인 구역 기준)
const popSorted = [...SEJONG_UNITS].sort((a, b) => b.population - a.population);
export const POPULATION_RANK: Record<string, number> = Object.fromEntries(
  popSorted.map((u, i) => [u.id, u.population > 0 ? i + 1 : 0]),
);

// 면적 순위
const areaSorted = [...SEJONG_UNITS].sort((a, b) => b.areaKm2 - a.areaKm2);
export const AREA_RANK: Record<string, number> = Object.fromEntries(
  areaSorted.map((u, i) => [u.id, i + 1]),
);

// 단지 수 순위
const complexSorted = [...SEJONG_UNITS].sort((a, b) => b.complexCount - a.complexCount);
export const COMPLEX_RANK: Record<string, number> = Object.fromEntries(
  complexSorted.map((u, i) => [u.id, u.complexCount > 0 ? i + 1 : 0]),
);

export function formatNumber(n: number): string {
  return n.toLocaleString('ko-KR');
}
