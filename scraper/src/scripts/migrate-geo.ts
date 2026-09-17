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

    for (const item of items) {
      const oldCounty = item.county;
      const inferred = inferCounty(item.city, item.county);
      if (inferred && (!oldCounty || oldCounty !== inferred)) {
        item.county = inferred;
        inferredCountyCount++;
      }

      item.isNearBorder = isBorderLocation(item.voivodeship, item.county, item.city);
      if (item.isNearBorder) borderCount++;

      item.coordinates = getLocationCoordinates(item.voivodeship, item.city, item.county);
    }

    fs.writeFileSync(fullPath, JSON.stringify(items, null, 2), 'utf8');
    console.log(
      `Updated ${file} in ${path.basename(dir)}: ${items.length} items (${borderCount} in border zone, ${inferredCountyCount} counties inferred)`
    );
  }
}
