import React from "react";
import { Search, FileCheck2, Home, Heart, Sparkles } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Explora y Filtra",
    description:
      "Utiliza nuestro catálogo interactivo para filtrar por especie (perro o gato), tamaño, nivel de urgencia, ciudad u ONG responsable.",
    icon: Search,
    color: "bg-brand-navy text-white"
  },
  {
    step: "02",
    title: "Postula en Línea",
    description:
      "Completa el formulario unificado de solicitud de adopción indicando tu tipo de vivienda, experiencia y motivación familiar.",
    icon: FileCheck2,
    color: "bg-brand-teal text-white"
  },
  {
    step: "03",
    title: "Entrevista con la ONG",
    description:
      "La fundación correspondiente valida tu solicitud, coordina una visita o videollamada de seguridad y resuelve todas tus dudas.",
    icon: Home,
    color: "bg-brand-cyan text-white"
  },
  {
    step: "04",
    title: "Adopción y Seguimiento",
    description:
      "Firmas el acta de adopción responsable, recibes a tu nuevo compañero y liberamos un cupo vital en el refugio para otro rescatado.",
    icon: Heart,
    color: "bg-brand-amber text-white"
  }
];

export default function AdoptionStepsSection() {
  return (
    <section
      id="proceso-adopcion"
      className="py-16 bg-gradient-to-b from-brand-ice to-white border-b border-brand-cyan/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-navy/10 text-brand-navy text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
            Guía de Adopción Estandarizada
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-brand-navy font-display">
            Un proceso claro, transparente y sin trámites dispersos
          </h2>
          <p className="mt-2 text-slate-600 text-base">
            Simplificamos el camino entre los refugios y los adoptantes en cuatro etapas verificadas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-3xl p-6 shadow-soft border border-brand-cyan/20 hover:border-brand-cyan transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${item.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-brand-cyan/30 font-display">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-brand-navy font-display mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-teal">
                  <span>Etapa Verificada</span>
                  <span>Animal Advisor</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
