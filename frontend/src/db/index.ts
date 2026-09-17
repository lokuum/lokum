import Dexie, { type EntityTable } from 'dexie';
import type { PropertyOffer } from 'shared';

export interface MetaRecord {
  key: string;
  value: string;
}

export const db = new Dexie('LokumDatabase') as Dexie & {
  offers: EntityTable<PropertyOffer, 'id'>;
  meta: EntityTable<MetaRecord, 'key'>;
};

db.version(1).stores({
  offers:
    'id, source, propertyType, voivodeship, county, city, currentPrice, currentPricePerM2, areaM2, plotAreaM2, status, priceChangePercent, isNearBorder, isDirectOwner, firstSeenAt, lastSeenAt',
  meta: 'key',
});
