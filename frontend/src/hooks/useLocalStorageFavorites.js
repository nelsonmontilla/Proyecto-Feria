import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "animal_advisor_favorites";

/**
 * Custom Hook #4: useLocalStorageFavorites
 * Permite a los adoptantes guardar y gestionar sus mascotas favoritas
 * con persistencia en localStorage.
 */
export function useLocalStorageFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (err) {
      console.error("Error guardando favoritos en localStorage:", err);
    }
  }, [favoriteIds]);

  const toggleFavorite = useCallback((petId) => {
    setFavoriteIds((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  }, []);

  const isFavorite = useCallback(
    (petId) => favoriteIds.includes(petId),
    [favoriteIds]
  );

  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
  }, []);

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
}
