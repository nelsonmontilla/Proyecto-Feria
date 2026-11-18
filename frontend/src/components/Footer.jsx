import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, Building2, ShieldCheck, PhoneCall, Layers, Server } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-14 pb-10 border-t-4 border-brand-cyan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/15">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 overflow-hidden shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Animal Advisor Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="block text-xl font-extrabold font-display tracking-tight">
                  ANIMAL ADVISOR
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-brand-mint uppercase">
                  Guide to Pet Adoption
                </span>
              </div>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Sistema integral para la difusión y gestión de adopciones de perros y gatos, combatiendo la saturación de refugios y los procesos de adopción dispersos.
            </p>
          </div>

          {/* Col 2: React Router Views */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-brand-mint mb-4 font-display">
              Módulos del Sistema
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-white/85">
              <li>
                <Link
                  to="/"
                  className="hover:text-brand-amber transition-colors flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Landing Page Completa (8 Secciones)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className="hover:text-brand-amber transition-colors flex items-center gap-2"
                >
                  <PawPrint className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Catálogo Interactivo con Filtros</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/ong"
                  className="hover:text-brand-amber transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-3.5 h-3.5 text-brand-mint" />
                  <span>Pestaña de Gestión para ONGs</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-brand-amber transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Panel de Supervisión Administrador</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="hover:text-brand-amber transition-colors flex items-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Sección de Contacto y Asesoría</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Custom Hooks */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-brand-mint mb-4 font-display">
              Custom Hooks Propios (6)
            </h4>
            <ul className="space-y-1.5 text-xs text-white/80 font-mono">
              <li>1. useDebounce</li>
              <li>2. usePetFilters</li>
              <li>3. useFormValidation</li>
              <li>4. useLocalStorageFavorites</li>
              <li>5. useNotificationToast</li>
              <li>6. useShelterStats</li>
            </ul>
          </div>

          {/* Col 4: Architecture */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-brand-mint mb-4 font-display flex items-center gap-1.5">
              <Server className="w-4 h-4 text-brand-amber" />
              <span>Arquitectura Técnica</span>
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>• Estado Global: Redux Toolkit</li>
              <li>• Enrutamiento: React Router v6</li>
              <li>• Entidades CRUD: Mascotas, ONGs, Historial Adopciones, Contactos</li>
              <li>• Servidor Web & Proxy: Nginx</li>
              <li>• Backend Propio: Node.js + Express REST API</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>
            © {new Date().getFullYear()} Animal Advisor — Guide to Pet Adoption. Todos los derechos reservados.
          </p>
          <p className="text-brand-mint font-semibold">
            Diseñado con la paleta oficial del logo Animal Advisor
          </p>
        </div>
      </div>
    </footer>
  );
}
