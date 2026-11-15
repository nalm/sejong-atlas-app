import React from 'react';
import {
  Building2,
  Compass,
  Home,
  Landmark,
  MapPin,
  Sparkles,
  TrainFront,
  Users,
} from 'lucide-react';
import { AREA_RANK, COMPLEX_RANK, POPULATION_RANK } from '../data/atlasData';
import { MACRO_ZONES } from '../data/sejongConfig';
import { SejongZoneUnit } from '../types/atlas';

interface UnitDetailProps {
  unit: SejongZoneUnit;
  onCompareClick: (id: string) => void;
}

export const UnitDetail: React.FC<UnitDetailProps> = ({ unit, onCompareClick }) => {
  const macro = MACRO_ZONES[unit.macroZoneId];
  const popRank = POPULATION_RANK[unit.id];
  const areaRank = AREA_RANK[unit.id];
  const complexRank = COMPLEX_RANK[unit.id];

  return (
    <section
      id="detail-section"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      {/* Top 4-Way Identity Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-white">
              스레드 #{unit.threadNo}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${macro.badgeClass}`}>
              {unit.zoneCode}생활권 · {macro.shortName}
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {unit.stageText}
            </span>
            {unit.formerLegalName && (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                명칭 변경: {unit.formerLegalName}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {unit.legalDong}
            </h2>
            <span className="text-lg font-bold text-indigo-600 sm:text-xl">
              {unit.villageName}
            </span>
            {unit.formerVillageName && (
              <span className="text-xs font-medium text-slate-500">({unit.formerVillageName})</span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-slate-600">{unit.summary}</p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
            <span className="text-slate-500">관할 행정동(주민센터): </span>
            <strong className="text-slate-900">{unit.adminDong}</strong>
            {!unit.isAdminCenter && (
              <span className="ml-1.5 rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                통합 관할
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onCompareClick(unit.id)}
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
          >
            다른 동·마을과 1:1 비교하기 →
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>주민등록 인구</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-1.5 text-lg font-extrabold text-slate-900 sm:text-xl">
            {unit.population > 0 ? unit.populationText : '비주거 · 통합'}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            {popRank > 0 ? `23개 구역 중 ${popRank}위` : unit.populationNote ?? '행정동 통합 집계'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>세대수</span>
            <Home className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-1.5 text-lg font-extrabold text-slate-900 sm:text-xl">
            {unit.householdsText}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            도시기능: {unit.urbanFunction}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>아파트 단지 수</span>
            <Building2 className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-1.5 text-lg font-extrabold text-slate-900 sm:text-xl">
            {unit.complexCount > 0 ? `${unit.complexCount}개 단지` : '단지 없음'}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            {complexRank > 0 ? `단지수 ${complexRank}위 · ${unit.villageName}` : unit.complexCountText}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>구역 면적</span>
            <Compass className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-1.5 text-lg font-extrabold text-slate-900 sm:text-xl">
            {unit.areaKm2.toFixed(2)} km²
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            23개 구역 중 면적 {areaRank}위
          </div>
        </div>
      </div>

      {/* Highlight Banner */}
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs text-indigo-950">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
        <p className="leading-relaxed">
          <strong className="font-bold">핵심 포인트: </strong>
          {unit.highlightStory}
        </p>
      </div>

      {/* Thread Etymology Dual Cards */}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
          <div className="text-xs font-bold text-indigo-700">법정동 이름의 뜻 · {unit.legalDong}</div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{unit.dongMeaning}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50/40 to-white p-4">
          <div className="text-xs font-bold text-amber-700">마을 이름의 뜻 · {unit.villageName}</div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{unit.villageMeaning}</p>
        </div>
      </div>

      {/* 3-Column Bottom Dashboard */}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span>대표 아파트 단지 & 주거</span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600">
            {unit.representativeComplexes.map((c) => (
              <li key={c} className="flex items-start gap-1.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-slate-100 pt-2.5">
            <div className="text-[11px] font-bold text-slate-500">학교 및 생활권</div>
            <ul className="mt-1 space-y-1 text-xs text-slate-600">
              {unit.schoolsAndLiving.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Landmark className="h-4 w-4 text-emerald-600" />
            <span>주요 시설 · 공원 · 랜드마크</span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600">
            {unit.landmarks.map((l) => (
              <li key={l} className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <TrainFront className="h-4 w-4 text-sky-600" />
            <span>교통 · 행정 · 실생활 팁</span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-600">{unit.transportAndTip}</p>
          {unit.populationNote && (
            <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[11px] leading-relaxed text-slate-500">
              {unit.populationNote}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
