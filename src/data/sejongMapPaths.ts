export interface MapPolygon {
  id: string;
  path: string;
  centroid: [number, number];
}

// ViewBox: 0 0 1000 860
// 행정중심복합도시 23개 구역(법정동·생활권) 정적 SVG 폴리곤
export const SEJONG_ZONE_POLYGONS: Record<string, MapPolygon> = {
  // 1생활권
  goun: {
    id: 'goun',
    path: 'M 95 235 L 185 185 L 220 225 L 210 380 L 145 395 L 90 330 Z',
    centroid: [155, 290],
  },
  areum: {
    id: 'areum',
    path: 'M 220 225 L 295 225 L 295 335 L 212 335 Z',
    centroid: [255, 280],
  },
  jongchon: {
    id: 'jongchon',
    path: 'M 212 335 L 295 335 L 295 435 L 205 435 Z',
    centroid: [250, 385],
  },
  dodam: {
    id: 'dodam',
    path: 'M 295 225 L 365 225 L 395 295 L 395 365 L 295 365 Z',
    centroid: [342, 300],
  },
  eojin: {
    id: 'eojin',
    path: 'M 295 365 L 395 365 L 405 485 L 320 495 L 295 435 Z',
    centroid: [348, 430],
  },

  // 2생활권 & S-2
  dajeong: {
    id: 'dajeong',
    path: 'M 155 435 L 295 435 L 295 540 L 160 540 L 140 485 Z',
    centroid: [222, 488],
  },
  saerom: {
    id: 'saerom',
    path: 'M 160 540 L 285 540 L 285 650 L 175 650 L 150 595 Z',
    centroid: [222, 595],
  },
  hansol: {
    id: 'hansol',
    path: 'M 175 650 L 285 650 L 305 715 L 255 750 L 195 735 Z',
    centroid: [240, 698],
  },
  naseong: {
    id: 'naseong',
    path: 'M 285 490 L 395 485 L 385 625 L 325 660 L 285 650 Z',
    centroid: [338, 575],
  },
  garam: {
    id: 'garam',
    path: 'M 160 735 L 255 750 L 245 815 L 175 810 L 145 775 Z',
    centroid: [202, 778],
  },

  // 3생활권 (금강 남안)
  daepyeong: {
    id: 'daepyeong',
    path: 'M 330 705 L 455 680 L 475 765 L 385 810 L 315 780 Z',
    centroid: [398, 745],
  },
  boram: {
    id: 'boram',
    path: 'M 455 640 L 570 595 L 595 685 L 475 730 Z',
    centroid: [525, 665],
  },
  sodam: {
    id: 'sodam',
    path: 'M 570 595 L 675 525 L 705 605 L 595 665 Z',
    centroid: [638, 595],
  },

  // 4생활권
  bangok: {
    id: 'bangok',
    path: 'M 675 525 L 785 465 L 810 565 L 705 605 Z',
    centroid: [745, 538],
  },
  jiphyeon: {
    id: 'jiphyeon',
    path: 'M 785 465 L 915 445 L 935 555 L 810 585 Z',
    centroid: [865, 515],
  },

  // 5생활권
  hapgang: {
    id: 'hapgang',
    path: 'M 775 265 L 905 255 L 925 365 L 820 395 L 765 340 Z',
    centroid: [845, 325],
  },
  dasom: {
    id: 'dasom',
    path: 'M 685 135 L 795 145 L 805 260 L 765 280 L 680 245 Z',
    centroid: [745, 208],
  },
  yongho: {
    id: 'yongho',
    path: 'M 575 95 L 685 120 L 680 245 L 580 240 L 555 165 Z',
    centroid: [622, 175],
  },

  // 6생활권
  nuri: {
    id: 'nuri',
    path: 'M 470 215 L 580 220 L 595 315 L 485 335 L 455 275 Z',
    centroid: [525, 275],
  },
  hanbyeol: {
    id: 'hanbyeol',
    path: 'M 375 95 L 495 100 L 490 215 L 385 215 L 365 155 Z',
    centroid: [432, 158],
  },
  haemil: {
    id: 'haemil',
    path: 'M 365 215 L 470 215 L 460 315 L 395 315 L 365 270 Z',
    centroid: [418, 265],
  },
  sanul: {
    id: 'sanul',
    path: 'M 235 120 L 365 110 L 380 220 L 230 220 Z',
    centroid: [305, 168],
  },

  // S-1 생활권 (세종동 - 중앙녹지·국가중추)
  sejong: {
    id: 'sejong',
    path: 'M 405 335 L 595 320 L 675 375 L 650 485 L 535 555 L 415 580 L 395 485 Z',
    centroid: [525, 445],
  },
};

// 금강 본류 (남서 -> 중앙 -> 동쪽 합강부 통과)
export const GEUMGANG_RIVER_PATH =
  'M 120 855 C 210 830, 270 760, 320 695 C 375 630, 440 615, 530 580 C 625 545, 690 485, 765 440 C 835 400, 910 395, 980 390';

// 미호강 (북동쪽에서 합강동 서남단으로 합류)
export const MIHOGANG_RIVER_PATH =
  'M 800 50 C 790 120, 775 210, 755 295 C 740 355, 750 405, 770 438';

// 제천 & 방축천 (1~2생활권을 가로지르는 도심 하천)
export const JECHEON_STREAM_PATH =
  'M 215 180 C 235 280, 265 395, 295 490 C 315 560, 315 620, 310 685';

export const BANGCHUKCHEON_STREAM_PATH =
  'M 340 165 C 350 265, 385 335, 425 415 C 455 475, 460 535, 445 605';

// 환상형(Ring) BRT 순환 노선 가이드
export const BRT_RING_PATH =
  'M 265 255 C 230 340, 225 480, 255 625 C 285 720, 405 735, 535 660 C 665 585, 785 495, 815 395 C 835 300, 740 205, 600 185 C 460 165, 310 185, 265 255 Z';
