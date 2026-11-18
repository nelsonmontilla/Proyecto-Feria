import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "./useDebounce";

const INITIAL_FILTERS = {
  search: "",
  species: "Todos",
  size: "Todos",
  gender: "Todos",
  urgencyLevel: "Todos",
  ongId: "Todos",
  status: "Todos",
  onlyFavorites: false,
  sortBy: "urgency"
};

/**
 * Custom Hook #2: usePetFilters
 * Gestiona el filtrado multicriterio, ordenamiento y búsqueda con debounce
 * en el catálogo interactivo de mascotas.
 */
export function usePetFilters(pets = [], favoriteIds = []) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 220);

  const updateFilter = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const filteredPets = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return pets
      .filter((pet) => {
        if (filters.species !== "Todos" && pet.species !== filters.species) {
          return false;
        }
        if (filters.size !== "Todos" && pet.size !== filters.size) {
          return false;
        }
        if (filters.gender !== "Todos" && pet.gender !== filters.gender) {
          return false;
        }
        if (
          filters.urgencyLevel !== "Todos" &&
          pet.urgencyLevel !== filters.urgencyLevel
        ) {
          return false;
        }
        if (filters.ongId !== "Todos" && pet.ongId !== filters.ongId) {
          return false;
        }
        if (filters.status !== "Todos" && pet.status !== filters.status) {
          return false;
        }
        if (filters.onlyFavorites && !favoriteIds.includes(pet.id)) {
          return false;
        }
        if (query) {
          const searchable = `${pet.name} ${pet.breed} ${pet.city} ${pet.ongName} ${pet.description}`.toLowerCase();
          if (!searchable.includes(query)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "urgency") {
          const rank = { Alta: 3, Media: 2, Baja: 1 };
          return (rank[b.urgencyLevel] || 0) - (rank[a.urgencyLevel] || 0);
        }
        if (filters.sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (filters.sortBy === "recent") {
          return (b.createdAt || "").localeCompare(a.createdAt || "");
        }
        return 0;
      });
  }, [pets, filters, debouncedSearch, favoriteIds]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.species !== "Todos") count++;
    if (filters.size !== "Todos") count++;
    if (filters.gender !== "Todos") count++;
    if (filters.urgencyLevel !== "Todos") count++;
    if (filters.ongId !== "Todos") count++;
    if (filters.status !== "Todos") count++;
    if (filters.onlyFavorites) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredPets,
    activeFiltersCount,
    updateFilter,
    resetFilters
  };
}
