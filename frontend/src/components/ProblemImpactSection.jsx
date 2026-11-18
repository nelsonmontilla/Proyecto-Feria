import React from "react";
import { useSelector } from "react-redux";
import {
  AlertTriangle,
  Layers,
  CheckCircle,
  TrendingUp,
  Building2,
  HeartHandshake
} from "lucide-react";
import { useShelterStats } from "../hooks/useShelterStats";

export default function ProblemImpactSection() {
  const ongs = useSelector((state) => state.ongs.items);
  const stats = useShelterStats();

  return (
    <section id="problematica" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-cream text-brand-amberDark text-xs font-extrabold uppercase tracking-wider border border-brand-amber/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Diagnóstico de la Problemática
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-brand-navy font-display">
            ¿Por qué los refugios están saturados y cómo lo resolvemos?
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            La falta de canales centralizados provoca que los adoptantes no encuentren información confiable y que los albergues superen el 85% de su capacidad operativa.
          </p>
        </div>

        {/* 3 Pillars Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-red-50/60 border border-red-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-brand-navy font-display mb-2">
              1. Refugios Saturados
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Los albergues reciben decenas de animales rescatados semanalmente, pero la baja rotación por falta de visibilidad impide recibir nuevos casos de emergencia.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-brand-cream/80 border border-brand-amber/30 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber/20 text-brand-amberDark flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-brand-navy font-display mb-2">
              2. Procesos Dispersos
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Publicaciones perdidas en redes sociales, formularios inconexos y falta de seguimiento generan frustración en los adoptantes y abandono del proceso.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-brand-ice border border-brand-cyan/30 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 text-brand-navy flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-brand-teal" />
            </div>
            <h3 className="text-xl font-extrabold text-brand-navy font-display mb-2">
              3. Solución Animal Advisor
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unificamos un catálogo interactivo con filtros precisos, un portal autogestionable para ONGs y un panel administrativo de auditoría e historial.
            </p>
          </div>
        </div>

        {/* Real-time Shelter Occupancy Monitor */}
        <div className="bg-brand-navy rounded-3xl p-6 sm:p-8 text-white shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <div className="flex items-center gap-2 text-brand-mint text-xs font-extrabold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Monitor de Ocupación en Tiempo Real (Estado Redux)</span>
              </div>
              <h3 className="text-2xl font-extrabold font-display mt-1">
                Nivel de Saturación por ONG Aliada
              </h3>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl">
              <HeartHandshake className="w-5 h-5 text-brand-amber" />
              <div className="text-xs">
                <span className="block opacity-80">Ocupación Total Red</span>
                <strong className="text-sm font-extrabold text-brand-mint">
                  {stats.totalOccupancy} / {stats.totalCapacity} cupos ({stats.saturationPercentage}%)
                </strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {ongs.map((ong) => {
              const pct =
                ong.capacity > 0
                  ? Math.min(100, Math.round((ong.currentOccupancy / ong.capacity) * 100))
                  : 0;
              const isCritical = pct >= 85;

              return (
                <div
                  key={ong.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-cyan shrink-0" />
                      <span className="font-bold text-sm">{ong.name}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        isCritical
                          ? "bg-brand-amber text-brand-navy"
                          : "bg-brand-mint text-brand-navy"
                      }`}
                    >
                      {ong.currentOccupancy}/{ong.capacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritical ? "bg-brand-amber" : "bg-brand-mint"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/75 mt-2">
                    <span>Ciudad: {ong.city}</span>
                    <span>
                      {isCritical ? "Prioridad de descongestionamiento" : "Capacidad estable"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
