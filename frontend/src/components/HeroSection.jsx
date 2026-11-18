import React from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  Building2,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity,
  KeyRound,
  User
} from "lucide-react";
import { useShelterStats } from "../hooks/useShelterStats";
import { useAuth } from "../hooks/useAuth";

export default function HeroSection() {
  const stats = useShelterStats();
  const { isAuthenticated, isAdmin, isOng, user } = useAuth();

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-white via-brand-ice to-brand-mint/15 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-brand-cyan/15"
    >
      {/* Decorative Soft Circles Matching Logo Colors */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-brand-amber/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-navy/10 border border-brand-cyan/30 text-brand-navy text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 text-brand-amber shrink-0" />
              <span>Plataforma Integral contra la Saturación de Refugios</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy leading-tight tracking-tight font-display">
              Conectamos corazones con{" "}
              <span className="text-logo-gradient">perros y gatos</span> que esperan un hogar
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              En <strong>Animal Advisor</strong> centralizamos la difusión y gestión de adopciones para combatir la saturación crítica de los albergues y eliminar los procesos dispersos. Explora como adoptante o inicia sesión como ONG / Administrador.
            </p>

            {/* Primary CTA Buttons Separated by Role */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/catalogo"
                className="px-6 py-3.5 rounded-2xl bg-brand-amber hover:bg-brand-amberDark text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
              >
                <PawPrint className="w-5 h-5" />
                <span>Explorar Catálogo Interactivo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="px-5 py-3.5 rounded-2xl bg-brand-navy hover:bg-brand-teal text-white font-bold text-base shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-5 h-5 text-brand-amber" />
                  <span>Login (Usuario / ONG / Admin)</span>
                </Link>
              ) : (
                <>
                  {user?.role === "user" && (
                    <Link
                      to="/mi-cuenta"
                      className="px-5 py-3.5 rounded-2xl bg-brand-navy hover:bg-brand-teal text-white font-bold text-base shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-5 h-5 text-brand-mint" />
                      <span>Mi Panel Adoptante</span>
                    </Link>
                  )}
                  {isOng && (
                    <Link
                      to="/ong"
                      className="px-5 py-3.5 rounded-2xl bg-brand-navy hover:bg-brand-teal text-white font-bold text-base shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-5 h-5 text-brand-mint" />
                      <span>Pestaña ONG</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-5 py-3.5 rounded-2xl bg-white hover:bg-brand-ice text-brand-navy border-2 border-brand-cyan/40 font-bold text-base transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-5 h-5 text-brand-teal" />
                      <span>Panel Administrador</span>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Key Trust Points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold text-brand-navy">
              <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2.5 rounded-xl border border-brand-cyan/20 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                <span>Adopción 100% Responsable</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2.5 rounded-xl border border-brand-cyan/20 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                <span>Roles Separados por Login</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2.5 rounded-xl border border-brand-cyan/20 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>Soporte MongoDB Atlas</span>
              </div>
            </div>
          </div>

          {/* Right Column: Official Brand Showcase + Real-Time Metrics Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-card border-2 border-brand-cyan/30">
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-soft border border-brand-cyan/20 bg-white p-2 mb-4">
                  <img
                    src="/logo.jpg"
                    alt="Animal Advisor - Guide to Pet Adoption Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ice text-brand-teal text-xs font-extrabold uppercase tracking-wider">
                  <HeartHandshake className="w-3.5 h-3.5 text-brand-amber" />
                  Red Unificada de Adopción
                </span>
              </div>

              {/* Live Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-brand-ice border border-brand-cyan/20">
                  <div className="flex items-center justify-between text-brand-teal mb-1">
                    <span className="text-xs font-bold uppercase">En Adopción</span>
                    <PawPrint className="w-4 h-4 text-brand-amber" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                    {stats.availablePets}
                  </p>
                  <p className="text-xs text-brand-slate mt-0.5">
                    {stats.dogsCount} perros y {stats.catsCount} gatos
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-cream border border-brand-amber/30">
                  <div className="flex items-center justify-between text-brand-amberDark mb-1">
                    <span className="text-xs font-bold uppercase">Saturación ONG</span>
                    <Activity className="w-4 h-4 text-brand-amber" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                    {stats.saturationPercentage}%
                  </p>
                  <p className="text-xs text-brand-slate mt-0.5">
                    {stats.criticalOngsCount} refugios en estado crítico
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-brand-mint/50">
                  <div className="flex items-center justify-between text-brand-teal mb-1">
                    <span className="text-xs font-bold uppercase">ONGs Aliadas</span>
                    <Building2 className="w-4 h-4 text-brand-teal" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                    {stats.totalOngs}
                  </p>
                  <p className="text-xs text-brand-slate mt-0.5">
                    {stats.verifiedOngs} verificadas oficialmente
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-brand-navy mb-1">
                    <span className="text-xs font-bold uppercase">Solicitudes</span>
                    <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                    {stats.totalAdoptions}
                  </p>
                  <p className="text-xs text-brand-slate mt-0.5">
                    {stats.completedAdoptions} aprobadas/completadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
