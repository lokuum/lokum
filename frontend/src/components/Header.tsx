import React from 'react';
import type { FilterState, SummaryStats } from 'shared';
import { Home, Trees, Flame, Map, LayoutGrid, Heart, Wheat } from 'lucide-react';

interface HeaderProps {
  filters: FilterState;
  onTabChange: (tab: FilterState['tab']) => void;
  onViewModeChange: (mode: FilterState['viewMode']) => void;
  totalOffers: number;
  favoritesCount: number;
  summary: SummaryStats | null;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onTabChange,
  onViewModeChange,
  totalOffers,
  favoritesCount,
  summary,
}) => {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Home className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900">Lokum</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Tracker Nieruchomości
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Śledzenie cen domów, działek i siedlisk • Lubelskie, Podlaskie, Podkarpackie, Wielkopolskie
              </p>
            </div>
          </div>

          {/* Stats summary pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full font-medium border border-neutral-200">
              Baza: <strong>{totalOffers}</strong> ofert
            </span>
            {summary && summary.totalPriceDrops > 0 && (
              <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 border border-rose-200">
                <Flame className="size-3.5" />
                {summary.totalPriceDrops} obniżek cen
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs & View Mode */}
        <div className="flex flex-wrap items-center justify-between border-t border-neutral-100 pt-2 pb-2 gap-2">
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Tabs">
            <button
              onClick={() => onTabChange('houses')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                filters.tab === 'houses'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Home className="size-4" />
              Domy
            </button>
            <button
              onClick={() => onTabChange('plots')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                filters.tab === 'plots'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Trees className="size-4" />
              Działki
            </button>
            <button
              onClick={() => onTabChange('habitats')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                filters.tab === 'habitats'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Wheat className="size-4" />
              Siedliska
            </button>
            <button
              onClick={() => onTabChange('drops')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                filters.tab === 'drops'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:text-rose-900 hover:bg-rose-50'
              }`}
            >
              <Flame className="size-4" />
              Obniżki cen
            </button>
            <button
              onClick={() => onTabChange('favorites')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                filters.tab === 'favorites'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Heart className={`size-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Ulubione</span>
              {favoritesCount > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    filters.tab === 'favorites' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* View mode toggle (Cards vs Map) */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              onClick={() => onViewModeChange('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filters.viewMode === 'cards'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Widok listy kafelków"
            >
              <LayoutGrid className="size-3.5" />
              Lista
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filters.viewMode === 'map'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Widok interaktywnej mapy"
            >
              <Map className="size-3.5" />
              Mapa
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
