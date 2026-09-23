import type { PropertyOffer, PropertyType, Voivodeship } from 'shared';
import {
  getLocationCoordinates,
  inferCounty,
  isBorderLocation,
  normalizeText,
} from 'shared';
import { SUPPORTED_TYPES, SUPPORTED_VOIVODESHIPS } from '../config.js';
import { generateSummaryFromAllPartitions, loadPartition, savePartition } from '../engine/storage.js';

// Lista miejscowości podmiejskich do detekcji w tytule oferty
const SUBURBAN_CITIES = [
  'Głogów Małopolski', 'Jasionka', 'Zaczernie', 'Tyczyn', 'Boguchwała', 'Świlcza', 'Trzebownisko',
  'Krasne', 'Malawa', 'Stobierna', 'Lutoryż', 'Mogielnica', 'Racławówka', 'Chmielnik',
  'Sokołów Małopolski', 'Dynów', 'Borek Stary', 'Hermanowa', 'Bratkowice', 'Strażów', 'Kielnarowa',
  'Dys', 'Turka', 'Jakubowice Konińskie', 'Niedrzwica Duża', 'Konopnica', 'Motycz', 'Kalinówka',
  'Niemce', 'Panieńszczyzna', 'Snopków', 'Nasutów', 'Marysin', 'Prawiedniki', 'Lipniak', 'Jabłonna',
  'Choroszcz', 'Wasilków', 'Nowodworce', 'Klepacze', 'Zabłudów', 'Zaścianki', 'Łapy', 'Sobolewo',
  'Grabówka', 'Studzianki', 'Fasty', 'Dobrzyniewo', 'Supraśl', 'Czarna Białostocka',
  'Sierosław', 'Tarnowo Podgórne', 'Swarzędz', 'Kórnik', 'Mosina', 'Komorniki', 'Luboń',
  'Dąbrówka', 'Plewiska', 'Skórzewo', 'Suchy Las', 'Czerwonak', 'Rokietnica', 'Murowana Goślina',
];

async function main() {
  console.log('=== Rozpoczynam pełną rekalkulację geolokalizacji ofert ===');

  let totalProcessed = 0;
  let updatedCounties = 0;
  let detectedSuburbs = 0;
  let borderZoneCount = 0;

  for (const v of SUPPORTED_VOIVODESHIPS) {
    for (const t of SUPPORTED_TYPES) {
      const offers = await loadPartition(v, t);
      if (offers.length === 0) continue;

      let partitionUpdated = 0;

      for (const item of offers) {
        totalProcessed++;

        // 1. Sprawdzenie, czy oferta w dużej stolicy nie ma podmiejskiej miejscowości w tytule
        const normCity = item.city ? normalizeText(item.city) : '';
        if (['poznan', 'lublin', 'rzeszow', 'bialystok'].includes(normCity)) {
          for (const sub of SUBURBAN_CITIES) {
            const re = new RegExp(`\\b${sub}(?:ej|ie|a|e|owi|ach|em|ą)?\\b`, 'i');
            if (re.test(item.title)) {
              item.city = sub;
              detectedSuburbs++;
              break;
            }
          }
        }

        // 2. Inferencja powiatu z nazwy miejscowości
        const oldCounty = item.county;
        const resolvedCounty = inferCounty(item.city, item.county) || item.county;
        if (resolvedCounty && resolvedCounty !== oldCounty) {
          item.county = resolvedCounty;
          updatedCounties++;
        }

        // 3. Weryfikacja strefy przygranicznej
        item.isNearBorder = isBorderLocation(item.voivodeship, item.county, item.city);
        if (item.isNearBorder) {
          borderZoneCount++;
        }

        // 4. Rekalkulacja współrzędnych geograficznych z uwzględnieniem street/dzielnicy
        item.coordinates = getLocationCoordinates(v, item.city, item.county, undefined, item.street);
        partitionUpdated++;
      }

      await savePartition(v, t, offers);
      console.log(`[${v} / ${t}] Przeliczono ${partitionUpdated} ofert.`);
    }
  }

  console.log(`\n=== Podsumowanie rekalkulacji ===`);
  console.log(`- Przetworzono łącznie ofert: ${totalProcessed}`);
  console.log(`- Wykryto podmiejskich miejscowości w stolicach: ${detectedSuburbs}`);
  console.log(`- Zaktualizowano powiatów: ${updatedCounties}`);
  console.log(`- Ofert w pasie przygranicznym: ${borderZoneCount}`);

  console.log('\nGenerowanie globalnego summary.json...');
  await generateSummaryFromAllPartitions();
  console.log('=== Zakończono pomyślnie! ===');
}

main().catch((err) => {
  console.error('Błąd podczas rekalkulacji:', err);
  process.exit(1);
});
