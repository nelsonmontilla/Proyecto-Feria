import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  User,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  UserPlus,
  CheckCircle2,
  Database,
  Info
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNotificationToast } from "../hooks/useNotificationToast";

export default function LoginSection() {
  const navigate = useNavigate();
  const { login, register, loading, error, resetError, dbStatus } = useAuth();
  const { notify } = useNotificationToast();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    resetError();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickDemoLogin = async (email, password, targetRoute, roleLabel) => {
    try {
      const res = await login({ email, password });
      notify({
        title: `Sesión iniciada como ${roleLabel}`,
        message: res.message || `Bienvenido(a) a Animal Advisor.`,
        type: "success"
      });
      navigate(targetRoute);
    } catch (err) {
      notify({
        title: "Error de autenticación",
        message: err,
        type: "error"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        const res = await login({
          email: formData.email,
          password: formData.password
        });
        notify({
          title: "Sesión iniciada",
          message: res.message,
          type: "success"
        });
        if (res.user.role === "admin") {
          navigate("/admin");
        } else if (res.user.role === "ong") {
          navigate("/ong");
        } else {
          navigate("/mi-cuenta");
        }
      } else {
        // El registro público crea únicamente cuentas de Usuario Normal (Adoptante)
        const res = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        notify({
          title: "Cuenta de adoptante registrada",
          message: `Bienvenido(a), ${res.user.name}.`,
          type: "success"
        });
        navigate("/mi-cuenta");
      }
    } catch (err) {
      notify({
        title: "No se pudo completar el acceso",
        message: err,
        type: "error"
      });
    }
  };

  return (
    <section className="py-14 bg-gradient-to-br from-brand-ice via-white to-brand-mint/15 min-h-[82vh] flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Role Separation Explanation & 1-Click Demo Access */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy/10 text-brand-navy text-xs font-extrabold uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-brand-amber" />
              <span>Control de Acceso por Roles e Independencia por ONG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-display leading-tight">
              Portal de Acceso Separado: Usuario Adoptante, ONGs y Administrador
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Los nuevos adoptantes pueden registrarse libremente. Las cuentas de <strong>ONGs aliadas</strong> son dadas de alta exclusivamente por el <strong>Administrador</strong> desde su panel de supervisión.
            </p>

            {/* Quick 1-Click Role Switcher Cards for Evaluation */}
            <div className="bg-white rounded-3xl p-6 border border-brand-cyan/30 shadow-soft space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-navy">
                  Credenciales Rápidas de Prueba (1 Clic)
                </h2>
                <span className="text-xs font-bold text-brand-teal">
                  Haz clic para probar cada rol
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Admin Quick Login */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      "admin@animaladvisor.org",
                      "admin123",
                      "/admin",
                      "Administrador"
                    )
                  }
                  className="w-full p-3.5 rounded-2xl bg-brand-navy hover:bg-brand-teal text-white text-left transition-all flex items-center justify-between group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-brand-amber" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm font-display flex items-center gap-2">
                        <span>1. Administrador General</span>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-brand-amber text-brand-navy font-extrabold">
                          ADMIN
                        </span>
                      </p>
                      <p className="text-xs text-white/80">
                        admin@animaladvisor.org | Único habilitado para registrar nuevas ONGs
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-mint group-hover:translate-x-1 transition-transform" />
                </button>

                {/* ONG 1 Quick Login */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      "ong@huellasesperanza.org",
                      "ong123",
                      "/ong",
                      "ONG: Fundación Huellas de Esperanza"
                    )
                  }
                  className="w-full p-3.5 rounded-2xl bg-brand-ice hover:bg-brand-cyan/20 text-brand-navy border border-brand-cyan/30 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm font-display flex items-center gap-2">
                        <span>2. ONG 1: Huellas de Esperanza (Caracas)</span>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-brand-teal text-white font-extrabold">
                          ONG #1
                        </span>
                      </p>
                      <p className="text-xs text-slate-600">
                        ong@huellasesperanza.org | Solo gestiona sus mascotas (Max, Milo, Simba)
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-teal group-hover:translate-x-1 transition-transform" />
                </button>

                {/* ONG 2 Quick Login */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      "ong@patitasunidas.org",
                      "ong123",
                      "/ong",
                      "ONG: Refugio Patitas Unidas"
                    )
                  }
                  className="w-full p-3.5 rounded-2xl bg-brand-ice hover:bg-brand-cyan/20 text-brand-navy border border-brand-cyan/30 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-cyan text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm font-display flex items-center gap-2">
                        <span>3. ONG 2: Refugio Patitas Unidas (Valencia)</span>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-brand-cyan text-white font-extrabold">
                          ONG #2
                        </span>
                      </p>
                      <p className="text-xs text-slate-600">
                        ong@patitasunidas.org | Solo gestiona sus mascotas (Toby, Canela)
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-teal group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Normal User Quick Login */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      "usuario@correo.com",
                      "user123",
                      "/mi-cuenta",
                      "Usuario Normal (Adoptante)"
                    )
                  }
                  className="w-full p-3.5 rounded-2xl bg-brand-cream hover:bg-brand-amber/15 text-brand-navy border border-brand-amber/30 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-amber text-white flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm font-display flex items-center gap-2">
                        <span>4. Usuario Normal (Adoptante)</span>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-brand-amber text-white font-extrabold">
                          USUARIO
                        </span>
                      </p>
                      <p className="text-xs text-slate-600">
                        usuario@correo.com | Tiene su lista privada de favoritos y solicitudes
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-amberDark group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* MongoDB Atlas Status Badge */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 border border-brand-cyan/25 text-xs text-slate-600">
              <Database className="w-5 h-5 text-brand-teal shrink-0" />
              <div>
                <span className="font-extrabold text-brand-navy">
                  Motor de Base de Datos:{" "}
                </span>
                <span>{dbStatus?.mode || "MongoDB Atlas + Respaldo JSON"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Login / Register Manual Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-card border-2 border-brand-cyan/30">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.jpg"
                    alt="Animal Advisor"
                    className="w-12 h-12 rounded-full object-cover border border-brand-cyan/40"
                  />
                  <div>
                    <h2 className="text-xl font-extrabold text-brand-navy font-display">
                      {mode === "login"
                        ? "Iniciar Sesión"
                        : "Registro de Adoptante"}
                    </h2>
                    <p className="text-xs text-brand-slate">
                      Animal Advisor — Guide to Pet Adoption
                    </p>
                  </div>
                </div>

                <div className="flex bg-brand-ice p-1 rounded-xl border border-brand-cyan/20 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      mode === "login"
                        ? "bg-brand-navy text-white"
                        : "text-brand-navy"
                    }`}
                  >
                    Ingresar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      mode === "register"
                        ? "bg-brand-navy text-white"
                        : "text-brand-navy"
                    }`}
                  >
                    Registro
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <>
                    <div className="p-3.5 rounded-2xl bg-brand-ice border border-brand-cyan/30 flex items-start gap-2.5 text-xs text-brand-navy">
                      <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                      <span>
                        Este formulario registra cuentas de{" "}
                        <strong>Usuario Adoptante</strong>. El alta de nuevas{" "}
                        <strong>ONGs</strong> es realizada exclusivamente por el{" "}
                        <strong>Administrador</strong> en su panel de supervisión.
                      </span>
                    </div>

                    <div>
                      <label
                        htmlFor="auth-name"
                        className="block text-xs font-bold text-brand-navy mb-1"
                      >
                        Nombre Completo del Adoptante *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="auth-name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ej. Carlos Mendoza"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={
                        mode === "login"
                          ? "admin@animaladvisor.org, ong@... o usuario@..."
                          : "tu@correo.com"
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="auth-password"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-brand-amber hover:bg-brand-amberDark text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {mode === "login" ? (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>
                        {loading ? "Verificando..." : "Iniciar Sesión"}
                      </span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>
                        {loading
                          ? "Registrando..."
                          : "Crear Cuenta de Adoptante"}
                      </span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                  Sesión segura para tu cuenta
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  className="font-bold text-brand-teal hover:underline cursor-pointer"
                >
                  {mode === "login"
                    ? "¿Eres adoptante nuevo? Regístrate"
                    : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
