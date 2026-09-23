import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CITY_COORDINATES, normalizeText } from 'shared';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheFile = path.resolve(__dirname, 'geocoded_cache.json');
const needFile = path.resolve(__dirname, 'need_geocode.json');

const need = JSON.parse(fs.readFileSync(needFile, 'utf8'));
// We want top places with count >= 4 (covers over 75% of offers that lack precise city coords)
// We also can take the top 500 places.
const targetPlaces = need.slice(0, 500);

let cache: Record<string, { lat: number; lng: number; displayName: string }> = {};
if (fs.existsSync(cacheFile)) {
  try {
    cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  } catch {
    cache = {};
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Starting geocoding for ${targetPlaces.length} locations...`);
  let fetched = 0;
  let skipped = 0;
  let notFound = 0;

  for (let i = 0; i < targetPlaces.length; i++) {
    const item = targetPlaces[i];
    const key = normalizeText(item.city);

    if (cache[key] || CITY_COORDINATES[key]) {
      skipped++;
      continue;
    }

    let queryCity = item.city.trim();
    if (queryCity.startsWith('Rzeszów ')) {
      queryCity = queryCity.replace('Rzeszów ', '');
    }

    const county = item.county ? item.county.replace(/^powiat\s+/i, '') : '';
    const query = `${queryCity}${county ? `, powiat ${county}` : ''}, ${item.voivodeship}, Polska`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'LokumPropertyScraper/1.0 (internal-research)',
          'Accept-Language': 'pl',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          cache[key] = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name,
          };
          fetched++;
          console.log(`[${i + 1}/${targetPlaces.length}] OK: ${item.city} -> lat: ${data[0].lat}, lng: ${data[0].lon}`);
        } else {
          // Fallback query without county
          await sleep(1000);
          const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${queryCity}, ${item.voivodeship}, Polska`)}&format=json&limit=1`;
          const resFallback = await fetch(fallbackUrl, {
            headers: {
              'User-Agent': 'LokumPropertyScraper/1.0 (internal-research)',
              'Accept-Language': 'pl',
            },
          });
          const dataFallback = await resFallback.json();
          if (dataFallback && dataFallback.length > 0) {
            cache[key] = {
              lat: parseFloat(dataFallback[0].lat),
              lng: parseFloat(dataFallback[0].lon),
              displayName: dataFallback[0].display_name,
            };
            fetched++;
            console.log(`[${i + 1}/${targetPlaces.length}] OK (fallback): ${item.city} -> lat: ${dataFallback[0].lat}, lng: ${dataFallback[0].lon}`);
          } else {
            notFound++;
            console.warn(`[${i + 1}/${targetPlaces.length}] Not found: ${item.city} (${item.voivodeship})`);
          }
        }
      } else {
        console.warn(`[${i + 1}/${targetPlaces.length}] HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error(`Error fetching ${item.city}:`, err);
    }

    if (fetched > 0 && fetched % 10 === 0) {
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
    }

    await sleep(1000); // 1 request per second
  }

  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
  console.log(`Completed. Fetched: ${fetched}, Skipped: ${skipped}, Not found: ${notFound}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
