import React from 'react';
import type { SummaryStats } from 'shared';
import { formatDate, formatPricePerM2 } from 'shared';
import { Home, Trees, Wheat, Flame, Clock } from 'lucide-react';

interface StatsBarProps {
  summary: SummaryStats | null;
}

export const StatsBar: React.FC<StatsBarProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-neutral-900 text-white text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Home className="size-3.5 text-emerald-400" />
            <span>
              Średnia domy: <strong className="text-white">{formatPricePerM2(summary.avgHousePricePerM2)}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-300">
            <Trees className="size-3.5 text-amber-400" />
            <span>
              Średnia działki: <strong className="text-white">{formatPricePerM2(summary.avgPlotPricePerM2)}</strong>
            </span>
          </div>

          {summary.avgHabitatPricePerM2 > 0 && (
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Wheat className="size-3.5 text-yellow-400" />
              <span>
                Średnia siedliska: <strong className="text-white">{formatPricePerM2(summary.avgHabitatPricePerM2)}</strong>
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-neutral-300">
            <Flame className="size-3.5 text-rose-400" />
            <span>
              Wykryte obniżki cen: <strong className="text-white">{summary.totalPriceDrops}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-neutral-400 text-[11px] ml-auto">
          <Clock className="size-3" />
          <span>Aktualizacja: {formatDate(summary.lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
};
