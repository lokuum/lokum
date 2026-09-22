import React from 'react';
import type { PropertyOffer } from 'shared';
import { formatDate, formatPrice, formatPriceDelta, formatPricePerM2 } from 'shared';
import { X, TrendingDown, TrendingUp, Calendar, ExternalLink, Heart } from 'lucide-react';

interface PriceHistoryModalProps {
  offer: PropertyOffer | null;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onClose: () => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  offer,
  isFavorite = false,
  onToggleFavorite,
  onClose,
}) => {
  if (!offer) return null;

  const isDrop = offer.priceChangeAmount < 0;
  const isIncrease = offer.priceChangeAmount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Historia zmian cen
            </span>
            <h3 className="text-base font-bold text-neutral-900 line-clamp-1">{offer.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(offer.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isFavorite
                    ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                    : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
                }`}
                title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              >
                <Heart className={`size-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-500 font-medium block">Cena aktualna</span>
              <div className="text-lg font-extrabold text-neutral-900">{formatPrice(offer.currentPrice)}</div>
              <span className="text-[10px] text-neutral-400">{formatPricePerM2(offer.currentPricePerM2)}</span>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                isDrop
                  ? 'bg-rose-50 border-rose-100 text-rose-900'
                  : isIncrease
                  ? 'bg-amber-50 border-amber-100 text-amber-900'
                  : 'bg-neutral-50 border-neutral-100 text-neutral-900'
              }`}
            >
              <span className="text-[11px] font-medium block opacity-75">Całkowita zmiana</span>
              <div className="text-lg font-extrabold flex items-center gap-1">
                {isDrop && <TrendingDown className="size-4 text-rose-600 shrink-0" />}
                {isIncrease && <TrendingUp className="size-4 text-amber-600 shrink-0" />}
                <span>{formatPriceDelta(offer.priceChangeAmount, offer.priceChangePercent)}</span>
              </div>
              <span className="text-[10px] opacity-75">
                Od: {formatPrice(offer.initialPrice)} ({formatDate(offer.firstSeenAt)})
              </span>
            </div>
          </div>

          {/* Timeline / History Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                Historia notowań cen (od najnowszej)
              </h4>
              <span className="text-[11px] text-neutral-400 font-medium">
                {offer.priceHistory.length} {offer.priceHistory.length === 1 ? 'zapis' : 'zapisy/zapisów'}
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto rounded-xl border border-neutral-200 divide-y divide-neutral-100">
              {offer.priceHistory
                .slice()
                .reverse()
                .map((snap, idx, arr) => {
                  const prev = arr[idx + 1];
                  const diff = prev ? snap.price - prev.price : 0;
                  const diffPercent = prev && prev.price > 0 ? ((snap.price - prev.price) / prev.price) * 100 : 0;
                  const isLatest = idx === 0;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 text-xs transition-colors ${
                        isLatest ? 'bg-neutral-50/80 font-medium' : 'hover:bg-neutral-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-neutral-400" />
                        <div>
                          <span className="font-semibold text-neutral-800">{formatDate(snap.date)}</span>
                          {isLatest && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-neutral-200 text-neutral-700">
                              Ostatnia
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {diff !== 0 && (
                          <span
                            className={`font-semibold text-[11px] flex items-center gap-0.5 ${
                              diff < 0 ? 'text-rose-600' : 'text-amber-600'
                            }`}
                            title={`Zmiana względem poprzedniego notowania`}
                          >
                            {diff < 0 ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
                            {diff > 0 ? '+' : ''}{Math.round(diff).toLocaleString('pl-PL')} zł ({diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%)
                          </span>
                        )}
                        <div className="text-right">
                          <div className="font-extrabold text-neutral-900">{formatPrice(snap.price)}</div>
                          <div className="text-neutral-400 text-[10px]">{formatPricePerM2(snap.pricePerM2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 border-t border-neutral-100">
          <span className="text-xs text-neutral-500">
            Źródło: <strong className="uppercase">{offer.source}</strong> ({offer.city})
          </span>

          <a
            href={offer.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Otwórz ogłoszenie</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
