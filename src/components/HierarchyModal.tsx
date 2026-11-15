import React, { useState } from 'react';
import { BookOpen, GitCompare, Layers, MapPin, X } from 'lucide-react';
import { NAME_CHANGE_HISTORY, SEJONG_EUP_MYEON } from '../data/sejongConfig';
import { SEJONG_UNITS } from '../data/atlasData';

interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit: (id: string) => void;
}

export const HierarchyModal: React.FC<HierarchyModalProps> = ({
  isOpen,
  onClose,
  onSelectUnit,
}) => {
  const [tab, setTab] = useState<'matrix' | 'system' | 'eupmyeon'>('matrix');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-extrabold sm:text-lg">
              세종시 행정구역 · 생활권 · 마을이름 4중 체계 완벽 해설
            </h2>
            <p className="mt-0.5 text-xs text-slate-300">
              왜 세종시에는 &apos;구(區)&apos;가 없고 동이름과 마을이름이 따로 있을까요?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 bg-slate-50 px-5 pt-3">
          <button
            type="button"
            onClick={() => setTab('matrix')}
            className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2 text-xs font-bold transition ${
              tab === 'matrix'
                ? 'border border-b-0 border-slate-200 bg-white text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>1~23번 4중 매칭표</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('system')}
            className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2 text-xs font-bold transition ${
              tab === 'system'
                ? 'border border-b-0 border-slate-200 bg-white text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>명칭 변경 이력 & 단층제</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('eupmyeon')}
            className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2 text-xs font-bold transition ${
              tab === 'eupmyeon'
                ? 'border border-b-0 border-slate-200 bg-white text-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>외곽 1읍 9면 일람</span>
          </button>
        </div>

        {/* Body */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-5">
          {tab === 'matrix' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs leading-relaxed text-indigo-950">
                <strong>읽는 법: </strong>
                세종시 주소지나 대화에서는 <strong>① 생활권 번호(1-1)</strong>, <strong>② 법정동(고운동)</strong>,{' '}
                <strong>③ 마을이름(가락마을)</strong>, <strong>④ 관할 행정동(주민센터)</strong>이 함께 쓰입니다.
                행을 클릭하면 지도와 상세 패널에서 바로 해당 구역으로 이동합니다.
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-700">
                    <tr>
                      <th className="px-3 py-2.5">번호</th>
                      <th className="px-3 py-2.5">생활권</th>
                      <th className="px-3 py-2.5">법정동</th>
                      <th className="px-3 py-2.5">관할 행정동</th>
                      <th className="px-3 py-2.5">마을이름</th>
                      <th className="px-3 py-2.5">단지수</th>
                      <th className="px-3 py-2.5">도시기능 / 특징</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SEJONG_UNITS.map((u) => (
                      <tr
                        key={u.id}
                        onClick={() => {
                          onSelectUnit(u.id);
                          onClose();
                        }}
                        className="cursor-pointer transition hover:bg-indigo-50/60"
                      >
                        <td className="px-3 py-2 font-extrabold text-slate-900">#{u.threadNo}</td>
                        <td className="px-3 py-2 font-bold text-indigo-700">{u.zoneCode}</td>
                        <td className="px-3 py-2 font-bold text-slate-900">
                          {u.legalDong}
                          {u.formerLegalName && (
                            <span className="ml-1 text-[10px] font-normal text-amber-700">
                              ({u.formerLegalName})
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                              u.isAdminCenter
                                ? 'bg-slate-100 text-slate-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {u.adminDong}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-bold text-amber-700">
                          {u.villageName}
                          {u.formerVillageName && (
                            <span className="block text-[10px] font-normal text-slate-500">
                              {u.formerVillageName}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-600">{u.complexCountText}</td>
                        <td className="px-3 py-2 text-slate-600">{u.urbanFunction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'system' && (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700">
                    <BookOpen className="h-4 w-4" />
                    <span>1. 구(區)가 없는 단층제 광역지자체</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    서울·부산 등 일반 광역시는 아래에 시·군·구를 두지만, 세종특별자치시는 기초자치단체가 없는{' '}
                    <strong>단층제</strong>입니다. 따라서 시청 바로 아래에 1읍 9면 15행정동이 직속됩니다.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                    <BookOpen className="h-4 w-4" />
                    <span>2. &apos;OO마을 N단지&apos; 명명 규칙</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    세종시 아파트는 건설사 브랜드 대신 생활권별 순우리말·전래지명인{' '}
                    <strong>&apos;마을이름 + 단지 번호&apos;</strong>(예: 가락마을 12단지)를 공식 단지 명칭으로
                    사용해 지역 정체성을 통일했습니다.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700">
                    <BookOpen className="h-4 w-4" />
                    <span>3. 법정동(23개) vs 행정동(15개)</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    인구가 적은 개발 초기 구역이나 비주거 구역은 인접 행정동이 통합 관할합니다. 예:
                    <strong> 해밀동</strong>(해밀·산울·누리·한별), <strong>집현동</strong>(집현·합강·다솜·용호),{' '}
                    <strong>나성동</strong>(나성·세종), <strong>한솔동</strong>(한솔·가람).
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2.5 text-sm font-extrabold text-slate-900">
                  주요 명칭 변경 & 분동 타임라인
                </h3>
                <div className="space-y-2">
                  {NAME_CHANGE_HISTORY.map((item) => (
                    <div
                      key={item.zoneCode + item.after}
                      className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                            {item.zoneCode}
                          </span>
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            {item.category}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">{item.year}</span>
                        </div>
                        <div className="mt-1.5 text-xs font-bold text-slate-900">
                          <span className="text-slate-500 line-through">{item.before}</span> →{' '}
                          <span className="text-indigo-700">{item.after}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'eupmyeon' && (
            <div className="grid gap-3 sm:grid-cols-2">
              {SEJONG_EUP_MYEON.map((em) => (
                <div key={em.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{em.name}</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {em.populationText} · {em.areaKm2} km²
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-indigo-700">{em.direction}</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{em.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {em.keySpots.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
