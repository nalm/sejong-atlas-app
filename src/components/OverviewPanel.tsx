import React from 'react';
import { Compass, Info, Map, Trees } from 'lucide-react';
import { MACRO_ZONE_ORDER, MACRO_ZONES, SEJONG_EUP_MYEON } from '../data/sejongConfig';
import { UNIT_BY_ID } from '../data/atlasData';
import { MacroZoneId } from '../types/atlas';

interface OverviewPanelProps {
  activeZoneFilter: MacroZoneId | 'all';
  onSelectZoneFilter: (id: MacroZoneId | 'all') => void;
  onSelectUnit: (id: string) => void;
  onOpenHierarchy: () => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  activeZoneFilter,
  onSelectZoneFilter,
  onSelectUnit,
  onOpenHierarchy,
}) => {
  return (
    <div className="space-y-6">
      {/* 7대 생활권 요약 카드 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
              <Compass className="h-5 w-5 text-indigo-600" />
              <span>행복도시 환상형 7대 생활권 한눈에 보기</span>
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              생활권을 클릭해 지도에서 강조하거나, 하위 법정동·마을을 바로 선택해 보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenHierarchy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <Info className="h-3.5 w-3.5" />
            <span>생활권·법정동·행정동·마을 체계 해설</span>
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MACRO_ZONE_ORDER.map((zId) => {
            const mz = MACRO_ZONES[zId];
            const isActive = activeZoneFilter === zId;
            return (
              <div
                key={zId}
                className={`flex flex-col justify-between rounded-xl border p-4 transition ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectZoneFilter(isActive ? 'all' : zId)}
                      className="flex items-center gap-2 text-left"
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: mz.color }}
                      />
                      <span className="text-sm font-extrabold text-slate-900">{mz.shortName}</span>
                    </button>
                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                      {mz.unitIds.length}개 구역
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-bold text-indigo-700">{mz.coreFunction}</div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">{mz.description}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1 border-t border-slate-200/70 pt-2.5">
                  {mz.unitIds.map((uId) => {
                    const u = UNIT_BY_ID[uId];
                    if (!u) return null;
                    return (
                      <button
                        key={uId}
                        type="button"
                        onClick={() => onSelectUnit(uId)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
                      >
                        {u.threadNo}. {u.legalDong}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 외곽 1읍 9면 요약 섹션 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
              <Trees className="h-5 w-5 text-emerald-600" />
              <span>세종시 외곽 1읍 9면 (원도심 · 북부 · 남부 배후권)</span>
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              행복도시(신도시 23개 구역) 외곽을 감싸는 조치원읍과 9개 면 지역의 위치와 핵심 거점 요약입니다.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <Map className="h-3.5 w-3.5" />
            세종시 전체: 1읍 · 9면 · 15행정동 (24법정동)
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SEJONG_EUP_MYEON.map((em) => (
            <div
              key={em.id}
              className={`rounded-xl border p-3.5 ${
                em.type === '읍'
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">{em.name}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    em.type === '읍'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {em.populationText}
                </span>
              </div>
              <div className="mt-1 text-[11px] font-semibold text-indigo-700">{em.direction}</div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">{em.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {em.keySpots.slice(0, 3).map((spot) => (
                  <span
                    key={spot}
                    className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                  >
                    {spot}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
