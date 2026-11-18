import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ShieldCheck,
  Building2,
  ClipboardList,
  MessageSquare,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Save,
  Database,
  Cloud
} from "lucide-react";
import {
  createOng,
  updateOng,
  deleteOng
} from "../store/slices/ongsSlice";
import {
  createAdoption,
  updateAdoption,
  deleteAdoption
} from "../store/slices/adoptionsSlice";
import {
  updateContact,
  deleteContact
} from "../store/slices/contactsSlice";
import { connectMongoAtlasUri } from "../store/slices/authSlice";
import { fetchPets } from "../store/slices/petsSlice";
import { useFormValidation } from "../hooks/useFormValidation";
import { useNotificationToast } from "../hooks/useNotificationToast";

const INITIAL_ONG_FORM = {
  name: "",
  ruc: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  capacity: 40,
  currentOccupancy: 25,
  status: "Activa",
  verified: true,
  description: ""
};

function validateOngForm(values) {
  const errors = {};
  if (!values.name || !values.name.trim()) {
    errors.name = "El nombre de la ONG es obligatorio";
  }
  if (!values.city || !values.city.trim()) {
    errors.city = "La ciudad es obligatoria";
  }
  if (!values.email || !values.email.includes("@")) {
    errors.email = "Ingresa un correo electrónico válido";
  }
  return errors;
}

const INITIAL_ADOPTION_ADMIN_FORM = {
  petId: "pet-1",
  applicantName: "",
  applicantEmail: "",
  applicantPhone: "",
  applicantCity: "Caracas",
  housingType: "Apartamento con mallas de seguridad",
  status: "Pendiente",
  notes: ""
};

function validateAdoptionAdminForm(values) {
  const errors = {};
  if (!values.petId) errors.petId = "Selecciona una mascota";
  if (!values.applicantName || !values.applicantName.trim()) {
    errors.applicantName = "El nombre del adoptante es obligatorio";
  }
  if (!values.applicantEmail || !values.applicantEmail.includes("@")) {
    errors.applicantEmail = "Correo válido obligatorio";
  }
  return errors;
}

export default function AdminPanelSection() {
  const dispatch = useDispatch();
  const ongs = useSelector((state) => state.ongs.items);
  const adoptions = useSelector((state) => state.adoptions.items);
  const pets = useSelector((state) => state.pets.items);
  const contacts = useSelector((state) => state.contacts.items);
  const dbStatus = useSelector((state) => state.auth.dbStatus);
  const { notify } = useNotificationToast();

  const [activeAdminTab, setActiveAdminTab] = useState("ongs"); // 'ongs' | 'adoptions' | 'contacts' | 'mongo'
  const [editingOngId, setEditingOngId] = useState(null);
  const [editingAdoptionId, setEditingAdoptionId] = useState(null);
  const [mongoUriInput, setMongoUriInput] = useState("");
  const [connectingMongo, setConnectingMongo] = useState(false);

  const ongForm = useFormValidation(INITIAL_ONG_FORM, validateOngForm);
  const adoptionForm = useFormValidation(
    INITIAL_ADOPTION_ADMIN_FORM,
    validateAdoptionAdminForm
  );

  // =====================================
  // HANDLER: CONEXIÓN A MONGODB ATLAS
  // =====================================
  const handleConnectMongo = async (e) => {
    e.preventDefault();
    if (!mongoUriInput.trim()) return;
    setConnectingMongo(true);
    try {
      const res = await dispatch(connectMongoAtlasUri(mongoUriInput)).unwrap();
      notify({
        title: "MongoDB Atlas Conectado",
        message: res.message,
        type: "success"
      });
      setMongoUriInput("");
    } catch (err) {
      notify({
        title: "Aviso de Conexión MongoDB Atlas",
        message: err,
        type: "error"
      });
    } finally {
      setConnectingMongo(false);
    }
  };

  // =====================================
  // HANDLERS: SUPERVISIÓN DE ONGS (CRUD)
  // =====================================
  const handleEditOng = (ong) => {
    setEditingOngId(ong.id);
    ongForm.setFormValues({
      name: ong.name || "",
      ruc: ong.ruc || "",
      city: ong.city || "",
      address: ong.address || "",
      phone: ong.phone || "",
      email: ong.email || "",
      capacity: ong.capacity ?? 40,
      currentOccupancy: ong.currentOccupancy ?? 20,
      status: ong.status || "Activa",
      verified: Boolean(ong.verified),
      description: ong.description || ""
    });
  };

  const handleSubmitOng = async (e) => {
    e.preventDefault();
    if (!ongForm.validateAll()) return;

    ongForm.setIsSubmitting(true);
    try {
      if (editingOngId) {
        await dispatch(
          updateOng({ id: editingOngId, data: ongForm.values })
        ).unwrap();
        notify({
          title: "ONG actualizada",
          message: `Se actualizaron los datos de ${ongForm.values.name}.`,
          type: "success"
        });
      } else {
        await dispatch(createOng(ongForm.values)).unwrap();
        notify({
          title: "Nueva ONG registrada",
          message: `${ongForm.values.name} fue incorporada a la red Animal Advisor.`,
          type: "success"
        });
      }
      setEditingOngId(null);
      ongForm.resetForm();
    } catch (err) {
      notify({
        title: "Error en gestión de ONG",
        message: err || "No se pudo guardar la ONG.",
        type: "error"
      });
      ongForm.setIsSubmitting(false);
    }
  };

  const handleToggleVerifyOng = async (ong) => {
    try {
      await dispatch(
        updateOng({
          id: ong.id,
          data: {
            ...ong,
            verified: !ong.verified,
            status: !ong.verified ? "Activa" : ong.status
          }
        })
      ).unwrap();
      notify({
        title: !ong.verified ? "ONG Verificada" : "Verificación retirada",
        message: `${ong.name} cambió su estado de verificación.`,
        type: "success"
      });
    } catch (err) {
      notify({ title: "Error", message: err, type: "error" });
    }
  };

  const handleDeleteOng = async (ong) => {
    try {
      await dispatch(deleteOng(ong.id)).unwrap();
      if (editingOngId === ong.id) {
        setEditingOngId(null);
        ongForm.resetForm();
      }
      notify({
        title: "ONG eliminada",
        message: `${ong.name} fue eliminada del directorio nacional.`,
        type: "warning"
      });
    } catch (err) {
      notify({ title: "Error al eliminar ONG", message: err, type: "error" });
    }
  };

  // =========================================================
  // HANDLERS: CONTROL DEL HISTORIAL DE ADOPCIONES (CRUD)
  // =========================================================
  const handleEditAdoption = (adp) => {
    setEditingAdoptionId(adp.id);
    adoptionForm.setFormValues({
      petId: adp.petId || (pets[0]?.id ?? "pet-1"),
      applicantName: adp.applicantName || "",
      applicantEmail: adp.applicantEmail || "",
      applicantPhone: adp.applicantPhone || "",
      applicantCity: adp.applicantCity || "Caracas",
      housingType: adp.housingType || "Apartamento",
      status: adp.status || "Pendiente",
      notes: adp.notes || ""
    });
  };

  const handleSubmitAdoption = async (e) => {
    e.preventDefault();
    if (!adoptionForm.validateAll()) return;

    adoptionForm.setIsSubmitting(true);
    try {
      if (editingAdoptionId) {
        await dispatch(
          updateAdoption({ id: editingAdoptionId, data: adoptionForm.values })
        ).unwrap();
        notify({
          title: "Historial de adopción actualizado",
          message: `Se actualizó el expediente de ${adoptionForm.values.applicantName}.`,
          type: "success"
        });
      } else {
        await dispatch(createAdoption(adoptionForm.values)).unwrap();
        notify({
          title: "Registro de adopción creado",
          message: `Expediente añadido al historial de adopciones.`,
          type: "success"
        });
      }
      dispatch(fetchPets());
      setEditingAdoptionId(null);
      adoptionForm.resetForm();
    } catch (err) {
      notify({
        title: "Error en historial de adopción",
        message: err || "No se pudo guardar el registro.",
        type: "error"
      });
      adoptionForm.setIsSubmitting(false);
    }
  };

  const handleQuickAdoptionStatus = async (adp, newStatus) => {
    try {
      await dispatch(
        updateAdoption({ id: adp.id, data: { ...adp, status: newStatus } })
      ).unwrap();
      dispatch(fetchPets());
      notify({
        title: `Adopción ${newStatus}`,
        message: `El registro de ${adp.petName} (${adp.applicantName}) cambió a ${newStatus}.`,
        type: "success"
      });
    } catch (err) {
      notify({ title: "Error", message: err, type: "error" });
    }
  };

  const handleDeleteAdoption = async (adp) => {
    try {
      await dispatch(deleteAdoption(adp.id)).unwrap();
      if (editingAdoptionId === adp.id) {
        setEditingAdoptionId(null);
        adoptionForm.resetForm();
      }
      notify({
        title: "Registro eliminado del historial",
        message: `El expediente de adopción de ${adp.petName} (${adp.applicantName}) fue eliminado.`,
        type: "warning"
      });
    } catch (err) {
      notify({ title: "Error", message: err, type: "error" });
    }
  };

  // =========================================================
  // HANDLERS: GESTIÓN DE CONSULTAS DE CONTACTO (CRUD)
  // =========================================================
  const handleToggleContactStatus = async (cnt) => {
    const nextStatus = cnt.status === "Respondido" ? "Pendiente" : "Respondido";
    try {
      await dispatch(
        updateContact({ id: cnt.id, data: { ...cnt, status: nextStatus } })
      ).unwrap();
      notify({
        title: "Estado de consulta actualizado",
        message: `Consulta de ${cnt.name} marcada como ${nextStatus}.`,
        type: "success"
      });
    } catch (err) {
      notify({ title: "Error", message: err, type: "error" });
    }
  };

  const handleDeleteContact = async (cnt) => {
    try {
      await dispatch(deleteContact(cnt.id)).unwrap();
      notify({
        title: "Consulta eliminada",
        message: `Se eliminó el mensaje de ${cnt.name}.`,
        type: "warning"
      });
    } catch (err) {
      notify({ title: "Error", message: err, type: "error" });
    }
  };

  return (
    <section
      id="panel-admin"
      className="py-14 bg-gradient-to-b from-brand-ice/80 to-white border-b border-brand-cyan/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Sub-navigation Tabs */}
        <div className="space-y-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-navy text-white text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-mint" />
              Panel Protegido del Administrador (Rol Admin)
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-brand-navy font-display">
              Supervisión de ONGs y Control del Historial de Adopciones
            </h2>
            <p className="mt-1.5 text-slate-600 text-base max-w-3xl">
              Panel exclusivo separado por login para auditar refugios, controlar niveles de saturación, administrar registros del historial y conectar con MongoDB Atlas.
            </p>
          </div>

          {/* Sub-navigation Tabs on its own clean row so nothing collides */}
          <div className="flex flex-wrap items-center gap-2.5 bg-white p-2 rounded-2xl border border-brand-cyan/30 shadow-sm w-fit">
            <button
              type="button"
              onClick={() => setActiveAdminTab("ongs")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeAdminTab === "ongs"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-brand-navy hover:bg-brand-ice"
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Supervisar ONGs ({ongs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab("adoptions")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeAdminTab === "adoptions"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-brand-navy hover:bg-brand-ice"
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>Historial de Adopciones ({adoptions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab("contacts")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeAdminTab === "contacts"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-brand-navy hover:bg-brand-ice"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Consultas Recibidas ({contacts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab("mongo")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeAdminTab === "mongo"
                  ? "bg-brand-teal text-white shadow-sm"
                  : "text-brand-teal hover:bg-brand-ice"
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>MongoDB Atlas</span>
            </button>
          </div>
        </div>

        {/* =============================================================== */}
        {/* TAB 1: SUPERVISIÓN Y CRUD DE ONGs (FORMULARIO + TABLA)          */}
        {/* =============================================================== */}
        {activeAdminTab === "ongs" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-4 bg-white rounded-3xl p-6 border border-brand-cyan/30 shadow-soft">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-brand-navy font-display">
                    {editingOngId
                      ? "Editar / Auditar ONG"
                      : "Registrar Nueva ONG (Entidad #2)"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control de capacidad, verificación y estatus
                  </p>
                </div>
                {editingOngId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOngId(null);
                      ongForm.resetForm();
                    }}
                    className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1 whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Cancelar</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitOng} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="ong-name"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Nombre Oficial de la ONG *
                  </label>
                  <input
                    id="ong-name"
                    name="name"
                    type="text"
                    value={ongForm.values.name}
                    onChange={ongForm.handleChange}
                    placeholder="Ej. Fundación Huellas del Sur"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  {ongForm.errors.name && (
                    <p className="text-xs text-red-600 mt-1">
                      {ongForm.errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="ong-ruc"
                      className="block text-xs font-bold text-brand-navy mb-1"
                    >
                      RIF / Registro Legal
                    </label>
                    <input
                      id="ong-ruc"
                      name="ruc"
                      type="text"
                      value={ongForm.values.ruc}
                      onChange={ongForm.handleChange}
                      placeholder="J-40123456-7"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ong-city"
                      className="block text-xs font-bold text-brand-navy mb-1"
                    >
                      Ciudad Sede *
                    </label>
                    <input
                      id="ong-city"
                      name="city"
                      type="text"
                      value={ongForm.values.city}
                      onChange={ongForm.handleChange}
                      placeholder="Caracas, Valencia..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                    {ongForm.errors.city && (
                      <p className="text-xs text-red-600 mt-1">
                        {ongForm.errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="ong-email"
                      className="block text-xs font-bold text-brand-navy mb-1"
                    >
                      Correo Institucional *
                    </label>
                    <input
                      id="ong-email"
                      name="email"
                      type="email"
                      value={ongForm.values.email}
                      onChange={ongForm.handleChange}
                      placeholder="contacto@fundacion.org"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                    {ongForm.errors.email && (
                      <p className="text-xs text-red-600 mt-1">
                        {ongForm.errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="ong-phone"
                      className="block text-xs font-bold text-brand-navy mb-1"
                    >
                      Teléfono
                    </label>
                    <input
                      id="ong-phone"
                      name="phone"
                      type="text"
                      value={ongForm.values.phone}
                      onChange={ongForm.handleChange}
                      placeholder="+58 414-000-0000"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ong-address"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Dirección Física
                  </label>
                  <input
                    id="ong-address"
                    name="address"
                    type="text"
                    value={ongForm.values.address}
                    onChange={ongForm.handleChange}
                    placeholder="Av. Principal, Edificio..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="ong-capacity"
                      className="block text-xs font-bold text-brand-navy mb-1 truncate"
                    >
                      Capacidad
                    </label>
                    <input
                      id="ong-capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={ongForm.values.capacity}
                      onChange={ongForm.handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ong-occupancy"
                      className="block text-xs font-bold text-brand-navy mb-1 truncate"
                    >
                      Ocupación
                    </label>
                    <input
                      id="ong-occupancy"
                      name="currentOccupancy"
                      type="number"
                      min="0"
                      value={ongForm.values.currentOccupancy}
                      onChange={ongForm.handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ong-status"
                      className="block text-xs font-bold text-brand-navy mb-1 truncate"
                    >
                      Estatus
                    </label>
                    <select
                      id="ong-status"
                      name="status"
                      value={ongForm.values.status}
                      onChange={ongForm.handleChange}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                    >
                      <option value="Activa">Activa</option>
                      <option value="En Revisión">En Revisión</option>
                      <option value="Suspendida">Suspendida</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-brand-navy pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={ongForm.values.verified}
                    onChange={ongForm.handleChange}
                    className="w-4 h-4 rounded text-brand-teal cursor-pointer"
                  />
                  <span>ONG Verificada y Auditada por Animal Advisor</span>
                </label>

                <div>
                  <label
                    htmlFor="ong-description"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Descripción y Alcance Operativo
                  </label>
                  <textarea
                    id="ong-description"
                    name="description"
                    rows={2}
                    value={ongForm.values.description}
                    onChange={ongForm.handleChange}
                    placeholder="Misión y labor del refugio..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={ongForm.isSubmitting}
                  className="w-full py-3 px-5 rounded-2xl bg-brand-navy hover:bg-brand-teal text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {editingOngId ? (
                    <>
                      <Save className="w-4 h-4 text-brand-amber" />
                      <span>Actualizar ONG Supervisada</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 text-brand-mint" />
                      <span>Registrar Nueva ONG en Sistema</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Tabla de Supervisión de ONGs */}
            <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/70">
                <h3 className="text-lg font-extrabold text-brand-navy font-display">
                  Tabla de Supervisión de ONGs ({ongs.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Aprueba, audita la saturación o elimina organizaciones registradas.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="bg-brand-ice text-brand-navy text-xs font-extrabold uppercase tracking-wider border-b border-brand-cyan/20">
                      <th className="py-3.5 px-4 whitespace-nowrap">Organización</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Ciudad / Contacto</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Capacidad</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Auditoría</th>
                      <th className="py-3.5 px-4 text-right whitespace-nowrap">Acciones Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {ongs.map((ong) => {
                      const pct =
                        ong.capacity > 0
                          ? Math.round((ong.currentOccupancy / ong.capacity) * 100)
                          : 0;
                      return (
                        <tr key={ong.id} className="hover:bg-brand-ice/30">
                          <td className="py-3.5 px-4">
                            <p className="font-extrabold text-brand-navy">
                              {ong.name}
                            </p>
                            <p className="text-xs text-slate-500 whitespace-nowrap">
                              RIF: {ong.ruc}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-700 text-xs">
                              {ong.city}
                            </p>
                            <p className="text-xs text-slate-500">{ong.email}</p>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
                                pct >= 85
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {ong.currentOccupancy}/{ong.capacity} ({pct}%)
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleVerifyOng(ong)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                                ong.verified
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {ong.verified ? "Verificada" : "Verificar"}
                              </span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditOng(ong)}
                                title="Editar ONG"
                                className="p-2 rounded-xl bg-brand-ice hover:bg-brand-cyan/25 text-brand-navy cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOng(ong)}
                                title="Eliminar ONG"
                                aria-label={`Eliminar ONG ${ong.name}`}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 2: HISTORIAL DE ADOPCIONES (FORMULARIO + TABLA CRUD)        */}
        {/* =============================================================== */}
        {activeAdminTab === "adoptions" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-4 bg-white rounded-3xl p-6 border border-brand-cyan/30 shadow-soft">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-brand-navy font-display">
                    {editingAdoptionId
                      ? "Modificar Registro de Adopción"
                      : "Nuevo Registro de Adopción (Entidad #3)"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Controla solicitudes y actas del historial de adopciones
                  </p>
                </div>
                {editingAdoptionId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAdoptionId(null);
                      adoptionForm.resetForm();
                    }}
                    className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1 whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Cancelar</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitAdoption} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="adp-petId"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Mascota Asociada *
                  </label>
                  <select
                    id="adp-petId"
                    name="petId"
                    value={adoptionForm.values.petId}
                    onChange={adoptionForm.handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species} - {p.ongName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="adp-applicantName"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Nombre del Adoptante *
                  </label>
                  <input
                    id="adp-applicantName"
                    name="applicantName"
                    type="text"
                    value={adoptionForm.values.applicantName}
                    onChange={adoptionForm.handleChange}
                    placeholder="Nombre y Apellido"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                  {adoptionForm.errors.applicantName && (
                    <p className="text-xs text-red-600 mt-1">
                      {adoptionForm.errors.applicantName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="adp-applicantEmail"
                      className="block text-xs font-bold text-brand-navy mb-1"
                    >
                      Correo del Adoptante *
                    </label>
                    <input
                      id="adp-applicantEmail"
                      name="applicantEmail"
                      type="email"
                      value={adoptionForm.values.applicantEmail}
                      onChange={adoptionForm.handleChange}
                      placeholder="adoptante@correo.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                    {adoptionForm.errors.applicantEmail && (
                      <p className="text-xs text-red-600 mt-1">
                        {adoptionForm.errors.applicantEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="adp-applicantPhone"
                      className="block text-xs font-bold text-brand-navy mb-1"
                    >
                      Teléfono
                    </label>
                    <input
                      id="adp-applicantPhone"
                      name="applicantPhone"
                      type="text"
                      value={adoptionForm.values.applicantPhone}
                      onChange={adoptionForm.handleChange}
                      placeholder="+58 412-000-0000"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="adp-city"
                      className="block text-xs font-bold text-brand-navy mb-1"
                    >
                      Ciudad
                    </label>
                    <input
                      id="adp-city"
                      name="applicantCity"
                      type="text"
                      value={adoptionForm.values.applicantCity}
                      onChange={adoptionForm.handleChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="adp-status"
                      className="block text-xs font-bold text-brand-navy mb-1"
                    >
                      Estado del Proceso
                    </label>
                    <select
                      id="adp-status"
                      name="status"
                      value={adoptionForm.values.status}
                      onChange={adoptionForm.handleChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobada">Aprobada</option>
                      <option value="Completada">Completada</option>
                      <option value="Rechazada">Rechazada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="adp-notes"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Observaciones de Auditoría / Seguimiento
                  </label>
                  <textarea
                    id="adp-notes"
                    name="notes"
                    rows={2}
                    value={adoptionForm.values.notes}
                    onChange={adoptionForm.handleChange}
                    placeholder="Notas de entrevista, visita domiciliaria o seguimiento..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={adoptionForm.isSubmitting}
                  className="w-full py-3 px-5 rounded-2xl bg-brand-amber hover:bg-brand-amberDark text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {editingAdoptionId ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios en Historial</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Añadir Registro al Historial</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/70">
                <h3 className="text-lg font-extrabold text-brand-navy font-display">
                  Tabla de Control del Historial de Adopciones ({adoptions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Controla el estatus de cada solicitud o elimina registros del historial.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="bg-brand-ice text-brand-navy text-xs font-extrabold uppercase tracking-wider border-b border-brand-cyan/20">
                      <th className="py-3.5 px-4 whitespace-nowrap">Mascota & ONG</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Adoptante</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Fecha / Notas</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Estado</th>
                      <th className="py-3.5 px-4 text-right whitespace-nowrap">Control Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {adoptions.map((adp) => (
                      <tr key={adp.id} className="hover:bg-brand-ice/30">
                        <td className="py-3.5 px-4">
                          <p className="font-extrabold text-brand-navy whitespace-nowrap">
                            {adp.petName}{" "}
                            <span className="text-xs font-semibold text-brand-teal">
                              ({adp.petSpecies})
                            </span>
                          </p>
                          <p className="text-xs text-slate-500">{adp.ongName}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800">
                            {adp.applicantName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {adp.applicantEmail} • {adp.applicantCity}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-xs font-bold text-brand-slate whitespace-nowrap">
                            {adp.applicationDate}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {adp.notes}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            aria-label={`Estado de adopción de ${adp.petName}`}
                            value={adp.status}
                            onChange={(e) =>
                              handleQuickAdoptionStatus(adp, e.target.value)
                            }
                            className={`px-3 py-1 rounded-xl text-xs font-extrabold border cursor-pointer ${
                              adp.status === "Completada"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : adp.status === "Aprobada"
                                ? "bg-cyan-50 text-brand-navy border-cyan-200"
                                : adp.status === "Pendiente"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aprobada">Aprobada</option>
                            <option value="Completada">Completada</option>
                            <option value="Rechazada">Rechazada</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEditAdoption(adp)}
                              title="Editar registro"
                              className="p-2 rounded-xl bg-brand-ice hover:bg-brand-cyan/25 text-brand-navy cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAdoption(adp)}
                              title="Eliminar registro del historial"
                              aria-label={`Eliminar registro de ${adp.applicantName}`}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {adoptions.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-sm text-slate-500"
                        >
                          No existen registros en el historial de adopciones.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 3: BANDEJA DE CONSULTAS DE CONTACTO (TABLA CRUD)            */}
        {/* =============================================================== */}
        {activeAdminTab === "contacts" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-lg font-extrabold text-brand-navy font-display">
                Bandeja de Consultas y Mensajes de Contacto ({contacts.length})
              </h3>
              <p className="text-xs text-slate-500">
                Mensajes recibidos desde el formulario de Contacto y Asesoría.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="bg-brand-ice text-brand-navy text-xs font-extrabold uppercase tracking-wider border-b border-brand-cyan/20">
                    <th className="py-3.5 px-4 whitespace-nowrap">Remitente</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Categoría / Asunto</th>
                    <th className="py-3.5 px-4">Mensaje</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Estado</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {contacts.map((cnt) => (
                    <tr key={cnt.id} className="hover:bg-brand-ice/30">
                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-brand-navy">
                          {cnt.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {cnt.email} • {cnt.phone}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-ice text-brand-teal text-xs font-bold whitespace-nowrap">
                          {cnt.category}
                        </span>
                        <p className="font-bold text-slate-700 mt-1">
                          {cnt.subject}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-xs text-slate-600">{cnt.message}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleContactStatus(cnt)}
                          className={`px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer ${
                            cnt.status === "Respondido"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {cnt.status}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(cnt)}
                          aria-label={`Eliminar consulta de ${cnt.name}`}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-sm text-slate-500"
                      >
                        No hay consultas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 4: CONFIGURACIÓN EN LA NUBE CON MONGODB ATLAS               */}
        {/* =============================================================== */}
        {activeAdminTab === "mongo" && (
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-brand-cyan/30 shadow-soft max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-brand-navy text-brand-mint flex items-center justify-center shrink-0">
                <Cloud className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-navy font-display">
                  Conexión con MongoDB Atlas Cloud (Mongoose)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Estado actual:{" "}
                  <strong className="text-brand-teal">{dbStatus?.mode}</strong>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-ice border border-brand-cyan/25 text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
              <p className="font-bold text-brand-navy">
                ¿Cómo alojar la base de datos en MongoDB Atlas?
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Crea un clúster gratuito (`M0`) en{" "}
                  <strong>cloud.mongodb.com</strong> (MongoDB Atlas).
                </li>
                <li>
                  En <em>Database Access</em> crea un usuario, y en{" "}
                  <em>Network Access</em> habilita `0.0.0.0/0`.
                </li>
                <li>
                  Copia tu cadena de conexión (`mongodb+srv://usuario:clave@cluster...`) y pégala en <code>backend/.env</code> como <code>MONGODB_URI=...</code> o directamente aquí abajo:
                </li>
              </ol>
            </div>

            <form onSubmit={handleConnectMongo} className="space-y-4">
              <div>
                <label
                  htmlFor="mongo-uri-input"
                  className="block text-xs font-bold text-brand-navy mb-1"
                >
                  Cadena de Conexión de MongoDB Atlas (`MONGODB_URI`)
                </label>
                <input
                  id="mongo-uri-input"
                  type="text"
                  value={mongoUriInput}
                  onChange={(e) => setMongoUriInput(e.target.value)}
                  placeholder="mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/animal_advisor?retryWrites=true&w=majority"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>

              <button
                type="submit"
                disabled={connectingMongo}
                className="px-6 py-3 rounded-2xl bg-brand-navy hover:bg-brand-teal text-white font-extrabold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Database className="w-4 h-4 text-brand-mint" />
                <span>
                  {connectingMongo
                    ? "Conectando y sincronizando colecciones..."
                    : "Conectar y Sincronizar con MongoDB Atlas"}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
