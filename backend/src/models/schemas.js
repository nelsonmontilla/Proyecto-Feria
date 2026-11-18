const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "ong", "user"],
      default: "user"
    },
    ongId: { type: String, default: null },
    title: { type: String, default: "Usuario Adoptante" }
  },
  { timestamps: true }
);

const OngSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ruc: { type: String, default: "J-00000000-0" },
    city: { type: String, required: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, required: true },
    website: { type: String, default: "" },
    capacity: { type: Number, default: 30 },
    currentOccupancy: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ["Activa", "En Revisión", "Suspendida"],
      default: "Activa"
    },
    verified: { type: Boolean, default: false },
    foundedYear: { type: Number, default: 2024 },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

const PetSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    species: { type: String, enum: ["Perro", "Gato"], required: true },
    breed: { type: String, default: "Mestizo" },
    age: { type: Number, default: 1 },
    ageUnit: { type: String, default: "años" },
    gender: { type: String, default: "Macho" },
    size: { type: String, default: "Mediano" },
    weight: { type: String, default: "10 kg" },
    ongId: { type: String, required: true },
    ongName: { type: String, default: "Refugio Aliado" },
    city: { type: String, default: "Caracas" },
    vaccinated: { type: Boolean, default: true },
    sterilized: { type: Boolean, default: true },
    microchipped: { type: Boolean, default: false },
    urgencyLevel: {
      type: String,
      enum: ["Alta", "Media", "Baja"],
      default: "Media"
    },
    status: {
      type: String,
      enum: ["Disponible", "En Proceso", "Adoptado", "Baja"],
      default: "Disponible"
    },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    createdAt: { type: String }
  },
  { timestamps: true }
);

const AdoptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    petId: { type: String, required: true },
    petName: { type: String, required: true },
    petSpecies: { type: String, default: "Perro" },
    ongId: { type: String, required: true },
    ongName: { type: String, default: "Refugio Aliado" },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String, default: "" },
    applicantCity: { type: String, default: "Caracas" },
    housingType: { type: String, default: "Apartamento" },
    hasOtherPets: { type: Boolean, default: false },
    motivation: { type: String, default: "" },
    applicationDate: { type: String },
    status: {
      type: String,
      enum: ["Pendiente", "Aprobada", "Completada", "Rechazada"],
      default: "Pendiente"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

const ContactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    category: { type: String, default: "Adopción" },
    ongId: { type: String, default: "general" },
    message: { type: String, required: true },
    status: { type: String, default: "Pendiente" },
    createdAt: { type: String }
  },
  { timestamps: true }
);

module.exports = {
  UserModel: mongoose.models.User || mongoose.model("User", UserSchema),
  OngModel: mongoose.models.Ong || mongoose.model("Ong", OngSchema),
  PetModel: mongoose.models.Pet || mongoose.model("Pet", PetSchema),
  AdoptionModel:
    mongoose.models.Adoption || mongoose.model("Adoption", AdoptionSchema),
  ContactModel:
    mongoose.models.Contact || mongoose.model("Contact", ContactSchema)
};
