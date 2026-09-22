import React from 'react';
import type { PropertyOffer } from 'shared';
import { formatArea, formatDate, formatPrice, formatPriceDelta, formatPricePerM2 } from 'shared';
import { ExternalLink, Heart, History, MapPin, ShieldAlert, Trees, TrendingDown, TrendingUp } from 'lucide-react';

interface PropertyCardProps {
  offer: PropertyOffer;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenHistory: (offer: PropertyOffer) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  offer,
  isFavorite,
  onToggleFavorite,
  onOpenHistory,
}) => {
  const isDrop = offer.priceChangeAmount < 0 || offer.status === 'price_drop';
  const isIncrease = offer.priceChangeAmount > 0 || offer.status === 'price_increase';

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Photo Container */}
      <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
        {offer.imageUrl ? (
          <img
            src={offer.imageUrl}
            alt={offer.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
            Brak zdjęcia
          </div>
        )}

        {/* Favorite heart button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(offer.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-xs transition-all duration-200 shadow-xs z-10 ${
            isFavorite
              ? 'bg-white text-rose-500 hover:scale-110 shadow-md'
              : 'bg-black/30 hover:bg-black/50 text-white hover:scale-110'
          }`}
          title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        >
          <Heart className={`size-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 max-w-[90%]">
          {/* Habitat badge */}
          {offer.propertyType === 'habitat' && (
            <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              🌾 Siedlisko
            </span>
          )}

          {/* Direct owner */}
          {offer.isDirectOwner && (
            <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Bez pośredników
            </span>
          )}

          {/* Border county */}
          {offer.isNearBorder && (
            <span className="bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <ShieldAlert className="size-3" />
              Pas graniczny
            </span>
          )}

          {/* Price history count badge */}
          {offer.priceHistory.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenHistory(offer);
              }}
              className="bg-indigo-600/90 hover:bg-indigo-700 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 transition-colors"
              title="Historia zmian cen"
            >
              <History className="size-2.5" />
              {offer.priceHistory.length}
            </button>
          )}

          {/* Source badge */}
          <span className="bg-neutral-900/70 backdrop-blur-xs text-white text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md">
            {offer.source}
          </span>
        </div>

        {/* Price drop floating pill */}
        {isDrop && (
          <div className="absolute bottom-2 left-2 bg-rose-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
            <TrendingDown className="size-3.5" />
            <span>{formatPriceDelta(offer.priceChangeAmount, offer.priceChangePercent)}</span>
          </div>
        )}

        {isIncrease && (
          <div className="absolute bottom-2 left-2 bg-amber-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
            <TrendingUp className="size-3.5" />
            <span>{formatPriceDelta(offer.priceChangeAmount, offer.priceChangePercent)}</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Prices */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-xl font-extrabold text-neutral-900">
              {formatPrice(offer.currentPrice)}
            </div>
            <div className="text-xs font-semibold text-neutral-500">
              {formatPricePerM2(offer.currentPricePerM2)}
            </div>
          </div>

          {/* If initial price is different, show previous strikethrough */}
          {(isDrop || isIncrease) && offer.initialPrice !== offer.currentPrice && (
            <div className="text-xs text-neutral-400 line-through">
              Cena początkowa: {formatPrice(offer.initialPrice)}
            </div>
          )}
        </div>

        {/* Areas info */}
        <div className="flex items-center gap-3 py-1.5 px-2.5 bg-neutral-50 rounded-lg text-xs font-medium text-neutral-700 border border-neutral-100">
          <div>
            <span className="text-neutral-400 block text-[10px] uppercase">
              {offer.propertyType === 'house'
                ? 'Pow. domu'
                : offer.propertyType === 'habitat'
                ? 'Pow. zabudowy'
                : 'Pow. działki'}
            </span>
            <strong className="text-neutral-900 font-bold">
              {formatArea(offer.areaM2, offer.propertyType === 'plot')}
            </strong>
          </div>

          {(offer.propertyType === 'house' || offer.propertyType === 'habitat') && offer.plotAreaM2 != null && (
            <div className="border-l border-neutral-200 pl-3">
              <span className="text-neutral-400 flex items-center gap-1 text-[10px] uppercase">
                <Trees className="size-2.5" /> Działka
              </span>
              <strong className="text-neutral-900 font-bold">
                {formatArea(offer.plotAreaM2, true)}
              </strong>
            </div>
          )}
        </div>

        {/* Location & Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
            <MapPin className="size-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">
              {offer.city}
              {offer.county ? `, pow. ${offer.county}` : ''}
              {offer.street ? ` (${offer.street})` : ''}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {offer.title}
          </h3>
        </div>

        {/* Footer Actions & Dates */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-neutral-400">
            Dodano: {formatDate(offer.firstSeenAt)}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Price History Button */}
            <button
              type="button"
              onClick={() => onOpenHistory(offer)}
              className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors"
              title="Zobacz historię zmian cen"
            >
              <History className="size-4" />
            </button>

            {/* External link button */}
            <a
              href={offer.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-700 font-medium transition-colors"
            >
              <span>Oferta</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
