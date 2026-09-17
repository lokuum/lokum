import { useEffect, useMemo, useState } from 'react';
import type { FilterState, PropertyOffer, SummaryStats, Voivodeship } from 'shared';
import { db } from '../db/index.js';

const DEFAULT_FILTERS: FilterState = {
  tab: 'houses',
  voivodeship: 'all',
  sortBy: 'drop_percent_desc',
  viewMode: 'cards',
};

export function useProperties() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [allOffers, setAllOffers] = useState<PropertyOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<PropertyOffer | null>(null);

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
        const voivodeships: Voivodeship[] = ['lubelskie', 'podlaskie', 'podkarpackie'];
        const partitionPromises: Promise<PropertyOffer[]>[] = [];

        for (const v of voivodeships) {
          for (const type of ['houses', 'plots'] as const) {
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
      // 1. Filtr zakładki: domy vs działki vs tylko okazje
      if (filters.tab === 'houses' && item.propertyType !== 'house') return false;
      if (filters.tab === 'plots' && item.propertyType !== 'plot') return false;
      if (filters.tab === 'drops' && item.priceChangeAmount >= 0 && item.status !== 'price_drop') return false;

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
  }, [allOffers, filters]);

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
