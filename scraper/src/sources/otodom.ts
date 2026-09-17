import type { PropertyOffer, PropertyType, Voivodeship } from 'shared';
import { isBorderCounty, VOIVODESHIP_CENTERS } from 'shared';
import { fetchWithRetry } from '../utils/http.js';

interface OtodomSearchResponse {
  props: {
    pageProps: {
      data?: {
        searchAds?: {
          pagination?: {
            totalPages?: number;
            totalItems?: number;
            currentPage?: number;
          };
          items?: Array<{
            id: number;
            title: string;
            slug: string;
            totalPrice?: { value: number; currency: string };
            pricePerSquareMeter?: { value: number; currency: string };
            areaInSquareMeters?: number;
            terrainAreaInSquareMeters?: number;
            isPrivateOwner?: boolean;
            images?: Array<{ medium?: string; large?: string }>;
            dateCreated?: string;
            dateModified?: string;
            location?: {
              address?: {
                city?: { name?: string };
                street?: { name?: string };
                province?: { name?: string };
              };
              reverseGeocoding?: {
                locations?: Array<{
                  id: string;
                  name: string;
                  locationLevel: string;
                  fullName: string;
                }>;
              };
              coordinates?: {
                latitude?: number;
                longitude?: number;
              };
            };
          }>;
        };
      };
    };
  };
}

export interface FetchResult {
  items: PropertyOffer[];
  totalPages: number;
  totalItems: number;
}

export async function fetchOtodomPage(
  voivodeship: Voivodeship,
  type: PropertyType,
  page = 1
): Promise<FetchResult> {
  const category = type === 'house' ? 'dom' : 'dzialka';
  const url = `https://www.otodom.pl/pl/wyniki/sprzedaz/${category}/${voivodeship}?limit=36&page=${page}`;

  const html = await fetchWithRetry(url);
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json"[^>]*>(.*?)<\/script>/s);

  if (!match) {
    console.warn(`[Otodom] No __NEXT_DATA__ found for ${voivodeship} (${type}), page ${page}`);
    return { items: [], totalPages: 0, totalItems: 0 };
  }

  let data: OtodomSearchResponse;
  try {
    data = JSON.parse(match[1]);
  } catch (err) {
    console.error(`[Otodom] JSON parse error for ${url}:`, err);
    return { items: [], totalPages: 0, totalItems: 0 };
  }

  const searchAds = data.props?.pageProps?.data?.searchAds;
  const pagination = searchAds?.pagination;
  const rawItems = searchAds?.items || [];

  const now = new Date().toISOString();
  const center = VOIVODESHIP_CENTERS[voivodeship];

  const items: PropertyOffer[] = rawItems
    .filter((item) => item.totalPrice?.value && item.totalPrice.value > 0)
    .map((item) => {
      const id = `otodom-${item.id}`;
      const sourceId = String(item.id);
      const sourceUrl = `https://www.otodom.pl/pl/oferta/${item.slug}`;

      // Ekstrakcja powiatu i miasta z reverseGeocoding
      const revLocations = item.location?.reverseGeocoding?.locations || [];
      const countyObj = revLocations.find((l) => l.locationLevel === 'county');
      const cityObj = revLocations.find((l) => l.locationLevel === 'city_or_village' || l.locationLevel === 'city');

      const county = countyObj ? countyObj.name : undefined;
      const city = cityObj ? cityObj.name : item.location?.address?.city?.name || 'Nieznana miejscowość';
      const street = item.location?.address?.street?.name || undefined;

      const areaM2 = item.areaInSquareMeters || 0;
      const currentPrice = item.totalPrice?.value || 0;
      const currentPricePerM2 =
        item.pricePerSquareMeter?.value || (areaM2 > 0 ? Math.round((currentPrice / areaM2) * 100) / 100 : 0);

      const lat = item.location?.coordinates?.latitude ?? (center ? center.lat + (Math.random() - 0.5) * 0.4 : 51.0);
      const lng = item.location?.coordinates?.longitude ?? (center ? center.lng + (Math.random() - 0.5) * 0.4 : 23.0);

      const imageUrl = item.images?.[0]?.medium || item.images?.[0]?.large;

      const dateCreated = item.dateCreated ? new Date(item.dateCreated).toISOString() : now;

      return {
        id,
        source: 'otodom' as const,
        sourceId,
        sourceUrl,
        propertyType: type,
        title: item.title,
        voivodeship,
        county,
        city,
        street,
        coordinates: { lat, lng },
        isNearBorder: isBorderCounty(voivodeship, county),
        areaM2,
        plotAreaM2: type === 'house' && item.terrainAreaInSquareMeters ? item.terrainAreaInSquareMeters : undefined,
        currentPrice,
        currentPricePerM2,
        initialPrice: currentPrice,
        priceChangeAmount: 0,
        priceChangePercent: 0,
        priceHistory: [
          {
            date: dateCreated.split('T')[0],
            price: currentPrice,
            pricePerM2: currentPricePerM2,
          },
        ],
        status: 'active' as const,
        firstSeenAt: dateCreated,
        lastSeenAt: now,
        imageUrl,
        isDirectOwner: Boolean(item.isPrivateOwner),
      };
    });

  return {
    items,
    totalPages: pagination?.totalPages || (items.length > 0 ? page : 0),
    totalItems: pagination?.totalItems || items.length,
  };
}
