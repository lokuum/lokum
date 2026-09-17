import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getLocationCoordinates, inferCounty, isBorderLocation } from 'shared';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');

const dirs = [
  path.join(rootDir, 'frontend/public/data'),
  path.join(rootDir, 'data'),
];

const files = [
  'houses-lubelskie.json',
  'plots-lubelskie.json',
  'houses-podlaskie.json',
  'plots-podlaskie.json',
  'houses-podkarpackie.json',
  'plots-podkarpackie.json',
];

for (const dir of dirs) {
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (!fs.existsSync(fullPath)) continue;

    const items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    let borderCount = 0;
    let inferredCountyCount = 0;
    let areaFixedCount = 0;

    for (const item of items) {
      // 1. Poprawka metrażu dla działek z Adresowo podanych pierwotnie w ha
      if (item.source === 'adresowo' && item.propertyType === 'plot') {
        const isHectares =
          /-(\d+(?:[.,]\d+)?)-ha(?:-|\/|$)/i.test(item.sourceUrl) ||
          (item.areaM2 > 0 && item.areaM2 < 50);

        if (isHectares && item.areaM2 > 0 && item.areaM2 < 100) {
          item.areaM2 = Math.round(item.areaM2 * 10000);
          item.currentPricePerM2 =
            item.areaM2 > 0 ? Math.round((item.currentPrice / item.areaM2) * 100) / 100 : 0;
          if (Array.isArray(item.priceHistory)) {
            for (const h of item.priceHistory) {
              h.pricePerM2 =
                item.areaM2 > 0 ? Math.round((h.price / item.areaM2) * 100) / 100 : 0;
            }
          }
          areaFixedCount++;
        }
      }

      // 2. Ekstrakcja powiatu z nazwy pliku zdjęcia Adresowo, jeśli brak lub nieprecyzyjny
      const oldCounty = item.county;
      if (item.source === 'adresowo' && item.imageUrl) {
        const filename = item.imageUrl.split('/').pop() || '';
        const skiMatch = filename.match(/[-_]([a-z]+(?:ski|cki|dzki))[-_]/i);
        if (skiMatch) {
          item.county = skiMatch[1].toLowerCase();
        } else {
          const locMatch = filename.match(/cover(?:@\w+)?-(?:dom|dzialka)(?:-[a-z0-9-]+)?-([a-z0-9-]+)\.webp/i);
          if (locMatch) {
            item.county = inferCounty(locMatch[1]) || locMatch[1];
          }
        }
      }

      // 3. Inferencja powiatu z nazwy miejscowości
      const inferred = inferCounty(item.city, item.county);
      if (inferred && (!item.county || item.county !== inferred)) {
        item.county = inferred;
      }

      if (item.county && item.county !== oldCounty) {
        inferredCountyCount++;
      }

      // 4. Aktualizacja strefy przygranicznej i współrzędnych
      item.isNearBorder = isBorderLocation(item.voivodeship, item.county, item.city);
      if (item.isNearBorder) borderCount++;

      item.coordinates = getLocationCoordinates(item.voivodeship, item.city, item.county);
    }

    fs.writeFileSync(fullPath, JSON.stringify(items, null, 2), 'utf8');
    console.log(
      `Updated ${file} in ${path.basename(dir)}: ${items.length} items (${borderCount} in border zone, ${inferredCountyCount} counties updated, ${areaFixedCount} plot areas fixed)`
    );
  }
}
