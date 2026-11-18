import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Building2,
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  RotateCcw,
  PawPrint,
  ArchiveRestore,
  Save,
  Lock
} from "lucide-react";
import {
  createPet,
  updatePet,
  updatePetStatus,
  deletePet
} from "../store/slices/petsSlice";
import { useFormValidation } from "../hooks/useFormValidation";
import { useDebounce } from "../hooks/useDebounce";
import { useNotificationToast } from "../hooks/useNotificationToast";
import { useAuth } from "../hooks/useAuth";

const INITIAL_PET_FORM = {
  name: "",
  species: "Perro",
  breed: "",
  age: 1,
  ageUnit: "años",
  gender: "Macho",
  size: "Mediano",
  weight: "12 kg",
  ongId: "ong-1",
  city: "Caracas",
  vaccinated: true,
  sterilized: true,
  microchipped: false,
  urgencyLevel: "Media",
  status: "Disponible",
  image: "",
  description: ""
};

function validatePetForm(values) {
  const errors = {};
  if (!values.name || !values.name.trim()) {
    errors.name = "El nombre de la mascota es obligatorio";
  }
  if (!values.breed || !values.breed.trim()) {
    errors.breed = "La raza o mestizaje es obligatorio";
  }
  if (!values.ongId) {
    errors.ongId = "Selecciona la ONG responsable";
  }
  if (!values.description || values.description.trim().length < 10) {
    errors.description = "Ingresa una descripción breve (mín. 10 caracteres)";
  }
  return errors;
}

export default function OngPortalSection() {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.items);
  const ongs = useSelector((state) => state.ongs.items);
  const { user, isAdmin } = useAuth();
  const { notify } = useNotificationToast();

  // Si inició sesión como una ONG específica, su ongId queda bloqueado a su propia fundación
  const isOngRole = user?.role === "ong";
  const myOngId = isOngRole ? user?.ongId || "ong-1" : null;
  const myOngObj = useMemo(
    () => (myOngId ? ongs.find((o) => o.id === myOngId) : null),
    [ongs, myOngId]
  );

  const [editingPetId, setEditingPetId] = useState(null);
  const [selectedOngFilter, setSelectedOngFilter] = useState(
    myOngId || "all"
  );
  const [tableSearch, setTableSearch] = useState("");
  const debouncedTableSearch = useDebounce(tableSearch, 200);

  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    setFormValues,
    resetForm,
    validateAll
  } = useFormValidation(
    {
      ...INITIAL_PET_FORM,
      ongId: myOngId || "ong-1",
      city: myOngObj?.city || "Caracas"
    },
    validatePetForm
  );

  // Sincronizar el filtro y el formulario cuando cambia la ONG autenticada
  useEffect(() => {
    if (isOngRole && myOngId) {
      setSelectedOngFilter(myOngId);
      setFormValues((prev) => ({
        ...prev,
        ongId: myOngId,
        city: myOngObj?.city || prev.city || "Caracas"
      }));
    }
  }, [isOngRole, myOngId, myOngObj, setFormValues]);

  // Lista de mascotas estrictamente aislada para la ONG que inició sesión
  const filteredTablePets = useMemo(() => {
    const q = debouncedTableSearch.trim().toLowerCase();
    return pets.filter((pet) => {
      // Si el usuario es una ONG, SOLO ve las mascotas de su propia ONG
      if (isOngRole && pet.ongId !== myOngId) {
        return false;
      }
      // Si es el Administrador general, puede filtrar por ONG o ver todas
      if (!isOngRole && selectedOngFilter !== "all" && pet.ongId !== selectedOngFilter) {
        return false;
      }
      if (q) {
        const text = `${pet.name} ${pet.breed} ${pet.species} ${pet.status} ${pet.ongName}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [pets, isOngRole, myOngId, selectedOngFilter, debouncedTableSearch]);

  const handleEditClick = (pet) => {
    if (isOngRole && pet.ongId !== myOngId) {
      notify({
        title: "Acción no permitida",
        message: "Solo puedes editar mascotas que pertenecen a tu propia ONG.",
        type: "error"
      });
      return;
    }

    setEditingPetId(pet.id);
    setFormValues({
      name: pet.name || "",
      species: pet.species || "Perro",
      breed: pet.breed || "",
      age: pet.age || 1,
      ageUnit: pet.ageUnit || "años",
      gender: pet.gender || "Macho",
      size: pet.size || "Mediano",
      weight: pet.weight || "10 kg",
      ongId: isOngRole ? myOngId : pet.ongId || "ong-1",
      city: pet.city || myOngObj?.city || "Caracas",
      vaccinated: Boolean(pet.vaccinated),
      sterilized: Boolean(pet.sterilized),
      microchipped: Boolean(pet.microchipped),
      urgencyLevel: pet.urgencyLevel || "Media",
      status: pet.status || "Disponible",
      image: pet.image || "",
      description: pet.description || ""
    });
    const formEl = document.getElementById("ong-pet-form");
    if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingPetId(null);
    resetForm();
    if (isOngRole && myOngId) {
      setFormValues({
        ...INITIAL_PET_FORM,
        ongId: myOngId,
        city: myOngObj?.city || "Caracas"
      });
    }
  };

  const handleSubmitPet = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const payload = {
      ...values,
      ongId: isOngRole ? myOngId : values.ongId
    };

    setIsSubmitting(true);
    try {
      if (editingPetId) {
        await dispatch(updatePet({ id: editingPetId, data: payload })).unwrap();
        notify({
          title: "Mascota actualizada",
          message: `Los datos de ${payload.name} fueron actualizados correctamente.`,
          type: "success"
        });
      } else {
        await dispatch(createPet(payload)).unwrap();
        notify({
          title: "Mascota registrada en tu ONG",
          message: `${payload.name} ya está visible en el catálogo interactivo.`,
          type: "success"
        });
      }
      handleCancelEdit();
    } catch (err) {
      notify({
        title: "Error al guardar mascota",
        message: err || "No se pudo completar la operación.",
        type: "error"
      });
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (pet, newStatus) => {
    if (isOngRole && pet.ongId !== myOngId) return;
    try {
      await dispatch(updatePetStatus({ id: pet.id, status: newStatus })).unwrap();
      notify({
        title: `Estado actualizado: ${newStatus}`,
        message: `${pet.name} ahora figura como "${newStatus}".`,
        type: newStatus === "Baja" ? "warning" : "success"
      });
    } catch (err) {
      notify({
        title: "Error",
        message: err || "No se pudo cambiar el estado.",
        type: "error"
      });
    }
  };

  const handleDeletePet = async (pet) => {
    if (isOngRole && pet.ongId !== myOngId) return;
    try {
      await dispatch(deletePet(pet.id)).unwrap();
      if (editingPetId === pet.id) {
        handleCancelEdit();
      }
      notify({
        title: "Mascota dada de baja definitivamente",
        message: `${pet.name} fue retirado de los registros de tu ONG.`,
        type: "warning"
      });
    } catch (err) {
      notify({
        title: "Error al dar de baja",
        message: err || "No se pudo eliminar el registro.",
        type: "error"
      });
    }
  };

  return (
    <section id="portal-ong" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-teal/15 text-brand-navy text-xs font-extrabold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-brand-teal" />
              {isOngRole
                ? `Panel Independiente: ${myOngObj?.name || user?.name}`
                : "Pestaña de Gestión de Mascotas por ONG"}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-navy font-display">
              {isOngRole
                ? `Mascotas de ${myOngObj?.name || user?.name}`
                : "Gestión de Mascotas en Adopción (CRUD Entidad #1)"}
            </h2>
            <p className="mt-1.5 text-slate-600 text-base max-w-2xl">
              {isOngRole
                ? "Aquí solo se muestran y gestionan las mascotas pertenecientes a tu ONG. No es posible alterar ni dar de baja registros de otros albergues."
                : "Registra nuevos perros y gatos rescatados, actualiza su ficha clínica y da de baja aquellos casos adoptados o retirados."}
            </p>
          </div>

          {isOngRole ? (
            <div className="flex items-center gap-3 bg-brand-navy text-white px-5 py-3 rounded-2xl shadow-sm">
              <Lock className="w-4 h-4 text-brand-amber shrink-0" />
              <div className="text-xs">
                <span className="block text-brand-mint font-bold uppercase">
                  Sesión Independiente de ONG Activa
                </span>
                <strong className="text-sm font-extrabold">
                  {myOngObj?.name || user?.name} ({myOngObj?.city || "Sede Activa"}) —{" "}
                  {filteredTablePets.length} mascotas propias
                </strong>
              </div>
            </div>
          ) : (
            isAdmin && (
              <div className="flex items-center gap-3 bg-brand-ice px-4 py-3 rounded-2xl border border-brand-cyan/30">
                <label
                  htmlFor="ong-portal-selector"
                  className="text-xs font-extrabold text-brand-navy whitespace-nowrap"
                >
                  Vista Admin — Filtrar ONG:
                </label>
                <select
                  id="ong-portal-selector"
                  value={selectedOngFilter}
                  onChange={(e) => setSelectedOngFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-cyan/30 text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
                >
                  <option value="all">Todas las ONG ({pets.length} mascotas)</option>
                  {ongs.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.city})
                    </option>
                  ))}
                </select>
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FORMULARIO CRUD MASCOTA */}
          <div
            id="ong-pet-form"
            className="lg:col-span-5 bg-brand-ice/70 rounded-3xl p-6 sm:p-7 border border-brand-cyan/30 shadow-soft"
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-brand-cyan/20">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-navy text-white flex items-center justify-center">
                  {editingPetId ? (
                    <Edit3 className="w-5 h-5 text-brand-amber" />
                  ) : (
                    <PlusCircle className="w-5 h-5 text-brand-mint" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-brand-navy font-display">
                    {editingPetId
                      ? "Editar Ficha de Mascota"
                      : "Registrar Nueva Mascota"}
                  </h3>
                  <p className="text-xs text-brand-slate">
                    {isOngRole
                      ? `Registro exclusivo para ${myOngObj?.name || user?.name}`
                      : "Formulario conectado al Backend y Redux"}
                  </p>
                </div>
              </div>

              {editingPetId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancelar edición</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitPet} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="pet-name"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Nombre de la Mascota *
                  </label>
                  <input
                    id="pet-name"
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Ej. Rocky, Mia..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pet-species"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Especie *
                  </label>
                  <select
                    id="pet-species"
                    name="species"
                    value={values.species}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="pet-breed"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Raza / Mestizaje *
                  </label>
                  <input
                    id="pet-breed"
                    name="breed"
                    type="text"
                    value={values.breed}
                    onChange={handleChange}
                    placeholder="Ej. Mestizo Pelo Corto"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  {errors.breed && (
                    <p className="text-xs text-red-600 mt-1">{errors.breed}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pet-ong"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    ONG Responsable *
                  </label>
                  {isOngRole ? (
                    <div className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-extrabold text-brand-navy flex items-center justify-between">
                      <span className="truncate">
                        {myOngObj?.name || user?.name}
                      </span>
                      <Lock className="w-3.5 h-3.5 text-brand-teal shrink-0 ml-1" />
                    </div>
                  ) : (
                    <select
                      id="pet-ong"
                      name="ongId"
                      value={values.ongId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-cyan cursor-pointer"
                    >
                      {ongs.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="pet-age"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Edad
                  </label>
                  <input
                    id="pet-age"
                    name="age"
                    type="number"
                    min="1"
                    max="25"
                    value={values.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pet-ageUnit"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Unidad
                  </label>
                  <select
                    id="pet-ageUnit"
                    name="ageUnit"
                    value={values.ageUnit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                  >
                    <option value="meses">Meses</option>
                    <option value="años">Años</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="pet-gender"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Sexo
                  </label>
                  <select
                    id="pet-gender"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="pet-size"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Tamaño
                  </label>
                  <select
                    id="pet-size"
                    name="size"
                    value={values.size}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                  >
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="pet-urgency"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Urgencia
                  </label>
                  <select
                    id="pet-urgency"
                    name="urgencyLevel"
                    value={values.urgencyLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="pet-status"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="pet-status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-brand-navy cursor-pointer"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Adoptado">Adoptado</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="pet-city"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    Ciudad
                  </label>
                  <input
                    id="pet-city"
                    name="city"
                    type="text"
                    value={values.city}
                    onChange={handleChange}
                    placeholder="Caracas, Valencia..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pet-image"
                    className="block text-xs font-bold text-brand-navy mb-1"
                  >
                    URL Fotografía (opcional)
                  </label>
                  <input
                    id="pet-image"
                    name="image"
                    type="url"
                    value={values.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                </div>
              </div>

              {/* Health Checkboxes */}
              <div className="flex flex-wrap items-center gap-4 pt-1 bg-white p-3 rounded-2xl border border-slate-200/80">
                <label className="flex items-center gap-2 text-xs font-bold text-brand-navy cursor-pointer">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={values.vaccinated}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-teal cursor-pointer"
                  />
                  <span>Vacunado</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-brand-navy cursor-pointer">
                  <input
                    type="checkbox"
                    name="sterilized"
                    checked={values.sterilized}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-teal cursor-pointer"
                  />
                  <span>Esterilizado</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-brand-navy cursor-pointer">
                  <input
                    type="checkbox"
                    name="microchipped"
                    checked={values.microchipped}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-teal cursor-pointer"
                  />
                  <span>Microchip</span>
                </label>
              </div>

              <div>
                <label
                  htmlFor="pet-description"
                  className="block text-xs font-bold text-brand-navy mb-1"
                >
                  Historia y Temperamento *
                </label>
                <textarea
                  id="pet-description"
                  name="description"
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Describe el carácter de la mascota, cómo fue rescatada y qué tipo de familia necesita..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
                {errors.description && (
                  <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-2xl bg-brand-navy hover:bg-brand-teal text-white font-extrabold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {editingPetId ? (
                  <>
                    <Save className="w-4 h-4 text-brand-amber" />
                    <span>Guardar Cambios de Mascota</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 text-brand-mint" />
                    <span>
                      Publicar Mascota en {myOngObj?.name || "el Catálogo"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: TABLA DE GESTIÓN DE MASCOTAS PROPIAS DE LA ONG */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60">
              <div>
                <h3 className="text-lg font-extrabold text-brand-navy font-display flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-brand-amber" />
                  <span>
                    {isOngRole
                      ? `Mis Mascotas Registradas (${filteredTablePets.length})`
                      : `Tabla de Control de Mascotas (${filteredTablePets.length})`}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isOngRole
                    ? `Mostrando únicamente las mascotas registradas por ${
                        myOngObj?.name || user?.name
                      }.`
                    : "Visualiza, edita o da de baja a las mascotas registradas."}
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filtrar en tus mascotas..."
                  aria-label="Filtrar mascotas en tabla"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-ice/80 text-brand-navy text-xs font-extrabold uppercase tracking-wider border-b border-brand-cyan/20">
                    <th className="py-3.5 px-4">Mascota</th>
                    <th className="py-3.5 px-4">ONG / Ciudad</th>
                    <th className="py-3.5 px-4">Salud & Urgencia</th>
                    <th className="py-3.5 px-4">Estado Actual</th>
                    <th className="py-3.5 px-4 text-right">Acciones ONG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredTablePets.map((pet) => (
                    <tr
                      key={pet.id}
                      className="hover:bg-brand-ice/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-brand-navy">
                              {pet.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {pet.species} • {pet.breed} ({pet.age} {pet.ageUnit})
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-700 text-xs">
                          {pet.ongName}
                        </p>
                        <p className="text-xs text-slate-500">{pet.city}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              pet.urgencyLevel === "Alta"
                                ? "bg-amber-100 text-amber-800"
                                : pet.urgencyLevel === "Media"
                                ? "bg-cyan-100 text-brand-navy"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            Urgencia {pet.urgencyLevel}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {pet.vaccinated ? "Vacunado" : "Sin vacuna"} •{" "}
                            {pet.sterilized ? "Esterilizado" : "No esteril."}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          aria-label={`Cambiar estado de ${pet.name}`}
                          value={pet.status}
                          onChange={(e) =>
                            handleQuickStatusChange(pet, e.target.value)
                          }
                          className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border cursor-pointer ${
                            pet.status === "Disponible"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : pet.status === "En Proceso"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : pet.status === "Adoptado"
                              ? "bg-cyan-50 text-brand-navy border-cyan-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="En Proceso">En Proceso</option>
                          <option value="Adoptado">Adoptado</option>
                          <option value="Baja">Baja Temporal</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditClick(pet)}
                            title="Editar ficha"
                            className="p-2 rounded-xl bg-brand-ice hover:bg-brand-cyan/25 text-brand-navy transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {pet.status !== "Baja" ? (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(pet, "Baja")}
                              title="Dar de baja del catálogo activo"
                              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Dar Baja
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleQuickStatusChange(pet, "Disponible")
                              }
                              title="Reactivar en catálogo"
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                            >
                              <ArchiveRestore className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeletePet(pet)}
                            title="Eliminar definitivamente"
                            aria-label={`Eliminar a ${pet.name}`}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTablePets.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-sm text-slate-500"
                      >
                        No hay mascotas registradas para esta ONG con el filtro actual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
