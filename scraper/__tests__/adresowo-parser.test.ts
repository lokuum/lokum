import { describe, expect, it } from 'vitest';
import { parseAdresowoHtml } from '../src/sources/adresowo.js';

describe('parseAdresowoHtml', () => {
  it('poprawnie parsuje działkę o powierzchni w hektarach (np. 1,22 ha -> 12 200 m2)', () => {
    const mockHtml = `
      <div data-offer-card data-id="4160752">
        <a data-track="offer-link" href="/o/dzialka-rolna-dorohusk-1-ha-y5q6c5">
          <span class="font-medium">Dorohusk</span>
        </a>
        <div class="isolate">
          <div class="flex pb-1">
            <p><span class="font-bold">40 000</span> <span class="text-xs text-neutral-700">zł</span></p>
            <p><span class="font-bold">1,22</span> <span class="text-xs text-neutral-700">ha</span></p>
          </div>
        </div>
        <img src="https://s2.adresowa.pl/oi/17/1a/3f7cf0_5d42_cover@2x-dzialka-rolna-chelmski-dorohusk.webp" />
      </div>
    `;

    const result = parseAdresowoHtml(mockHtml, 'lubelskie', 'plot');
    expect(result.items.length).toBe(1);

    const offer = result.items[0];
    expect(offer.id).toBe('adresowo-4160752');
    expect(offer.city).toBe('Dorohusk');
    expect(offer.county).toBe('chelmski');
    expect(offer.isNearBorder).toBe(true);
    expect(offer.currentPrice).toBe(40000);
    expect(offer.areaM2).toBe(12200);
    expect(offer.currentPricePerM2).toBe(3.28);
    expect(offer.priceHistory[0].pricePerM2).toBe(3.28);
  });

  it('poprawnie parsuje tradycyjną działkę w m2', () => {
    const mockHtml = `
      <div data-offer-card data-id="10101">
        <a data-track="offer-link" href="/o/dzialka-budowlana-chelm-850-m2-abc">
          <span class="font-medium">Chełm</span>
        </a>
        <div class="isolate">
          <div class="flex pb-1">
            <p><span class="font-bold">139 000</span> <span class="text-xs text-neutral-700">zł</span></p>
            <p><span class="font-bold">850</span> <span class="text-xs text-neutral-700">m²</span></p>
          </div>
        </div>
      </div>
    `;

    const result = parseAdresowoHtml(mockHtml, 'lubelskie', 'plot');
    expect(result.items.length).toBe(1);

    const offer = result.items[0];
    expect(offer.currentPrice).toBe(139000);
    expect(offer.areaM2).toBe(850);
    expect(offer.currentPricePerM2).toBe(163.53);
    expect(offer.county).toBe('chełmski');
    expect(offer.isNearBorder).toBe(true);
  });

  it('poprawnie parsuje powierzchnię działki podaną w arach (np. 25 a -> 2500 m2)', () => {
    const mockHtml = `
      <div data-offer-card data-id="20202">
        <a data-track="offer-link" href="/o/dzialka-zamosc-25-a">
          <span class="font-medium">Zamość</span>
        </a>
        <div class="isolate">
          <div class="flex pb-1">
            <p><span class="font-bold">100 000</span> <span class="text-xs text-neutral-700">zł</span></p>
            <p><span class="font-bold">25</span> <span class="text-xs text-neutral-700">a</span></p>
          </div>
        </div>
      </div>
    `;

    const result = parseAdresowoHtml(mockHtml, 'lubelskie', 'plot');
    expect(result.items.length).toBe(1);

    const offer = result.items[0];
    expect(offer.areaM2).toBe(2500);
    expect(offer.currentPricePerM2).toBe(40);
  });

  it('poprawnie wyciąga powierzchnię działki dla domu z opisu (np. 0.5 ha -> 5000 m2)', () => {
    const mockHtml = `
      <div data-offer-card data-id="30303">
        <a data-track="offer-link" href="/o/dom-wlodawa">
          <span class="font-medium">Włodawa</span>
        </a>
        <div class="isolate">
          <div class="flex pb-1">
            <p><span class="font-bold">350 000</span> <span class="text-xs text-neutral-700">zł</span></p>
            <p><span class="font-bold">120</span> <span class="text-xs text-neutral-700">m²</span></p>
          </div>
        </div>
        <p class="line-clamp-4">Przestronny dom, działka o powierzchni 0.5 ha, ogród i garaż.</p>
      </div>
    `;

    const result = parseAdresowoHtml(mockHtml, 'lubelskie', 'house');
    expect(result.items.length).toBe(1);

    const offer = result.items[0];
    expect(offer.areaM2).toBe(120);
    expect(offer.plotAreaM2).toBe(5000);
    expect(offer.isNearBorder).toBe(true);
  });
});
