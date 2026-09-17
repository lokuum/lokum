/**
 * Formatuje kwotę w PLN ze spacjami jako separatorem tysięcy.
 */
export function formatPrice(price: number): string {
  if (price == null || isNaN(price)) return '— zł';
  return Math.round(price).toLocaleString('pl-PL') + ' zł';
}

/**
 * Formatuje cenę za metr kwadratowy.
 */
export function formatPricePerM2(pricePerM2: number): string {
  if (pricePerM2 == null || isNaN(pricePerM2)) return '— zł/m²';
  return Math.round(pricePerM2).toLocaleString('pl-PL') + ' zł/m²';
}

/**
 * Formatuje powierzchnię (dla działek opcjonalnie podaje również w arach/hektarach).
 */
export function formatArea(areaM2: number, isPlot = false): string {
  if (areaM2 == null || isNaN(areaM2)) return '— m²';
  const formatted = Math.round(areaM2).toLocaleString('pl-PL') + ' m²';
  if (isPlot) {
    if (areaM2 >= 10000) {
      const ha = (areaM2 / 10000).toFixed(2).replace(/\.00$/, '');
      return `${formatted} (${ha} ha)`;
    }
    if (areaM2 >= 500) {
      const ary = Math.round(areaM2 / 100);
      return `${formatted} (${ary} a)`;
    }
  }
  return formatted;
}

/**
 * Formatuje zmianę ceny (np. "-25 000 zł (-8.5%)").
 */
export function formatPriceDelta(amount: number, percent: number): string {
  const sign = amount > 0 ? '+' : '';
  const formattedAmount = sign + Math.round(amount).toLocaleString('pl-PL') + ' zł';
  const formattedPercent = `(${sign}${percent.toFixed(1)}%)`;
  return `${formattedAmount} ${formattedPercent}`;
}

/**
 * Formatuje datę do czytelnej polskiej formy.
 */
export function formatDate(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return isoString;
  }
}
