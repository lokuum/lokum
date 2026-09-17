import type { Voivodeship } from './types.js';

export const VOIVODESHIPS: { id: Voivodeship; name: string; borderWith: string }[] = [
  { id: 'lubelskie', name: 'Lubelskie', borderWith: 'Ukraina / Białoruś' },
  { id: 'podlaskie', name: 'Podlaskie', borderWith: 'Białoruś / Litwa' },
  { id: 'podkarpackie', name: 'Podkarpackie', borderWith: 'Ukraina / Słowacja' },
];

/**
 * Powiaty zlokalizowane bezpośrednio przy granicy lub w strefie przygranicznej (< 40-50 km).
 */
export const BORDER_COUNTIES: Record<Voivodeship, string[]> = {
  lubelskie: [
    'bialski',
    'Biała Podlaska',
    'włodawski',
    'chełmski',
    'Chełm',
    'hrubieszowski',
    'tomaszowski',
    'zamojski',
    'Zamość',
    'krasnostawski',
  ],
  podlaskie: [
    'sejneński',
    'augustowski',
    'sokólski',
    'białostocki',
    'Białystok',
    'hajnowski',
    'bielski',
    'siemiatycki',
  ],
  podkarpackie: [
    'lubaczowski',
    'jarosławski',
    'przemyski',
    'Przemyśl',
    'bieszczadzki',
    'leski',
    'sanocki',
  ],
};

/**
 * Sprawdza czy dany powiat znajduje się w pasie przygranicznym.
 */
export function isBorderCounty(voivodeship: Voivodeship, countyName?: string): boolean {
  if (!countyName) return false;
  const list = BORDER_COUNTIES[voivodeship];
  if (!list) return false;
  const normalized = countyName.toLowerCase().replace(/^powiat\s+/, '').trim();
  return list.some((c) => normalized.includes(c.toLowerCase()) || c.toLowerCase().includes(normalized));
}

/**
 * Centra mapy dla poszczególnych województw
 */
export const VOIVODESHIP_CENTERS: Record<Voivodeship, { lat: number; lng: number; zoom: number }> = {
  lubelskie: { lat: 51.2465, lng: 22.5684, zoom: 8 },
  podlaskie: { lat: 53.1325, lng: 23.1688, zoom: 8 },
  podkarpackie: { lat: 49.95, lng: 22.3, zoom: 8 },
};

export const EAST_POLAND_CENTER = { lat: 51.5, lng: 22.8, zoom: 7 };
