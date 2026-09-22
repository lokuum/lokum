import * as cheerio from 'cheerio';
import type { PropertyOffer, PropertyType, Voivodeship } from 'shared';
import { classifyPropertyType, getLocationCoordinates, inferCounty, isBorderLocation } from 'shared';
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
  return parseAdresowoHtml(html, voivodeship, type, page);
}

export function parseAdresowoHtml(
  html: string,
  voivodeship: Voivodeship,
  type: PropertyType,
  page = 1
): FetchResult {
  const $ = cheerio.load(html);

  const cardElements = $('div[data-offer-card]');
  if (cardElements.length === 0) {
    return { items: [], totalPages: 0, totalItems: 0 };
  }

  const hasNext = $('link[rel="next"]').length > 0;
  const now = new Date().toISOString();

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
    // W Adresowo:
    // Pierwszy <p> w pasku parametrów to cena (np. "40 000 zł"),
    // Drugi <p> to metraż z jednostką (np. "1 685 m²", "1,22 ha", "25 a").
    const statPs = card.find('div.isolate div.flex.pb-1 p');
    let currentPrice = 0;
    let areaM2 = 0;

    if (statPs.length >= 1) {
      const priceSpan = statPs.eq(0).find('span.font-bold');
      const priceText = (priceSpan.length ? priceSpan.text() : statPs.eq(0).text()).replace(/[\s\u00a0]/g, '');
      currentPrice = parseInt(priceText, 10) || 0;
    }

    if (statPs.length >= 2) {
      const areaP = statPs.eq(1);
      const areaSpan = areaP.find('span.font-bold');
      const areaNumText = (areaSpan.length ? areaSpan.text() : areaP.text())
        .replace(/[\s\u00a0]/g, '')
        .replace(',', '.');
      const rawArea = parseFloat(areaNumText) || 0;
      const unitText = areaP.text().toLowerCase();

      if (unitText.includes('ha') || unitText.includes('hektar') || /-(\d+(?:[.,]\d+)?)-ha(?:-|\/|$)/i.test(path)) {
        // 1 ha = 10 000 m²
        areaM2 = Math.round(rawArea * 10000);
      } else if (/\b(?:ar|a)\b/i.test(unitText) && !unitText.includes('m²') && !unitText.includes('m2')) {
        // 1 ar = 100 m²
        areaM2 = Math.round(rawArea * 100);
      } else {
        areaM2 = Math.round(rawArea);
      }
    } else {
      // Fallback jeśli selektor p uległby zmianie
      const boldSpans = card.find('div.isolate div.flex.pb-1 p span.font-bold');
      if (boldSpans.length >= 1 && currentPrice === 0) {
        const priceText = $(boldSpans[0]).text().replace(/[\s\u00a0]/g, '');
        currentPrice = parseInt(priceText, 10) || 0;
      }
      if (boldSpans.length >= 2 && areaM2 === 0) {
        const areaText = $(boldSpans[1]).text().replace(/[\s\u00a0]/g, '').replace(',', '.');
        const rawArea = parseFloat(areaText) || 0;
        const parentText = $(boldSpans[1]).parent().text().toLowerCase();
        if (parentText.includes('ha') || /-(\d+(?:[.,]\d+)?)-ha(?:-|\/|$)/i.test(path)) {
          areaM2 = Math.round(rawArea * 10000);
        } else if (/\b(?:ar|a)\b/i.test(parentText) && !parentText.includes('m²') && !parentText.includes('m2')) {
          areaM2 = Math.round(rawArea * 100);
        } else {
          areaM2 = Math.round(rawArea);
        }
      }
    }

    // Bezpiecznik dla działek: jeśli metraż jest ułamkowy lub < 50 m² i w URL jest -ha lub wartość jest typowa dla hektarów
    if (type === 'plot' && areaM2 > 0 && areaM2 < 50) {
      if (/-(\d+(?:[.,]\d+)?)-ha(?:-|\/|$)/i.test(path) || !Number.isInteger(areaM2) || areaM2 <= 10) {
        areaM2 = Math.round(areaM2 * 10000);
      }
    }

    if (currentPrice <= 0) return;

    const currentPricePerM2 = areaM2 > 0 ? Math.round((currentPrice / areaM2) * 100) / 100 : 0;

    // Zdjęcie i potencjalna ekstrakcja powiatu z nazwy pliku
    const imgEl = card.find('img');
    const imageUrl = imgEl.attr('src') || card.find('source').first().attr('srcset')?.split(' ')[0] || undefined;

    let county: string | undefined = undefined;
    if (imageUrl) {
      const filename = imageUrl.split('/').pop() || '';
      // Przykład: 3f7cf0_5d42_cover@2x-dzialka-rolna-chelmski-dorohusk.webp lub 40d866_a55e_cover@2x-dom-zamojski-guciow.webp
      const skiMatch = filename.match(/[-_]([a-z]+(?:ski|cki|dzki))[-_]/i);
      if (skiMatch) {
        county = skiMatch[1].toLowerCase();
      } else {
        const locationMatch = filename.match(/cover(?:@\w+)?-(?:dom|dzialka)(?:-[a-z0-9-]+)?-([a-z0-9-]+)\.webp/i);
        if (locationMatch) {
          county = inferCounty(locationMatch[1]) || locationMatch[1];
        }
      }
    }

    if (!county) {
      county = inferCounty(city);
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

    const resolvedType = classifyPropertyType(type === 'habitat' ? 'plot' : type, {
      title: `${type === 'house' ? 'Dom' : 'Działka'} — ${city}`,
      sourceUrl,
      street,
      description: descText,
    });

    const typeLabel = resolvedType === 'habitat' ? 'Siedlisko' : resolvedType === 'house' ? 'Dom' : 'Działka';
    const title = `${typeLabel} — ${city}${street ? `, ${street}` : ''}`;
    const coordinates = getLocationCoordinates(voivodeship, city, county);
    const isNearBorder = isBorderLocation(voivodeship, county, city);

    items.push({
      id,
      source: 'adresowo',
      sourceId: rawId,
      sourceUrl,
      propertyType: resolvedType,
      title,
      voivodeship,
      county,
      city,
      street,
      coordinates,
      isNearBorder,
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
