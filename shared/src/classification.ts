import type { PropertyType } from './types.js';

/**
 * Rozpoznaje, czy dana oferta (dom lub działka) to w rzeczywistości siedlisko / gospodarstwo.
 */
export function isHabitatOffer(offer: {
  title?: string;
  sourceUrl?: string;
  street?: string;
  description?: string;
}): boolean {
  const text = `${offer.title || ''} ${offer.sourceUrl || ''} ${offer.street || ''} ${offer.description || ''}`.toLowerCase();
  
  // Słowa kluczowe identyfikujące siedliska i gospodarstwa
  return (
    text.includes('siedlisk') || // siedlisko, siedliska, siedliskowa, siedliskowej, siedliskiem, siedliskowy
    text.includes('zagrodow') || // zabudowa zagrodowa, działka zagrodowa
    text.includes('gospodarstw') || // gospodarstwo rolne / siedliskowe
    text.includes('lesniczowk') || // leśniczówka
    text.includes('leśniczówk')
  );
}

/**
 * Klasyfikuje typ nieruchomości: 'habitat' (jeśli spełnia kryteria siedliska) lub bazowy typ ('house' / 'plot').
 */
export function classifyPropertyType(
  baseType: 'house' | 'plot',
  offer: {
    title?: string;
    sourceUrl?: string;
    street?: string;
    description?: string;
  }
): PropertyType {
  if (isHabitatOffer(offer)) {
    return 'habitat';
  }
  return baseType;
}
