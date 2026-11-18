import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  PawPrint,
  Building2,
  ShieldCheck,
  Heart,
  PhoneCall,
  Menu,
  X,
  Home,
  AlertCircle,
  Sparkles,
  KeyRound,
  LogOut,
  User
} from "lucide-react";
import { useShelterStats } from "../hooks/useShelterStats";
import { useLocalStorageFavorites } from "../hooks/useLocalStorageFavorites";
import { useAuth } from "../hooks/useAuth";
import { useNotificationToast } from "../hooks/useNotificationToast";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stats = useShelterStats();
  const { favoritesCount } = useLocalStorageFavorites();
  const { user, isAuthenticated, isAdmin, isOng, signOut } = useAuth();
  const { notify } = useNotificationToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Navegación dinámica según el rol autenticado
  const navItems = [
    { to: "/", label: "Inicio", icon: Home },
    {
      to: "/catalogo",
      label: "Catálogo",
      icon: PawPrint,
      badge: stats.availablePets
    },
    ...(isAuthenticated
      ? [{ to: "/mi-cuenta", label: "Mis Favoritos y Solicitudes", icon: User }]
      : []),
    ...(isOng ? [{ to: "/ong", label: "Pestaña ONG", icon: Building2 }] : []),
    ...(isAdmin
      ? [{ to: "/admin", label: "Panel Admin", icon: ShieldCheck }]
      : []),
    { to: "/contacto", label: "Contacto", icon: PhoneCall }
  ];

  const handleQuickJump = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFavoritesNavClick = () => {
    setMobileMenuOpen(false);
    if (!isAuthenticated) {
      notify({
        title: "Inicio de sesión requerido",
        message:
          "Inicia sesión (como Usuario, ONG o Admin) para acceder a tu lista personal de favoritos.",
        type: "warning"
      });
      navigate("/login");
    } else {
      navigate("/mi-cuenta");
    }
  };

  const handleLogout = () => {
    signOut();
    setMobileMenuOpen(false);
    notify({
      title: "Sesión cerrada",
      message: "Has salido de tu cuenta correctamente.",
      type: "warning"
    });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-cyan/20 shadow-sm">
      {/* Top Alert Bar */}
      <div className="bg-logo-gradient text-white text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-brand-amber shrink-0" />
            <span>
              Alerta de Saturación: Los refugios aliados están al{" "}
              <strong className="underline decoration-brand-amber font-bold">
                {stats.saturationPercentage}% de su capacidad
              </strong>{" "}
              ({stats.totalOccupancy}/{stats.totalCapacity} plazas ocupadas).
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleQuickJump("problematica")}
              className="hover:text-brand-amber transition-colors cursor-pointer"
            >
              Ver Impacto
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleQuickJump("proceso-adopcion")}
              className="hover:text-brand-amber transition-colors cursor-pointer"
            >
              Guía de Adopción
            </button>
            <span>•</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              {stats.urgentPetsCount} casos urgentes hoy
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          >
            <div className="relative w-14 h-14 rounded-full p-0.5 bg-logo-gradient shadow-md overflow-hidden shrink-0">
              <img
                src="/logo.jpg"
                alt="Logo Animal Advisor - Guide to Pet Adoption"
                className="w-full h-full object-cover rounded-full bg-white group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-extrabold tracking-tight text-brand-navy font-display leading-none">
                ANIMAL ADVISOR
              </span>
              <span className="block text-[11px] font-bold tracking-widest text-brand-slate uppercase mt-1">
                Guide to Pet Adoption
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav
            className="hidden lg:flex items-center gap-1.5"
            aria-label="Navegación Principal"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-brand-navy text-white shadow-sm"
                        : "text-brand-navy/80 hover:bg-brand-ice hover:text-brand-navy"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-0.5 px-2 py-0.5 text-xs font-extrabold rounded-full bg-brand-amber text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right CTA: Favorites (Requires Login) + Auth Role Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleFavoritesNavClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-cream border border-brand-amber/30 text-brand-navy text-xs font-bold hover:bg-brand-amber/15 transition-colors cursor-pointer"
              title={
                isAuthenticated
                  ? `Favoritos de ${user.name}`
                  : "Inicia sesión para ver tus favoritos"
              }
            >
              <Heart className="w-4 h-4 text-brand-amber fill-brand-amber" />
              <span>
                {isAuthenticated ? `Mis Favoritos (${favoritesCount})` : "Favoritos"}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-brand-ice border border-brand-cyan/30 text-xs">
                  <span className="block font-extrabold text-brand-navy leading-tight">
                    {user.name}
                  </span>
                  <span className="block text-[10px] font-extrabold uppercase text-brand-teal">
                    Rol:{" "}
                    {user.role === "admin"
                      ? "Administrador"
                      : user.role === "ong"
                      ? "ONG"
                      : "Usuario"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-teal text-white font-extrabold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-brand-amber" />
                <span>Login (Usuario / Admin)</span>
              </NavLink>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={
              mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"
            }
            className="lg:hidden p-2.5 rounded-xl text-brand-navy hover:bg-brand-ice focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-brand-navy text-white"
                      : "text-brand-navy hover:bg-brand-ice"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2.5 py-0.5 text-xs rounded-full bg-brand-amber text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleFavoritesNavClick}
              className="w-full py-2.5 rounded-xl bg-brand-cream text-brand-navy font-bold text-center text-sm border border-brand-amber/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-brand-amber fill-brand-amber" />
              <span>
                {isAuthenticated
                  ? `Mis Favoritos (${favoritesCount})`
                  : "Favoritos (Requiere Login)"}
              </span>
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-center text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión ({user.name})</span>
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-brand-amber text-white font-bold text-center text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Iniciar Sesión (Usuario / ONG / Admin)</span>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
