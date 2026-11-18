import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  PhoneCall,
  Mail,
  MapPin,
  Send,
  HelpCircle,
  HeartHandshake
} from "lucide-react";
import { createContact } from "../store/slices/contactsSlice";
import { useFormValidation } from "../hooks/useFormValidation";
import { useNotificationToast } from "../hooks/useNotificationToast";

const INITIAL_CONTACT = {
  name: "",
  email: "",
  phone: "",
  category: "Adopción",
  ongId: "general",
  subject: "",
  message: ""
};

function validateContact(values) {
  const errors = {};
  if (!values.name || !values.name.trim()) {
    errors.name = "Ingresa tu nombre completo";
  }
  if (!values.email || !values.email.includes("@")) {
    errors.email = "Ingresa un correo electrónico válido";
  }
  if (!values.message || values.message.trim().length < 10) {
    errors.message = "Escribe tu consulta con al menos 10 caracteres";
  }
  return errors;
}

const FAQS = [
  {
    q: "¿Tiene algún costo adoptar en Animal Advisor?",
    a: "La adopción es un acto solidario y gratuito. Algunas ONGs solicitan únicamente un aporte voluntario o insumo médico para cubrir vacunas o esterilizaciones de nuevos rescatados."
  },
  {
    q: "¿Cómo puede un refugio u ONG registrarse en la plataforma?",
    a: "Las ONGs pueden registrarse desde el Panel Administrador o enviarnos sus datos legales en este formulario seleccionando la categoría 'Alianza ONG'."
  },
  {
    q: "¿Qué requisitos básicos piden las fundaciones para adoptar?",
    a: "Ser mayor de edad, contar con el acuerdo de todos los miembros del hogar, poseer mallas de protección en balcones/ventanas (especialmente para gatos) y aceptar seguimiento post-adopción."
  }
];

export default function ContactSection() {
  const dispatch = useDispatch();
  const ongs = useSelector((state) => state.ongs.items);
  const { notify } = useNotificationToast();

  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    resetForm,
    validateAll
  } = useFormValidation(INITIAL_CONTACT, validateContact);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await dispatch(createContact(values)).unwrap();
      notify({
        title: "Mensaje enviado con éxito",
        message:
          "Un asesor de adopción o representante de la ONG te responderá pronto.",
        type: "success"
      });
      resetForm();
    } catch (err) {
      notify({
        title: "Error al enviar consulta",
        message: err || "Intenta nuevamente.",
        type: "error"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contacto"
      className="py-16 bg-gradient-to-b from-white to-brand-ice border-b border-brand-cyan/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Info + FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-amber/15 text-brand-amberDark text-xs font-extrabold uppercase tracking-wider">
                <PhoneCall className="w-3.5 h-3.5" />
                Sección de Contacto para Adoptantes y ONGs
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-brand-navy font-display">
                ¿Tienes dudas sobre una mascota o proceso de adopción?
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                Nuestro equipo de orientación y las ONGs aliadas están listos para asesorarte antes, durante y después de la adopción.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-brand-cyan/25 shadow-sm">
                <Mail className="w-5 h-5 text-brand-teal mb-2" />
                <p className="text-xs font-bold text-brand-slate uppercase">
                  Correo Central
                </p>
                <p className="text-sm font-extrabold text-brand-navy mt-0.5">
                  asesoria@animaladvisor.org
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-brand-cyan/25 shadow-sm">
                <MapPin className="w-5 h-5 text-brand-amber mb-2" />
                <p className="text-xs font-bold text-brand-slate uppercase">
                  Cobertura Nacional
                </p>
                <p className="text-sm font-extrabold text-brand-navy mt-0.5">
                  Red de {ongs.length} Albergues Verificados
                </p>
              </div>
            </div>

            {/* FAQ List */}
            <div className="bg-white rounded-3xl p-6 border border-brand-cyan/25 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-brand-navy font-extrabold font-display">
                <HelpCircle className="w-5 h-5 text-brand-amber" />
                <h3>Preguntas Frecuentes del Adoptante</h3>
              </div>
              <div className="space-y-3 divide-y divide-slate-100">
                {FAQS.map((item, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-3" : ""}>
                    <p className="text-xs sm:text-sm font-extrabold text-brand-navy">
                      {item.q}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-brand-cyan/30 shadow-card">
            <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-logo-gradient text-white flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-navy font-display">
                  Formulario de Contacto y Asesoría Directa
                </h3>
                <p className="text-xs text-slate-500">
                  Tu mensaje quedará registrado en el servidor y visible para las ONGs y Administradores.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="cnt-name"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Tu Nombre Completo *
                  </label>
                  <input
                    id="cnt-name"
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Ej. Gabriel Mendoza"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cnt-email"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Correo Electrónico *
                  </label>
                  <input
                    id="cnt-email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="tu@correo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="cnt-phone"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Teléfono / WhatsApp
                  </label>
                  <input
                    id="cnt-phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="+58 412-000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cnt-category"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Tipo de Consulta
                  </label>
                  <select
                    id="cnt-category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                  >
                    <option value="Adopción">Consulta de Adopción</option>
                    <option value="Hogar Temporal">Ser Hogar Temporal</option>
                    <option value="Voluntariado">Voluntariado / Donación</option>
                    <option value="Alianza ONG">Inscribir una ONG</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cnt-ongId"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Dirigido a ONG
                  </label>
                  <select
                    id="cnt-ongId"
                    name="ongId"
                    value={values.ongId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                  >
                    <option value="general">Asesoría General</option>
                    {ongs.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cnt-subject"
                  className="block text-xs font-bold text-brand-navy mb-1"
                >
                  Asunto
                </label>
                <input
                  id="cnt-subject"
                  name="subject"
                  type="text"
                  value={values.subject}
                  onChange={handleChange}
                  placeholder="Ej. Información sobre requisitos para adoptar a Max"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="cnt-message"
                  className="block text-xs font-bold text-brand-navy mb-1"
                >
                  Mensaje Detallado *
                </label>
                <textarea
                  id="cnt-message"
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
                {errors.message && (
                  <p className="text-xs text-red-600 mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-amber hover:bg-brand-amberDark text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting ? "Enviando Mensaje..." : "Enviar Consulta de Contacto"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
