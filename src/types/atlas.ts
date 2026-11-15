export type MacroZoneId = 'S' | '1' | '2' | '3' | '4' | '5' | '6';

export type AtlasLens =
  | 'zone'        // 생활권 · 마을 기본 뷰
  | 'function'    // 환상형 7대 도시기능
  | 'population'  // 인구 · 단지 밀집도
  | 'etymology'   // 지명 유래 유형 (순우리말 / 전래지명 / 상징한자)
  | 'stage';      // 개발 · 입주 단계

export type MapLabelMode = 'number_village' | 'zone_code' | 'admin_dong';

export type EtymologyType = 'pure_korean' | 'historic' | 'hanja_vision';

export type DevelopmentStage = 'phase1_done' | 'phase2_done' | 'phase3_active' | 'phase4_planned';

export interface SejongZoneUnit {
  id: string;                 // e.g. 'goun', 'areum', 'sejong'
  threadNo: number;           // 1 ~ 23 (스레드 포스트 번호)
  zoneCode: string;           // '1-1' ~ '6-4', 'S-1', 'S-2'
  macroZoneId: MacroZoneId;   // '1' ~ '6', 'S'
  legalDong: string;          // 법정동 (e.g. '고운동')
  formerLegalName?: string;   // 구 법정리 명칭 (e.g. '세종리 (2022.7.1 변경)', '집현리')
  adminDong: string;          // 관할 행정동 (e.g. '고운동', '해밀동', '집현동', '나성동', '한솔동')
  isAdminCenter: boolean;     // 행정복지센터 소재 여부
  villageName: string;        // 마을이름 (e.g. '가락마을')
  formerVillageName?: string; // 초기 계획 마을이름 (e.g. '올목마을', '빗돌마을')
  complexCount: number;       // 아파트 단지 수 (0이면 비주거/예정지)
  complexCountText: string;   // e.g. '22개 단지 (1~22단지)', '조성 예정'
  representativeComplexes: string[]; // 대표 단지명

  // 스레드 원문 기반 지명 유래
  dongMeaning: string;        // 동 이름의 뜻
  villageMeaning: string;     // 마을 이름의 뜻
  etymologyType: EtymologyType;

  // 통계 (2025~2026 기준)
  population: number;         // 구역/행정동 추산 또는 확정 인구수 (명)
  populationText: string;     // 표시용 텍스트 (예: '35,161명', '한솔동 통합 집계')
  populationNote?: string;    // 통합 집계 등 참고 설명
  households: number;         // 세대수
  householdsText: string;     // 표시용 세대수
  areaKm2: number;            // 면적 (km²)

  // 도시 기능 & 입주 단계
  urbanFunction: string;      // e.g. '중앙행정', '주거·교육', '스마트시티'
  stage: DevelopmentStage;
  stageText: string;          // e.g. '1기 입주 완료 (2014~)'
  summary: string;            // 한 줄 요약
  highlightStory: string;     // 핵심 스토리 배너

  // 상세 3단 대시보드 데이터
  landmarks: string[];        // 주요 시설 · 공원 · 관공서
  schoolsAndLiving: string[]; // 학교 · 상권 · 생활 인프라
  transportAndTip: string;    // BRT · 교통 및 헷갈리기 쉬운 포인트

  // 지도 좌표 (SVG viewBox 내부)
  labelOffset?: [number, number];
}

export interface MacroZoneInfo {
  id: MacroZoneId;
  name: string;
  shortName: string;
  coreFunction: string;
  description: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  unitIds: string[];
}

export interface EupMyeonInfo {
  id: string;
  name: string;
  type: '읍' | '면';
  population: number;
  populationText: string;
  areaKm2: number;
  direction: string;
  summary: string;
  keySpots: string[];
}

export interface NameChangeRecord {
  zoneCode: string;
  threadNo: number;
  before: string;
  after: string;
  category: '법정리→법정동' | '마을이름 변경' | '행정동 신설';
  year: string;
  note: string;
}

export interface ComparePreset {
  id: string;
  title: string;
  subtitle: string;
  unitIds: string[];
}
