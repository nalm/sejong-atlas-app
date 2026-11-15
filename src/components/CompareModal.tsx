import React from 'react';
import { GitCompare, Plus, X } from 'lucide-react';
import { COMPARE_PRESETS, MACRO_ZONES } from '../data/sejongConfig';
import { SEJONG_UNITS, UNIT_BY_ID } from '../data/atlasData';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareIds: string[];
  onSetCompareIds: (ids: string[]) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareIds,
  onSetCompareIds,
}) => {
  if (!isOpen) return null;

  const selectedUnits = compareIds.map((id) => UNIT_BY_ID[id]).filter(Boolean);

  const toggleId = (id: string) => {
    if (compareIds.includes(id)) {
      onSetCompareIds(compareIds.filter((x) => x !== id));
    } else if (compareIds.length < 3) {
      onSetCompareIds([...compareIds, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-extrabold sm:text-lg">생활권 · 동 · 마을 1:1 비교</h2>
              <p className="text-xs text-slate-300">최대 3개 구역을 선택해 인구·단지수·유래·도시기능을 나란히 비교합니다.</p>
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

        <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto p-5">
          {/* Presets */}
          <div>
            <div className="mb-2 text-xs font-bold text-slate-500">추천 비교 프리셋</div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {COMPARE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSetCompareIds(p.unitIds)}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50/50"
                >
                  <div className="text-xs font-extrabold text-slate-900">{p.title}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{p.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>비교 구역 선택 ({compareIds.length}/3)</span>
              {compareIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => onSetCompareIds([])}
                  className="text-rose-600 hover:underline"
                >
                  선택 초기화
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SEJONG_UNITS.map((u) => {
                const active = compareIds.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleId(u.id)}
                    disabled={!active && compareIds.length >= 3}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 disabled:opacity-40'
                    }`}
                  >
                    {u.threadNo}. {u.legalDong}({u.villageName})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedUnits.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12 text-slate-400">
              <Plus className="h-8 w-8" />
              <p className="mt-2 text-xs font-medium">위에서 프리셋이나 구역을 선택해 주세요.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="w-32 px-4 py-3 font-bold">비교 항목</th>
                    {selectedUnits.map((u) => (
                      <th key={u.id} className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            #{u.threadNo}
                          </span>
                          <span className="text-sm font-extrabold">{u.legalDong}</span>
                          <span className="text-xs font-bold text-indigo-700">({u.villageName})</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600">생활권 / 권역</td>
                    {selectedUnits.map((u) => (
                      <td key={u.id} className="px-4 py-2.5 font-semibold">
                        {u.zoneCode}생활권 · {MACRO_ZONES[u.macroZoneId].shortName}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600">관할 행정동</td>
                    {selectedUnits.map((u) => (
                      <td key={u.id} className="px-4 py-2.5">
                        {u.adminDong} {u.isAdminCenter ? '(단독/중심)' : '(통합 관할)'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600">인구 / 세대수</td>
                    {selectedUnits.map((u) => (
                      <td key={u.id} className="px-4 py-2.5 font-bold text-slate-900">
                        {u.populationText} / {u.householdsText}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600">아파트 단지수</td>
                    {selectedUnits.map((u) => (
                      <td key={u.id} className="px-4 py-2.5 font-semibold text-amber-700">
                        {u.complexCountText}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600">면적 / 단계</td>
                    {selectedUnits.map((u) => (
                      <td key={u.id} className="px-4 py-2.5">
                        {u.areaKm2.toFixed(2)} km² · {u.stageText}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600">동 이름의 뜻</td>
                    {selectedUnits.map((u) => (
                      <td key={u.id} className="px-4 py-2.5 leading-relaxed text-slate-600">
                        {u.dongMeaning}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600">마을 이름의 뜻</td>
                    {selectedUnits.map((u) => (
                      <td key={u.id} className="px-4 py-2.5 leading-relaxed text-slate-600">
                        {u.villageMeaning}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600">핵심 시설</td>
                    {selectedUnits.map((u) => (
                      <td key={u.id} className="px-4 py-2.5 text-slate-700">
                        {u.landmarks.slice(0, 3).join(', ')}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
