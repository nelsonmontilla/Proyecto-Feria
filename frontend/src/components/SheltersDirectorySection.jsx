import React from "react";
import { useSelector } from "react-redux";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ShieldAlert
} from "lucide-react";

export default function SheltersDirectorySection() {
  const ongs = useSelector((state) => state.ongs.items);

  return (
    <section id="directorio-ongs" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-ice text-brand-teal text-xs font-extrabold uppercase tracking-wider border border-brand-cyan/30">
              <Building2 className="w-3.5 h-3.5" />
              Red Nacional de Refugios
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-navy font-display">
              ONGs y Albergues Aliados
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Todas las organizaciones listadas son supervisadas desde el Panel Administrador para garantizar el bienestar animal y la transparencia del proceso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ongs.map((ong) => {
            const occupancyRate =
              ong.capacity > 0
                ? Math.min(100, Math.round((ong.currentOccupancy / ong.capacity) * 100))
                : 0;

            return (
              <article
                key={ong.id}
                className="bg-brand-ice/50 rounded-3xl p-6 border border-brand-cyan/25 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2.5 rounded-2xl bg-brand-navy text-white">
                      <Building2 className="w-5 h-5" />
                    </div>
                    {ong.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verificada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {ong.status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-brand-navy font-display leading-snug">
                    {ong.name}
                  </h3>
                  <p className="text-xs font-bold text-brand-slate mt-0.5">
                    RIF/RUC: {ong.ruc}
                  </p>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {ong.description}
                  </p>

                  {/* Occupancy bar */}
                  <div className="mt-4 p-3 rounded-2xl bg-white border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-brand-navy flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-brand-amber" />
                        Ocupación
                      </span>
                      <span
                        className={
                          occupancyRate >= 85 ? "text-red-600" : "text-brand-teal"
                        }
                      >
                        {ong.currentOccupancy}/{ong.capacity} ({occupancyRate}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancyRate >= 85 ? "bg-brand-amber" : "bg-brand-teal"
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-brand-cyan/20 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                    <span className="truncate">
                      {ong.city} — {ong.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                    <span>{ong.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">{ong.email}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
