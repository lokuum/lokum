import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PropertyType, Voivodeship } from 'shared';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DATA_OUTPUT_DIR = path.resolve(__dirname, '../../frontend/public/data');
export const BACKUP_DATA_DIR = path.resolve(__dirname, '../../data');

export const SUPPORTED_VOIVODESHIPS: Voivodeship[] = [
  'dolnoslaskie',
  'kujawsko-pomorskie',
  'lubelskie',
  'lubuskie',
  'lodzkie',
  'malopolskie',
  'mazowieckie',
  'opolskie',
  'podkarpackie',
  'podlaskie',
  'pomorskie',
  'slaskie',
  'swietokrzyskie',
  'warminsko-mazurskie',
  'wielkopolskie',
  'zachodniopomorskie',
];
export const SUPPORTED_TYPES: PropertyType[] = ['house', 'plot', 'habitat'];

export const ADRESOWO_VOIVODESHIP_CODES: Record<Voivodeship, string> = {
  dolnoslaskie: 'fds',
  'kujawsko-pomorskie': 'fkp',
  lubelskie: 'flu',
  lubuskie: 'flb',
  lodzkie: 'fld',
  malopolskie: 'fma',
  mazowieckie: 'fmz',
  opolskie: 'fop',
  podkarpackie: 'fpk',
  podlaskie: 'fpd',
  pomorskie: 'fpm',
  slaskie: 'fsl',
  swietokrzyskie: 'fsk',
  'warminsko-mazurskie': 'fwn',
  wielkopolskie: 'fwp',
  zachodniopomorskie: 'fzp',
};

export const OTODOM_VOIVODESHIP_SLUGS: Record<Voivodeship, string> = {
  dolnoslaskie: 'dolnoslaskie',
  'kujawsko-pomorskie': 'kujawsko--pomorskie',
  lubelskie: 'lubelskie',
  lubuskie: 'lubuskie',
  lodzkie: 'lodzkie',
  malopolskie: 'malopolskie',
  mazowieckie: 'mazowieckie',
  opolskie: 'opolskie',
  podkarpackie: 'podkarpackie',
  podlaskie: 'podlaskie',
  pomorskie: 'pomorskie',
  slaskie: 'slaskie',
  swietokrzyskie: 'swietokrzyskie',
  'warminsko-mazurskie': 'warminsko--mazurskie',
  wielkopolskie: 'wielkopolskie',
  zachodniopomorskie: 'zachodniopomorskie',
};

export const SCRAPER_CONFIG = {
  requestDelayMs: { min: 1200, max: 2500 },
  maxPagesPerCategory: 50, // default cap per category per run
  itemsPerPage: 36,
  userAgents: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  ],
};
