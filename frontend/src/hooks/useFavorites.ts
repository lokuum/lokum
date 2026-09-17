import { useEffect, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'lokum_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('Nie udało się wczytać ulubionych z localStorage:', e);
    }
    return new Set();
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn('Nie udało się zapisać ulubionych do localStorage:', e);
      }
      return next;
    });
  };

  const isFavorite = (id: string): boolean => {
    return favorites.has(id);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.size,
  };
}
