import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Heart,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Eye,
  PawPrint,
  PhoneCall,
  Lock
} from "lucide-react";
import { usePetFilters } from "../hooks/usePetFilters";
import { useLocalStorageFavorites } from "../hooks/useLocalStorageFavorites";
import { useNotificationToast } from "../hooks/useNotificationToast";
import { useAuth } from "../hooks/useAuth";
import { openAdoptionModal, openDetailModal } from "../store/slices/uiSlice";

export default function CatalogSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pets = useSelector((state) => state.pets.items);
  const loading = useSelector((state) => state.pets.loading);
  const ongs = useSelector((state) => state.ongs.items);

  const { isAuthenticated, user } = useAuth();
  const { favoriteIds, toggleFavorite, isFavorite } = useLocalStorageFavorites();
  const { notify } = useNotificationToast();

  const {
    filters,
    filteredPets,
    activeFiltersCount,
    updateFilter,
    resetFilters
  } = usePetFilters(pets, favoriteIds);

  // Si cierra sesión mientras tenía activo el filtro de favoritos, desactivarlo
  useEffect(() => {
    if (!isAuthenticated && filters.onlyFavorites) {
      updateFilter("onlyFavorites", false);
    }
  }, [isAuthenticated, filters.onlyFavorites, updateFilter]);

  const handleFavoriteClick = (pet) => {
    if (!isAuthenticated) {
      notify({
        title: "Inicio de sesión requerido",
        message:
          "Debes iniciar sesión (como Usuario, ONG o Admin) para guardar mascotas en tu lista personal de favoritos.",
        type: "warning"
      });
      navigate("/login");
      return;
    }

    const alreadyFav = isFavorite(pet.id);
    toggleFavorite(pet.id);
    notify({
      title: alreadyFav ? "Eliminado de tus favoritos" : "Guardado en tus favoritos",
      message: alreadyFav
        ? `${pet.name} fue retirado de la lista de favoritos de ${user.name}.`
        : `${pet.name} se guardó en la lista personal de favoritos de ${user.name}.`,
      type: alreadyFav ? "warning" : "success"
    });
  };

  const handleToggleOnlyFavorites = () => {
    if (!isAuthenticated) {
      notify({
        title: "Inicia sesión para ver tus Favoritos",
        message:
          "La sección de favoritos es privada de cada cuenta. Inicia sesión para acceder a ella.",
        type: "warning"
      });
      navigate("/login");
      return;
    }
    updateFilter("onlyFavorites", !filters.onlyFavorites);
  };

  return (
    <section id="catalogo" className="py-16 bg-brand-ice/60 border-b border-brand-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-navy text-white text-xs font-extrabold uppercase tracking-wider">
              <PawPrint className="w-3.5 h-3.5 text-brand-amber" />
              Catálogo Interactivo de Adopción
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-brand-navy font-display">
              Encuentra a tu compañero ideal
            </h2>
            <p className="mt-1.5 text-slate-600 text-base max-w-2xl">
              Filtra por especie, tamaño, nivel de urgencia o refugio responsable. Cada adopción libera espacio en un albergue saturado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleToggleOnlyFavorites}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                filters.onlyFavorites
                  ? "bg-brand-amber text-white border-brand-amber shadow-sm"
                  : "bg-white text-brand-navy border-brand-cyan/30 hover:bg-brand-cream"
              }`}
            >
              {isAuthenticated ? (
                <Heart
                  className={`w-4 h-4 ${
                    filters.onlyFavorites
                      ? "fill-white text-white"
                      : "text-brand-amber"
                  }`}
                />
              ) : (
                <Lock className="w-4 h-4 text-brand-amber" />
              )}
              <span>
                {isAuthenticated
                  ? `Mis Favoritos (${favoriteIds.length})`
                  : "Favoritos (Iniciar Sesión)"}
              </span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-brand-slate border border-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Limpiar filtros ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Filter Panel */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-brand-cyan/25 mb-10">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-teal mb-4">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros Multicriterio (Custom Hook: usePetFilters + useDebounce)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search Input */}
            <div className="sm:col-span-2">
              <label
                htmlFor="catalog-search"
                className="block text-xs font-bold text-brand-navy mb-1"
              >
                Buscar por nombre, raza o ciudad
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="catalog-search"
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  placeholder="Ej. Max, Siamés, Caracas..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>
            </div>

            {/* Species Filter */}
            <div>
              <label
                htmlFor="filter-species"
                className="block text-xs font-bold text-brand-navy mb-1"
              >
                Especie
              </label>
              <select
                id="filter-species"
                value={filters.species}
                onChange={(e) => updateFilter("species", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
              >
                <option value="Todos">Perros y Gatos</option>
                <option value="Perro">Solo Perros</option>
                <option value="Gato">Solo Gatos</option>
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label
                htmlFor="filter-size"
                className="block text-xs font-bold text-brand-navy mb-1"
              >
                Tamaño
              </label>
              <select
                id="filter-size"
                value={filters.size}
                onChange={(e) => updateFilter("size", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
              >
                <option value="Todos">Todos los tamaños</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            {/* Urgency Filter */}
            <div>
              <label
                htmlFor="filter-urgency"
                className="block text-xs font-bold text-brand-navy mb-1"
              >
                Nivel de Urgencia
              </label>
              <select
                id="filter-urgency"
                value={filters.urgencyLevel}
                onChange={(e) => updateFilter("urgencyLevel", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
              >
                <option value="Todos">Cualquier urgencia</option>
                <option value="Alta">Urgencia Alta</option>
                <option value="Media">Urgencia Media</option>
                <option value="Baja">Urgencia Baja</option>
              </select>
            </div>

            {/* ONG Filter */}
            <div>
              <label
                htmlFor="filter-ong"
                className="block text-xs font-bold text-brand-navy mb-1"
              >
                Refugio / ONG
              </label>
              <select
                id="filter-ong"
                value={filters.ongId}
                onChange={(e) => updateFilter("ongId", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
              >
                <option value="Todos">Todas las ONG</option>
                {ongs.map((ong) => (
                  <option key={ong.id} value={ong.id}>
                    {ong.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Quick Filter Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-brand-slate">Estado:</span>
              {["Todos", "Disponible", "En Proceso", "Adoptado"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => updateFilter("status", st)}
                  className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                    filters.status === st
                      ? "bg-brand-navy text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-brand-ice"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-slate">Mostrando:</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-ice text-brand-navy font-extrabold">
                {filteredPets.length} de {pets.length} mascotas
              </span>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-4 h-96 animate-pulse border border-slate-100"
              >
                <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4" />
                <div className="h-5 bg-slate-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-10 bg-slate-200 rounded-xl mt-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPets.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-cyan/25 shadow-soft max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-brand-ice text-brand-teal flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-brand-navy font-display">
              No encontramos mascotas con esos filtros
            </h3>
            <p className="text-sm text-slate-600 mt-2 mb-6">
              Prueba ajustando la especie, el tamaño o limpiando los criterios de búsqueda para ver todos los peludos disponibles.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-sm hover:bg-brand-teal transition-colors cursor-pointer"
            >
              Restablecer todos los filtros
            </button>
          </div>
        )}

        {/* Pet Cards Grid */}
        {!loading && filteredPets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPets.map((pet) => {
              const fav = isFavorite(pet.id);
              const isAvailable = pet.status === "Disponible";

              return (
                <article
                  key={pet.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-brand-cyan/25 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Pet Image Container */}
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <img
                        src={pet.image}
                        alt={`${pet.name} - ${pet.breed}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                            pet.species === "Perro"
                              ? "bg-brand-navy text-white"
                              : "bg-brand-teal text-white"
                          }`}
                        >
                          {pet.species}
                        </span>
                        {pet.urgencyLevel === "Alta" && isAvailable && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-brand-amber text-white shadow-sm flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Urgente
                          </span>
                        )}
                      </div>

                      {/* Favorite Button (Requires Login, Isolated per User) */}
                      <button
                        type="button"
                        onClick={() => handleFavoriteClick(pet)}
                        title={
                          !isAuthenticated
                            ? "Inicia sesión para guardar en favoritos"
                            : fav
                            ? `Quitar a ${pet.name} de tus favoritos`
                            : `Guardar a ${pet.name} en tus favoritos`
                        }
                        aria-label={
                          fav
                            ? `Quitar a ${pet.name} de favoritos`
                            : `Guardar a ${pet.name} en favoritos`
                        }
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            fav
                              ? "fill-brand-amber text-brand-amber"
                              : "text-slate-600"
                          }`}
                        />
                      </button>

                      {/* Status Ribbon */}
                      <div className="absolute bottom-3 left-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider shadow-sm ${
                            pet.status === "Disponible"
                              ? "bg-emerald-500 text-white"
                              : pet.status === "En Proceso"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-700 text-white"
                          }`}
                        >
                          {pet.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-extrabold text-brand-navy font-display">
                            {pet.name}
                          </h3>
                          <p className="text-xs font-bold text-brand-teal">
                            {pet.breed}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-brand-ice text-brand-navy text-xs font-extrabold">
                          {pet.age} {pet.ageUnit}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100">
                          {pet.gender}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100">
                          Tamaño {pet.size}
                        </span>
                        {pet.vaccinated && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Vacunado
                          </span>
                        )}
                        {pet.sterilized && (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-brand-navy flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Esterilizado
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {pet.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                          <span className="truncate font-semibold text-brand-navy">
                            {pet.ongName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                          <span>{pet.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch(openDetailModal(pet))}
                      className="px-3 py-2.5 rounded-xl bg-brand-ice hover:bg-brand-cyan/20 text-brand-navy font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ficha</span>
                    </button>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => dispatch(openAdoptionModal(pet))}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 ${
                        isAvailable
                          ? "bg-brand-amber hover:bg-brand-amberDark text-white shadow-sm cursor-pointer"
                          : "bg-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>
                        {isAvailable ? "Solicitar Adopción" : pet.status}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
