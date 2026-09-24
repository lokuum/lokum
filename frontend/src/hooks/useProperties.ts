import { useEffect, useMemo, useRef, useState } from 'react';
import type { FilterState, PropertyOffer, SummaryStats, Voivodeship } from 'shared';
import { VOIVODESHIPS } from 'shared';
import { db } from '../db/index.js';
import { parseUrlFilters, syncUrlWithFilters } from '../utils/urlParams.js';

export function useProperties(favorites: Set<string> = new Set()) {
  // 1. Inicjalizacja stanu filtrów oraz wybranej oferty z parametrów URL (query string)
  const [initialUrlState] = useState(() => parseUrlFilters());
  const [filters, setFilters] = useState<FilterState>(initialUrlState.filters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [allOffers, setAllOffers] = useState<PropertyOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<PropertyOffer | null>(null);

  const initialOfferIdRef = useRef<string | null>(initialUrlState.selectedOfferId);
  const previousTabRef = useRef<FilterState['tab']>(initialUrlState.filters.tab);

  // Pobieranie danych z plików JSON i zapis do Dexie
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. Pobierz podsumowanie
        const summaryRes = await fetch('./data/summary.json');
        if (summaryRes.ok) {
          const sumData: SummaryStats = await summaryRes.json();
          setSummary(sumData);
        }

        // 2. Pobierz partycje dla wszystkich województw
        const voivodeships: Voivodeship[] = VOIVODESHIPS.map((v) => v.id);
        const partitionPromises: Promise<PropertyOffer[]>[] = [];

        for (const v of voivodeships) {
          for (const type of ['houses', 'plots', 'habitats'] as const) {
            partitionPromises.push(
              fetch(`./data/${type}-${v}.json`)
                .then((r) => (r.ok ? r.json() : []))
                .catch(() => [])
            );
          }
        }

        const partitions = await Promise.all(partitionPromises);
        const combined = partitions.flat();

        // 3. Zapisz do Dexie dla szybkiego indeksowania i pracy offline
        if (combined.length > 0) {
          await db.offers.clear();
          await db.offers.bulkPut(combined);
        }

        setAllOffers(combined);
        setError(null);
      } catch (err) {
        console.error('Błąd podczas ładowania danych nieruchomości:', err);
        setError('Nie udało się załadować danych nieruchomości.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filtrowanie i sortowanie po stronie klienta
  const filteredOffers = useMemo(() => {
    return allOffers.filter((item) => {
      // 1. Filtr zakładki: domy vs działki vs siedliska vs tylko okazje vs ulubione
      if (filters.tab === 'houses' && item.propertyType !== 'house') return false;
      if (filters.tab === 'plots' && item.propertyType !== 'plot') return false;
      if (filters.tab === 'habitats' && item.propertyType !== 'habitat') return false;
      if (filters.tab === 'drops' && item.priceChangeAmount >= 0 && item.status !== 'price_drop') return false;
      if (filters.tab === 'favorites' && !favorites.has(item.id)) return false;

      // Filtr ulubionych (jako przełącznik)
      if (filters.onlyFavorites && !favorites.has(item.id)) return false;

      // 2. Filtr województwa
      if (filters.voivodeship !== 'all' && item.voivodeship !== filters.voivodeship) return false;

      // 3. Filtr powiatu
      if (filters.county && item.county?.toLowerCase() !== filters.county.toLowerCase()) return false;

      // 4. Filtr strefy przygranicznej
      if (filters.onlyNearBorder && !item.isNearBorder) return false;

      // 5. Filtr obniżek cen
      if (filters.onlyPriceDrops && item.priceChangeAmount >= 0 && item.status !== 'price_drop') return false;

      // 6. Filtr ofert bezpośrednich
      if (filters.onlyDirectOwner && !item.isDirectOwner) return false;

      // 7. Filtr źródła
      if (filters.source && filters.source !== 'all' && item.source !== filters.source) return false;

      // 8. Zakres cen całkowitych
      if (filters.minPrice != null && item.currentPrice < filters.minPrice) return false;
      if (filters.maxPrice != null && item.currentPrice > filters.maxPrice) return false;

      // 9. Zakres ceny za m²
      if (filters.minPricePerM2 != null && item.currentPricePerM2 < filters.minPricePerM2) return false;
      if (filters.maxPricePerM2 != null && item.currentPricePerM2 > filters.maxPricePerM2) return false;

      // 10. Powierzchnia domu / działki
      if (filters.minArea != null && item.areaM2 < filters.minArea) return false;
      if (filters.maxArea != null && item.areaM2 > filters.maxArea) return false;

      // 11. Wielkość działki przydomowej (dla domów)
      if (filters.minPlotArea != null && (item.plotAreaM2 == null || item.plotAreaM2 < filters.minPlotArea)) return false;
      if (filters.maxPlotArea != null && item.plotAreaM2 != null && item.plotAreaM2 > filters.maxPlotArea) return false;

      // 12. Wyszukiwarka tekstowa
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        const matchesCounty = item.county?.toLowerCase().includes(q) || false;
        const matchesStreet = item.street?.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesCity && !matchesCounty && !matchesStreet) return false;
      }

      return true;
    });
  }, [allOffers, filters, favorites]);

  // Sortowanie
  const sortedOffers = useMemo(() => {
    const list = [...filteredOffers];
    switch (filters.sortBy) {
      case 'price_asc':
        return list.sort((a, b) => a.currentPrice - b.currentPrice);
      case 'price_desc':
        return list.sort((a, b) => b.currentPrice - a.currentPrice);
      case 'price_m2_asc':
        return list.sort((a, b) => a.currentPricePerM2 - b.currentPricePerM2);
      case 'price_m2_desc':
        return list.sort((a, b) => b.currentPricePerM2 - a.currentPricePerM2);
      case 'area_asc':
        return list.sort((a, b) => a.areaM2 - b.areaM2);
      case 'area_desc':
        return list.sort((a, b) => b.areaM2 - a.areaM2);
      case 'plot_area_asc':
        return list.sort((a, b) => (a.plotAreaM2 || 0) - (b.plotAreaM2 || 0));
      case 'plot_area_desc':
        return list.sort((a, b) => (b.plotAreaM2 || 0) - (a.plotAreaM2 || 0));
      case 'drop_percent_desc':
        return list.sort((a, b) => a.priceChangePercent - b.priceChangePercent);
      case 'newest':
      default:
        return list.sort((a, b) => new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime());
    }
  }, [filteredOffers, filters.sortBy]);

  // 2. Otwórz ofertę z parametru offer=id po załadowaniu danych
  useEffect(() => {
    if (initialOfferIdRef.current && allOffers.length > 0 && !selectedOffer) {
      const found = allOffers.find((o) => o.id === initialOfferIdRef.current);
      if (found) {
        setSelectedOffer(found);
      }
      initialOfferIdRef.current = null;
    }
  }, [allOffers, selectedOffer]);

  // 3. Synchronizacja filtrów, sortowania, widoku i wybranej oferty z URL (query string)
  useEffect(() => {
    const isTabChange = filters.tab !== previousTabRef.current;
    previousTabRef.current = filters.tab;

    const timeout = setTimeout(() => {
      syncUrlWithFilters(filters, selectedOffer?.id || null, isTabChange);
    }, 150);

    return () => clearTimeout(timeout);
  }, [filters, selectedOffer]);

  // 4. Obsługa nawigacji przyciskami Wstecz / Dalej w przeglądarce (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const { filters: nextFilters, selectedOfferId: nextOfferId } = parseUrlFilters();
      setFilters(nextFilters);
      previousTabRef.current = nextFilters.tab;

      if (nextOfferId) {
        const found = allOffers.find((o) => o.id === nextOfferId);
        if (found) setSelectedOffer(found);
      } else {
        setSelectedOffer(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allOffers]);

  return {
    offers: sortedOffers,
    totalCount: allOffers.length,
    filteredCount: sortedOffers.length,
    summary,
    loading,
    error,
    filters,
    setFilters,
    selectedOffer,
    setSelectedOffer,
  };
}
