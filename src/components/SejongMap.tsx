import React, { useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, Layers, LocateFixed, ZoomIn, ZoomOut } from 'lucide-react';
import {
  BANGCHUKCHEON_STREAM_PATH,
  BRT_RING_PATH,
  GEUMGANG_RIVER_PATH,
  JECHEON_STREAM_PATH,
  MIHOGANG_RIVER_PATH,
  SEJONG_ZONE_POLYGONS,
} from '../data/sejongMapPaths';
import { LENS_DEFINITIONS, MACRO_ZONES } from '../data/sejongConfig';
import { SEJONG_UNITS, UNIT_BY_ID } from '../data/atlasData';
import { AtlasLens, MacroZoneId, MapLabelMode, SejongZoneUnit } from '../types/atlas';

interface SejongMapProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeZoneFilter: MacroZoneId | 'all';
  activeLens: AtlasLens;
  labelMode: MapLabelMode;
  onChangeLabelMode: (mode: MapLabelMode) => void;
}

const ETYMOLOGY_COLORS: Record<SejongZoneUnit['etymologyType'], { fill: string; label: string }> = {
  pure_korean: { fill: '#10b981', label: '순우리말 창작형 (고운·아름·도담·해밀 등)' },
  historic: { fill: '#f59e0b', label: '전래지명·역사 계승형 (종촌·한솔·나성·대평·반곡·합강·용호)' },
  hanja_vision: { fill: '#6366f1', label: '도시 비전·상징 한자형 (집현·세종)' },
};

const STAGE_COLORS: Record<SejongZoneUnit['stage'], { fill: string; label: string }> = {
  phase1_done: { fill: '#0ea5e9', label: '1기 초기 완성 (2011~2016)' },
  phase2_done: { fill: '#10b981', label: '2기 성숙 완성 (2017~2022)' },
  phase3_active: { fill: '#f59e0b', label: '3기 입주·조성 진행 중 (집현·산울·합강·세종)' },
  phase4_planned: { fill: '#94a3b8', label: '4기 개발 예정지 (다솜·용호·누리·한별)' },
};

const ADMIN_DONG_COLORS: Record<string, string> = {
  고운동: '#f43f5e',
  아름동: '#fb7185',
  종촌동: '#e11d48',
  도담동: '#be123c',
  어진동: '#f97316',
  다정동: '#f59e0b',
  새롬동: '#eab308',
  한솔동: '#84cc16',
  나성동: '#ec4899',
  대평동: '#14b8a6',
  보람동: '#10b981',
  소담동: '#059669',
  반곡동: '#06b6d4',
  집현동: '#3b82f6',
  해밀동: '#8b5cf6',
};

function getPopColor(pop: number): string {
  if (pop === 0) return '#cbd5e1';
  if (pop >= 25000) return '#4338ca';
  if (pop >= 20000) return '#4f46e5';
  if (pop >= 14000) return '#6366f1';
  if (pop >= 10000) return '#818cf8';
  return '#a5b4fc';
}

export const SejongMap: React.FC<SejongMapProps> = ({
  selectedId,
  onSelect,
  activeZoneFilter,
  activeLens,
  labelMode,
  onChangeLabelMode,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hudOpen, setHudOpen] = useState(true);
  const [showRiversAndBrt, setShowRiversAndBrt] = useState(true);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const hoveredUnit = hoveredId ? UNIT_BY_ID[hoveredId] : null;
  const activeLensMeta = useMemo(
    () => LENS_DEFINITIONS.find((l) => l.id === activeLens) ?? LENS_DEFINITIONS[0],
    [activeLens],
  );

  const getFillColor = (unit: SejongZoneUnit): string => {
    if (labelMode === 'admin_dong') {
      return ADMIN_DONG_COLORS[unit.adminDong] ?? '#94a3b8';
    }
    if (activeLens === 'population') {
      return getPopColor(unit.population);
    }
    if (activeLens === 'etymology') {
      return ETYMOLOGY_COLORS[unit.etymologyType].fill;
    }
    if (activeLens === 'stage') {
      return STAGE_COLORS[unit.stage].fill;
    }
    // 'zone' or 'function'
    return MACRO_ZONES[unit.macroZoneId].color;
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as HTMLElement).closest('[data-zone-poly]')) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging || !dragStart.current) return;
    const dx = (e.clientX - dragStart.current.x) / zoom;
    const dy = (e.clientY - dragStart.current.y) / zoom;
    setPan({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  };

  const handlePointerUp = () => {
    setDragging(false);
    dragStart.current = null;
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-sky-50/40 to-emerald-50/30 shadow-sm">
      {/* Top-Left HUD */}
      <div className="absolute left-3 top-3 z-20 max-w-xs sm:max-w-sm">
        <div className="rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>{activeLensMeta.label}</span>
            </div>
            <button
              type="button"
              onClick={() => setHudOpen((v) => !v)}
              className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-100"
            >
              {hudOpen ? '접기' : '펼치기'}
            </button>
          </div>
          {hudOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] leading-relaxed text-slate-600">{activeLensMeta.description}</p>
              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  지도 표기 모드 (스레드 인포그래픽 전환)
                </div>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => onChangeLabelMode('number_village')}
                    className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                      labelMode === 'number_village'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    1~23번 + 마을명
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeLabelMode('zone_code')}
                    className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                      labelMode === 'zone_code'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    생활권 코드 (1-1~S-2)
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeLabelMode('admin_dong')}
                    className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                      labelMode === 'admin_dong'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    15개 행정동 관할
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top-Center Hover Tooltip */}
      {hoveredUnit && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-20 hidden -translate-x-1/2 sm:block">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-900/95 px-4 py-2 text-white shadow-lg backdrop-blur-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
              {hoveredUnit.threadNo}
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span>{hoveredUnit.legalDong}</span>
                <span className="text-amber-300">({hoveredUnit.villageName})</span>
                <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px]">
                  {hoveredUnit.zoneCode}생활권
                </span>
              </div>
              <div className="mt-0.5 text-[11px] text-slate-300">
                행정동: {hoveredUnit.adminDong} · {hoveredUnit.populationText} · {hoveredUnit.complexCountText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top-Right Controls */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setShowRiversAndBrt((v) => !v)}
          title="금강·하천·BRT 링 표시 토글"
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          {showRiversAndBrt ? <Eye className="h-3.5 w-3.5 text-sky-600" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
          <span className="hidden sm:inline">수계·BRT</span>
        </button>
        <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.2).toFixed(1)))}
            className="p-1.5 text-slate-700 hover:bg-slate-100"
            title="확대"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(1)))}
            className="border-t border-slate-100 p-1.5 text-slate-700 hover:bg-slate-100"
            title="축소"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="border-t border-slate-100 p-1.5 text-slate-700 hover:bg-slate-100"
            title="초기화"
          >
            <LocateFixed className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Map */}
      <div className="w-full select-none">
        <svg
          viewBox="0 0 1000 860"
          className={`h-[430px] w-full sm:h-[540px] lg:h-[620px] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <g transform={`translate(${500 + pan.x}, ${430 + pan.y}) scale(${zoom}) translate(-500, -430)`}>
            {/* Subtle outer ring backdrop */}
            <circle cx="515" cy="445" r="385" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray="6 6" strokeWidth="1.5" />

            {/* External Direction Indicators (from Thread Image #2) */}
            <g className="pointer-events-none">
              <rect x="330" y="14" width="132" height="32" rx="16" fill="#0f172a" />
              <text x="396" y="34" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">
                ⬆️ 조치원읍 (1번국도)
              </text>

              <rect x="655" y="18" width="150" height="32" rx="16" fill="#0369a1" />
              <text x="730" y="38" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">
                ⬆️ 🚆 KTX 오송역
              </text>

              <rect x="335" y="818" width="180" height="32" rx="16" fill="#047857" />
              <text x="425" y="838" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">
                ⬇️ 🚆 대전 반석역 (1호선)
              </text>
            </g>

            {/* Rivers */}
            {showRiversAndBrt && (
              <g className="pointer-events-none">
                <path
                  d={GEUMGANG_RIVER_PATH}
                  fill="none"
                  stroke="#7dd3fc"
                  strokeWidth="20"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <path
                  d={GEUMGANG_RIVER_PATH}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeDasharray="8 6"
                  opacity="0.45"
                />
                <path
                  d={MIHOGANG_RIVER_PATH}
                  fill="none"
                  stroke="#7dd3fc"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <path d={JECHEON_STREAM_PATH} fill="none" stroke="#bae6fd" strokeWidth="5" strokeLinecap="round" />
                <path d={BANGCHUKCHEON_STREAM_PATH} fill="none" stroke="#bae6fd" strokeWidth="5" strokeLinecap="round" />

                {/* River Labels */}
                <text x="690" y="502" fill="#0369a1" fontSize="11" fontWeight="700" transform="rotate(-28 690 502)">
                  금강 (Geumgang)
                </text>
                <text x="768" y="175" fill="#0369a1" fontSize="11" fontWeight="700" transform="rotate(80 768 175)">
                  미호강
                </text>
              </g>
            )}

            {/* 23 Zone Polygons */}
            {SEJONG_UNITS.map((unit) => {
              const poly = SEJONG_ZONE_POLYGONS[unit.id];
              if (!poly) return null;
              const isSelected = selectedId === unit.id;
              const isHovered = hoveredId === unit.id;
              const isFilteredOut = activeZoneFilter !== 'all' && unit.macroZoneId !== activeZoneFilter;
              const fillColor = getFillColor(unit);

              return (
                <g
                  key={unit.id}
                  data-zone-poly="true"
                  className="cursor-pointer transition-opacity duration-200"
                  opacity={isFilteredOut ? 0.22 : 1}
                  onClick={() => onSelect(unit.id)}
                  onMouseEnter={() => setHoveredId(unit.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <path
                    d={poly.path}
                    fill={fillColor}
                    fillOpacity={isSelected ? 0.92 : isHovered ? 0.85 : 0.68}
                    stroke={isSelected ? '#0f172a' : isHovered ? '#1e293b' : '#ffffff'}
                    strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.8}
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}

            {/* BRT Ring Overlay */}
            {showRiversAndBrt && (
              <path
                d={BRT_RING_PATH}
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeDasharray="7 5"
                opacity="0.75"
                className="pointer-events-none"
              />
            )}

            {/* Labels & Badges */}
            {SEJONG_UNITS.map((unit) => {
              const poly = SEJONG_ZONE_POLYGONS[unit.id];
              if (!poly) return null;
              const [cx, cy] = poly.centroid;
              const isSelected = selectedId === unit.id;
              const isFilteredOut = activeZoneFilter !== 'all' && unit.macroZoneId !== activeZoneFilter;

              return (
                <g
                  key={`lbl-${unit.id}`}
                  className="pointer-events-none"
                  opacity={isFilteredOut ? 0.25 : 1}
                >
                  {/* Number or ZoneCode Pill */}
                  <rect
                    x={cx - 14}
                    y={cy - 22}
                    width="28"
                    height="17"
                    rx="8.5"
                    fill={isSelected ? '#0f172a' : '#ffffff'}
                    stroke={isSelected ? '#0f172a' : '#334155'}
                    strokeWidth="1"
                  />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill={isSelected ? '#ffffff' : '#0f172a'}
                  >
                    {labelMode === 'zone_code' ? unit.zoneCode : unit.threadNo}
                  </text>

                  {/* Legal Dong Name */}
                  <text
                    x={cx}
                    y={cy + 8}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth="3"
                    paintOrder="stroke"
                  >
                    {unit.legalDong}
                  </text>

                  {/* Sub-label: Village or Admin Dong */}
                  <text
                    x={cx}
                    y={cy + 22}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={labelMode === 'admin_dong' ? '#1e293b' : '#334155'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    paintOrder="stroke"
                  >
                    {labelMode === 'admin_dong'
                      ? `행:${unit.adminDong}`
                      : unit.villageName}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Bottom Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white/90 px-4 py-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {labelMode === 'admin_dong' ? (
            <span className="font-medium text-slate-600">
              15개 행정동 관할 색분류 (예: 해밀동이 해밀·산울·누리·한별동 관할 / 집현동이 집현·합강·다솜·용호동 관할)
            </span>
          ) : activeLens === 'etymology' ? (
            Object.entries(ETYMOLOGY_COLORS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: v.fill }} />
                <span className="text-slate-700">{v.label}</span>
              </div>
            ))
          ) : activeLens === 'stage' ? (
            Object.entries(STAGE_COLORS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: v.fill }} />
                <span className="text-slate-700">{v.label}</span>
              </div>
            ))
          ) : activeLens === 'population' ? (
            <>
              {[
                { color: '#4338ca', label: '2.5만명 이상' },
                { color: '#4f46e5', label: '2만~2.5만명' },
                { color: '#6366f1', label: '1.4만~2만명' },
                { color: '#818cf8', label: '1만~1.4만명' },
                { color: '#cbd5e1', label: '비주거·예정지' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.label}</span>
                </div>
              ))}
            </>
          ) : (
            Object.values(MACRO_ZONES).map((mz) => (
              <div key={mz.id} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: mz.color }} />
                <span className="font-medium text-slate-700">{mz.shortName}</span>
              </div>
            ))
          )}
        </div>
        {showRiversAndBrt && (
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-4 rounded-full bg-sky-400" /> 금강·미호강
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-orange-500" /> 환상형 BRT 링
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
