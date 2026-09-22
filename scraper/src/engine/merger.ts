import type { PropertyOffer } from 'shared';

export interface MergeStats {
  newOffersCount: number;
  priceDropsCount: number;
  priceIncreasesCount: number;
  unchangedCount: number;
  removedCount: number;
  totalActive: number;
}

export function mergeOffers(
  existingOffers: PropertyOffer[],
  freshOffers: PropertyOffer[],
  daysUntilRemoved = 7
): { merged: PropertyOffer[]; stats: MergeStats } {
  const existingMap = new Map<string, PropertyOffer>();
  for (const offer of existingOffers) {
    existingMap.set(offer.id, { ...offer });
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const todayStr = nowIso.split('T')[0];

  const stats: MergeStats = {
    newOffersCount: 0,
    priceDropsCount: 0,
    priceIncreasesCount: 0,
    unchangedCount: 0,
    removedCount: 0,
    totalActive: 0,
  };

  const freshIds = new Set<string>();

  for (const fresh of freshOffers) {
    freshIds.add(fresh.id);
    const existing = existingMap.get(fresh.id);

    if (!existing) {
      // Nowa oferta
      const firstSeenDate = (fresh.firstSeenAt || nowIso).split('T')[0];
      const initialHistory: typeof fresh.priceHistory =
        fresh.priceHistory && fresh.priceHistory.length > 0
          ? [...fresh.priceHistory]
          : [
              {
                date: firstSeenDate,
                price: fresh.currentPrice,
                pricePerM2: fresh.currentPricePerM2,
              },
            ];

      const newOffer: PropertyOffer = {
        ...fresh,
        status: 'active',
        firstSeenAt: fresh.firstSeenAt || nowIso,
        lastSeenAt: nowIso,
        initialPrice: fresh.currentPrice,
        priceChangeAmount: 0,
        priceChangePercent: 0,
        priceHistory: initialHistory,
      };
      existingMap.set(fresh.id, newOffer);
      stats.newOffersCount++;
    } else {
      // Istniejąca oferta
      existing.lastSeenAt = nowIso;
      if (existing.status === 'removed') {
        existing.status = 'active';
        existing.removedAt = undefined;
      }

      // Aktualizacja danych uzupełniających
      if (fresh.imageUrl && !existing.imageUrl) existing.imageUrl = fresh.imageUrl;
      if (fresh.plotAreaM2 && !existing.plotAreaM2) existing.plotAreaM2 = fresh.plotAreaM2;
      if (fresh.county && !existing.county) existing.county = fresh.county;
      if (fresh.coordinates && !existing.coordinates) existing.coordinates = fresh.coordinates;

      // Zapewnienie poprawności priceHistory w istniejącym rekordzie
      if (!Array.isArray(existing.priceHistory) || existing.priceHistory.length === 0) {
        const initDate = (existing.firstSeenAt || nowIso).split('T')[0];
        existing.priceHistory = [
          {
            date: initDate,
            price: existing.initialPrice || existing.currentPrice,
            pricePerM2: existing.currentPricePerM2,
          },
        ];
      }

      const priceChanged = fresh.currentPrice !== existing.currentPrice;

      if (priceChanged) {
        const oldPrice = existing.currentPrice;
        existing.previousPrice = oldPrice;
        existing.currentPrice = fresh.currentPrice;
        existing.currentPricePerM2 = fresh.currentPricePerM2;
        existing.priceChangeAmount = fresh.currentPrice - existing.initialPrice;
        existing.priceChangePercent =
          existing.initialPrice > 0
            ? Math.round(((fresh.currentPrice - existing.initialPrice) / existing.initialPrice) * 1000) / 10
            : 0;

        // Aktualizacja lub dopisanie wpisu do chronologicznej historii cen (data - cena)
        const lastHistory = existing.priceHistory[existing.priceHistory.length - 1];
        if (lastHistory && lastHistory.date === todayStr) {
          lastHistory.price = fresh.currentPrice;
          lastHistory.pricePerM2 = fresh.currentPricePerM2;
        } else {
          existing.priceHistory.push({
            date: todayStr,
            price: fresh.currentPrice,
            pricePerM2: fresh.currentPricePerM2,
          });
        }

        // Sortowanie chronologiczne po dacie rosnąco
        existing.priceHistory.sort((a, b) => a.date.localeCompare(b.date));

        if (fresh.currentPrice < oldPrice) {
          existing.status = 'price_drop';
          stats.priceDropsCount++;
        } else {
          existing.status = 'price_increase';
          stats.priceIncreasesCount++;
        }
      } else {
        stats.unchangedCount++;
      }
    }
  }

  // Wykrywanie ofert, które zniknęły
  const removalThresholdMs = daysUntilRemoved * 24 * 60 * 60 * 1000;

  for (const offer of existingMap.values()) {
    if (offer.status !== 'removed') {
      const lastSeen = new Date(offer.lastSeenAt).getTime();
      if (now.getTime() - lastSeen > removalThresholdMs && !freshIds.has(offer.id)) {
        offer.status = 'removed';
        offer.removedAt = nowIso;
        stats.removedCount++;
      } else {
        stats.totalActive++;
      }
    }
  }

  const merged = Array.from(existingMap.values()).sort(
    (a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime()
  );

  return { merged, stats };
}
