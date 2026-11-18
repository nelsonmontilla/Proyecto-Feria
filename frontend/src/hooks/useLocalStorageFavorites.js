import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

const BASE_STORAGE_KEY = "animal_advisor_favorites_user_";

/**
 * Custom Hook #4: useLocalStorageFavorites
 * Requiere sesión iniciada y aisla la lista de favoritos de forma exclusiva
 * para cada usuario autenticado (según su user.id).
 */
export function useLocalStorageFavorites() {
  const user = useSelector((state) => state.auth.user);
  const userStorageKey = user?.id ? `${BASE_STORAGE_KEY}${user.id}` : null;

  const [favoriteIds, setFavoriteIds] = useState([]);

  // Cargar los favoritos propios del usuario que inició sesión
  useEffect(() => {
    if (!userStorageKey) {
      setFavoriteIds([]);
      return;
    }
    try {
      const saved = window.localStorage.getItem(userStorageKey);
      setFavoriteIds(saved ? JSON.parse(saved) : []);
    } catch {
      setFavoriteIds([]);
    }
  }, [userStorageKey]);

  const toggleFavorite = useCallback(
    (petId) => {
      if (!userStorageKey) return false;
      setFavoriteIds((prev) => {
        const next = prev.includes(petId)
          ? prev.filter((id) => id !== petId)
          : [...prev, petId];
        try {
          window.localStorage.setItem(userStorageKey, JSON.stringify(next));
        } catch (err) {
          console.error("Error guardando favoritos del usuario:", err);
        }
        return next;
      });
      return true;
    },
    [userStorageKey]
  );

  const isFavorite = useCallback(
    (petId) => {
      if (!userStorageKey) return false;
      return favoriteIds.includes(petId);
    },
    [favoriteIds, userStorageKey]
  );

  const clearFavorites = useCallback(() => {
    if (!userStorageKey) return;
    setFavoriteIds([]);
    try {
      window.localStorage.removeItem(userStorageKey);
    } catch (err) {
      console.error("Error limpiando favoritos:", err);
    }
  }, [userStorageKey]);

  return {
    favoriteIds: userStorageKey ? favoriteIds : [],
    favoritesCount: userStorageKey ? favoriteIds.length : 0,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    canUseFavorites: Boolean(userStorageKey)
  };
}
