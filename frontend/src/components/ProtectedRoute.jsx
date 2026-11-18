import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, KeyRound, Home } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

/**
 * Componente ProtectedRoute
 * Separa estrictamente la vista del Usuario Normal respecto a los paneles
 * protegidos de Administrador (/admin) y ONG (/ong).
 */
export default function ProtectedRoute({ allowedRoles = ["admin"], children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <section className="py-20 bg-brand-ice min-h-[70vh] flex items-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-8 border-2 border-brand-cyan/30 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-brand-navy text-brand-amber flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-brand-navy font-display">
              Inicio de Sesión Requerido
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Esta sección está reservada para cuentas autorizadas ({allowedRoles.join(" o ").toUpperCase()}). Inicia sesión para continuar.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-6 py-3 rounded-2xl bg-brand-amber hover:bg-brand-amberDark text-white font-extrabold text-sm shadow-sm flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Ir al Login de Acceso</span>
              </Link>
              <Link
                to="/"
                className="px-5 py-3 rounded-2xl bg-brand-ice text-brand-navy font-bold text-sm hover:bg-brand-cyan/20 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <section className="py-20 bg-brand-ice min-h-[70vh] flex items-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-8 border-2 border-red-200 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-brand-navy font-display">
              Acceso Restringido para tu Rol Actual
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Has iniciado sesión como <strong>{user.name}</strong> (Rol:{" "}
              <span className="uppercase font-bold text-brand-teal">
                {user.role}
              </span>
              ). Este módulo requiere permisos de{" "}
              <strong className="uppercase">{allowedRoles.join(" / ")}</strong>.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-6 py-3 rounded-2xl bg-brand-navy hover:bg-brand-teal text-white font-extrabold text-sm shadow-sm"
              >
                Cambiar de Cuenta en Login
              </Link>
              <Link
                to="/"
                className="px-5 py-3 rounded-2xl bg-brand-ice text-brand-navy font-bold text-sm"
              >
                Ir a la Vista de Usuario
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return children;
}
