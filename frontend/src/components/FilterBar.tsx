import React, { useState } from 'react';
import type { FilterState, Voivodeship } from 'shared';
import { VOIVODESHIPS } from 'shared';
import { Search, SlidersHorizontal, RotateCcw, ShieldAlert, Tag, UserCheck, Heart } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, filteredCount }) => {
  const hasActiveAdvanced = Boolean(
    (filters.minPrice != null && filters.minPrice > 0) ||
    (filters.maxPrice != null && filters.maxPrice > 0) ||
    (filters.minPricePerM2 != null && filters.minPricePerM2 > 0) ||
    (filters.maxPricePerM2 != null && filters.maxPricePerM2 > 0) ||
    (filters.minArea != null && filters.minArea > 0) ||
    (filters.maxArea != null && filters.maxArea > 0) ||
    (filters.minPlotArea != null && filters.minPlotArea > 0) ||
    (filters.maxPlotArea != null && filters.maxPlotArea > 0) ||
    (filters.source && filters.source !== 'all')
  );

  const [showAdvanced, setShowAdvanced] = useState(hasActiveAdvanced);

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const handleReset = () => {
    onChange({
      tab: filters.tab,
      voivodeship: 'all',
      sortBy: 'drop_percent_desc',
      viewMode: filters.viewMode,
    });
    setShowAdvanced(false);
  };

  return (
    <div className="bg-white border-b border-neutral-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Main top row: Search, Voivodeship, Sort, Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Szukaj (miasto, powiat, ulica)..."
              value={filters.searchQuery || ''}
              onChange={(e) => update({ searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-neutral-50/50"
            />
          </div>

          {/* Voivodeship Select */}
          <select
            value={filters.voivodeship}
            onChange={(e) => update({ voivodeship: e.target.value as Voivodeship | 'all' })}
            className="text-sm rounded-lg border border-neutral-300 py-1.5 px-3 bg-white font-medium text-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Wszystkie województwa</option>
            {VOIVODESHIPS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Sort By Select */}
          <select
            value={filters.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="text-sm rounded-lg border border-neutral-300 py-1.5 px-3 bg-white text-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="drop_percent_desc">Największa obniżka (%)</option>
            <option value="price_asc">Cena: najniższa</option>
            <option value="price_desc">Cena: najwyższa</option>
            <option value="price_m2_asc">Cena za m²: najniższa</option>
            <option value="price_m2_desc">Cena za m²: najwyższa</option>
            <option value="area_desc">Powierzchnia: największa</option>
            {filters.tab === 'houses' && <option value="plot_area_desc">Działka przy domu: największa</option>}
            <option value="newest">Najnowsze ogłoszenia</option>
          </select>

          {/* Toggle Advanced Filters */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-lg border transition-colors ${
              showAdvanced
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Filtry</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            title="Resetuj wszystkie filtry"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {/* Quick boolean toggles row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Border county filter */}
          <button
            type="button"
            onClick={() => update({ onlyNearBorder: !filters.onlyNearBorder })}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              filters.onlyNearBorder
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/80'
            }`}
          >
            <ShieldAlert className="size-3.5" />
            Tylko pas przygraniczny (UA/BY)
          </button>

          {/* Price drops filter */}
          <button
            type="button"
            onClick={() => update({ onlyPriceDrops: !filters.onlyPriceDrops })}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              filters.onlyPriceDrops
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/80'
            }`}
          >
            <Tag className="size-3.5" />
            Tylko z obniżoną ceną
          </button>

          {/* Direct owner filter */}
          <button
            type="button"
            onClick={() => update({ onlyDirectOwner: !filters.onlyDirectOwner })}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              filters.onlyDirectOwner
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/80'
            }`}
          >
            <UserCheck className="size-3.5" />
            Bez pośredników (prywatne)
          </button>

          {/* Favorites filter toggle */}
          <button
            type="button"
            onClick={() => update({ onlyFavorites: !filters.onlyFavorites })}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              filters.onlyFavorites
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/80'
            }`}
          >
            <Heart className={`size-3.5 ${filters.onlyFavorites ? 'fill-current' : ''}`} />
            Tylko ulubione
          </button>

          {/* Counter text */}
          <div className="ml-auto text-xs text-neutral-500 font-medium">
            Znaleziono: <strong className="text-neutral-900 font-bold">{filteredCount}</strong> ofert
          </div>
        </div>

        {/* Advanced filter panel (collapsible) */}
        {showAdvanced && (
          <div className="pt-3 pb-1 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Price range */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Cena całkowita (zł)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Od"
                  value={filters.minPrice || ''}
                  onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                />
                <span className="text-neutral-400">—</span>
                <input
                  type="number"
                  placeholder="Do"
                  value={filters.maxPrice || ''}
                  onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                />
              </div>
            </div>

            {/* Price per m2 range */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Cena za m² (zł/m²)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Od"
                  value={filters.minPricePerM2 || ''}
                  onChange={(e) => update({ minPricePerM2: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                />
                <span className="text-neutral-400">—</span>
                <input
                  type="number"
                  placeholder="Do"
                  value={filters.maxPricePerM2 || ''}
                  onChange={(e) => update({ maxPricePerM2: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                />
              </div>
            </div>

            {/* Area range */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-700">
                {filters.tab === 'houses' ? 'Powierzchnia domu (m²)' : 'Powierzchnia działki (m²)'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Od"
                  value={filters.minArea || ''}
                  onChange={(e) => update({ minArea: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                />
                <span className="text-neutral-400">—</span>
                <input
                  type="number"
                  placeholder="Do"
                  value={filters.maxArea || ''}
                  onChange={(e) => update({ maxArea: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                />
              </div>
            </div>

            {/* Plot Area for houses */}
            {filters.tab === 'houses' && (
              <div className="space-y-1">
                <label className="font-medium text-neutral-700">Powierzchnia działki przydomowej (m²)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Od"
                    value={filters.minPlotArea || ''}
                    onChange={(e) => update({ minPlotArea: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                  />
                  <span className="text-neutral-400">—</span>
                  <input
                    type="number"
                    placeholder="Do"
                    value={filters.maxPlotArea || ''}
                    onChange={(e) => update({ maxPlotArea: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                  />
                </div>
              </div>
            )}

            {/* Source filter */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Źródło ogłoszenia</label>
              <select
                value={filters.source || 'all'}
                onChange={(e) => update({ source: e.target.value as FilterState['source'] })}
                className="w-full px-2 py-1 border border-neutral-300 rounded-md bg-white text-xs text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">Wszystkie serwisy</option>
                <option value="otodom">Tylko Otodom</option>
                <option value="adresowo">Tylko Adresowo.pl</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
