import type { FilterState, Voivodeship } from 'shared';

export interface UrlSyncState {
  filters: FilterState;
  selectedOfferId: string | null;
}

export const DEFAULT_FILTERS: FilterState = {
  tab: 'houses',
  voivodeship: 'all',
  sortBy: 'drop_percent_desc',
  viewMode: 'cards',
};

const VALID_TABS: FilterState['tab'][] = ['houses', 'plots', 'drops', 'favorites'];
const VALID_VOIVODESHIPS: (Voivodeship | 'all')[] = ['all', 'lubelskie', 'podlaskie', 'podkarpackie'];
const VALID_VIEWS: FilterState['viewMode'][] = ['cards', 'map'];
const VALID_SORTS: FilterState['sortBy'][] = [
  'drop_percent_desc',
  'price_asc',
  'price_desc',
  'price_m2_asc',
  'price_m2_desc',
  'area_asc',
  'area_desc',
  'plot_area_asc',
  'plot_area_desc',
  'newest',
];
const VALID_SOURCES: ('all' | 'otodom' | 'adresowo')[] = ['all', 'otodom', 'adresowo'];

function parsePositiveNumber(val: string | null): number | undefined {
  if (!val) return undefined;
  const num = Number(val);
  return isNaN(num) || num < 0 ? undefined : num;
}

/**
 * Odczytuje parametry z query stringa URL i przekształca je w obiekt FilterState oraz ID wybranej oferty.
 */
export function parseUrlFilters(search?: string): UrlSyncState {
  let searchStr = search;
  if (searchStr === undefined && typeof window !== 'undefined') {
    searchStr = window.location.search;
  }
  const params = new URLSearchParams(searchStr || '');
  const filters: FilterState = { ...DEFAULT_FILTERS };

  // Tab
  const tab = params.get('tab') as FilterState['tab'] | null;
  if (tab && VALID_TABS.includes(tab)) {
    filters.tab = tab;
  }

  // View mode
  const view = params.get('view') as FilterState['viewMode'] | null;
  if (view && VALID_VIEWS.includes(view)) {
    filters.viewMode = view;
  }

  // Voivodeship
  const voivodeship = params.get('voivodeship') as (Voivodeship | 'all') | null;
  if (voivodeship && VALID_VOIVODESHIPS.includes(voivodeship)) {
    filters.voivodeship = voivodeship;
  }

  // County
  const county = params.get('county');
  if (county) {
    filters.county = county.trim();
  }

  // Sort
  const sort = params.get('sort') as FilterState['sortBy'] | null;
  if (sort && VALID_SORTS.includes(sort)) {
    filters.sortBy = sort;
  }

  // Search query (q)
  const q = params.get('q');
  if (q) {
    filters.searchQuery = q.trim();
  }

  // Booleans
  const border = params.get('border');
  if (border === '1' || border === 'true') {
    filters.onlyNearBorder = true;
  }

  const drops = params.get('drops');
  if (drops === '1' || drops === 'true') {
    filters.onlyPriceDrops = true;
  }

  const direct = params.get('direct');
  if (direct === '1' || direct === 'true') {
    filters.onlyDirectOwner = true;
  }

  const fav = params.get('fav');
  if (fav === '1' || fav === 'true') {
    filters.onlyFavorites = true;
  }

  // Source
  const source = params.get('source') as ('all' | 'otodom' | 'adresowo') | null;
  if (source && VALID_SOURCES.includes(source)) {
    filters.source = source;
  }

  // Numeric bounds
  filters.minPrice = parsePositiveNumber(params.get('minPrice'));
  filters.maxPrice = parsePositiveNumber(params.get('maxPrice'));
  filters.minPricePerM2 = parsePositiveNumber(params.get('minM2'));
  filters.maxPricePerM2 = parsePositiveNumber(params.get('maxM2'));
  filters.minArea = parsePositiveNumber(params.get('minArea'));
  filters.maxArea = parsePositiveNumber(params.get('maxArea'));
  filters.minPlotArea = parsePositiveNumber(params.get('minPlot'));
  filters.maxPlotArea = parsePositiveNumber(params.get('maxPlot'));

  // Selected Offer ID
  const selectedOfferId = params.get('offer') ? params.get('offer')!.trim() : null;

  return { filters, selectedOfferId };
}

/**
 * Konwertuje obiekt FilterState na URLSearchParams.
 * Pomija wartości domyślne, aby adres URL był estetyczny i krótki.
 */
export function buildSearchParams(filters: FilterState, selectedOfferId?: string | null): URLSearchParams {
  const params = new URLSearchParams();

  // Tab (domyślnie 'houses')
  if (filters.tab && filters.tab !== DEFAULT_FILTERS.tab) {
    params.set('tab', filters.tab);
  }

  // View mode (domyślnie 'cards')
  if (filters.viewMode && filters.viewMode !== DEFAULT_FILTERS.viewMode) {
    params.set('view', filters.viewMode);
  }

  // Voivodeship (domyślnie 'all')
  if (filters.voivodeship && filters.voivodeship !== 'all') {
    params.set('voivodeship', filters.voivodeship);
  }

  // County
  if (filters.county && filters.county.trim()) {
    params.set('county', filters.county.trim());
  }

  // Sort (domyślnie 'drop_percent_desc')
  if (filters.sortBy && filters.sortBy !== DEFAULT_FILTERS.sortBy) {
    params.set('sort', filters.sortBy);
  }

  // Search query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    params.set('q', filters.searchQuery.trim());
  }

  // Booleans
  if (filters.onlyNearBorder) {
    params.set('border', '1');
  }
  if (filters.onlyPriceDrops) {
    params.set('drops', '1');
  }
  if (filters.onlyDirectOwner) {
    params.set('direct', '1');
  }
  if (filters.onlyFavorites) {
    params.set('fav', '1');
  }

  // Source
  if (filters.source && filters.source !== 'all') {
    params.set('source', filters.source);
  }

  // Numeric bounds
  if (filters.minPrice != null && filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice != null && filters.maxPrice > 0) params.set('maxPrice', String(filters.maxPrice));
  if (filters.minPricePerM2 != null && filters.minPricePerM2 > 0) params.set('minM2', String(filters.minPricePerM2));
  if (filters.maxPricePerM2 != null && filters.maxPricePerM2 > 0) params.set('maxM2', String(filters.maxPricePerM2));
  if (filters.minArea != null && filters.minArea > 0) params.set('minArea', String(filters.minArea));
  if (filters.maxArea != null && filters.maxArea > 0) params.set('maxArea', String(filters.maxArea));
  if (filters.minPlotArea != null && filters.minPlotArea > 0) params.set('minPlot', String(filters.minPlotArea));
  if (filters.maxPlotArea != null && filters.maxPlotArea > 0) params.set('maxPlot', String(filters.maxPlotArea));

  // Selected Offer ID
  if (selectedOfferId) {
    params.set('offer', selectedOfferId);
  }

  return params;
}

/**
 * Aktualizuje query string w pasku adresu przeglądarki bez przeładowywania strony.
 */
export function syncUrlWithFilters(
  filters: FilterState,
  selectedOfferId?: string | null,
  push = false
) {
  if (typeof window === 'undefined') return;

  const params = buildSearchParams(filters, selectedOfferId);
  const paramString = params.toString();
  const newUrl = `${window.location.pathname}${paramString ? `?${paramString}` : ''}${window.location.hash}`;
  const currentSearch = window.location.search.replace(/^\?/, '');

  if (paramString !== currentSearch) {
    if (push) {
      window.history.pushState(null, '', newUrl);
    } else {
      window.history.replaceState(null, '', newUrl);
    }
  }
}
