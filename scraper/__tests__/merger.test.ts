import { describe, expect, it } from 'vitest';
import type { PropertyOffer } from 'shared';
import { mergeOffers } from '../src/engine/merger.js';

describe('mergeOffers Engine', () => {
  const sampleOffer: PropertyOffer = {
    id: 'otodom-101',
    source: 'otodom',
    sourceId: '101',
    sourceUrl: 'https://otodom.pl/oferta/101',
    propertyType: 'house',
    title: 'Dom wolnostojący w Chełmie',
    voivodeship: 'lubelskie',
    county: 'chełmski',
    city: 'Chełm',
    areaM2: 120,
    plotAreaM2: 1000,
    currentPrice: 300000,
    currentPricePerM2: 2500,
    initialPrice: 300000,
    priceChangeAmount: 0,
    priceChangePercent: 0,
    priceHistory: [
      {
        date: '2026-09-01',
        price: 300000,
        pricePerM2: 2500,
      },
    ],
    status: 'active',
    firstSeenAt: '2026-09-01T10:00:00.000Z',
    lastSeenAt: '2026-09-01T10:00:00.000Z',
  };

  it('dodaje nową ofertę z poprawną historią i stanem początkowym', () => {
    const { merged, stats } = mergeOffers([], [sampleOffer]);

    expect(stats.newOffersCount).toBe(1);
    expect(stats.priceDropsCount).toBe(0);
    expect(merged.length).toBe(1);

    const added = merged[0];
    expect(added.id).toBe('otodom-101');
    expect(added.initialPrice).toBe(300000);
    expect(added.currentPrice).toBe(300000);
    expect(added.priceChangeAmount).toBe(0);
    expect(added.status).toBe('active');
    expect(added.priceHistory.length).toBe(1);
  });

  it('wykrywa obniżkę ceny (price_drop) i wylicza procentowy spadek', () => {
    const freshOffer: PropertyOffer = {
      ...sampleOffer,
      currentPrice: 270000,
      currentPricePerM2: 2250,
    };

    const { merged, stats } = mergeOffers([sampleOffer], [freshOffer]);

    expect(stats.priceDropsCount).toBe(1);
    expect(stats.newOffersCount).toBe(0);

    const updated = merged[0];
    expect(updated.currentPrice).toBe(270000);
    expect(updated.previousPrice).toBe(300000);
    expect(updated.initialPrice).toBe(300000);
    expect(updated.priceChangeAmount).toBe(-30000);
    expect(updated.priceChangePercent).toBe(-10); // -10%
    expect(updated.status).toBe('price_drop');
    expect(updated.priceHistory.length).toBe(2);
  });

  it('wykrywa podwyżkę ceny (price_increase)', () => {
    const freshOffer: PropertyOffer = {
      ...sampleOffer,
      currentPrice: 330000,
      currentPricePerM2: 2750,
    };

    const { merged, stats } = mergeOffers([sampleOffer], [freshOffer]);

    expect(stats.priceIncreasesCount).toBe(1);

    const updated = merged[0];
    expect(updated.currentPrice).toBe(330000);
    expect(updated.previousPrice).toBe(300000);
    expect(updated.priceChangeAmount).toBe(30000);
    expect(updated.priceChangePercent).toBe(10);
    expect(updated.status).toBe('price_increase');
  });

  it('oznacza ofertę jako usuniętą (removed) po przekroczeniu progu dni', () => {
    const oldOffer: PropertyOffer = {
      ...sampleOffer,
      lastSeenAt: '2026-08-01T10:00:00.000Z', // ponad 30 dni temu
    };

    const { merged, stats } = mergeOffers([oldOffer], [], 7);

    expect(stats.removedCount).toBe(1);
    expect(merged[0].status).toBe('removed');
    expect(merged[0].removedAt).toBeDefined();
  });
});
