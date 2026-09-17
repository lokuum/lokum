import * as cheerio from 'cheerio';
import type { PropertyOffer, PropertyType, Voivodeship } from 'shared';
import { isBorderCounty, VOIVODESHIP_CENTERS } from 'shared';
import { ADRESOWO_VOIVODESHIP_CODES } from '../config.js';
import { fetchWithRetry } from '../utils/http.js';
import type { FetchResult } from './otodom.js';

export async function fetchAdresowoPage(
  voivodeship: Voivodeship,
  type: PropertyType,
  page = 1
): Promise<FetchResult> {
  const code = ADRESOWO_VOIVODESHIP_CODES[voivodeship];
  if (!code) {
    console.warn(`[Adresowo] No code mapping for voivodeship: ${voivodeship}`);
    return { items: [], totalPages: 0, totalItems: 0 };
  }

  const category = type === 'house' ? 'domy' : 'dzialki';
  const url = page === 1 ? `https://adresowo.pl/${category}/${code}` : `https://adresowo.pl/${category}/${code}_l${page}`;

  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const cardElements = $('div[data-offer-card]');
  if (cardElements.length === 0) {
    return { items: [], totalPages: 0, totalItems: 0 };
  }

  const hasNext = $('link[rel="next"]').length > 0;
  const now = new Date().toISOString();
  const center = VOIVODESHIP_CENTERS[voivodeship];

  const items: PropertyOffer[] = [];

  cardElements.each((_, el) => {
    const card = $(el);
    const rawId = card.attr('data-id');
    if (!rawId) return;

    const id = `adresowo-${rawId}`;
    const linkEl = card.find('a[data-track="offer-link"]');
    const path = linkEl.attr('href') || '';
    const sourceUrl = path.startsWith('http') ? path : `https://adresowo.pl${path}`;

    // Miejscowość i ulica z nagłówka
    const city = linkEl.find('span.font-medium').first().text().trim() || 'Nieznana';
    const street = linkEl.find('span.text-neutral-600').first().text().trim() || undefined;

    // Cena i metraż
    // W Adresowo pierwszy <span class="font-bold"> to cena, drugi to metraż m²
    const boldSpans = card.find('div.isolate div.flex.pb-1 p span.font-bold');
    let currentPrice = 0;
    let areaM2 = 0;

    if (boldSpans.length >= 1) {
      const priceText = $(boldSpans[0]).text().replace(/[\s\u00a0]/g, '');
      currentPrice = parseInt(priceText, 10) || 0;
    }

    if (boldSpans.length >= 2) {
      const areaText = $(boldSpans[1]).text().replace(/[\s\u00a0]/g, '').replace(',', '.');
      areaM2 = parseFloat(areaText) || 0;
    }

    if (currentPrice <= 0) return;

    const currentPricePerM2 = areaM2 > 0 ? Math.round((currentPrice / areaM2) * 100) / 100 : 0;

    // Zdjęcie i potencjalna ekstrakcja powiatu z nazwy pliku
    const imgEl = card.find('img');
    const imageUrl = imgEl.attr('src') || card.find('source').first().attr('srcset')?.split(' ')[0] || undefined;

    let county: string | undefined = undefined;
    if (imageUrl) {
      // Przykład: cover-dom-hrubieszowski-nieledew.webp lub cover-dzialka-siedliskowa-lubelski-sobianowice.webp
      const fileMatch = imageUrl.match(/cover-(?:dom|dzialka)-(?:[a-z0-9]+-)?([a-z0-9]+)-[a-z0-9]+\.webp/i);
      if (fileMatch && fileMatch[1]) {
        county = fileMatch[1];
      }
    }

    // Opis oferty i ewentualne wyszukanie powierzchni działki dla domu
    const descText = card.find('p.line-clamp-4').text().trim();
    let plotAreaM2: number | undefined = undefined;

    if (type === 'house' && descText) {
      const plotMatch = descText.match(/działk[a-z]?\s+(?:o\s+powierzchni\s+)?([0-9\s,.]+)\s*(m2|m²|ar|ha)/i);
      if (plotMatch) {
        const rawVal = parseFloat(plotMatch[1].replace(/[\s\u00a0]/g, '').replace(',', '.'));
        const unit = plotMatch[2].toLowerCase();
        if (!isNaN(rawVal)) {
          if (unit === 'ha') {
            plotAreaM2 = Math.round(rawVal * 10000);
          } else if (unit.startsWith('ar')) {
            plotAreaM2 = Math.round(rawVal * 100);
          } else {
            plotAreaM2 = Math.round(rawVal);
          }
        }
      }
    }

    const title = `${type === 'house' ? 'Dom' : 'Działka'} — ${city}${street ? `, ${street}` : ''}`;
    const lat = center ? center.lat + (Math.random() - 0.5) * 0.35 : 51.0;
    const lng = center ? center.lng + (Math.random() - 0.5) * 0.35 : 23.0;

    items.push({
      id,
      source: 'adresowo',
      sourceId: rawId,
      sourceUrl,
      propertyType: type,
      title,
      voivodeship,
      county,
      city,
      street,
      coordinates: { lat, lng },
      isNearBorder: isBorderCounty(voivodeship, county),
      areaM2,
      plotAreaM2,
      currentPrice,
      currentPricePerM2,
      initialPrice: currentPrice,
      priceChangeAmount: 0,
      priceChangePercent: 0,
      priceHistory: [
        {
          date: now.split('T')[0],
          price: currentPrice,
          pricePerM2: currentPricePerM2,
        },
      ],
      status: 'active',
      firstSeenAt: now,
      lastSeenAt: now,
      imageUrl,
      isDirectOwner: true,
    });
  });

  return {
    items,
    totalPages: hasNext ? page + 1 : page,
    totalItems: items.length,
  };
}
