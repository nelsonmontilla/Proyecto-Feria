import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  User,
  Heart,
  ClipboardList,
  PawPrint,
  CheckCircle2,
  Clock,
  Eye
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLocalStorageFavorites } from "../hooks/useLocalStorageFavorites";
import { openDetailModal, openAdoptionModal } from "../store/slices/uiSlice";

export default function UserDashboardSection() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const pets = useSelector((state) => state.pets.items);
  const adoptions = useSelector((state) => state.adoptions.items);
  const { favoriteIds } = useLocalStorageFavorites();

  const favoritePets = pets.filter((p) => favoriteIds.includes(p.id));
  const myAdoptions = user
    ? adoptions.filter(
        (a) =>
          a.applicantEmail?.toLowerCase() === user.email?.toLowerCase() ||
          a.applicantName?.toLowerCase().includes(user.name?.toLowerCase())
      )
    : [];

  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* User Profile Banner */}
        <div className="bg-logo-gradient rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <User className="w-8 h-8 text-brand-amber" />
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full bg-brand-amber text-brand-navy text-xs font-extrabold uppercase">
                Panel de Usuario Adoptante
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display mt-1">
                Hola, {user ? user.name : "Adoptante Invitado"}
              </h1>
              <p className="text-xs sm:text-sm text-white/85">
                {user
                  ? `${user.email} — Desde aquí puedes consultar tus mascotas favoritas y el estado de tus solicitudes de adopción.`
                  : "Explora tus mascotas guardadas en favoritos y postula desde el catálogo interactivo."}
              </p>
            </div>
          </div>

          <Link
            to="/catalogo"
            className="px-6 py-3 rounded-2xl bg-brand-amber hover:bg-brand-amberDark text-white font-extrabold text-sm shadow-md flex items-center gap-2 self-start md:self-auto"
          >
            <PawPrint className="w-4 h-4" />
            <span>Explorar Más Mascotas</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mis Solicitudes de Adopción */}
          <div className="lg:col-span-6 bg-brand-ice/60 rounded-3xl p-6 border border-brand-cyan/25">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-brand-navy font-display flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand-teal" />
                <span>Mis Solicitudes de Adopción</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-navy text-white text-xs font-bold">
                {myAdoptions.length || adoptions.slice(0, 2).length}
              </span>
            </div>

            <div className="space-y-3">
              {(myAdoptions.length > 0 ? myAdoptions : adoptions.slice(0, 2)).map(
                (adp) => (
                  <div
                    key={adp.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-extrabold text-brand-navy text-sm">
                        Mascota: {adp.petName} ({adp.petSpecies})
                      </p>
                      <p className="text-xs text-slate-500">
                        ONG: {adp.ongName} • Fecha: {adp.applicationDate}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{adp.notes}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold shrink-0 flex items-center gap-1 ${
                        adp.status === "Completada" || adp.status === "Aprobada"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {adp.status === "Completada" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {adp.status}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Mis Mascotas Favoritas */}
          <div className="lg:col-span-6 bg-brand-cream/60 rounded-3xl p-6 border border-brand-amber/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-brand-navy font-display flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-amber fill-brand-amber" />
                <span>Mis Mascotas Favoritas ({favoritePets.length})</span>
              </h2>
            </div>

            {favoritePets.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/60">
                <p className="text-sm font-bold text-brand-navy">
                  Aún no has marcado mascotas como favoritas
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Haz clic en el corazón de cualquier perro o gato en el catálogo para guardarlo aquí.
                </p>
                <Link
                  to="/catalogo"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-navy text-white text-xs font-bold"
                >
                  <PawPrint className="w-3.5 h-3.5" />
                  <span>Ir al Catálogo</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {favoritePets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-extrabold text-brand-navy text-sm">
                          {pet.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {pet.species} • {pet.breed} • {pet.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => dispatch(openDetailModal(pet))}
                        className="p-2 rounded-xl bg-brand-ice text-brand-navy text-xs font-bold cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {pet.status === "Disponible" && (
                        <button
                          type="button"
                          onClick={() => dispatch(openAdoptionModal(pet))}
                          className="px-3 py-1.5 rounded-xl bg-brand-amber text-white text-xs font-extrabold cursor-pointer"
                        >
                          Adoptar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
