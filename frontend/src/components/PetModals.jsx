import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  CheckCircle2,
  MapPin,
  Building2,
  HeartHandshake,
  PawPrint
} from "lucide-react";
import {
  closeAdoptionModal,
  closeDetailModal,
  openAdoptionModal
} from "../store/slices/uiSlice";
import { createAdoption } from "../store/slices/adoptionsSlice";
import { fetchPets } from "../store/slices/petsSlice";
import { useFormValidation } from "../hooks/useFormValidation";
import { useNotificationToast } from "../hooks/useNotificationToast";

const INITIAL_ADOPTION_FORM = {
  applicantName: "",
  applicantEmail: "",
  applicantPhone: "",
  applicantCity: "Caracas",
  housingType: "Apartamento con mallas de seguridad",
  hasOtherPets: false,
  motivation: ""
};

function validateAdoptionForm(values) {
  const errors = {};
  if (!values.applicantName.trim()) {
    errors.applicantName = "El nombre completo es obligatorio";
  }
  if (!values.applicantEmail.trim() || !values.applicantEmail.includes("@")) {
    errors.applicantEmail = "Ingresa un correo electrónico válido";
  }
  if (!values.applicantPhone.trim()) {
    errors.applicantPhone = "El teléfono de contacto es obligatorio";
  }
  if (!values.motivation.trim() || values.motivation.trim().length < 10) {
    errors.motivation = "Cuéntanos brevemente por qué deseas adoptarlo (mín. 10 caracteres)";
  }
  return errors;
}

export default function PetModals() {
  const dispatch = useDispatch();
  const detailPet = useSelector((state) => state.ui.detailModalPet);
  const adoptionPet = useSelector((state) => state.ui.adoptionModalPet);
  const { notify } = useNotificationToast();

  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    resetForm,
    validateAll
  } = useFormValidation(INITIAL_ADOPTION_FORM, validateAdoptionForm);

  const handleSubmitAdoption = async (e) => {
    e.preventDefault();
    if (!validateAll() || !adoptionPet) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createAdoption({
          ...values,
          petId: adoptionPet.id,
          petName: adoptionPet.name,
          petSpecies: adoptionPet.species,
          ongId: adoptionPet.ongId,
          ongName: adoptionPet.ongName
        })
      ).unwrap();

      dispatch(fetchPets());
      notify({
        title: "¡Solicitud de Adopción Enviada!",
        message: `La ONG ${adoptionPet.ongName} ha recibido tu postulación por ${adoptionPet.name}.`,
        type: "success"
      });
      resetForm();
      dispatch(closeAdoptionModal());
    } catch (err) {
      notify({
        title: "Error al enviar solicitud",
        message: err || "Revisa los campos e intenta nuevamente.",
        type: "error"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* MODAL 1: FICHA DETALLADA DE MASCOTA */}
      {detailPet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-pet-title"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-brand-cyan/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-64 sm:h-72 bg-slate-100">
              <img
                src={detailPet.image}
                alt={detailPet.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => dispatch(closeDetailModal())}
                aria-label="Cerrar ficha"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-brand-navy flex items-center justify-center shadow hover:bg-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-navy text-white text-xs font-extrabold">
                  {detailPet.species} • {detailPet.breed}
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-amber text-white text-xs font-extrabold">
                  Urgencia {detailPet.urgencyLevel}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3
                    id="detail-pet-title"
                    className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display"
                  >
                    {detailPet.name}
                  </h3>
                  <p className="text-sm text-brand-slate font-semibold">
                    {detailPet.gender} • {detailPet.age} {detailPet.ageUnit} • Tamaño{" "}
                    {detailPet.size} ({detailPet.weight || "Peso estándar"})
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-brand-ice text-brand-teal font-extrabold text-xs">
                  Estado: {detailPet.status}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {detailPet.description}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-brand-ice text-center">
                  <CheckCircle2
                    className={`w-5 h-5 mx-auto mb-1 ${
                      detailPet.vaccinated ? "text-emerald-600" : "text-slate-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-brand-navy">
                    {detailPet.vaccinated ? "Vacunado al día" : "Vacuna pendiente"}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-brand-ice text-center">
                  <CheckCircle2
                    className={`w-5 h-5 mx-auto mb-1 ${
                      detailPet.sterilized ? "text-emerald-600" : "text-slate-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-brand-navy">
                    {detailPet.sterilized ? "Esterilizado" : "Sin esterilizar"}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-brand-ice text-center">
                  <CheckCircle2
                    className={`w-5 h-5 mx-auto mb-1 ${
                      detailPet.microchipped ? "text-emerald-600" : "text-slate-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-brand-navy">
                    {detailPet.microchipped ? "Con Microchip" : "Sin Microchip"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-brand-navy">
                  <Building2 className="w-4 h-4 text-brand-teal" />
                  <span>ONG Responsable: {detailPet.ongName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-amber" />
                  <span>Ubicación: {detailPet.city}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => dispatch(closeDetailModal())}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  Cerrar
                </button>
                {detailPet.status === "Disponible" && (
                  <button
                    type="button"
                    onClick={() => {
                      const petToAdopt = detailPet;
                      dispatch(closeDetailModal());
                      dispatch(openAdoptionModal(petToAdopt));
                    }}
                    className="px-6 py-2.5 rounded-xl bg-brand-amber hover:bg-brand-amberDark text-white font-extrabold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <PawPrint className="w-4 h-4" />
                    <span>Postular para Adoptar a {detailPet.name}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FORMULARIO DE SOLICITUD DE ADOPCIÓN */}
      {adoptionPet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="adopt-modal-title"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-brand-cyan/30 my-8">
            <div className="bg-logo-gradient p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shrink-0">
                  <img
                    src={adoptionPet.image}
                    alt={adoptionPet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-brand-cream">
                    Solicitud Formal de Adopción
                  </span>
                  <h3 id="adopt-modal-title" className="text-xl font-extrabold font-display">
                    Adoptar a {adoptionPet.name} ({adoptionPet.species})
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => dispatch(closeAdoptionModal())}
                aria-label="Cerrar formulario de adopción"
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdoption} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="applicantName"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Nombre y Apellido *
                  </label>
                  <input
                    id="applicantName"
                    name="applicantName"
                    type="text"
                    value={values.applicantName}
                    onChange={handleChange}
                    placeholder="Ej. Andrea Rodríguez"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  {errors.applicantName && (
                    <p className="text-xs text-red-600 mt-1">{errors.applicantName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="applicantEmail"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Correo Electrónico *
                  </label>
                  <input
                    id="applicantEmail"
                    name="applicantEmail"
                    type="email"
                    value={values.applicantEmail}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  {errors.applicantEmail && (
                    <p className="text-xs text-red-600 mt-1">{errors.applicantEmail}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="applicantPhone"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    id="applicantPhone"
                    name="applicantPhone"
                    type="tel"
                    value={values.applicantPhone}
                    onChange={handleChange}
                    placeholder="+58 412-000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  {errors.applicantPhone && (
                    <p className="text-xs text-red-600 mt-1">{errors.applicantPhone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="applicantCity"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Ciudad de Residencia
                  </label>
                  <input
                    id="applicantCity"
                    name="applicantCity"
                    type="text"
                    value={values.applicantCity}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="housingType"
                  className="block text-xs font-bold text-brand-navy mb-1"
                >
                  Tipo de Vivienda y Condiciones de Seguridad
                </label>
                <select
                  id="housingType"
                  name="housingType"
                  value={values.housingType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
                >
                  <option value="Apartamento con mallas de seguridad">
                    Apartamento con mallas de seguridad
                  </option>
                  <option value="Casa cerrada con patio o jardín">
                    Casa cerrada con patio o jardín
                  </option>
                  <option value="Apartamento amplio sin balcones abiertos">
                    Apartamento amplio sin balcones abiertos
                  </option>
                  <option value="Quinta familiar cercada">Quinta familiar cercada</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="hasOtherPets"
                  name="hasOtherPets"
                  type="checkbox"
                  checked={values.hasOtherPets}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-brand-teal focus:ring-brand-cyan cursor-pointer"
                />
                <label
                  htmlFor="hasOtherPets"
                  className="text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Actualmente convivo con otras mascotas vacunadas en casa
                </label>
              </div>

              <div>
                <label
                  htmlFor="motivation"
                  className="block text-xs font-bold text-brand-navy mb-1"
                >
                  Motivación y compromiso de adopción *
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  rows={3}
                  value={values.motivation}
                  onChange={handleChange}
                  placeholder="Cuéntale a la ONG sobre tu rutina diaria, espacio disponible y compromiso..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
                {errors.motivation && (
                  <p className="text-xs text-red-600 mt-1">{errors.motivation}</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(closeAdoptionModal())}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-amber hover:bg-brand-amberDark disabled:opacity-50 text-white font-extrabold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>
                    {isSubmitting ? "Enviando..." : "Enviar Solicitud a la ONG"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
