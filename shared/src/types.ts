export type PropertyType = 'house' | 'plot' | 'habitat';

export type Voivodeship = 'lubelskie' | 'podlaskie' | 'podkarpackie' | 'wielkopolskie';

export type PropertyStatus = 'active' | 'price_drop' | 'price_increase' | 'removed';

export interface PriceSnapshot {
  date: string; // YYYY-MM-DD
  price: number;
  pricePerM2: number;
}

export interface PropertyOffer {
  id: string; // np. 'otodom-68038340' lub 'adresowo-4257750'
  source: 'otodom' | 'adresowo';
  sourceId: string;
  sourceUrl: string;
  propertyType: PropertyType;

  title: string;
  voivodeship: Voivodeship;
  county?: string; // Powiat np. 'hrubieszowski', 'hajnowski', 'bieszczadzki'
  city: string; // Miejscowość / gmina
  street?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isNearBorder?: boolean; // Powiat w pasie przygranicznym z UA/BY

  // Parametry powierzchni
  areaM2: number; // Dom: pow. użytkowa / Działka: pow. działki / Siedlisko: pow. budynku lub działki
  plotAreaM2?: number; // Dla domów i siedlisk: wielkość działki w m²

  // Finanse
  currentPrice: number;
  currentPricePerM2: number;
  initialPrice: number;
  previousPrice?: number;
  priceChangeAmount: number; // currentPrice - initialPrice (ujemna = obniżka)
  priceChangePercent: number; // np. -12.5%

  // Historia i status
  priceHistory: PriceSnapshot[];
  status: PropertyStatus;
  firstSeenAt: string; // ISO string
  lastSeenAt: string; // ISO string
  removedAt?: string; // ISO string jeśli oferta wygasła/zniknęła

  imageUrl?: string;
  isDirectOwner?: boolean; // Prawda dla Adresowo (bez pośredników)
}

export interface SummaryStats {
  totalHouses: number;
  totalPlots: number;
  totalHabitats: number;
  totalPriceDrops: number;
  avgHousePricePerM2: number;
  avgPlotPricePerM2: number;
  avgHabitatPricePerM2: number;
  lastUpdated: string;
  topPriceDrops: PropertyOffer[];
}

export interface FilterState {
  tab: 'houses' | 'plots' | 'habitats' | 'drops' | 'favorites';
  voivodeship: Voivodeship | 'all';
  county?: string;
  minPrice?: number;
  maxPrice?: number;
  minPricePerM2?: number;
  maxPricePerM2?: number;
  minArea?: number;
  maxArea?: number;
  minPlotArea?: number;
  maxPlotArea?: number;
  onlyNearBorder?: boolean;
  onlyPriceDrops?: boolean;
  onlyDirectOwner?: boolean;
  onlyFavorites?: boolean;
  source?: 'all' | 'otodom' | 'adresowo';
  searchQuery?: string;
  sortBy:
    | 'price_asc'
    | 'price_desc'
    | 'price_m2_asc'
    | 'price_m2_desc'
    | 'area_asc'
    | 'area_desc'
    | 'plot_area_asc'
    | 'plot_area_desc'
    | 'drop_percent_desc'
    | 'newest';
  viewMode: 'cards' | 'map';
}
