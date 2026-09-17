# Lokum 🏠🌲

> Monitor cen nieruchomości (domy, działki) we wschodniej Polsce (woj. lubelskie, podlaskie, podkarpackie). Śledzenie historii cen, wykrywanie okazji (obniżki cen) i interaktywna mapa ofert.

## Architektura

```
GitHub Actions (cron: codziennie o 4:00 UTC / manual)
       │
       ▼
   Scraper (TypeScript + Node.js)
   ├── Otodom (ekstrakcja __NEXT_DATA__ JSON)
   └── Adresowo (oferty bezpośrednie bez pośredników)
       │
       ▼
   Engine (wykrywanie delty cenowej & statusów)
       │
       ▼
   public/data/ (*.json per województwo i kategoria + summary.json)
       │
       ▼
   Frontend (React 19 + Vite + Tailwind CSS v4 + Dexie.js + Leaflet) → GitHub Pages
```

## Struktura projektu

- `shared/` — wspólne typy TypeScript (`PropertyOffer`, `PriceSnapshot`), formatowanie i definicje geograficzne powiatów przygranicznych.
- `scraper/` — moduł pobierania danych z serwisów Otodom i Adresowo, silnik porównywania cen i aktualizacji bazy.
- `frontend/` — statyczna aplikacja SPA (React + Tailwind v4 + Leaflet + Dexie IndexedDB) z dedykowanymi zakładkami na domy, działki i największe obniżki.

## Uruchomienie lokalnie

```bash
# Instalacja zależności
npm install

# Uruchomienie deweloperskie frontendu
npm run dev

# Uruchomienie scrapera dla testów (np. 1 strona dla woj. lubelskiego)
npm run scrape -- --voivodeship lubelskie --limit 1

# Pełne scrapowanie wszystkich źródeł
npm run scrape
```
