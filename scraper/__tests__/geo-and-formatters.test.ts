import { describe, expect, it } from 'vitest';
import {
  formatArea,
  formatPrice,
  formatPricePerM2,
  inferCounty,
  isBorderLocation,
  normalizeText,
} from 'shared';

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
