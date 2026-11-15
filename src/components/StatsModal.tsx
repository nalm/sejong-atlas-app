import React, { useMemo, useState } from 'react';
import { ArrowUpDown, BarChart3, X } from 'lucide-react';
import { MACRO_ZONES } from '../data/sejongConfig';
import { SEJONG_UNITS, formatNumber } from '../data/atlasData';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit: (id: string) => void;
}

type SortKey = 'threadNo' | 'population' | 'areaKm2' | 'complexCount';

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, onSelectUnit }) => {
  const [sortKey, setSortKey] = useState<SortKey>('threadNo');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const sortedUnits = useMemo(() => {
    const list = [...SEJONG_UNITS];
    list.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [sortKey, sortAsc]);

  const totals = useMemo(() => {
    const totalComplexes = SEJONG_UNITS.reduce((acc, u) => acc + u.complexCount, 0);
    const totalArea = SEJONG_UNITS.reduce((acc, u) => acc + u.areaKm2, 0);
    const totalDongPop = SEJONG_UNITS.reduce((acc, u) => acc + u.population, 0);
    return { totalComplexes, totalArea, totalDongPop };
  }, []);

  if (!isOpen) return null;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === 'threadNo');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-extrabold sm:text-lg">
                세종시 23개 구역 인구 · 세대수 · 단지수 · 면적 통계표
              </h2>
              <p className="text-xs text-slate-300">
                열 제목을 클릭해 정렬할 수 있으며, 구역을 누르면 상세 패널로 바로 이동합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-5">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-bold text-slate-500">세종시 전체 인구 (2026)</div>
              <div className="mt-1 text-lg font-extrabold text-slate-900">약 390,618명</div>
              <div className="text-[10px] text-slate-500">165,934세대 · 평균연령 39.6세</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-bold text-slate-500">행복도시 동 지역 합계</div>
              <div className="mt-1 text-lg font-extrabold text-indigo-700">
                약 {formatNumber(totals.totalDongPop)}명
              </div>
              <div className="text-[10px] text-slate-500">나머지 약 8.8만 명은 1읍 9면</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-bold text-slate-500">예정지역 아파트 단지</div>
              <div className="mt-1 text-lg font-extrabold text-amber-700">{totals.totalComplexes}개+</div>
              <div className="text-[10px] text-slate-500">최다: 고운동 가락마을(22개)</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-bold text-slate-500">23개 구역 면적 합계</div>
              <div className="mt-1 text-lg font-extrabold text-emerald-700">
                {totals.totalArea.toFixed(1)} km²
              </div>
              <div className="text-[10px] text-slate-500">세종시 총 면적 464.9 km²</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700">
                <tr>
                  <th
                    className="cursor-pointer px-3 py-2.5 hover:bg-slate-200"
                    onClick={() => handleSort('threadNo')}
                  >
                    <span className="inline-flex items-center gap-1">
                      번호 <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th className="px-3 py-2.5">생활권</th>
                  <th className="px-3 py-2.5">법정동 (마을이름)</th>
                  <th className="px-3 py-2.5">행정동</th>
                  <th
                    className="cursor-pointer px-3 py-2.5 text-right hover:bg-slate-200"
                    onClick={() => handleSort('population')}
                  >
                    <span className="inline-flex items-center justify-end gap-1">
                      인구수 <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-3 py-2.5 text-right hover:bg-slate-200"
                    onClick={() => handleSort('complexCount')}
                  >
                    <span className="inline-flex items-center justify-end gap-1">
                      단지수 <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-3 py-2.5 text-right hover:bg-slate-200"
                    onClick={() => handleSort('areaKm2')}
                  >
                    <span className="inline-flex items-center justify-end gap-1">
                      면적(km²) <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th className="px-3 py-2.5">진행 단계</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedUnits.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => {
                      onSelectUnit(u.id);
                      onClose();
                    }}
                    className="cursor-pointer transition hover:bg-indigo-50/50"
                  >
                    <td className="px-3 py-2 font-extrabold text-slate-900">#{u.threadNo}</td>
                    <td className="px-3 py-2">
                      <span
                        className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: MACRO_ZONES[u.macroZoneId].color }}
                      >
                        {u.zoneCode}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-900">
                      {u.legalDong}{' '}
                      <span className="font-semibold text-indigo-700">({u.villageName})</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{u.adminDong}</td>
                    <td className="px-3 py-2 text-right font-bold text-slate-900">
                      {u.population > 0 ? `${formatNumber(u.population)}명` : '비주거/통합'}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-700">
                      {u.complexCount > 0 ? `${u.complexCount}개` : '-'}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-700">{u.areaKm2.toFixed(2)}</td>
                    <td className="px-3 py-2 text-[11px] text-slate-600">{u.stageText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
