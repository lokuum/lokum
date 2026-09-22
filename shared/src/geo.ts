import type { Voivodeship } from './types.js';

export const VOIVODESHIPS: { id: Voivodeship; name: string; borderWith: string }[] = [
  { id: 'lubelskie', name: 'Lubelskie', borderWith: 'Ukraina / Białoruś' },
  { id: 'podlaskie', name: 'Podlaskie', borderWith: 'Białoruś / Litwa' },
  { id: 'podkarpackie', name: 'Podkarpackie', borderWith: 'Ukraina / Słowacja' },
  { id: 'wielkopolskie', name: 'Wielkopolskie', borderWith: 'Region Zachodni' },
];

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
 * Centra poszczególnych powiatów (współrzędne geograficzne)
 */
export const COUNTY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // --- Wielkopolskie ---
  chodzieski: { lat: 52.9936, lng: 16.9142 },
  'czarnkowsko-trzcianecki': { lat: 52.9031, lng: 16.5647 },
  czarnkowski: { lat: 52.9031, lng: 16.5647 },
  trzcianecki: { lat: 53.0406, lng: 16.4589 },
  gnieźnieński: { lat: 52.5348, lng: 17.5826 },
  gnieznienski: { lat: 52.5348, lng: 17.5826 },
  gostyński: { lat: 51.8789, lng: 17.0125 },
  gostynski: { lat: 51.8789, lng: 17.0125 },
  grodziski: { lat: 52.2272, lng: 16.3653 },
  jarociński: { lat: 51.9728, lng: 17.5025 },
  jarocinski: { lat: 51.9728, lng: 17.5025 },
  kaliski: { lat: 51.7673, lng: 18.0853 },
  kępiński: { lat: 51.2783, lng: 17.9883 },
  kepinski: { lat: 51.2783, lng: 17.9883 },
  kolski: { lat: 52.2003, lng: 18.6386 },
  koniński: { lat: 52.2230, lng: 18.2512 },
  koninski: { lat: 52.2230, lng: 18.2512 },
  kościański: { lat: 52.0886, lng: 16.6492 },
  koscianski: { lat: 52.0886, lng: 16.6492 },
  krotoszyński: { lat: 51.6975, lng: 17.4372 },
  krotoszynski: { lat: 51.6975, lng: 17.4372 },
  leszczyński: { lat: 51.8427, lng: 16.5749 },
  leszczynski: { lat: 51.8427, lng: 16.5749 },
  międzychodzki: { lat: 52.6033, lng: 15.8906 },
  miedzychodzki: { lat: 52.6033, lng: 15.8906 },
  nowotomyski: { lat: 52.3167, lng: 16.1333 },
  obornicki: { lat: 52.6467, lng: 16.8153 },
  ostrowski: { lat: 51.6550, lng: 17.8068 },
  ostrzeszowski: { lat: 51.4283, lng: 17.9256 },
  pilski: { lat: 53.1514, lng: 16.7378 },
  pleszewski: { lat: 51.8958, lng: 17.7850 },
  poznański: { lat: 52.4064, lng: 16.9252 },
  poznanski: { lat: 52.4064, lng: 16.9252 },
  rawicki: { lat: 51.6094, lng: 16.8581 },
  słupecki: { lat: 52.2903, lng: 17.8722 },
  slupecki: { lat: 52.2903, lng: 17.8722 },
  szamotulski: { lat: 52.6117, lng: 16.5778 },
  średzki: { lat: 52.2289, lng: 17.2742 },
  sredzki: { lat: 52.2289, lng: 17.2742 },
  śremski: { lat: 52.0886, lng: 17.0153 },
  sremski: { lat: 52.0886, lng: 17.0153 },
  turecki: { lat: 52.0161, lng: 18.5008 },
  wągrowiecki: { lat: 52.8081, lng: 17.1997 },
  wagrowiecki: { lat: 52.8081, lng: 17.1997 },
  wolsztyński: { lat: 52.1158, lng: 16.1150 },
  wolsztynski: { lat: 52.1158, lng: 16.1150 },
  wrzesiński: { lat: 52.3253, lng: 17.5650 },
  wrzesinski: { lat: 52.3253, lng: 17.5650 },
  złotowski: { lat: 53.3611, lng: 17.0417 },
  zlotowski: { lat: 53.3611, lng: 17.0417 },

  // --- Lubelskie ---
  bialski: { lat: 52.0326, lng: 23.1165 },
  biłgorajski: { lat: 50.5408, lng: 22.7214 },
  bilgorajski: { lat: 50.5408, lng: 22.7214 },
  chełmski: { lat: 51.1333, lng: 23.4833 },
  chelmski: { lat: 51.1333, lng: 23.4833 },
  hrubieszowski: { lat: 50.8052, lng: 23.8912 },
  janowski: { lat: 50.7072, lng: 22.4103 },
  krasnostawski: { lat: 50.9856, lng: 23.1764 },
  kraśnicki: { lat: 50.9239, lng: 22.2247 },
  krasnicki: { lat: 50.9239, lng: 22.2247 },
  lubartowski: { lat: 51.4619, lng: 22.6078 },
  lubelski: { lat: 51.2465, lng: 22.5684 },
  łęczyński: { lat: 51.3008, lng: 22.8803 },
  leczynski: { lat: 51.3008, lng: 22.8803 },
  łukowski: { lat: 51.9286, lng: 22.3839 },
  lukowski: { lat: 51.9286, lng: 22.3839 },
  opolski: { lat: 51.1472, lng: 21.9706 },
  parczewski: { lat: 51.6403, lng: 22.9014 },
  puławski: { lat: 51.4166, lng: 21.9694 },
  pulawski: { lat: 51.4166, lng: 21.9694 },
  radzyński: { lat: 51.7831, lng: 22.6181 },
  radzynski: { lat: 51.7831, lng: 22.6181 },
  rycki: { lat: 51.6253, lng: 21.9333 },
  świdnicki: { lat: 51.2189, lng: 22.6953 },
  swidnicki: { lat: 51.2189, lng: 22.6953 },
  tomaszowski: { lat: 50.4485, lng: 23.4162 },
  włodawski: { lat: 51.5438, lng: 23.5511 },
  wlodawski: { lat: 51.5438, lng: 23.5511 },
  zamojski: { lat: 50.7206, lng: 23.2589 },

  // --- Podlaskie ---
  augustowski: { lat: 53.8433, lng: 22.9797 },
  białostocki: { lat: 53.1325, lng: 23.1688 },
  bialostocki: { lat: 53.1325, lng: 23.1688 },
  bielski: { lat: 52.7667, lng: 23.1931 },
  grajewski: { lat: 53.6472, lng: 22.4542 },
  hajnowski: { lat: 52.7433, lng: 23.5811 },
  kolneński: { lat: 53.4111, lng: 21.9333 },
  kolnenski: { lat: 53.4111, lng: 21.9333 },
  łomżyński: { lat: 53.1781, lng: 22.0594 },
  lomzynski: { lat: 53.1781, lng: 22.0594 },
  moniecki: { lat: 53.4056, lng: 22.7961 },
  sejneński: { lat: 54.1072, lng: 23.3486 },
  sejnenski: { lat: 54.1072, lng: 23.3486 },
  siemiatycki: { lat: 52.4272, lng: 22.8628 },
  sokólski: { lat: 53.4069, lng: 23.5039 },
  sokolski: { lat: 53.4069, lng: 23.5039 },
  suwalski: { lat: 54.1006, lng: 22.9308 },
  wysokomazowiecki: { lat: 52.9167, lng: 22.5167 },
  zambrowski: { lat: 52.9856, lng: 22.2433 },

  // --- Podkarpackie ---
  bieszczadzki: { lat: 49.4311, lng: 22.5936 },
  brzozowski: { lat: 49.6947, lng: 22.0194 },
  dębicki: { lat: 50.0514, lng: 21.4114 },
  debicki: { lat: 50.0514, lng: 21.4114 },
  jarosławski: { lat: 50.0189, lng: 22.6842 },
  jaroslawski: { lat: 50.0189, lng: 22.6842 },
  jasielski: { lat: 49.7453, lng: 21.4725 },
  kolbuszowski: { lat: 50.2458, lng: 21.7706 },
  krośnieński: { lat: 49.6886, lng: 21.7706 },
  krosnienski: { lat: 49.6886, lng: 21.7706 },
  leski: { lat: 49.4697, lng: 22.3297 },
  leżajski: { lat: 50.2639, lng: 22.4236 },
  lezajski: { lat: 50.2639, lng: 22.4236 },
  lubaczowski: { lat: 50.1558, lng: 23.1239 },
  łańcucki: { lat: 50.0683, lng: 22.2306 },
  lancucki: { lat: 50.0683, lng: 22.2306 },
  mielecki: { lat: 50.2872, lng: 21.4239 },
  niżański: { lat: 50.5206, lng: 22.1408 },
  nizanski: { lat: 50.5206, lng: 22.1408 },
  przemyski: { lat: 49.7839, lng: 22.7678 },
  przeworski: { lat: 50.0603, lng: 22.4939 },
  'ropczycko-sędziszowski': { lat: 50.0525, lng: 21.6094 },
  'ropczycko-sedziszowski': { lat: 50.0525, lng: 21.6094 },
  rzeszowski: { lat: 50.0412, lng: 21.9991 },
  sanocki: { lat: 49.5583, lng: 22.2056 },
  stalowowolski: { lat: 50.5828, lng: 22.0536 },
  strzyżowski: { lat: 49.8708, lng: 21.7925 },
  strzyzowski: { lat: 49.8708, lng: 21.7925 },
  tarnobrzeski: { lat: 50.5739, lng: 21.6797 },

  // --- Graniczne / sąsiadujące ---
  radziejowski: { lat: 52.6167, lng: 18.5167 },
  żniński: { lat: 52.8500, lng: 17.7167 },
  zninski: { lat: 52.8500, lng: 17.7167 },
  milicki: { lat: 51.5289, lng: 17.2736 },
  oleśnicki: { lat: 51.2106, lng: 17.3800 },
  olesnicki: { lat: 51.2106, lng: 17.3800 },
  międzyrzecki: { lat: 52.4439, lng: 15.5786 },
  miedzyrzecki: { lat: 52.4439, lng: 15.5786 },
};

/**
 * Centra miast i miejscowości (współrzędne geograficzne)
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
  'janow podlaski': { lat: 52.1969, lng: 23.2117 },
  sławatycze: { lat: 51.7619, lng: 23.5556 },
  slawatycze: { lat: 51.7619, lng: 23.5556 },
  kijowiec: { lat: 52.0673, lng: 23.3774 },
  zalesie: { lat: 52.0333, lng: 23.3667 },
  rokitno: { lat: 52.1167, lng: 23.2833 },
  łomazy: { lat: 51.9000, lng: 23.1667 },
  lomazy: { lat: 51.9000, lng: 23.1667 },
  wisznice: { lat: 51.7833, lng: 23.2000 },
  tuczna: { lat: 51.8833, lng: 23.4333 },
  rossosz: { lat: 51.8500, lng: 23.1333 },
  sosnówka: { lat: 51.7500, lng: 23.3333 },
  sosnowka: { lat: 51.7500, lng: 23.3333 },
  'leśna podlaska': { lat: 52.1333, lng: 23.0333 },
  'lesna podlaska': { lat: 52.1333, lng: 23.0333 },
  konstantynów: { lat: 52.2000, lng: 23.0833 },
  konstantynow: { lat: 52.2000, lng: 23.0833 },
  drelów: { lat: 51.9167, lng: 22.8833 },
  drelow: { lat: 51.9167, lng: 22.8833 },
  urszulin: { lat: 51.4000, lng: 23.2000 },
  hańsk: { lat: 51.4167, lng: 23.4000 },
  hansk: { lat: 51.4167, lng: 23.4000 },
  'wola uhruska': { lat: 51.3167, lng: 23.6333 },
  wyryki: { lat: 51.5500, lng: 23.3833 },
  hanna: { lat: 51.7167, lng: 23.5000 },
  dubienka: { lat: 51.0500, lng: 23.8833 },
  'ruda-huta': { lat: 51.2333, lng: 23.6000 },
  wierzbica: { lat: 51.2667, lng: 23.2333 },
  kamień: { lat: 51.1000, lng: 23.5833 },
  kamien: { lat: 51.1000, lng: 23.5833 },
  białopole: { lat: 50.9667, lng: 23.7167 },
  bialopole: { lat: 50.9667, lng: 23.7167 },
  wojsławice: { lat: 50.9167, lng: 23.5500 },
  wojslawice: { lat: 50.9167, lng: 23.5500 },
  uchanie: { lat: 50.9000, lng: 23.6500 },
  trzeszczany: { lat: 50.8000, lng: 23.7000 },
  jarczów: { lat: 50.4333, lng: 23.5667 },
  jarczow: { lat: 50.4333, lng: 23.5667 },
  ulhówek: { lat: 50.4500, lng: 23.8167 },
  ulhowek: { lat: 50.4500, lng: 23.8167 },
  telatyn: { lat: 50.5333, lng: 23.8333 },
  łaszczów: { lat: 50.5333, lng: 23.7167 },
  laszczow: { lat: 50.5333, lng: 23.7167 },

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
  gruszki: { lat: 53.8627, lng: 23.4335 },
  płaska: { lat: 53.9036, lng: 23.2508 },
  plaska: { lat: 53.9036, lng: 23.2508 },
  mikaszówka: { lat: 53.8872, lng: 23.3939 },
  mikaszowka: { lat: 53.8872, lng: 23.3939 },
  gorczyca: { lat: 53.8833, lng: 23.3333 },
  rygol: { lat: 53.9000, lng: 23.4333 },
  giby: { lat: 54.0333, lng: 23.3667 },
  zelwa: { lat: 54.0000, lng: 23.4500 },
  berżałowce: { lat: 54.0667, lng: 23.4333 },
  berzalowce: { lat: 54.0667, lng: 23.4333 },
  sidorówka: { lat: 54.2167, lng: 22.8833 },
  sidorowka: { lat: 54.2167, lng: 22.8833 },
  solniki: { lat: 53.0167, lng: 23.1667 },
  szerenosy: { lat: 53.0000, lng: 23.1000 },
  'odnoga-kuźmy': { lat: 52.8833, lng: 23.7500 },
  'odnoga-kuzmy': { lat: 52.8833, lng: 23.7500 },

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

  // --- Wielkopolskie - Miasta i Gminy ---
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
  kępno: { lat: 51.2783, lng: 17.9883 },
  kepno: { lat: 51.2783, lng: 17.9883 },

  // Gminy i mniejsze miejscowości w Wielkopolsce
  sośnie: { lat: 51.4883, lng: 17.7183 },
  sosnie: { lat: 51.4883, lng: 17.7183 },
  pawłów: { lat: 51.4800, lng: 17.6500 },
  pawlow: { lat: 51.4800, lng: 17.6500 },
  wysoka: { lat: 53.1814, lng: 17.0808 },
  'jeziorki kosztowskie': { lat: 53.1800, lng: 17.1500 },
  osieczna: { lat: 51.9083, lng: 16.6806 },
  frankowo: { lat: 51.9200, lng: 16.7100 },
  czerniejewo: { lat: 52.4278, lng: 17.4878 },
  kąpiel: { lat: 52.4500, lng: 17.4500 },
  kapiel: { lat: 52.4500, lng: 17.4500 },
  kwilcz: { lat: 52.5564, lng: 16.0828 },
  kurnatowice: { lat: 52.5600, lng: 16.0300 },
  głażewo: { lat: 52.6100, lng: 15.9800 },
  glazewo: { lat: 52.6100, lng: 15.9800 },
  szczytniki: { lat: 51.6833, lng: 18.3167 },
  sobiesęki: { lat: 51.6900, lng: 18.3000 },
  sobieseki: { lat: 51.6900, lng: 18.3000 },
  'sobiesęki pierwsze': { lat: 51.6900, lng: 18.3000 },
  'sobieseki pierwsze': { lat: 51.6900, lng: 18.3000 },
  brzeziny: { lat: 51.6000, lng: 18.2667 },
  czempisz: { lat: 51.6000, lng: 18.2900 },
  tuliszków: { lat: 52.0736, lng: 18.2897 },
  tuliszkow: { lat: 52.0736, lng: 18.2897 },
  tarnowa: { lat: 52.0500, lng: 18.2800 },
  trzemeszno: { lat: 52.5611, lng: 17.8239 },
  'cegielnia-rudki': { lat: 52.5700, lng: 17.8200 },
  wierzbinek: { lat: 52.4300, lng: 18.5200 },
  folusz: { lat: 51.8700, lng: 17.7600 },
  'tarnowo podgórne': { lat: 52.4667, lng: 16.6667 },
  'tarnowo podgorne': { lat: 52.4667, lng: 16.6667 },
  'suchy las': { lat: 52.4750, lng: 16.8778 },
  komorniki: { lat: 52.3361, lng: 16.8083 },
  'murowana goślina': { lat: 52.5750, lng: 17.0111 },
  'murowana goslina': { lat: 52.5750, lng: 17.0111 },
  czerwonak: { lat: 52.4500, lng: 16.9833 },
  rokietnica: { lat: 52.5167, lng: 16.7500 },
  dopiewo: { lat: 52.3556, lng: 16.6778 },
  stęszew: { lat: 52.2833, lng: 16.7000 },
  steszew: { lat: 52.2833, lng: 16.7000 },
  kleszczewo: { lat: 52.3333, lng: 17.1833 },
  buk: { lat: 52.3556, lng: 16.5194 },
  pniewy: { lat: 52.5083, lng: 16.2583 },
  sieraków: { lat: 52.6500, lng: 16.0833 },
  sierakow: { lat: 52.6500, lng: 16.0833 },
  rydzyna: { lat: 51.7867, lng: 16.6681 },
  krobia: { lat: 51.7833, lng: 16.9833 },
  piaski: { lat: 51.8833, lng: 17.0500 },
  'borek wielkopolski': { lat: 51.9167, lng: 17.2333 },
  pogorzela: { lat: 51.8167, lng: 17.2333 },
  pępowo: { lat: 51.7500, lng: 17.1167 },
  pepowo: { lat: 51.7500, lng: 17.1167 },
  witkowo: { lat: 52.4333, lng: 17.7667 },
  skoki: { lat: 52.6667, lng: 17.1667 },
  kleczew: { lat: 52.3667, lng: 18.1833 },
  sompolno: { lat: 52.3833, lng: 18.5000 },
  golina: { lat: 52.2500, lng: 18.1000 },
  rychwał: { lat: 52.0667, lng: 18.1667 },
  rychwal: { lat: 52.0667, lng: 18.1667 },
  zagórów: { lat: 52.1667, lng: 17.9000 },
  zagorow: { lat: 52.1667, lng: 17.9000 },
  powidz: { lat: 52.4167, lng: 17.9167 },
  pyzdry: { lat: 52.1667, lng: 17.6833 },
  koźmin: { lat: 51.8333, lng: 17.4500 },
  kozmin: { lat: 51.8333, lng: 17.4500 },
  zduny: { lat: 51.6333, lng: 17.3833 },
  kobylin: { lat: 51.7167, lng: 17.2333 },
  bojanowo: { lat: 51.7000, lng: 16.7500 },
  jutrosin: { lat: 51.6500, lng: 17.1667 },
  odolanów: { lat: 51.5833, lng: 17.6667 },
  odolanow: { lat: 51.5833, lng: 17.6667 },
  raszków: { lat: 51.7167, lng: 17.7333 },
  raszkow: { lat: 51.7167, lng: 17.7333 },
  przygodzice: { lat: 51.6000, lng: 17.8167 },
  nowe: { lat: 52.4000, lng: 17.0000 },

  // Zawrzyj również wszystkie wpisy powiatowe bezpośrednio w CITY_COORDINATES
  ...COUNTY_COORDINATES,
};

/**
 * Miasta na prawach powiatu oraz mapowanie miast i gmin do powiatów
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
  kijowiec: 'bialski',
  zalesie: 'bialski',
  rokitno: 'bialski',
  łomazy: 'bialski',
  lomazy: 'bialski',
  wisznice: 'bialski',
  tuczna: 'bialski',
  rossosz: 'bialski',
  sosnówka: 'bialski',
  sosnowka: 'bialski',
  'leśna podlaska': 'bialski',
  'lesna podlaska': 'bialski',
  konstantynów: 'bialski',
  konstantynow: 'bialski',
  drelów: 'bialski',
  drelow: 'bialski',
  urszulin: 'włodawski',
  hańsk: 'włodawski',
  hansk: 'włodawski',
  'wola uhruska': 'włodawski',
  wyryki: 'włodawski',
  hanna: 'włodawski',
  dubienka: 'chełmski',
  'ruda-huta': 'chełmski',
  wierzbica: 'chełmski',
  kamień: 'chełmski',
  kamien: 'chełmski',
  białopole: 'chełmski',
  bialopole: 'chełmski',
  wojsławice: 'chełmski',
  wojslawice: 'chełmski',
  uchanie: 'hrubieszowski',
  trzeszczany: 'hrubieszowski',
  jarczów: 'tomaszowski',
  jarczow: 'tomaszowski',
  ulhówek: 'tomaszowski',
  ulhowek: 'tomaszowski',
  telatyn: 'tomaszowski',
  łaszczów: 'tomaszowski',
  laszczow: 'tomaszowski',

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
  gruszki: 'augustowski',
  gorczyca: 'augustowski',
  mikaszówka: 'augustowski',
  mikaszowka: 'augustowski',
  rygol: 'augustowski',
  zelwa: 'sejneński',
  berżałowce: 'sejneński',
  berzalowce: 'sejneński',
  sidorówka: 'suwalski',
  sidorowka: 'suwalski',
  solniki: 'białostocki',
  szerenosy: 'białostocki',
  'odnoga-kuźmy': 'białostocki',
  'odnoga-kuzmy': 'białostocki',

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
  sośnie: 'ostrowski',
  sosnie: 'ostrowski',
  pawłów: 'ostrowski',
  pawlow: 'ostrowski',
  wysoka: 'pilski',
  'jeziorki kosztowskie': 'pilski',
  osieczna: 'leszczyński',
  frankowo: 'leszczyński',
  czerniejewo: 'gnieźnieński',
  kąpiel: 'gnieźnieński',
  kapiel: 'gnieźnieński',
  kwilcz: 'międzychodzki',
  kurnatowice: 'międzychodzki',
  głażewo: 'międzychodzki',
  glazewo: 'międzychodzki',
  szczytniki: 'kaliski',
  sobiesęki: 'kaliski',
  sobieseki: 'kaliski',
  'sobiesęki pierwsze': 'kaliski',
  'sobieseki pierwsze': 'kaliski',
  brzeziny: 'kaliski',
  czempisz: 'kaliski',
  tuliszków: 'turecki',
  tuliszkow: 'turecki',
  tarnowa: 'turecki',
  trzemeszno: 'gnieźnieński',
  'cegielnia-rudki': 'gnieźnieński',
  wierzbinek: 'koniński',
  folusz: 'pleszewski',
  kępno: 'kępiński',
  kepno: 'kępiński',
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
 * Pomocnicza funkcja do inferencji powiatu na podstawie nazwy miejscowości lub powiatu
 */
export function inferCounty(city?: string, existingCounty?: string): string | undefined {
  if (existingCounty && existingCounty.trim() !== '') {
    const cleanExisting = existingCounty.replace(/^powiat\s+/i, '').trim();
    if (cleanExisting) return cleanExisting;
  }
  if (!city) return undefined;

  const rawNorm = city.toLowerCase().replace(/^powiat\s+/i, '').trim();
  if (CITY_TO_COUNTY[rawNorm]) {
    return CITY_TO_COUNTY[rawNorm];
  }
  const cleanNorm = normalizeText(rawNorm);

  // Sprawdź czy sama nazwa nie jest już powiatem (np. "ostrowski", "pilski")
  if (COUNTY_COORDINATES[cleanNorm] || COUNTY_COORDINATES[rawNorm]) {
    return cleanNorm;
  }

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
  if (!list || list.length === 0) return false;

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
 * aby oferty w tej samej miejscowości/powiecie nie nakładały się w 100% na siebie na mapie.
 */
export function getLocationCoordinates(
  voivodeship: Voivodeship,
  city?: string,
  county?: string,
  commune?: string
): { lat: number; lng: number } {
  const rawCity = city?.trim();
  const normCity = rawCity?.toLowerCase();
  const cleanCity = rawCity ? normalizeText(rawCity) : undefined;

  const rawCommune = commune?.replace(/^gmina\s+/i, '').trim();
  const normCommune = rawCommune?.toLowerCase();
  const cleanCommune = rawCommune ? normalizeText(rawCommune) : undefined;

  const rawCounty = county?.replace(/^powiat\s+/i, '').trim();
  const normCounty = rawCounty?.toLowerCase();
  const cleanCounty = rawCounty ? normalizeText(rawCounty) : undefined;

  let baseCoords: { lat: number; lng: number } | undefined = undefined;

  // 1. Bezpośrednie dopasowanie miejscowości w CITY_COORDINATES
  if (normCity && CITY_COORDINATES[normCity]) {
    baseCoords = CITY_COORDINATES[normCity];
  } else if (cleanCity && CITY_COORDINATES[cleanCity]) {
    baseCoords = CITY_COORDINATES[cleanCity];
  }

  // 2. Dopasowanie gminy (commune)
  if (!baseCoords && normCommune) {
    if (CITY_COORDINATES[normCommune]) {
      baseCoords = CITY_COORDINATES[normCommune];
    } else if (cleanCommune && CITY_COORDINATES[cleanCommune]) {
      baseCoords = CITY_COORDINATES[cleanCommune];
    }
  }

  // 3. Jeśli miejscowość nie jest znana, sprawdź czy mapuje się do znanego powiatu (inferCounty)
  if (!baseCoords && rawCity) {
    const inferred = inferCounty(rawCity);
    if (inferred) {
      const cleanInf = normalizeText(inferred.replace(/^powiat\s+/i, ''));
      if (COUNTY_COORDINATES[cleanInf]) {
        baseCoords = COUNTY_COORDINATES[cleanInf];
      } else if (COUNTY_COORDINATES[inferred.toLowerCase()]) {
        baseCoords = COUNTY_COORDINATES[inferred.toLowerCase()];
      } else if (CITY_COORDINATES[cleanInf]) {
        baseCoords = CITY_COORDINATES[cleanInf];
      }
    }
  }

  // 3. Dopasowanie powiatu przekazanego jako parametr
  if (!baseCoords && normCounty) {
    if (COUNTY_COORDINATES[normCounty]) {
      baseCoords = COUNTY_COORDINATES[normCounty];
    } else if (cleanCounty && COUNTY_COORDINATES[cleanCounty]) {
      baseCoords = COUNTY_COORDINATES[cleanCounty];
    } else if (CITY_COORDINATES[normCounty]) {
      baseCoords = CITY_COORDINATES[normCounty];
    } else if (cleanCounty && CITY_COORDINATES[cleanCounty]) {
      baseCoords = CITY_COORDINATES[cleanCounty];
    }
  }

  // 4. Dopasowanie częściowe (zawieranie) dla miejscowości
  if (!baseCoords && cleanCity && cleanCity.length >= 3) {
    for (const [knownCity, coords] of Object.entries(CITY_COORDINATES)) {
      const cleanKnown = normalizeText(knownCity);
      if (cleanCity === cleanKnown || cleanCity.includes(cleanKnown) || cleanKnown.includes(cleanCity)) {
        baseCoords = coords;
        break;
      }
    }
  }

  // 5. Dopasowanie częściowe (zawieranie) dla powiatu
  if (!baseCoords && cleanCounty && cleanCounty.length >= 4) {
    for (const [knownCounty, coords] of Object.entries(COUNTY_COORDINATES)) {
      const cleanKnown = normalizeText(knownCounty);
      if (cleanCounty === cleanKnown || cleanCounty.includes(cleanKnown) || cleanKnown.includes(cleanCounty)) {
        baseCoords = coords;
        break;
      }
    }
  }

  // 6. Ostateczny fallback na centrum województwa
  if (!baseCoords) {
    baseCoords = VOIVODESHIP_CENTERS[voivodeship] || EAST_POLAND_CENTER;
  }

  // Dodaj delikatny jitter (ok. +/- 300-800 m) aby punkty w tej samej lokalizacji nie były idealnie w jednym punkcie
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
