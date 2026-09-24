import React, { useEffect, useMemo, useRef } from 'react';
import type { PropertyOffer, Voivodeship } from 'shared';
import { EAST_POLAND_CENTER, formatArea, formatPrice, formatPriceDelta, formatPricePerM2, POLAND_CENTER, VOIVODESHIP_CENTERS } from 'shared';
import L from 'leaflet';
import Supercluster from 'supercluster';

interface PropertyMapProps {
  offers: PropertyOffer[];
  voivodeship: Voivodeship | 'all';
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  onOpenHistory: (offer: PropertyOffer) => void;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  offers,
  voivodeship,
  isFavorite,
  onToggleFavorite,
  onOpenHistory,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filtrujemy tylko oferty ze współrzędnymi
  const validOffers = useMemo(() => {
    return offers.filter(
      (o) => o.coordinates && typeof o.coordinates.lat === 'number' && typeof o.coordinates.lng === 'number'
    );
  }, [offers]);

  // Inicjalizacja instancji Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const center =
      voivodeship !== 'all' && VOIVODESHIP_CENTERS[voivodeship]
        ? VOIVODESHIP_CENTERS[voivodeship]
        : POLAND_CENTER;

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: center.zoom,
      maxZoom: 18,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Aktualizacja widoku przy zmianie województwa
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const center =
      voivodeship !== 'all' && VOIVODESHIP_CENTERS[voivodeship]
        ? VOIVODESHIP_CENTERS[voivodeship]
        : POLAND_CENTER;

    map.flyTo([center.lat, center.lng], center.zoom, { duration: 0.8 });
  }, [voivodeship]);

  // Aktualizacja klastrów i markerów za pomocą Supercluster
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (validOffers.length === 0) return;

    // Utwórz punkty GeoJSON dla Supercluster
    const points: GeoJSON.Feature<GeoJSON.Point, PropertyOffer>[] = validOffers.map((offer) => ({
      type: 'Feature',
      properties: offer,
      geometry: {
        type: 'Point',
        coordinates: [offer.coordinates!.lng, offer.coordinates!.lat],
      },
    }));

    const index = new Supercluster({
      radius: 60,
      maxZoom: 16,
    });

    index.load(points);

    const updateMarkers = () => {
      layer.clearLayers();
      const bounds = map.getBounds();
      const zoom = Math.floor(map.getZoom());

      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];

      const clusters = index.getClusters(bbox, zoom);

      for (const c of clusters) {
        const [lng, lat] = c.geometry.coordinates;
        const isCluster = c.properties && 'cluster' in c.properties && c.properties.cluster;

        if (isCluster) {
          const count = (c.properties as { point_count: number }).point_count;
          const size = Math.min(60, 32 + Math.log2(count) * 6);

          const icon = L.divIcon({
            html: `<span>${count}</span>`,
            className: 'cluster-marker',
            iconSize: [size, size],
          });

          const marker = L.marker([lat, lng], { icon });
          marker.on('click', () => {
            const expansionZoom = Math.min(index.getClusterExpansionZoom(c.properties.cluster_id), 18);
            map.flyTo([lat, lng], expansionZoom);
          });

          layer.addLayer(marker);
        } else {
          // Pojedynczy punkt oferty
          const offer = c.properties as PropertyOffer;
          const isDrop = offer.priceChangeAmount < 0 || offer.status === 'price_drop';

          const markerColor = isDrop
            ? 'bg-rose-600'
            : offer.propertyType === 'house'
            ? 'bg-emerald-600'
            : offer.propertyType === 'habitat'
            ? 'bg-orange-600'
            : 'bg-amber-600';

          const iconHtml = `
            <div class="px-2 py-1 rounded-md text-white font-bold text-[11px] shadow-md border-2 border-white flex items-center gap-1 ${markerColor} whitespace-nowrap cursor-pointer hover:scale-105 transition-transform">
              ${isDrop ? '📉 ' : ''}${formatPrice(offer.currentPrice)}
            </div>
          `;

          const icon = L.divIcon({
            html: iconHtml,
            className: 'custom-pin',
            iconSize: [80, 26],
            iconAnchor: [40, 13],
          });

          const marker = L.marker([lat, lng], { icon });

          const popupContent = document.createElement('div');
          popupContent.className = 'p-1 text-xs space-y-2 min-w-[220px]';

            const isFav = isFavorite ? isFavorite(offer.id) : false;

            popupContent.innerHTML = `
            ${
              offer.imageUrl
                ? `<div class="aspect-16/9 rounded-md overflow-hidden bg-neutral-100 mb-1">
                     <img src="${offer.imageUrl}" class="w-full h-full object-cover" />
                   </div>`
                : ''
            }
            <div class="font-extrabold text-sm text-neutral-900 flex justify-between items-baseline">
              <span>${formatPrice(offer.currentPrice)}</span>
              <span class="text-[11px] text-neutral-500 font-semibold">${formatPricePerM2(offer.currentPricePerM2)}</span>
            </div>
            ${
              isDrop
                ? `<div class="text-rose-600 font-bold text-[11px]">
                     ${formatPriceDelta(offer.priceChangeAmount, offer.priceChangePercent)}
                   </div>`
                : ''
            }
            <div class="font-medium text-neutral-700 line-clamp-1">
              ${offer.propertyType === 'house' ? '🏠 Dom' : offer.propertyType === 'habitat' ? '🌾 Siedlisko' : '🌲 Działka'}: ${formatArea(offer.areaM2, offer.propertyType === 'plot')}
              ${offer.plotAreaM2 ? ` • Działka: ${formatArea(offer.plotAreaM2, true)}` : ''}
            </div>
            <div class="text-neutral-500 text-[11px]">
              ${offer.city}${offer.county ? `, pow. ${offer.county}` : ''}
            </div>
            <div class="pt-2 flex items-center justify-between border-t border-neutral-100 mt-2">
              <a href="${offer.sourceUrl}" target="_blank" rel="noopener" class="text-emerald-700 font-semibold underline">
                Otwórz (${offer.source.toUpperCase()})
              </a>
              <div class="flex items-center gap-1">
                ${
                  onToggleFavorite
                    ? `<button id="fav-btn-${offer.id}" class="px-1.5 py-1 rounded text-xs hover:bg-neutral-100 ${
                        isFav ? 'text-rose-500' : 'text-neutral-400'
                      }">
                        ${isFav ? '❤️' : '🤍'}
                       </button>`
                    : ''
                }
                <button id="history-btn-${offer.id}" class="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 font-medium text-[10px]">
                  Historia cen
                </button>
              </div>
            </div>
          `;

          const favBtn = popupContent.querySelector(`#fav-btn-${offer.id}`);
          if (favBtn && onToggleFavorite) {
            favBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              onToggleFavorite(offer.id);
              favBtn.textContent = favBtn.textContent?.includes('❤️') ? '🤍' : '❤️';
            });
          }

          const historyBtn = popupContent.querySelector(`#history-btn-${offer.id}`);
          if (historyBtn) {
            historyBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              onOpenHistory(offer);
            });
          }

          marker.bindPopup(popupContent);
          layer.addLayer(marker);
        }
      }
    };

    updateMarkers();
    map.on('moveend', updateMarkers);

    return () => {
      map.off('moveend', updateMarkers);
    };
  }, [validOffers, onOpenHistory]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] bg-neutral-100">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
