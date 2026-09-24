import { describe, expect, it } from 'vitest';
import {
  formatArea,
  formatPrice,
  formatPricePerM2,
  getLocationCoordinates,
  inferCounty,
  isBorderLocation,
  normalizeText,
  VOIVODESHIPS,
} from 'shared';
import { ADRESOWO_VOIVODESHIP_CODES, OTODOM_VOIVODESHIP_SLUGS, SUPPORTED_VOIVODESHIPS } from '../src/config.js';

describe('normalizeText', () => {
  it('usuwa polskie znaki diakrytyczne i normalizuje tekst', () => {
    expect(normalizeText('Chełm')).toBe('chelm');
    expect(normalizeText('Biała Podlaska')).toBe('biala podlaska');
    expect(normalizeText('Zamość')).toBe('zamosc');
    expect(normalizeText('Włodawa')).toBe('wlodawa');
    expect(normalizeText('Sejneński')).toBe('sejnenski');
    expect(normalizeText('Łomżyński')).toBe('lomzynski');
  });
});

describe('isBorderLocation & inferCounty', () => {
  it('rozpoznaje Dorohusk jako miejscowość przygraniczną w lubelskim', () => {
    expect(isBorderLocation('lubelskie', 'chelmski', 'Dorohusk')).toBe(true);
    expect(isBorderLocation('lubelskie', 'chełmski', 'Dorohusk')).toBe(true);
    expect(isBorderLocation('lubelskie', undefined, 'Dorohusk')).toBe(true);
  });

  it('obsługuje dopasowania bez polskich znaków diakrytycznych', () => {
    expect(isBorderLocation('lubelskie', 'chelmski', 'Chelm')).toBe(true);
    expect(isBorderLocation('lubelskie', 'bialski', 'Biala Podlaska')).toBe(true);
    expect(isBorderLocation('lubelskie', 'wlodawski', 'Wlodawa')).toBe(true);
    expect(isBorderLocation('lubelskie', 'zamojski', 'Zamosc')).toBe(true);
  });

  it('poprawnie wyznacza powiat dla znanych miast przygranicznych', () => {
    expect(inferCounty('Dorohusk')).toBe('chełmski');
    expect(inferCounty('dorohusk')).toBe('chełmski');
    expect(inferCounty('Biała Podlaska')).toBe('bialski');
    expect(inferCounty('Zamość')).toBe('zamojski');
  });

  it('poprawnie wyznacza powiat i współrzędne dla miejscowości w Wielkopolsce', () => {
    expect(inferCounty('Sośnie')).toBe('ostrowski');
    expect(inferCounty('Pawłów')).toBe('ostrowski');
    expect(inferCounty('Folusz')).toBe('pleszewski');
    expect(inferCounty('Czerniejewo')).toBe('gnieźnieński');
    expect(inferCounty('Szczytniki')).toBe('kaliski');
    expect(inferCounty(undefined, 'powiat ostrowski')).toBe('ostrowski');
    expect(inferCounty('ostrowski')).toBe('ostrowski');
  });

  it('zwraca prawidłowe współrzędne dla miejscowości i powiatów, a nie domyślny Poznań', () => {
    // Pawłów / ostrowski (koło Ostrowa Wlkp / Sośni: lat ~51.5 - 51.7, lng ~17.6 - 17.9)
    const pawlowCoords = getLocationCoordinates('wielkopolskie', 'Pawłów', 'ostrowski');
    expect(pawlowCoords.lat).toBeLessThan(52.0);
    expect(pawlowCoords.lat).toBeGreaterThan(51.3);
    expect(pawlowCoords.lng).toBeGreaterThan(17.3);
    expect(pawlowCoords.lng).toBeLessThan(18.2);

    // Folusz / pleszewski (koło Pleszewa: lat ~51.8 - 52.0, lng ~17.6 - 17.9)
    const foluszCoords = getLocationCoordinates('wielkopolskie', 'Folusz', 'pleszewski');
    expect(foluszCoords.lat).toBeLessThan(52.1);
    expect(foluszCoords.lat).toBeGreaterThan(51.7);
    expect(foluszCoords.lng).toBeGreaterThan(17.5);
    expect(foluszCoords.lng).toBeLessThan(18.0);

    // Gdy miasto nieznane, ale podany jest powiat 'pilski' (okolice Piły: lat ~53.1)
    const pilaCoords = getLocationCoordinates('wielkopolskie', 'Nieznana wieś', 'pilski');
    expect(pilaCoords.lat).toBeGreaterThan(53.0);
    expect(pilaCoords.lng).toBeLessThan(17.2);
  });

  it('zwraca precyzyjne współrzędne dla podmiejskich miejscowości zamiast centrów stolic', () => {
    // Głogów Małopolski (pow. rzeszowski) - lat ~50.15, podczas gdy centrum Rzeszowa to lat ~50.04
    const glogowCoords = getLocationCoordinates('podkarpackie', 'Głogów Małopolski', 'rzeszowski');
    expect(glogowCoords.lat).toBeGreaterThan(50.12);
    expect(glogowCoords.lat).toBeLessThan(50.18);

    // Jasionka (pow. rzeszowski) - lat ~50.11, lng ~22.05
    const jasionkaCoords = getLocationCoordinates('podkarpackie', 'Jasionka', 'rzeszowski');
    expect(jasionkaCoords.lat).toBeGreaterThan(50.08);

    // Dys (pow. lubelski) - lat ~51.31, podczas gdy centrum Lublina to lat ~51.24
    const dysCoords = getLocationCoordinates('lubelskie', 'Dys', 'lubelski');
    expect(dysCoords.lat).toBeGreaterThan(51.29);

    // Wasilków (pow. białostocki) - lat ~53.20, podczas gdy centrum Białegostoku to lat ~53.13
    const wasilkowCoords = getLocationCoordinates('podlaskie', 'Wasilków', 'białostocki');
    expect(wasilkowCoords.lat).toBeGreaterThan(53.18);

    // Sierosław (pow. poznański) - lng ~16.67, podczas gdy centrum Poznania to lng ~16.92
    const sieroslawCoords = getLocationCoordinates('wielkopolskie', 'Sierosław', 'poznański');
    expect(sieroslawCoords.lng).toBeLessThan(16.75);
  });

  it('rozpoznaje dzielnicę stolic podaną w polu street i wyznacza jej koordynaty', () => {
    // Poznań Pokrzywno (południowy wschód: lat ~52.36, lng ~16.96)
    const pokrzywnoCoords = getLocationCoordinates('wielkopolskie', 'Poznań', 'poznański', undefined, 'Pokrzywno');
    expect(pokrzywnoCoords.lat).toBeLessThan(52.38);

    // Lublin Sławinek (północny zachód: lat ~51.26, lng ~22.51)
    const slawinekCoords = getLocationCoordinates('lubelskie', 'Lublin', 'lubelski', undefined, 'Sławinek');
    expect(slawinekCoords.lng).toBeLessThan(22.53);

    // Rzeszów Budziwój (południe: lat ~49.97, lng ~21.98)
    const budziwojCoords = getLocationCoordinates('podkarpackie', 'Rzeszów', 'rzeszowski', undefined, 'Budziwój');
    expect(budziwojCoords.lat).toBeLessThan(49.99);

    // Warszawa Mokotów (lat ~52.19, lng ~21.03)
    const mokotowCoords = getLocationCoordinates('mazowieckie', 'Warszawa', 'warszawski zachodni', undefined, 'Mokotów');
    expect(mokotowCoords.lat).toBeGreaterThan(52.17);
    expect(mokotowCoords.lat).toBeLessThan(52.22);

    // Wrocław Krzyki (lat ~51.07, lng ~17.01)
    const krzykiCoords = getLocationCoordinates('dolnoslaskie', 'Wrocław', 'wrocławski', undefined, 'Krzyki');
    expect(krzykiCoords.lat).toBeGreaterThan(51.05);
    expect(krzykiCoords.lat).toBeLessThan(51.10);

    // Kraków Nowa Huta (lat ~50.07, lng ~20.04)
    const nowaHutaCoords = getLocationCoordinates('malopolskie', 'Kraków', 'krakowski', undefined, 'Nowa Huta');
    expect(nowaHutaCoords.lng).toBeGreaterThan(20.00);
  });

  it('poprawnie rozpoznaje strefy przygraniczne dla nowych województw (DE, CZ, SK, RU)', () => {
    // Dolnośląskie (Czechy / Niemcy)
    expect(isBorderLocation('dolnoslaskie', 'zgorzelecki', 'Zgorzelec')).toBe(true);
    expect(isBorderLocation('dolnoslaskie', 'kłodzki', 'Kłodzko')).toBe(true);
    expect(isBorderLocation('dolnoslaskie', 'wrocławski', 'Wrocław')).toBe(false);

    // Zachodniopomorskie (Niemcy)
    expect(isBorderLocation('zachodniopomorskie', 'policki', 'Police')).toBe(true);
    expect(isBorderLocation('zachodniopomorskie', 'kamieński', 'Świnoujście')).toBe(true);
    expect(isBorderLocation('zachodniopomorskie', 'stargardzki', 'Stargard')).toBe(false);

    // Warmińsko-Mazurskie (Rosja)
    expect(isBorderLocation('warminsko-mazurskie', 'braniewski', 'Braniewo')).toBe(true);
    expect(isBorderLocation('warminsko-mazurskie', 'olsztyński', 'Olsztyn')).toBe(false);

    // Małopolskie (Słowacja)
    expect(isBorderLocation('malopolskie', 'tatrzański', 'Zakopane')).toBe(true);
    expect(isBorderLocation('malopolskie', 'krakowski', 'Kraków')).toBe(false);

    // Śląskie (Czechy / Słowacja)
    expect(isBorderLocation('slaskie', 'cieszyński', 'Cieszyn')).toBe(true);
    expect(isBorderLocation('slaskie', 'katowicki', 'Katowice')).toBe(false);

    // Województwa centralne nie mają stref przygranicznych
    expect(isBorderLocation('mazowieckie', 'radomski', 'Radom')).toBe(false);
    expect(isBorderLocation('lodzkie', 'piotrkowski', 'Piotrków Trybunalski')).toBe(false);
    expect(isBorderLocation('kujawsko-pomorskie', 'bydgoski', 'Bydgoszcz')).toBe(false);
  });

  it('poprawnie przypisuje powiaty dla miast ze wszystkich 16 województw', () => {
    expect(inferCounty('Wrocław')).toBe('wrocławski');
    expect(inferCounty('Kołobrzeg')).toBe('kołobrzeski');
    expect(inferCounty('Zakopane')).toBe('tatrzański');
    expect(inferCounty('Kraków')).toBe('krakowski');
    expect(inferCounty('Gdańsk')).toBe('gdański');
    expect(inferCounty('Sopot')).toBe('gdański');
    expect(inferCounty('Bydgoszcz')).toBe('bydgoski');
    expect(inferCounty('Toruń')).toBe('toruński');
    expect(inferCounty('Kielce')).toBe('kielecki');
    expect(inferCounty('Olsztyn')).toBe('olsztyński');
    expect(inferCounty('Opole')).toBe('opolski');
    expect(inferCounty('Gorzów Wielkopolski')).toBe('gorzowski');
    expect(inferCounty('Zielona Góra')).toBe('zielonogórski');
    expect(inferCounty('Katowice')).toBe('katowicki');
    expect(inferCounty('Częstochowa')).toBe('częstochowski');
  });
});

describe('formatArea', () => {
  it('dla działek powyżej 10 000 m2 podaje format z hektarami', () => {
    expect(formatArea(12200, true)).toContain('1.22 ha');
    expect(formatArea(10000, true)).toContain('1 ha');
    expect(formatArea(25000, true)).toContain('2.5 ha');
  });

  it('dla działek poniżej 10 000 m2 podaje ary lub metry', () => {
    expect(formatArea(1500, true)).toContain('15 a');
    expect(formatArea(400, true)).toBe('400 m²');
  });

  it('dla domów podaje czyste m2', () => {
    expect(formatArea(150, false)).toBe('150 m²');
  });
});

describe('formatPricePerM2', () => {
  it('formatuje cenę za metr z polskimi separatorami', () => {
    expect(formatPricePerM2(3.28)).toBe('3 zł/m²');
    expect(formatPricePerM2(2500)).toMatch(/2[\s\u00a0]?500 zł\/m²/);
  });
});

describe('16 voivodeships configuration', () => {
  it('zawiera dokładnie 16 województw w VOIVODESHIPS i SUPPORTED_VOIVODESHIPS', () => {
    expect(VOIVODESHIPS).toHaveLength(16);
    expect(SUPPORTED_VOIVODESHIPS).toHaveLength(16);
  });

  it('każde województwo posiada unikalny 3-literowy kod w Adresowo', () => {
    for (const v of SUPPORTED_VOIVODESHIPS) {
      const code = ADRESOWO_VOIVODESHIP_CODES[v];
      expect(code).toBeDefined();
      expect(code).toMatch(/^f[a-z]{2}$/);
    }
  });

  it('poprawnie mapuje podwójne myślniki dla Otodomu (kujawsko--pomorskie, warminsko--mazurskie)', () => {
    expect(OTODOM_VOIVODESHIP_SLUGS['kujawsko-pomorskie']).toBe('kujawsko--pomorskie');
    expect(OTODOM_VOIVODESHIP_SLUGS['warminsko-mazurskie']).toBe('warminsko--mazurskie');
    expect(OTODOM_VOIVODESHIP_SLUGS['dolnoslaskie']).toBe('dolnoslaskie');
    expect(OTODOM_VOIVODESHIP_SLUGS['mazowieckie']).toBe('mazowieckie');
  });
});
