import type { Voivodeship } from './types.js';

export const VOIVODESHIPS: { id: Voivodeship; name: string; borderWith: string }[] = [
  { id: 'lubelskie', name: 'Lubelskie', borderWith: 'Ukraina / Białoruś' },
  { id: 'podlaskie', name: 'Podlaskie', borderWith: 'Białoruś / Litwa' },
  { id: 'podkarpackie', name: 'Podkarpackie', borderWith: 'Ukraina / Słowacja' },
  { id: 'wielkopolskie', name: 'Wielkopolskie', borderWith: 'Region Zachodni' },
];

/**
 * Centra miast i powiatów we wschodniej Polsce (współrzędne geograficzne)
 */
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // --- Lubelskie ---
  chełm: { lat: 51.1333, lng: 23.4833 },
  chelm: { lat: 51.1333, lng: 23.4833 },
  zamość: { lat: 50.7206, lng: 23.2589 },
  zamosc: { lat: 50.7206, lng: 23.2589 },
  'biała podlaska': { lat: 52.0326, lng: 23.1165 },
  'biala podlaska': { lat: 52.0326, lng: 23.1165 },
  hrubieszów: { lat: 50.8052, lng: 23.8912 },
  hrubieszow: { lat: 50.8052, lng: 23.8912 },
  'tomaszów lubelski': { lat: 50.4485, lng: 23.4162 },
  'tomaszow lubelski': { lat: 50.4485, lng: 23.4162 },
  włodawa: { lat: 51.5438, lng: 23.5511 },
  wlodawa: { lat: 51.5438, lng: 23.5511 },
  krasnystaw: { lat: 50.9856, lng: 23.1764 },
  biłgoraj: { lat: 50.5408, lng: 22.7214 },
  bilgoraj: { lat: 50.5408, lng: 22.7214 },
  terespol: { lat: 52.0754, lng: 23.6166 },
  zwierzyniec: { lat: 50.6144, lng: 22.9686 },
  szczebrzeszyn: { lat: 50.6972, lng: 22.9772 },
  krasnobród: { lat: 50.5458, lng: 23.2083 },
  krasnobrod: { lat: 50.5458, lng: 23.2083 },
  dorohusk: { lat: 51.1614, lng: 23.8053 },
  parczew: { lat: 51.6403, lng: 22.9014 },
  lubartów: { lat: 51.4619, lng: 22.6078 },
  lubartow: { lat: 51.4619, lng: 22.6078 },
  łęczna: { lat: 51.3008, lng: 22.8803 },
  leczna: { lat: 51.3008, lng: 22.8803 },
  świdnik: { lat: 51.2189, lng: 22.6953 },
  swidnik: { lat: 51.2189, lng: 22.6953 },
  lublin: { lat: 51.2465, lng: 22.5684 },
  kraśnik: { lat: 50.9239, lng: 22.2247 },
  krasnik: { lat: 50.9239, lng: 22.2247 },
  puławy: { lat: 51.4166, lng: 21.9694 },
  pulawy: { lat: 51.4166, lng: 21.9694 },
  'radzyń podlaski': { lat: 51.7831, lng: 22.6181 },
  'radzyn podlaski': { lat: 51.7831, lng: 22.6181 },
  łuków: { lat: 51.9286, lng: 22.3839 },
  lukow: { lat: 51.9286, lng: 22.3839 },
  ryki: { lat: 51.6253, lng: 21.9333 },
  'opole lubelskie': { lat: 51.1472, lng: 21.9706 },
  'janów lubelski': { lat: 50.7072, lng: 22.4103 },
  'janow lubelski': { lat: 50.7072, lng: 22.4103 },
  'janów podlaski': { lat: 52.1969, lng: 23.2117 },
  sławatycze: { lat: 51.7619, lng: 23.5556 },
  slawatycze: { lat: 51.7619, lng: 23.5556 },

  // --- Podlaskie ---
  białystok: { lat: 53.1325, lng: 23.1688 },
  bialystok: { lat: 53.1325, lng: 23.1688 },
  hajnówka: { lat: 52.7433, lng: 23.5811 },
  hajnowka: { lat: 52.7433, lng: 23.5811 },
  'bielsk podlaski': { lat: 52.7667, lng: 23.1931 },
  siemiatycze: { lat: 52.4272, lng: 22.8628 },
  sokółka: { lat: 53.4069, lng: 23.5039 },
  sokolka: { lat: 53.4069, lng: 23.5039 },
  augustów: { lat: 53.8433, lng: 22.9797 },
  augustow: { lat: 53.8433, lng: 22.9797 },
  suwałki: { lat: 54.1006, lng: 22.9308 },
  suwalki: { lat: 54.1006, lng: 22.9308 },
  sejny: { lat: 54.1072, lng: 23.3486 },
  łomża: { lat: 53.1781, lng: 22.0594 },
  lomza: { lat: 53.1781, lng: 22.0594 },
  grajewo: { lat: 53.6472, lng: 22.4542 },
  zambrów: { lat: 52.9856, lng: 22.2433 },
  zambrow: { lat: 52.9856, lng: 22.2433 },
  mońki: { lat: 53.4056, lng: 22.7961 },
  monki: { lat: 53.4056, lng: 22.7961 },
  kolno: { lat: 53.4111, lng: 21.9333 },
  'dąbrowa białostocka': { lat: 53.6536, lng: 23.3489 },
  'dabrowa bialostocka': { lat: 53.6536, lng: 23.3489 },
  lipsk: { lat: 53.7333, lng: 23.4000 },
  krynki: { lat: 53.2642, lng: 23.7725 },
  michałowo: { lat: 53.0333, lng: 23.6000 },
  michalowo: { lat: 53.0333, lng: 23.6000 },
  białowieża: { lat: 52.7011, lng: 23.8681 },
  bialowieza: { lat: 52.7011, lng: 23.8681 },
  czeremcha: { lat: 52.5167, lng: 23.3500 },
  kleszczele: { lat: 52.5739, lng: 23.3258 },
  supraśl: { lat: 53.2081, lng: 23.3364 },
  suprasl: { lat: 53.2081, lng: 23.3364 },
  kuźnica: { lat: 53.5117, lng: 23.6456 },
  kuznica: { lat: 53.5117, lng: 23.6456 },

  // --- Podkarpackie ---
  rzeszów: { lat: 50.0412, lng: 21.9991 },
  rzeszow: { lat: 50.0412, lng: 21.9991 },
  przemyśl: { lat: 49.7839, lng: 22.7678 },
  przemysl: { lat: 49.7839, lng: 22.7678 },
  jarosław: { lat: 50.0189, lng: 22.6842 },
  jaroslaw: { lat: 50.0189, lng: 22.6842 },
  lubaczów: { lat: 50.1558, lng: 23.1239 },
  lubaczow: { lat: 50.1558, lng: 23.1239 },
  sanok: { lat: 49.5583, lng: 22.2056 },
  lesko: { lat: 49.4697, lng: 22.3297 },
  'ustrzyki dolne': { lat: 49.4311, lng: 22.5936 },
  krosno: { lat: 49.6886, lng: 21.7706 },
  jasło: { lat: 49.7453, lng: 21.4725 },
  jaslo: { lat: 49.7453, lng: 21.4725 },
  mielec: { lat: 50.2872, lng: 21.4239 },
  dębica: { lat: 50.0514, lng: 21.4114 },
  debica: { lat: 50.0514, lng: 21.4114 },
  'stalowa wola': { lat: 50.5828, lng: 22.0536 },
  tarnobrzeg: { lat: 50.5739, lng: 21.6797 },
  łańcut: { lat: 50.0683, lng: 22.2306 },
  lancut: { lat: 50.0683, lng: 22.2306 },
  przeworsk: { lat: 50.0603, lng: 22.4939 },
  leżajsk: { lat: 50.2639, lng: 22.4236 },
  lezajsk: { lat: 50.2639, lng: 22.4236 },
  nisko: { lat: 50.5206, lng: 22.1408 },
  kolbuszowa: { lat: 50.2458, lng: 21.7706 },
  strzyżów: { lat: 49.8708, lng: 21.7925 },
  strzyzow: { lat: 49.8708, lng: 21.7925 },
  brzozów: { lat: 49.6947, lng: 22.0194 },
  brzozow: { lat: 49.6947, lng: 22.0194 },
  ropczyce: { lat: 50.0525, lng: 21.6094 },
  radymno: { lat: 49.9467, lng: 22.8219 },
  medyka: { lat: 49.8050, lng: 22.9300 },
  krasiczyn: { lat: 49.7761, lng: 22.6508 },
  solina: { lat: 49.3986, lng: 22.4497 },
  polańczyk: { lat: 49.3683, lng: 22.4217 },
  polanczyk: { lat: 49.3683, lng: 22.4217 },
  cisna: { lat: 49.2131, lng: 22.3275 },
  wetlina: { lat: 49.1558, lng: 22.4706 },
  lutowiska: { lat: 49.2558, lng: 22.6953 },
  'horyniec-zdrój': { lat: 50.1917, lng: 23.3606 },
  horyniec: { lat: 50.1917, lng: 23.3606 },
  narol: { lat: 50.3547, lng: 23.3278 },
  cieszanów: { lat: 50.2456, lng: 23.1319 },
  cieszanow: { lat: 50.2456, lng: 23.1319 },

  // --- Wielkopolskie ---
  poznań: { lat: 52.4064, lng: 16.9252 },
  poznan: { lat: 52.4064, lng: 16.9252 },
  kalisz: { lat: 51.7673, lng: 18.0853 },
  konin: { lat: 52.2230, lng: 18.2512 },
  piła: { lat: 53.1514, lng: 16.7378 },
  pila: { lat: 53.1514, lng: 16.7378 },
  'ostrow wielkopolski': { lat: 51.6550, lng: 17.8068 },
  'ostrów wielkopolski': { lat: 51.6550, lng: 17.8068 },
  gniezno: { lat: 52.5348, lng: 17.5826 },
  leszno: { lat: 51.8427, lng: 16.5749 },
  luboń: { lat: 52.3394, lng: 16.8906 },
  lubon: { lat: 52.3394, lng: 16.8906 },
  września: { lat: 52.3253, lng: 17.5650 },
  wrzesnia: { lat: 52.3253, lng: 17.5650 },
  swarzędz: { lat: 52.4131, lng: 17.0789 },
  swarzedz: { lat: 52.4131, lng: 17.0789 },
  śrem: { lat: 52.0886, lng: 17.0153 },
  srem: { lat: 52.0886, lng: 17.0153 },
  krotoszyn: { lat: 51.6975, lng: 17.4372 },
  turek: { lat: 52.0161, lng: 18.5008 },
  jarocin: { lat: 51.9728, lng: 17.5025 },
  wągrowiec: { lat: 52.8081, lng: 17.1997 },
  wagrowiec: { lat: 52.8081, lng: 17.1997 },
  kościan: { lat: 52.0886, lng: 16.6492 },
  koscian: { lat: 52.0886, lng: 16.6492 },
  koło: { lat: 52.2003, lng: 18.6386 },
  kolo: { lat: 52.2003, lng: 18.6386 },
  'środa wielkopolska': { lat: 52.2289, lng: 17.2742 },
  'sroda wielkopolska': { lat: 52.2289, lng: 17.2742 },
  rawicz: { lat: 51.6094, lng: 16.8581 },
  gostyń: { lat: 51.8789, lng: 17.0125 },
  gostyn: { lat: 51.8789, lng: 17.0125 },
  chodzież: { lat: 52.9936, lng: 16.9142 },
  chodziez: { lat: 52.9936, lng: 16.9142 },
  szamotuły: { lat: 52.6117, lng: 16.5778 },
  szamotuly: { lat: 52.6117, lng: 16.5778 },
  złotów: { lat: 53.3611, lng: 17.0417 },
  zlotow: { lat: 53.3611, lng: 17.0417 },
  oborniki: { lat: 52.6467, lng: 16.8153 },
  pleszew: { lat: 51.8958, lng: 17.7850 },
  trzcianka: { lat: 53.0406, lng: 16.4589 },
  'nowy tomyśl': { lat: 52.3167, lng: 16.1333 },
  'nowy tomysl': { lat: 52.3167, lng: 16.1333 },
  'grodzisk wielkopolski': { lat: 52.2272, lng: 16.3653 },
  ostrzeszów: { lat: 51.4283, lng: 17.9256 },
  ostrzeszow: { lat: 51.4283, lng: 17.9256 },
  słupca: { lat: 52.2903, lng: 17.8722 },
  slupca: { lat: 52.2903, lng: 17.8722 },
  wolsztyn: { lat: 52.1158, lng: 16.1150 },
  mosina: { lat: 52.2464, lng: 16.8489 },
  wronki: { lat: 52.7094, lng: 16.3814 },
  czarnków: { lat: 52.9031, lng: 16.5647 },
  czarnkow: { lat: 52.9031, lng: 16.5647 },
  rogoźno: { lat: 52.7539, lng: 16.9997 },
  rogozno: { lat: 52.7539, lng: 16.9997 },
  międzychód: { lat: 52.6033, lng: 15.8906 },
  miedzychod: { lat: 52.6033, lng: 15.8906 },
  kórnik: { lat: 52.2436, lng: 17.0942 },
  kornik: { lat: 52.2436, lng: 17.0942 },
  kostrzyn: { lat: 52.3986, lng: 17.2278 },
  puszczykowo: { lat: 52.2817, lng: 16.8589 },
  pobiedziska: { lat: 52.4819, lng: 17.2794 },
};

/**
 * Normalizuje tekst: małe litery, usunięcie polskich znaków diakrytycznych i zbędnych spacji.
 */
export function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'l')
    .trim();
}

/**
 * Miasta na prawach powiatu oraz mapowanie miast do powiatów
 */
export const CITY_TO_COUNTY: Record<string, string> = {
  // Lubelskie
  zamość: 'zamojski',
  zamosc: 'zamojski',
  chełm: 'chełmski',
  chelm: 'chełmski',
  dorohusk: 'chełmski',
  sawin: 'chełmski',
  żmudź: 'chełmski',
  zmudz: 'chełmski',
  horodyszcze: 'chełmski',
  'biała podlaska': 'bialski',
  'biala podlaska': 'bialski',
  terespol: 'bialski',
  sławatycze: 'bialski',
  slawatycze: 'bialski',
  'janów podlaski': 'bialski',
  'janow podlaski': 'bialski',
  kodeń: 'bialski',
  koden: 'bialski',
  'międzyrzec podlaski': 'bialski',
  'miedzyrzec podlaski': 'bialski',
  piszczac: 'bialski',
  lublin: 'lubelski',
  hrubieszów: 'hrubieszowski',
  hrubieszow: 'hrubieszowski',
  horodło: 'hrubieszowski',
  horodlo: 'hrubieszowski',
  werbkowice: 'hrubieszowski',
  dołhobyczów: 'hrubieszowski',
  dolhobyczow: 'hrubieszowski',
  mircze: 'hrubieszowski',
  'tomaszów lubelski': 'tomaszowski',
  'tomaszow lubelski': 'tomaszowski',
  bełżec: 'tomaszowski',
  belzec: 'tomaszowski',
  susiec: 'tomaszowski',
  'lubycza królewska': 'tomaszowski',
  'lubycza krolewska': 'tomaszowski',
  włodawa: 'włodawski',
  wlodawa: 'włodawski',
  okuninka: 'włodawski',
  krasnystaw: 'krasnostawski',
  biłgoraj: 'biłgorajski',
  bilgoraj: 'biłgorajski',
  zwierzyniec: 'zamojski',
  szczebrzeszyn: 'zamojski',
  krasnobród: 'zamojski',
  krasnobrod: 'zamojski',

  // Podlaskie
  białystok: 'białostocki',
  bialystok: 'białostocki',
  suwałki: 'suwalski',
  suwalki: 'suwalski',
  wiżajny: 'suwalski',
  wizajny: 'suwalski',
  łomża: 'łomżyński',
  lomza: 'łomżyński',
  hajnówka: 'hajnowski',
  hajnowka: 'hajnowski',
  białowieża: 'hajnowski',
  bialowieza: 'hajnowski',
  czeremcha: 'hajnowski',
  kleszczele: 'hajnowski',
  narewka: 'hajnowski',
  sokółka: 'sokólski',
  sokolka: 'sokólski',
  krynki: 'sokólski',
  kuźnica: 'sokólski',
  kuznica: 'sokólski',
  'dąbrowa białostocka': 'sokólski',
  'dabrowa bialostocka': 'sokólski',
  augustów: 'augustowski',
  augustow: 'augustowski',
  lipsk: 'augustowski',
  płaska: 'augustowski',
  plaska: 'augustowski',
  sztabin: 'augustowski',
  siemiatycze: 'siemiatycki',
  'bielsk podlaski': 'bielski',
  sejny: 'sejneński',
  giby: 'sejneński',
  puńsk: 'sejneński',
  punsk: 'sejneński',

  // Podkarpackie
  przemyśl: 'przemyski',
  przemysl: 'przemyski',
  medyka: 'przemyski',
  żurawica: 'przemyski',
  zurawica: 'przemyski',
  rzeszów: 'rzeszowski',
  rzeszow: 'rzeszowski',
  krosno: 'krośnieński',
  tarnobrzeg: 'tarnobrzeski',
  jarosław: 'jarosławski',
  jaroslaw: 'jarosławski',
  korczowa: 'jarosławski',
  radymno: 'jarosławski',
  lubaczów: 'lubaczowski',
  lubaczow: 'lubaczowski',
  'horyniec-zdrój': 'lubaczowski',
  'horyniec zdroj': 'lubaczowski',
  narol: 'lubaczowski',
  cieszanów: 'lubaczowski',
  cieszanow: 'lubaczowski',
  sanok: 'sanocki',
  lesko: 'leski',
  solina: 'leski',
  polańczyk: 'leski',
  polanczyk: 'leski',
  cisna: 'leski',
  'ustrzyki dolne': 'bieszczadzki',
  lutowiska: 'bieszczadzki',
  krościenko: 'bieszczadzki',
  kroscienko: 'bieszczadzki',

  // Wielkopolskie
  poznań: 'poznański',
  poznan: 'poznański',
  kalisz: 'kaliski',
  konin: 'koniński',
  piła: 'pilski',
  pila: 'pilski',
  'ostrow wielkopolski': 'ostrowski',
  'ostrów wielkopolski': 'ostrowski',
  gniezno: 'gnieźnieński',
  leszno: 'leszczyński',
  luboń: 'poznański',
  lubon: 'poznański',
  września: 'wrzesiński',
  wrzesnia: 'wrzesiński',
  swarzędz: 'poznański',
  swarzedz: 'poznański',
  śrem: 'śremski',
  srem: 'śremski',
  krotoszyn: 'krotoszyński',
  turek: 'turecki',
  jarocin: 'jarociński',
  wągrowiec: 'wągrowiecki',
  wagrowiec: 'wągrowiecki',
  kościan: 'kościański',
  koscian: 'kościański',
  koło: 'kolski',
  kolo: 'kolski',
  'środa wielkopolska': 'średzki',
  'sroda wielkopolska': 'średzki',
  rawicz: 'rawicki',
  gostyń: 'gostyński',
  gostyn: 'gostyński',
  chodzież: 'chodzieski',
  chodziez: 'chodzieski',
  szamotuły: 'szamotulski',
  szamotuly: 'szamotulski',
  złotów: 'złotowski',
  zlotow: 'złotowski',
  oborniki: 'obornicki',
  pleszew: 'pleszewski',
  trzcianka: 'czarnkowsko-trzcianecki',
  'nowy tomyśl': 'nowotomyski',
  'nowy tomysl': 'nowotomyski',
  'grodzisk wielkopolski': 'grodziski',
  ostrzeszów: 'ostrzeszowski',
  ostrzeszow: 'ostrzeszowski',
  słupca: 'słupecki',
  slupca: 'słupecki',
  wolsztyn: 'wolsztyński',
  mosina: 'poznański',
  wronki: 'szamotulski',
  czarnków: 'czarnkowsko-trzcianecki',
  czarnkow: 'czarnkowsko-trzcianecki',
  rogoźno: 'obornicki',
  rogozno: 'obornicki',
  międzychód: 'międzychodzki',
  miedzychod: 'międzychodzki',
  kórnik: 'poznański',
  kornik: 'poznański',
  kostrzyn: 'poznański',
  puszczykowo: 'poznański',
  pobiedziska: 'poznański',
};

/**
 * Powiaty i miasta zlokalizowane bezpośrednio przy granicy lub w strefie przygranicznej (< 40-50 km).
 */
export const BORDER_COUNTIES: Record<Voivodeship, string[]> = {
  lubelskie: [
    'bialski',
    'Biała Podlaska',
    'włodawski',
    'chełmski',
    'Chełm',
    'hrubieszowski',
    'tomaszowski',
    'zamojski',
    'Zamość',
    'krasnostawski',
    'biłgorajski',
    'parczewski',
  ],
  podlaskie: [
    'sejneński',
    'augustowski',
    'sokólski',
    'białostocki',
    'Białystok',
    'hajnowski',
    'bielski',
    'siemiatycki',
    'suwalski',
    'Suwałki',
  ],
  podkarpackie: [
    'lubaczowski',
    'jarosławski',
    'przemyski',
    'Przemyśl',
    'bieszczadzki',
    'leski',
    'sanocki',
  ],
  wielkopolskie: [],
};

/**
 * Pomocnicza funkcja do inferencji powiatu na podstawie nazwy miejscowości
 */
export function inferCounty(city?: string, existingCounty?: string): string | undefined {
  if (existingCounty && existingCounty.trim() !== '') {
    return existingCounty;
  }
  if (!city) return undefined;
  const rawNorm = city.toLowerCase().trim();
  if (CITY_TO_COUNTY[rawNorm]) {
    return CITY_TO_COUNTY[rawNorm];
  }
  const cleanNorm = normalizeText(city);
  for (const [k, v] of Object.entries(CITY_TO_COUNTY)) {
    if (normalizeText(k) === cleanNorm) {
      return v;
    }
  }
  return undefined;
}

/**
 * Sprawdza czy dana lokalizacja (powiat lub miejscowość) znajduje się w pasie przygranicznym.
 */
export function isBorderLocation(voivodeship: Voivodeship, countyName?: string, cityName?: string): boolean {
  const list = BORDER_COUNTIES[voivodeship];
  if (!list) return false;

  const normCounty = countyName ? normalizeText(countyName.replace(/^powiat\s+/, '')) : '';
  const normCity = cityName ? normalizeText(cityName) : '';

  // 1. Sprawdzenie powiatu z normalizacją diakrytyków
  if (normCounty) {
    if (
      list.some((c) => {
        const nc = normalizeText(c);
        return normCounty.includes(nc) || nc.includes(normCounty);
      })
    ) {
      return true;
    }
  }

  // 2. Sprawdzenie miejscowości
  if (normCity) {
    if (
      list.some((c) => {
        const nc = normalizeText(c);
        return normCity.includes(nc) || nc.includes(normCity);
      })
    ) {
      return true;
    }
    // Sprawdzenie czy miejscowość mapuje się do powiatu przygranicznego
    const inferred = inferCounty(cityName);
    if (inferred) {
      const normInferred = normalizeText(inferred);
      if (
        list.some((c) => {
          const nc = normalizeText(c);
          return normInferred.includes(nc) || nc.includes(normInferred);
        })
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Backward-compatible alias for isBorderCounty
 */
export function isBorderCounty(voivodeship: Voivodeship, countyName?: string, cityName?: string): boolean {
  return isBorderLocation(voivodeship, countyName, cityName);
}

/**
 * Pobiera dokładne współrzędne dla miejscowości lub powiatu, z lekkim jitterem,
 * aby oferty w tej samej miejscowości nie nakładały się w 100% na siebie na mapie.
 */
export function getLocationCoordinates(
  voivodeship: Voivodeship,
  city?: string,
  county?: string
): { lat: number; lng: number } {
  const normCity = city?.toLowerCase().trim();
  const normCounty = county?.toLowerCase().replace(/^powiat\s+/, '').trim();

  let baseCoords: { lat: number; lng: number } | undefined = undefined;

  if (normCity && CITY_COORDINATES[normCity]) {
    baseCoords = CITY_COORDINATES[normCity];
  } else if (normCounty && CITY_COORDINATES[normCounty]) {
    baseCoords = CITY_COORDINATES[normCounty];
  } else {
    // Przeszukaj czy jakaś znana miejscowość zawiera się w nazwie
    if (normCity) {
      for (const [knownCity, coords] of Object.entries(CITY_COORDINATES)) {
        if (normCity.includes(knownCity) || knownCity.includes(normCity)) {
          baseCoords = coords;
          break;
        }
      }
    }
  }

  if (!baseCoords) {
    baseCoords = VOIVODESHIP_CENTERS[voivodeship] || EAST_POLAND_CENTER;
  }

  // Dodaj delikatny jitter (ok. +/- 300-800 m) aby punkty w tym samym mieście nie były idealnie w jednym punkcie
  const jitterLat = (Math.random() - 0.5) * 0.015;
  const jitterLng = (Math.random() - 0.5) * 0.02;

  return {
    lat: baseCoords.lat + jitterLat,
    lng: baseCoords.lng + jitterLng,
  };
}

/**
 * Centra mapy dla poszczególnych województw
 */
export const VOIVODESHIP_CENTERS: Record<Voivodeship, { lat: number; lng: number; zoom: number }> = {
  lubelskie: { lat: 51.2465, lng: 22.5684, zoom: 8 },
  podlaskie: { lat: 53.1325, lng: 23.1688, zoom: 8 },
  podkarpackie: { lat: 49.95, lng: 22.3, zoom: 8 },
  wielkopolskie: { lat: 52.4064, lng: 16.9252, zoom: 8 },
};

export const EAST_POLAND_CENTER = { lat: 51.5, lng: 22.8, zoom: 7 };
