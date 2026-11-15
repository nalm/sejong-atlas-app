import { useMemo, useState } from 'react';
import { BarChart3, GitCompare, Layers, MapPin, Search, X } from 'lucide-react';
import { SejongMap } from './components/SejongMap';
import { UnitDetail } from './components/UnitDetail';
import { OverviewPanel } from './components/OverviewPanel';
import { HierarchyModal } from './components/HierarchyModal';
import { CompareModal } from './components/CompareModal';
import { StatsModal } from './components/StatsModal';
import { LENS_DEFINITIONS, MACRO_ZONE_ORDER, MACRO_ZONES } from './data/sejongConfig';
import { SEJONG_UNITS, UNIT_BY_ID } from './data/atlasData';
import { AtlasLens, MacroZoneId, MapLabelMode } from './types/atlas';

export function App() {
  const [selectedId, setSelectedId] = useState<string>('goun');
  const [activeZoneFilter, setActiveZoneFilter] = useState<MacroZoneId | 'all'>('all');
  const [activeLens, setActiveLens] = useState<AtlasLens>('zone');
  const [labelMode, setLabelMode] = useState<MapLabelMode>('number_village');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const [hierarchyOpen, setHierarchyOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>(['hansol', 'goun']);

  const selectedUnit = UNIT_BY_ID[selectedId] ?? SEJONG_UNITS[0];

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return SEJONG_UNITS.filter(
      (u) =>
        u.legalDong.toLowerCase().includes(q) ||
        u.villageName.toLowerCase().includes(q) ||
        u.zoneCode.toLowerCase().includes(q) ||
        u.adminDong.toLowerCase().includes(q) ||
        String(u.threadNo) === q ||
        u.landmarks.some((l) => l.toLowerCase().includes(q)),
    ).slice(0, 8);
  }, [searchQuery]);

  const handleSelectUnit = (id: string) => {
    setSelectedId(id);
    setSearchOpen(false);
    setSearchQuery('');
    const el = document.getElementById('detail-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleCompareFromDetail = (id: string) => {
    if (!compareIds.includes(id)) {
      setCompareIds([id, ...compareIds].slice(0, 3));
    }
    setCompareOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-900 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-inner">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight sm:text-lg">
                  세종시 생활권 · 동 · 마을 아틀라스
                </h1>
                <span className="hidden rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-200 border border-indigo-400/30 sm:inline-block">
                  1~6 · S생활권 23구역
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                생활권 코드 · 법정동 · 행정동 · 마을이름 유래와 인구·단지 통계 탐험기
              </p>
            </div>
          </div>

          {/* Search & Modal Triggers */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-initial">
            <div className="relative w-full max-w-[230px] sm:w-60">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="동, 마을, 1-1, 청사 검색..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-1.5 pl-8 pr-7 text-xs text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {searchOpen && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl">
                  {searchResults.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectUnit(u.id)}
                      className="flex w-full items-center justify-between border-b border-slate-100 px-3 py-2 text-left text-xs last:border-none hover:bg-indigo-50"
                    >
                      <div>
                        <span className="font-extrabold text-slate-900">
                          {u.threadNo}. {u.legalDong}
                        </span>
                        <span className="ml-1.5 font-semibold text-indigo-600">({u.villageName})</span>
                      </div>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {u.zoneCode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setHierarchyOpen(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-100 transition hover:bg-slate-700"
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">4중 체계 해설</span>
            </button>
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-100 transition hover:bg-slate-700"
            >
              <GitCompare className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden md:inline">1:1 비교</span>
            </button>
            <button
              type="button"
              onClick={() => setStatsOpen(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-100 transition hover:bg-slate-700"
            >
              <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline">전체 통계</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-5">
        {/* 2-Tier Filter & Thematic Lens Bar */}
        <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          {/* Row 1: Macro-Zone Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-bold text-slate-400">생활권 필터</span>
            <button
              type="button"
              onClick={() => setActiveZoneFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                activeZoneFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              전체 23구역
            </button>
            {MACRO_ZONE_ORDER.map((zId) => {
              const mz = MACRO_ZONES[zId];
              const active = activeZoneFilter === zId;
              return (
                <button
                  key={zId}
                  type="button"
                  onClick={() => setActiveZoneFilter(active ? 'all' : zId)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    active ? mz.badgeClass : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: active ? '#ffffff' : mz.color }}
                  />
                  <span>{mz.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Row 2: 5 Thematic Lenses */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5">
            <span className="mr-1 text-[11px] font-bold text-slate-400">테마 렌즈</span>
            {LENS_DEFINITIONS.map((lens) => {
              const active = activeLens === lens.id;
              return (
                <button
                  key={lens.id}
                  type="button"
                  onClick={() => setActiveLens(lens.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lens.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Full-Width Interactive Map */}
        <SejongMap
          selectedId={selectedId}
          onSelect={handleSelectUnit}
          activeZoneFilter={activeZoneFilter}
          activeLens={activeLens}
          labelMode={labelMode}
          onChangeLabelMode={setLabelMode}
        />

        {/* Quick 1~23 Selector Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-700">
              1~23번 구역 빠른 선택 (스레드 포스트 순서)
            </span>
            <span className="text-[11px] text-slate-400">클릭 시 아래 상세 정보로 이동</span>
          </div>
          <div className="custom-scrollbar flex gap-1.5 overflow-x-auto pb-1.5">
            {SEJONG_UNITS.map((u) => {
              const active = selectedId === u.id;
              const mz = MACRO_ZONES[u.macroZoneId];
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectUnit(u.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs transition ${
                    active
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: mz.color }}
                  />
                  <span className="font-extrabold">{u.threadNo}.</span>
                  <span className="font-bold">{u.legalDong}</span>
                  <span className={`text-[10px] ${active ? 'text-amber-300' : 'text-slate-500'}`}>
                    {u.villageName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Unit Detail Dashboard */}
        <UnitDetail unit={selectedUnit} onCompareClick={handleCompareFromDetail} />

        {/* Overview & Outer Eup/Myeon Panel */}
        <OverviewPanel
          activeZoneFilter={activeZoneFilter}
          onSelectZoneFilter={setActiveZoneFilter}
          onSelectUnit={handleSelectUnit}
          onOpenHierarchy={() => setHierarchyOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl space-y-2 px-4">
          <p className="font-semibold text-slate-700">
            세종시 생활권 · 법정동 · 마을이름 아틀라스 (Sejong Interactive Atlas)
          </p>
          <p>
            원문 기반:{' '}
            <a
              href="https://www.threads.com/@nalm/post/DRJxVGLCQ81"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-indigo-600 hover:underline"
            >
              @nalm 스레드 포스트
            </a>{' '}
            · 지명 유래 출처: 세종특별자치시청(sejong.go.kr) · 인구/행정 통계: 행정안전부 주민등록통계(2026)
          </p>
        </div>
      </footer>

      {/* 3 Modals */}
      <HierarchyModal
        isOpen={hierarchyOpen}
        onClose={() => setHierarchyOpen(false)}
        onSelectUnit={handleSelectUnit}
      />
      <CompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        compareIds={compareIds}
        onSetCompareIds={setCompareIds}
      />
      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        onSelectUnit={handleSelectUnit}
      />
    </div>
  );
}

export default App;
