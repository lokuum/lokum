import type { PropertyOffer, PropertyType, Voivodeship } from 'shared';
import { SCRAPER_CONFIG, SUPPORTED_TYPES, SUPPORTED_VOIVODESHIPS } from './config.js';
import { mergeOffers } from './engine/merger.js';
import { generateAndSaveSummary, loadPartition, savePartition } from './engine/storage.js';
import { fetchAdresowoPage } from './sources/adresowo.js';
import { fetchOtodomPage } from './sources/otodom.js';
import { randomDelay } from './utils/http.js';

interface CliArgs {
  voivodeships: Voivodeship[];
  types: PropertyType[];
  maxPages: number;
  sources: ('otodom' | 'adresowo')[];
  dryRun: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let voivodeships: Voivodeship[] = [...SUPPORTED_VOIVODESHIPS];
  let types: PropertyType[] = [...SUPPORTED_TYPES];
  let maxPages = SCRAPER_CONFIG.maxPagesPerCategory;
  let sources: ('otodom' | 'adresowo')[] = ['otodom', 'adresowo'];
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if ((arg === '--voivodeship' || arg === '-v') && args[i + 1]) {
      const v = args[i + 1].toLowerCase() as Voivodeship;
      if (SUPPORTED_VOIVODESHIPS.includes(v)) {
        voivodeships = [v];
      }
      i++;
    } else if ((arg === '--type' || arg === '-t') && args[i + 1]) {
      const t = args[i + 1].toLowerCase() as PropertyType;
      if (SUPPORTED_TYPES.includes(t)) {
        types = [t];
      }
      i++;
    } else if ((arg === '--limit' || arg === '-l') && args[i + 1]) {
      const parsed = parseInt(args[i + 1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        maxPages = parsed;
      }
      i++;
    } else if (arg === '--source' && args[i + 1]) {
      const s = args[i + 1].toLowerCase();
      if (s === 'otodom' || s === 'adresowo') {
        sources = [s];
      }
      i++;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (SUPPORTED_VOIVODESHIPS.includes(arg.toLowerCase() as Voivodeship)) {
      voivodeships = [arg.toLowerCase() as Voivodeship];
    } else if (SUPPORTED_TYPES.includes(arg.toLowerCase() as PropertyType)) {
      types = [arg.toLowerCase() as PropertyType];
    } else if (/^\d+$/.test(arg)) {
      maxPages = parseInt(arg, 10);
    }
  }

  return { voivodeships, types, maxPages, sources, dryRun };
}

async function scrapeCategory(
  voivodeship: Voivodeship,
  type: PropertyType,
  maxPages: number,
  sources: ('otodom' | 'adresowo')[]
): Promise<PropertyOffer[]> {
  console.log(`\n========================================`);
  console.log(`[START] ${type.toUpperCase()} w ${voivodeship.toUpperCase()}`);
  console.log(`========================================`);

  const freshOffers: PropertyOffer[] = [];

  // 1. Scrape Otodom
  if (sources.includes('otodom')) {
    console.log(`[Otodom] Rozpoczynam pobieranie (max stron: ${maxPages})...`);
    for (let page = 1; page <= maxPages; page++) {
      try {
        console.log(`[Otodom] Pobieranie ${voivodeship} / ${type} — strona ${page}...`);
        const result = await fetchOtodomPage(voivodeship, type, page);
        freshOffers.push(...result.items);
        console.log(`[Otodom] Strona ${page}: znaleziono ${result.items.length} ofert (razem: ${freshOffers.length})`);

        if (page >= result.totalPages || result.items.length === 0) {
          console.log(`[Otodom] Osiągnięto koniec wyników na stronie ${page}.`);
          break;
        }

        await randomDelay();
      } catch (err) {
        console.error(`[Otodom] Błąd na stronie ${page}:`, err instanceof Error ? err.message : err);
        break;
      }
    }
  }

  // 2. Scrape Adresowo
  if (sources.includes('adresowo')) {
    console.log(`\n[Adresowo] Rozpoczynam pobieranie (max stron: ${maxPages})...`);
    for (let page = 1; page <= maxPages; page++) {
      try {
        console.log(`[Adresowo] Pobieranie ${voivodeship} / ${type} — strona ${page}...`);
        const result = await fetchAdresowoPage(voivodeship, type, page);
        freshOffers.push(...result.items);
        console.log(`[Adresowo] Strona ${page}: znaleziono ${result.items.length} ofert (razem: ${freshOffers.length})`);

        if (page >= result.totalPages || result.items.length === 0) {
          console.log(`[Adresowo] Osiągnięto koniec wyników na stronie ${page}.`);
          break;
        }

        await randomDelay();
      } catch (err) {
        console.error(`[Adresowo] Błąd na stronie ${page}:`, err instanceof Error ? err.message : err);
        break;
      }
    }
  }

  return freshOffers;
}

async function main() {
  const options = parseArgs();
  console.log(`Lokum Scraper uruchomiony z parametrami:`);
  console.log(`- Województwa: ${options.voivodeships.join(', ')}`);
  console.log(`- Kategorie: ${options.types.join(', ')}`);
  console.log(`- Źródła: ${options.sources.join(', ')}`);
  console.log(`- Max stron per kategoria: ${options.maxPages}`);
  console.log(`- Dry run: ${options.dryRun}`);

  const allMergedOffers: PropertyOffer[] = [];

  for (const voivodeship of options.voivodeships) {
    for (const type of options.types) {
      const existing = await loadPartition(voivodeship, type);
      console.log(`\nWczytano z bazy: ${existing.length} ofert (${voivodeship} / ${type})`);

      const fresh = await scrapeCategory(voivodeship, type, options.maxPages, options.sources);
      console.log(`Pobrano łącznie ${fresh.length} ofert.`);

      const { merged, stats } = mergeOffers(existing, fresh);
      allMergedOffers.push(...merged);

      console.log(`\n--- Statystyki aktualizacji (${voivodeship} / ${type}) ---`);
      console.log(`  Nowe oferty:       ${stats.newOffersCount}`);
      console.log(`  Obniżki cen:       ${stats.priceDropsCount} 🔥`);
      console.log(`  Podwyżki cen:      ${stats.priceIncreasesCount}`);
      console.log(`  Cena bez zmian:    ${stats.unchangedCount}`);
      console.log(`  Usunięte/nieaktywne: ${stats.removedCount}`);
      console.log(`  Łącznie aktywne:   ${stats.totalActive}`);

      if (!options.dryRun) {
        await savePartition(voivodeship, type, merged);
        console.log(`Zapisano partycję dla ${voivodeship} / ${type}`);
      }
    }
  }

  if (!options.dryRun && allMergedOffers.length > 0) {
    console.log(`\nGenerowanie globalnego podsumowania (summary.json)...`);
    const summary = await generateAndSaveSummary(allMergedOffers);
    console.log(`Podsumowanie wygenerowane:`);
    console.log(`- Wszystkie domy: ${summary.totalHouses}`);
    console.log(`- Wszystkie działki: ${summary.totalPlots}`);
    console.log(`- Liczba obniżek cen: ${summary.totalPriceDrops}`);
    console.log(`- Średnia cena m² dom: ${summary.avgHousePricePerM2} zł/m²`);
    console.log(`- Średnia cena m² działka: ${summary.avgPlotPricePerM2} zł/m²`);
  }

  console.log(`\n[SUKCES] Zakończono proces scrapowania.`);
}

main().catch((err) => {
  console.error(`[FATAL ERROR]`, err);
  process.exit(1);
});
