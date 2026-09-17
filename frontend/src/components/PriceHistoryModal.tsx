import React from 'react';
import type { PropertyOffer } from 'shared';
import { formatDate, formatPrice, formatPriceDelta, formatPricePerM2 } from 'shared';
import { X, TrendingDown, TrendingUp, Calendar, ExternalLink } from 'lucide-react';

interface PriceHistoryModalProps {
  offer: PropertyOffer | null;
  onClose: () => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({ offer, onClose }) => {
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
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="size-5" />
          </button>
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
            <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Zarejestrowane notowania ({offer.priceHistory.length})
            </h4>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-neutral-200 divide-y divide-neutral-100">
              {offer.priceHistory
                .slice()
                .reverse()
                .map((snap, idx, arr) => {
                  const prev = arr[idx + 1];
                  const diff = prev ? snap.price - prev.price : 0;

                  return (
                    <div key={idx} className="flex items-center justify-between p-3 text-xs hover:bg-neutral-50/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-neutral-400" />
                        <span className="font-medium text-neutral-700">{formatDate(snap.date)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {diff !== 0 && (
                          <span
                            className={`font-semibold text-[11px] ${
                              diff < 0 ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          >
                            {diff < 0 ? '📉 ' : '📈 '}
                            {Math.round(diff).toLocaleString('pl-PL')} zł
                          </span>
                        )}
                        <span className="font-bold text-neutral-900">{formatPrice(snap.price)}</span>
                        <span className="text-neutral-400 text-[10px]">{formatPricePerM2(snap.pricePerM2)}</span>
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
