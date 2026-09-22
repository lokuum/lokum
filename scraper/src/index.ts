import type { PropertyOffer, PropertyType, Voivodeship } from 'shared';
import { SCRAPER_CONFIG, SUPPORTED_TYPES, SUPPORTED_VOIVODESHIPS } from './config.js';
import { mergeOffers } from './engine/merger.js';
import { generateAndSaveSummary, generateSummaryFromAllPartitions, loadPartition, savePartition } from './engine/storage.js';
import { fetchAdresowoPage } from './sources/adresowo.js';
import { fetchOtodomPage } from './sources/otodom.js';
import { randomDelay } from './utils/http.js';

interface CliArgs {
  voivodeships: Voivodeship[];
  types: PropertyType[];
  maxPages: number;
  sources: ('otodom' | 'adresowo')[];
  dryRun: boolean;
  summaryOnly: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let voivodeships: Voivodeship[] = [...SUPPORTED_VOIVODESHIPS];
  let types: PropertyType[] = [...SUPPORTED_TYPES];
  let maxPages = SCRAPER_CONFIG.maxPagesPerCategory;
  let sources: ('otodom' | 'adresowo')[] = ['otodom', 'adresowo'];
  let dryRun = false;
  let summaryOnly = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--summary-only') {
      summaryOnly = true;
    } else if ((arg === '--voivodeship' || arg === '-v') && args[i + 1]) {
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

  return { voivodeships, types, maxPages, sources, dryRun, summaryOnly };
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

  if (options.summaryOnly) {
    console.log(`\nGenerowanie globalnego podsumowania (summary.json) ze wszystkich partycji na dysku...`);
    const summary = await generateSummaryFromAllPartitions();
    console.log(`Podsumowanie wygenerowane:`);
    console.log(`- Wszystkie domy: ${summary.totalHouses}`);
    console.log(`- Wszystkie działki: ${summary.totalPlots}`);
    console.log(`- Wszystkie siedliska: ${summary.totalHabitats}`);
    console.log(`- Liczba obniżek cen: ${summary.totalPriceDrops}`);
    console.log(`- Średnia cena m² dom: ${summary.avgHousePricePerM2} zł/m²`);
    console.log(`- Średnia cena m² działka: ${summary.avgPlotPricePerM2} zł/m²`);
    console.log(`- Średnia cena m² siedlisko: ${summary.avgHabitatPricePerM2} zł/m²`);
    return;
  }

  console.log(`Lokum Scraper uruchomiony z parametrami:`);
  console.log(`- Województwa: ${options.voivodeships.join(', ')}`);
  console.log(`- Kategorie: ${options.types.join(', ')}`);
  console.log(`- Źródła: ${options.sources.join(', ')}`);
  console.log(`- Max stron per kategoria: ${options.maxPages}`);
  console.log(`- Dry run: ${options.dryRun}`);

  for (const voivodeship of options.voivodeships) {
    // 1. Wczytaj istniejące partycje
    const existingHouses = await loadPartition(voivodeship, 'house');
    const existingPlots = await loadPartition(voivodeship, 'plot');
    const existingHabitats = await loadPartition(voivodeship, 'habitat');

    console.log(`\nWczytano z bazy dla ${voivodeship.toUpperCase()}:`);
    console.log(`  - Domy: ${existingHouses.length}`);
    console.log(`  - Działki: ${existingPlots.length}`);
    console.log(`  - Siedliska: ${existingHabitats.length}`);

    // Określamy kategorie do odpytania portali (domy i działki obejmują wszystkie nieruchomości, w tym siedliska)
    const typesToScrape: ('house' | 'plot')[] = [];
    if (options.types.includes('house') || options.types.includes('habitat')) typesToScrape.push('house');
    if (options.types.includes('plot') || options.types.includes('habitat')) {
      if (!typesToScrape.includes('plot')) typesToScrape.push('plot');
    }

    const freshAll: PropertyOffer[] = [];
    for (const scrapeType of typesToScrape) {
      const fresh = await scrapeCategory(voivodeship, scrapeType, options.maxPages, options.sources);
      freshAll.push(...fresh);
    }
    console.log(`Pobrano łącznie ${freshAll.length} ofert dla ${voivodeship}.`);

    // Podział na 3 grupy
    const freshHouses = freshAll.filter((o) => o.propertyType === 'house');
    const freshPlots = freshAll.filter((o) => o.propertyType === 'plot');
    const freshHabitats = freshAll.filter((o) => o.propertyType === 'habitat');

    const updateGroup = async (name: string, type: PropertyType, existing: PropertyOffer[], fresh: PropertyOffer[]) => {
      const { merged, stats } = mergeOffers(existing, fresh);
      console.log(`\n--- Statystyki aktualizacji (${voivodeship} / ${name}) ---`);
      console.log(`  Nowe oferty:       ${stats.newOffersCount}`);
      console.log(`  Obniżki cen:       ${stats.priceDropsCount} 🔥`);
      console.log(`  Podwyżki cen:      ${stats.priceIncreasesCount}`);
      console.log(`  Cena bez zmian:    ${stats.unchangedCount}`);
      console.log(`  Usunięte/nieaktywne: ${stats.removedCount}`);
      console.log(`  Łącznie aktywne:   ${stats.totalActive}`);

      if (!options.dryRun) {
        await savePartition(voivodeship, type, merged);
        console.log(`Zapisano partycję dla ${voivodeship} / ${name} (${merged.length} ofert)`);
      }
    };

    if (options.types.includes('house')) {
      await updateGroup('Domy', 'house', existingHouses, freshHouses);
    }
    if (options.types.includes('plot')) {
      await updateGroup('Działki', 'plot', existingPlots, freshPlots);
    }
    if (options.types.includes('habitat')) {
      await updateGroup('Siedliska', 'habitat', existingHabitats, freshHabitats);
    }
  }

  if (!options.dryRun) {
    console.log(`\nGenerowanie globalnego podsumowania (summary.json)...`);
    const summary = await generateSummaryFromAllPartitions();
    console.log(`Podsumowanie wygenerowane:`);
    console.log(`- Wszystkie domy: ${summary.totalHouses}`);
    console.log(`- Wszystkie działki: ${summary.totalPlots}`);
    console.log(`- Wszystkie siedliska: ${summary.totalHabitats}`);
    console.log(`- Liczba obniżek cen: ${summary.totalPriceDrops}`);
    console.log(`- Średnia cena m² dom: ${summary.avgHousePricePerM2} zł/m²`);
    console.log(`- Średnia cena m² działka: ${summary.avgPlotPricePerM2} zł/m²`);
    console.log(`- Średnia cena m² siedlisko: ${summary.avgHabitatPricePerM2} zł/m²`);
  }

  console.log(`\n[SUKCES] Zakończono proces scrapowania.`);
}

main().catch((err) => {
  console.error(`[FATAL ERROR]`, err);
  process.exit(1);
});
