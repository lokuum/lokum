import React, { useState } from 'react';
import { Header } from './components/Header.js';
import { FilterBar } from './components/FilterBar.js';
import { PropertyCard } from './components/PropertyCard.js';
import { PropertyMap } from './components/PropertyMap.js';
import { PriceHistoryModal } from './components/PriceHistoryModal.js';
import { StatsBar } from './components/StatsBar.js';
import { useProperties } from './hooks/useProperties.js';
import { useFavorites } from './hooks/useFavorites.js';
import { Loader2, SearchX, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const { favorites, toggleFavorite, isFavorite, favoritesCount } = useFavorites();

  const {
    offers,
    totalCount,
    filteredCount,
    summary,
    loading,
    error,
    filters,
    setFilters,
    selectedOffer,
    setSelectedOffer,
  } = useProperties(favorites);

  const [pageLimit, setPageLimit] = useState(24);

  const displayedOffers = offers.slice(0, pageLimit);
  const hasMore = offers.length > pageLimit;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-900">
      {/* Top statistics ticker */}
      <StatsBar summary={summary} />

      {/* Main sticky navigation header */}
      <Header
        filters={filters}
        onTabChange={(tab) => {
          setFilters({ ...filters, tab });
          setPageLimit(24);
        }}
        onViewModeChange={(viewMode) => setFilters({ ...filters, viewMode })}
        totalOffers={totalCount}
        favoritesCount={favoritesCount}
        summary={summary}
      />

      {/* Filter and search bar */}
      <FilterBar
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setPageLimit(24);
        }}
        filteredCount={filteredCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500 space-y-3">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Ładowanie bazy nieruchomości i wskaźników cenowych...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm max-w-md mx-auto text-center">
            {error}
          </div>
        ) : filters.viewMode === 'map' ? (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
            <PropertyMap
              offers={offers}
              voivodeship={filters.voivodeship}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onOpenHistory={(offer) => setSelectedOffer(offer)}
            />
          </div>
        ) : (
          <div>
            {displayedOffers.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200 max-w-md mx-auto space-y-3">
                {filters.tab === 'favorites' ? (
                  <>
                    <Heart className="size-10 text-rose-400 mx-auto" />
                    <h3 className="text-base font-bold text-neutral-800">Brak ulubionych ofert</h3>
                    <p className="text-xs text-neutral-500">
                      Kliknij ikonę serduszka (❤️) w prawym górnym rogu karty dowolnego domu lub działki, aby zachować ją na tej liście. Dane są zapamiętywane w Twojej przeglądarce.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          tab: 'houses',
                        })
                      }
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      Przejdź do domów
                    </button>
                  </>
                ) : (
                  <>
                    <SearchX className="size-10 text-neutral-400 mx-auto" />
                    <h3 className="text-base font-bold text-neutral-800">Brak ofert spełniających kryteria</h3>
                    <p className="text-xs text-neutral-500">
                      Spróbuj rozszerzyć zakres cenowy, wyczyścić wyszukiwanie lub wybrać inne województwo.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setFilters({
                          tab: filters.tab,
                          voivodeship: 'all',
                          sortBy: 'drop_percent_desc',
                          viewMode: 'cards',
                        })
                      }
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      Zresetuj filtry
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayedOffers.map((offer) => (
                    <PropertyCard
                      key={offer.id}
                      offer={offer}
                      isFavorite={isFavorite(offer.id)}
                      onToggleFavorite={toggleFavorite}
                      onOpenHistory={(off) => setSelectedOffer(off)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center pt-4 pb-8">
                    <button
                      type="button"
                      onClick={() => setPageLimit((prev) => prev + 24)}
                      className="px-6 py-2.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 font-semibold text-sm rounded-xl shadow-xs hover:bg-neutral-50 transition-all"
                    >
                      Pokaż więcej ofert ({offers.length - pageLimit} pozostało)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal historii zmian cen */}
      <PriceHistoryModal
        offer={selectedOffer}
        isFavorite={selectedOffer ? isFavorite(selectedOffer.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedOffer(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-neutral-700">Lokum — Niezależny Monitor Cen Nieruchomości</p>
          <p>Dane gromadzone z serwisów Otodom oraz Adresowo.pl dla wschodnich województw Polski.</p>
        </div>
      </footer>
    </div>
  );
};
