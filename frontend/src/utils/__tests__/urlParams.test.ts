import { describe, expect, it } from 'vitest';
import type { FilterState } from 'shared';
import {
  DEFAULT_FILTERS,
  buildSearchParams,
  parseUrlFilters,
} from '../urlParams.js';

describe('urlParams utility', () => {
  it('zwraca domyślne filtry gdy URL jest pusty', () => {
    const { filters, selectedOfferId } = parseUrlFilters('');
    expect(filters).toEqual(DEFAULT_FILTERS);
    expect(selectedOfferId).toBeNull();
  });

  it('poprawnie parsuje parametry zakładki, widoku i sortowania', () => {
    const search = '?tab=plots&view=map&sort=price_asc&voivodeship=lubelskie';
    const { filters } = parseUrlFilters(search);

    expect(filters.tab).toBe('plots');
    expect(filters.viewMode).toBe('map');
    expect(filters.sortBy).toBe('price_asc');
    expect(filters.voivodeship).toBe('lubelskie');
  });

  it('poprawnie parsuje filtry binarne (border, drops, direct, fav)', () => {
    const search = '?border=1&drops=true&direct=1&fav=1';
    const { filters } = parseUrlFilters(search);

    expect(filters.onlyNearBorder).toBe(true);
    expect(filters.onlyPriceDrops).toBe(true);
    expect(filters.onlyDirectOwner).toBe(true);
    expect(filters.onlyFavorites).toBe(true);
  });

  it('poprawnie parsuje zakresy liczbowe i frazę wyszukiwania', () => {
    const search = '?q=Dorohusk&minPrice=30000&maxPrice=150000&minM2=3&maxM2=50&minArea=1000&maxArea=20000';
    const { filters } = parseUrlFilters(search);

    expect(filters.searchQuery).toBe('Dorohusk');
    expect(filters.minPrice).toBe(30000);
    expect(filters.maxPrice).toBe(150000);
    expect(filters.minPricePerM2).toBe(3);
    expect(filters.maxPricePerM2).toBe(50);
    expect(filters.minArea).toBe(1000);
    expect(filters.maxArea).toBe(20000);
  });

  it('poprawnie parsuje ID otwartej oferty', () => {
    const search = '?offer=adresowo-4160752';
    const { selectedOfferId } = parseUrlFilters(search);
    expect(selectedOfferId).toBe('adresowo-4160752');
  });

  it('buduje zwięzły query string ignorując wartości domyślne', () => {
    const emptyParams = buildSearchParams(DEFAULT_FILTERS);
    expect(emptyParams.toString()).toBe('');

    const customFilters: FilterState = {
      tab: 'plots',
      voivodeship: 'lubelskie',
      sortBy: 'price_asc',
      viewMode: 'map',
      onlyNearBorder: true,
      minPrice: 40000,
      searchQuery: 'Dorohusk',
    };

    const params = buildSearchParams(customFilters, 'adresowo-4160752');
    expect(params.get('tab')).toBe('plots');
    expect(params.get('voivodeship')).toBe('lubelskie');
    expect(params.get('view')).toBe('map');
    expect(params.get('sort')).toBe('price_asc');
    expect(params.get('border')).toBe('1');
    expect(params.get('minPrice')).toBe('40000');
    expect(params.get('q')).toBe('Dorohusk');
    expect(params.get('offer')).toBe('adresowo-4160752');
  });

  it('round-trip: buildSearchParams -> parseUrlFilters odtwarza ten sam stan', () => {
    const originalFilters: FilterState = {
      tab: 'favorites',
      voivodeship: 'podlaskie',
      sortBy: 'price_m2_asc',
      viewMode: 'cards',
      searchQuery: 'Białystok',
      onlyNearBorder: true,
      onlyDirectOwner: true,
      minPrice: 100000,
      maxPrice: 600000,
      minPricePerM2: 200,
      maxPricePerM2: 2500,
      minArea: 80,
      maxArea: 300,
      minPlotArea: 500,
      maxPlotArea: 3000,
      source: 'adresowo',
    };

    const params = buildSearchParams(originalFilters, 'otodom-12345');
    const { filters: restoredFilters, selectedOfferId: restoredOfferId } = parseUrlFilters(`?${params.toString()}`);

    expect(restoredFilters).toEqual(originalFilters);
    expect(restoredOfferId).toBe('otodom-12345');
  });
});
