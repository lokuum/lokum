import fs from 'node:fs/promises';
import path from 'node:path';
import type { PropertyOffer, PropertyType, SummaryStats, Voivodeship } from 'shared';
import { BACKUP_DATA_DIR, DATA_OUTPUT_DIR } from '../config.js';

export function getPartitionFilename(voivodeship: Voivodeship, type: PropertyType): string {
  const category = type === 'house' ? 'houses' : 'plots';
  return `${category}-${voivodeship}.json`;
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function loadPartition(voivodeship: Voivodeship, type: PropertyType): Promise<PropertyOffer[]> {
  const filename = getPartitionFilename(voivodeship, type);
  const primaryPath = path.join(DATA_OUTPUT_DIR, filename);
  const backupPath = path.join(BACKUP_DATA_DIR, filename);

  for (const filePath of [primaryPath, backupPath]) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data;
      }
    } catch {
      // file may not exist yet on first run
    }
  }

  return [];
}

export async function savePartition(
  voivodeship: Voivodeship,
  type: PropertyType,
  offers: PropertyOffer[]
): Promise<void> {
  const filename = getPartitionFilename(voivodeship, type);
  const jsonContent = JSON.stringify(offers, null, 2);

  await ensureDir(DATA_OUTPUT_DIR);
  await fs.writeFile(path.join(DATA_OUTPUT_DIR, filename), jsonContent, 'utf-8');

  await ensureDir(BACKUP_DATA_DIR);
  await fs.writeFile(path.join(BACKUP_DATA_DIR, filename), jsonContent, 'utf-8');
}

export async function generateAndSaveSummary(allOffers: PropertyOffer[]): Promise<SummaryStats> {
  const activeOffers = allOffers.filter((o) => o.status !== 'removed');

  const houses = activeOffers.filter((o) => o.propertyType === 'house');
  const plots = activeOffers.filter((o) => o.propertyType === 'plot');

  const priceDrops = activeOffers.filter((o) => o.priceChangeAmount < 0 || o.status === 'price_drop');

  const avgHouseM2 =
    houses.length > 0
      ? Math.round(houses.reduce((acc, h) => acc + (h.currentPricePerM2 || 0), 0) / houses.length)
      : 0;

  const avgPlotM2 =
    plots.length > 0
      ? Math.round(plots.reduce((acc, p) => acc + (p.currentPricePerM2 || 0), 0) / plots.length)
      : 0;

  // Największe obniżki (posortowane po % spadku)
  const topPriceDrops = [...priceDrops]
    .sort((a, b) => a.priceChangePercent - b.priceChangePercent)
    .slice(0, 50);

  const summary: SummaryStats = {
    totalHouses: houses.length,
    totalPlots: plots.length,
    totalPriceDrops: priceDrops.length,
    avgHousePricePerM2: avgHouseM2,
    avgPlotPricePerM2: avgPlotM2,
    lastUpdated: new Date().toISOString(),
    topPriceDrops,
  };

  const summaryContent = JSON.stringify(summary, null, 2);

  await ensureDir(DATA_OUTPUT_DIR);
  await fs.writeFile(path.join(DATA_OUTPUT_DIR, 'summary.json'), summaryContent, 'utf-8');

  await ensureDir(BACKUP_DATA_DIR);
  await fs.writeFile(path.join(BACKUP_DATA_DIR, 'summary.json'), summaryContent, 'utf-8');

  return summary;
}
