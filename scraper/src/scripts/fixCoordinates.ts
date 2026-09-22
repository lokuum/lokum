import fs from 'node:fs/promises';
import path from 'node:path';
import type { PropertyOffer, PropertyType, Voivodeship } from 'shared';
import {
  getLocationCoordinates,
  inferCounty,
  isBorderLocation,
  normalizeText,
  VOIVODESHIP_CENTERS,
} from 'shared';
import { BACKUP_DATA_DIR, DATA_OUTPUT_DIR, SUPPORTED_TYPES, SUPPORTED_VOIVODESHIPS } from '../config.js';
import { generateSummaryFromAllPartitions, getPartitionFilename, loadPartition, savePartition } from '../engine/storage.js';

async function main() {
  console.log('Rozpoczynam aktualizację współrzędnych i powiatów...');

  const capitalNames: Record<Voivodeship, string[]> = {
    wielkopolskie: ['poznan', 'poznań'],
    lubelskie: ['lublin'],
    podlaskie: ['bialystok', 'białystok'],
    podkarpackie: ['rzeszow', 'rzeszów'],
  };

  for (const v of SUPPORTED_VOIVODESHIPS) {
    const center = VOIVODESHIP_CENTERS[v];
    const capitals = capitalNames[v] || [];

    for (const t of SUPPORTED_TYPES) {
      const offers = await loadPartition(v, t);
      if (offers.length === 0) continue;

      let updatedCount = 0;

      for (const item of offers) {
        const resolvedCounty = inferCounty(item.city, item.county) || item.county;
        item.county = resolvedCounty;
        item.isNearBorder = isBorderLocation(item.voivodeship, item.county, item.city);

        const normCity = item.city ? normalizeText(item.city) : '';
        const isCapitalCity = capitals.some((c) => normCity.includes(c));

        const distFromCenterLat = item.coordinates ? Math.abs(item.coordinates.lat - center.lat) : 999;
        const distFromCenterLng = item.coordinates ? Math.abs(item.coordinates.lng - center.lng) : 999;
        const wasInCenter = distFromCenterLat < 0.03 && distFromCenterLng < 0.03;

        const newCoords = getLocationCoordinates(v, item.city, item.county);
        item.coordinates = newCoords;
        updatedCount++;
      }

      await savePartition(v, t, offers);
      console.log(`[${v} / ${t}] Zaktualizowano współrzędne dla ${updatedCount} / ${offers.length} ofert.`);
    }
  }

  console.log('Generowanie podsumowania...');
  await generateSummaryFromAllPartitions();
  console.log('Zakończono pomyślnie!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
