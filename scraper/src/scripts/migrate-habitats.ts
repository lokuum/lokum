import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PropertyOffer, Voivodeship } from 'shared';
import { isHabitatOffer } from 'shared';
import { generateSummaryFromAllPartitions } from '../engine/storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');

const dirs = [
  path.join(rootDir, 'frontend/public/data'),
  path.join(rootDir, 'data'),
];

const voivodeships: Voivodeship[] = ['lubelskie', 'podlaskie', 'podkarpackie'];

for (const dir of dirs) {
  for (const v of voivodeships) {
    const housesPath = path.join(dir, `houses-${v}.json`);
    const plotsPath = path.join(dir, `plots-${v}.json`);
    const habitatsPath = path.join(dir, `habitats-${v}.json`);

    let houses: PropertyOffer[] = [];
    let plots: PropertyOffer[] = [];
    let existingHabitats: PropertyOffer[] = [];

    if (fs.existsSync(housesPath)) {
      houses = JSON.parse(fs.readFileSync(housesPath, 'utf8'));
    }
    if (fs.existsSync(plotsPath)) {
      plots = JSON.parse(fs.readFileSync(plotsPath, 'utf8'));
    }
    if (fs.existsSync(habitatsPath)) {
      existingHabitats = JSON.parse(fs.readFileSync(habitatsPath, 'utf8'));
    }

    const cleanHouses: PropertyOffer[] = [];
    const cleanPlots: PropertyOffer[] = [];
    const habitatsMap = new Map<string, PropertyOffer>();

    for (const h of existingHabitats) {
      habitatsMap.set(h.id, { ...h, propertyType: 'habitat' });
    }

    for (const item of houses) {
      if (isHabitatOffer(item)) {
        habitatsMap.set(item.id, { ...item, propertyType: 'habitat' });
      } else {
        cleanHouses.push(item);
      }
    }

    for (const item of plots) {
      if (isHabitatOffer(item)) {
        habitatsMap.set(item.id, { ...item, propertyType: 'habitat' });
      } else {
        cleanPlots.push(item);
      }
    }

    const habitats = Array.from(habitatsMap.values());

    fs.writeFileSync(housesPath, JSON.stringify(cleanHouses, null, 2), 'utf8');
    fs.writeFileSync(plotsPath, JSON.stringify(cleanPlots, null, 2), 'utf8');
    fs.writeFileSync(habitatsPath, JSON.stringify(habitats, null, 2), 'utf8');

    console.log(
      `[${path.basename(dir)}] ${v}: Domy=${cleanHouses.length}, Działki=${cleanPlots.length}, Siedliska=${habitats.length}`
    );
  }
}

console.log('Regenerating global summary.json...');
await generateSummaryFromAllPartitions();
console.log('Migration complete!');
