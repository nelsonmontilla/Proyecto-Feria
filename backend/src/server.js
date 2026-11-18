require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  readDb,
  writeDb,
  resetDb,
  connectMongoAtlas,
  getDbStatus
} = require("./data/db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Iniciar conexión a MongoDB Atlas si MONGODB_URI está configurada en .env
connectMongoAtlas();

// ===========================================================
// MIDDLEWARE DE PROTECCIÓN DE RUTAS Y ROLES EN EL BACKEND
// ===========================================================
function requireRole(allowedRoles = ["admin"]) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Acceso no autorizado: Debes iniciar sesión para realizar esta acción."
      });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

      if (!decoded || !decoded.role || !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          message: `Permisos insuficientes: Esta operación requiere rol ${allowedRoles
            .join(" o ")
            .toUpperCase()}.`
        });
      }

      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({
        message: "Token de sesión inválido o expirado. Inicia sesión nuevamente."
      });
    }
  };
}

// Health & Database Status Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Animal Advisor API",
    database: getDbStatus(),
    timestamp: new Date().toISOString()
  });
});

app.get("/api/db-status", (req, res) => {
  res.json(getDbStatus());
});

app.post("/api/db-connect", requireRole(["admin"]), async (req, res) => {
  const { mongoUri } = req.body;
  if (!mongoUri || !mongoUri.trim()) {
    return res
      .status(400)
      .json({ message: "Ingresa una URI válida de MongoDB Atlas (mongodb+srv://...)" });
  }
  process.env.MONGODB_URI = mongoUri.trim();
  const result = await connectMongoAtlas(mongoUri.trim());
  if (!result.connected) {
    return res.status(400).json({
      message: `No se pudo conectar a MongoDB Atlas: ${result.error}`,
      status: getDbStatus()
    });
  }
  res.json({
    message: "¡Conectado y sincronizado exitosamente con MongoDB Atlas!",
    status: getDbStatus()
  });
});

// ===========================================================
// AUTENTICACIÓN Y SEPARACIÓN DE ROLES (LOGIN / REGISTRO)
// ===========================================================
app.post("/api/auth/login", (req, res) => {
  const db = readDb();
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Debes ingresar tu correo electrónico y contraseña" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = (db.users || []).find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "Credenciales inválidas. Verifica tu correo o contraseña." });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role, // 'admin' | 'ong' | 'user'
    ongId: user.ongId || null,
    title: user.title || (user.role === "admin" ? "Administrador" : "Adoptante")
  };

  const token = Buffer.from(
    JSON.stringify({
      id: safeUser.id,
      role: safeUser.role,
      ongId: safeUser.ongId,
      iat: Date.now()
    })
  ).toString("base64");

  res.json({
    user: safeUser,
    token,
    message: `Bienvenido(a), ${safeUser.name}`
  });
});

app.post("/api/auth/register", (req, res) => {
  const db = readDb();
  const { name, email, password, role, ongId } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nombre, correo electrónico y contraseña son obligatorios" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = (db.users || []).some(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (exists) {
    return res
      .status(400)
      .json({ message: "Este correo electrónico ya se encuentra registrado" });
  }

  const validRole = ["user", "ong", "admin"].includes(role) ? role : "user";
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: validRole,
    ongId: validRole === "ong" ? ongId || "ong-1" : null,
    title:
      validRole === "admin"
        ? "Administrador del Sistema"
        : validRole === "ong"
        ? "Representante ONG"
        : "Usuario Adoptante"
  };

  if (!db.users) db.users = [];
  db.users.push(newUser);
  writeDb(db);

  const safeUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    ongId: newUser.ongId,
    title: newUser.title
  };

  const token = Buffer.from(
    JSON.stringify({
      id: safeUser.id,
      role: safeUser.role,
      ongId: safeUser.ongId,
      iat: Date.now()
    })
  ).toString("base64");

  res.status(201).json({
    user: safeUser,
    token,
    message: "Cuenta creada exitosamente"
  });
});

// Summary Statistics
app.get("/api/stats", (req, res) => {
  const db = readDb();
  const totalPets = db.pets.length;
  const availablePets = db.pets.filter((p) => p.status === "Disponible").length;
  const adoptedPets = db.pets.filter((p) => p.status === "Adoptado").length;
  const urgentPets = db.pets.filter(
    (p) => p.urgencyLevel === "Alta" && p.status === "Disponible"
  ).length;
  const totalOngs = db.ongs.length;
  const activeOngs = db.ongs.filter((o) => o.status === "Activa").length;
  const totalCapacity = db.ongs.reduce((acc, o) => acc + (Number(o.capacity) || 0), 0);
  const totalOccupancy = db.ongs.reduce(
    (acc, o) => acc + (Number(o.currentOccupancy) || 0),
    0
  );
  const saturationRate =
    totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  res.json({
    totalPets,
    availablePets,
    adoptedPets,
    urgentPets,
    totalOngs,
    activeOngs,
    totalCapacity,
    totalOccupancy,
    saturationRate,
    totalAdoptions: db.adoptions.length,
    totalContacts: db.contacts.length,
    database: getDbStatus()
  });
});

// ====================================================
// ENTIDAD 1: MASCOTAS (PETS) - CRUD COMPLETO
// Cada ONG solo puede crear, editar o borrar sus propias mascotas
// ====================================================
app.get("/api/pets", (req, res) => {
  const db = readDb();
  res.json(db.pets);
});

app.get("/api/pets/:id", (req, res) => {
  const db = readDb();
  const pet = db.pets.find((p) => p.id === req.params.id);
  if (!pet) return res.status(404).json({ message: "Mascota no encontrada" });
  res.json(pet);
});

app.post("/api/pets", requireRole(["ong", "admin"]), (req, res) => {
  const db = readDb();
  const {
    name,
    species,
    breed,
    age,
    ageUnit,
    gender,
    size,
    weight,
    ongId,
    city,
    vaccinated,
    sterilized,
    microchipped,
    urgencyLevel,
    status,
    description,
    image
  } = req.body;

  // Si es rol ONG, forzar estrictamente el ongId de la ONG autenticada
  const targetOngId =
    req.user.role === "ong" && req.user.ongId ? req.user.ongId : ongId;

  if (!name || !species || !targetOngId) {
    return res
      .status(400)
      .json({ message: "Nombre, especie y ONG son obligatorios" });
  }

  const ong = db.ongs.find((o) => o.id === targetOngId);
  const newPet = {
    id: `pet-${Date.now()}`,
    name: name.trim(),
    species,
    breed: breed || "Mestizo",
    age: Number(age) || 1,
    ageUnit: ageUnit || "años",
    gender: gender || "Macho",
    size: size || "Mediano",
    weight: weight || "10 kg",
    ongId: targetOngId,
    ongName: ong ? ong.name : "Refugio Aliado",
    city: city || (ong ? ong.city : "Caracas"),
    vaccinated: Boolean(vaccinated),
    sterilized: Boolean(sterilized),
    microchipped: Boolean(microchipped),
    urgencyLevel: urgencyLevel || "Media",
    status: status || "Disponible",
    description:
      description ||
      "Mascota rescatada en búsqueda de una familia amorosa y responsable.",
    image:
      image ||
      (species === "Gato"
        ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"),
    createdAt: new Date().toISOString().split("T")[0]
  };

  db.pets.unshift(newPet);
  writeDb(db);
  res.status(201).json(newPet);
});

app.put("/api/pets/:id", requireRole(["ong", "admin"]), (req, res) => {
  const db = readDb();
  const index = db.pets.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Mascota no encontrada" });
  }

  // Verificar independencia de ONG: una ONG no puede editar mascotas de otra ONG
  if (
    req.user.role === "ong" &&
    req.user.ongId &&
    db.pets[index].ongId !== req.user.ongId
  ) {
    return res.status(403).json({
      message:
        "Acción denegada: Solo puedes editar mascotas registradas por tu propia ONG."
    });
  }

  const targetOngId =
    req.user.role === "ong" && req.user.ongId
      ? req.user.ongId
      : req.body.ongId || db.pets[index].ongId;

  const ong = db.ongs.find((o) => o.id === targetOngId);

  const updatedPet = {
    ...db.pets[index],
    ...req.body,
    id: db.pets[index].id,
    ongId: targetOngId,
    ongName: ong ? ong.name : req.body.ongName || db.pets[index].ongName
  };

  db.pets[index] = updatedPet;
  writeDb(db);
  res.json(updatedPet);
});

app.patch("/api/pets/:id/status", requireRole(["ong", "admin"]), (req, res) => {
  const db = readDb();
  const index = db.pets.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Mascota no encontrada" });
  }

  if (
    req.user.role === "ong" &&
    req.user.ongId &&
    db.pets[index].ongId !== req.user.ongId
  ) {
    return res.status(403).json({
      message:
        "Acción denegada: Solo puedes cambiar el estado de las mascotas de tu propia ONG."
    });
  }

  const { status } = req.body;
  db.pets[index].status = status;
  writeDb(db);
  res.json(db.pets[index]);
});

app.delete("/api/pets/:id", requireRole(["ong", "admin"]), (req, res) => {
  const db = readDb();
  const pet = db.pets.find((p) => p.id === req.params.id);
  if (!pet) {
    return res.status(404).json({ message: "Mascota no encontrada" });
  }

  if (
    req.user.role === "ong" &&
    req.user.ongId &&
    pet.ongId !== req.user.ongId
  ) {
    return res.status(403).json({
      message:
        "Acción denegada: Solo puedes dar de baja o eliminar mascotas pertenecientes a tu propia ONG."
    });
  }

  db.pets = db.pets.filter((p) => p.id !== req.params.id);
  writeDb(db);
  res.json({ id: req.params.id, message: "Mascota eliminada correctamente" });
});

// ==========================================
// ENTIDAD 2: ONGS / REFUGIOS - CRUD COMPLETO
// ==========================================
app.get("/api/ongs", (req, res) => {
  const db = readDb();
  res.json(db.ongs);
});

app.get("/api/ongs/:id", (req, res) => {
  const db = readDb();
  const ong = db.ongs.find((o) => o.id === req.params.id);
  if (!ong) return res.status(404).json({ message: "ONG no encontrada" });
  res.json(ong);
});

app.post("/api/ongs", requireRole(["admin"]), (req, res) => {
  const db = readDb();
  const {
    name,
    ruc,
    city,
    address,
    phone,
    email,
    website,
    capacity,
    currentOccupancy,
    status,
    verified,
    foundedYear,
    description
  } = req.body;

  if (!name || !city || !email) {
    return res
      .status(400)
      .json({ message: "Nombre, ciudad y correo electrónico son obligatorios" });
  }

  const newOng = {
    id: `ong-${Date.now()}`,
    name: name.trim(),
    ruc: ruc || "J-00000000-0",
    city: city.trim(),
    address: address || "Dirección por confirmar",
    phone: phone || "+58 412-000-0000",
    email: email.trim(),
    website: website || "https://animaladvisor.org",
    capacity: Number(capacity) || 30,
    currentOccupancy: Number(currentOccupancy) || 15,
    status: status || "Activa",
    verified: Boolean(verified),
    foundedYear: Number(foundedYear) || new Date().getFullYear(),
    description:
      description ||
      "Organización de protección animal aliada de la red Animal Advisor."
  };

  db.ongs.unshift(newOng);
  writeDb(db);
  res.status(201).json(newOng);
});

app.put("/api/ongs/:id", requireRole(["admin"]), (req, res) => {
  const db = readDb();
  const index = db.ongs.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "ONG no encontrada" });
  }

  const updatedOng = {
    ...db.ongs[index],
    ...req.body,
    id: db.ongs[index].id,
    capacity: Number(req.body.capacity ?? db.ongs[index].capacity),
    currentOccupancy: Number(
      req.body.currentOccupancy ?? db.ongs[index].currentOccupancy
    )
  };

  db.ongs[index] = updatedOng;

  db.pets = db.pets.map((p) =>
    p.ongId === updatedOng.id ? { ...p, ongName: updatedOng.name } : p
  );
  db.adoptions = db.adoptions.map((a) =>
    a.ongId === updatedOng.id ? { ...a, ongName: updatedOng.name } : a
  );

  writeDb(db);
  res.json(updatedOng);
});

app.delete("/api/ongs/:id", requireRole(["admin"]), (req, res) => {
  const db = readDb();
  const exists = db.ongs.some((o) => o.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ message: "ONG no encontrada" });
  }
  db.ongs = db.ongs.filter((o) => o.id !== req.params.id);
  writeDb(db);
  res.json({ id: req.params.id, message: "ONG eliminada correctamente" });
});

// ===========================================================
// ENTIDAD 3: HISTORIAL Y SOLICITUDES DE ADOPCIÓN - CRUD COMPLETO
// ===========================================================
app.get("/api/adoptions", (req, res) => {
  const db = readDb();
  res.json(db.adoptions);
});

app.post("/api/adoptions", (req, res) => {
  const db = readDb();
  const {
    petId,
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantCity,
    housingType,
    hasOtherPets,
    motivation,
    status,
    notes
  } = req.body;

  if (!petId || !applicantName || !applicantEmail) {
    return res.status(400).json({
      message: "Mascota, nombre del solicitante y correo son obligatorios"
    });
  }

  const pet = db.pets.find((p) => p.id === petId);
  const ong = pet ? db.ongs.find((o) => o.id === pet.ongId) : null;

  const newAdoption = {
    id: `adp-${Date.now()}`,
    petId,
    petName: pet ? pet.name : req.body.petName || "Mascota",
    petSpecies: pet ? pet.species : req.body.petSpecies || "Perro",
    ongId: pet ? pet.ongId : req.body.ongId || "ong-1",
    ongName: ong ? ong.name : pet ? pet.ongName : "Refugio Aliado",
    applicantName: applicantName.trim(),
    applicantEmail: applicantEmail.trim(),
    applicantPhone: applicantPhone || "+58 412-000-0000",
    applicantCity: applicantCity || "Caracas",
    housingType: housingType || "Apartamento",
    hasOtherPets: Boolean(hasOtherPets),
    motivation:
      motivation || "Deseo brindar un hogar responsable y lleno de afecto.",
    applicationDate: new Date().toISOString().split("T")[0],
    status: status || "Pendiente",
    notes: notes || "Solicitud registrada desde la plataforma Animal Advisor."
  };

  if (pet && (newAdoption.status === "Aprobada" || newAdoption.status === "Completada")) {
    pet.status = newAdoption.status === "Completada" ? "Adoptado" : "En Proceso";
  } else if (pet && pet.status === "Disponible") {
    pet.status = "En Proceso";
  }

  db.adoptions.unshift(newAdoption);
  writeDb(db);
  res.status(201).json(newAdoption);
});

app.put("/api/adoptions/:id", requireRole(["admin", "ong"]), (req, res) => {
  const db = readDb();
  const index = db.adoptions.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res
      .status(404)
      .json({ message: "Registro de adopción no encontrado" });
  }

  const pet = req.body.petId
    ? db.pets.find((p) => p.id === req.body.petId)
    : db.pets.find((p) => p.id === db.adoptions[index].petId);

  const updatedAdoption = {
    ...db.adoptions[index],
    ...req.body,
    id: db.adoptions[index].id,
    petName: pet ? pet.name : req.body.petName || db.adoptions[index].petName,
    petSpecies: pet
      ? pet.species
      : req.body.petSpecies || db.adoptions[index].petSpecies,
    ongId: pet ? pet.ongId : req.body.ongId || db.adoptions[index].ongId,
    ongName: pet ? pet.ongName : req.body.ongName || db.adoptions[index].ongName
  };

  db.adoptions[index] = updatedAdoption;

  if (pet) {
    if (updatedAdoption.status === "Completada") {
      pet.status = "Adoptado";
    } else if (updatedAdoption.status === "Aprobada") {
      pet.status = "En Proceso";
    } else if (updatedAdoption.status === "Rechazada") {
      pet.status = "Disponible";
    }
  }

  writeDb(db);
  res.json(updatedAdoption);
});

app.delete("/api/adoptions/:id", requireRole(["admin"]), (req, res) => {
  const db = readDb();
  const exists = db.adoptions.some((a) => a.id === req.params.id);
  if (!exists) {
    return res
      .status(404)
      .json({ message: "Registro de adopción no encontrado" });
  }
  db.adoptions = db.adoptions.filter((a) => a.id !== req.params.id);
  writeDb(db);
  res.json({
    id: req.params.id,
    message: "Registro de adopción eliminado correctamente"
  });
});

// ===========================================================
// ENTIDAD 4: CONSULTAS DE CONTACTO / ASESORÍA - CRUD COMPLETO
// ===========================================================
app.get("/api/contacts", (req, res) => {
  const db = readDb();
  res.json(db.contacts);
});

app.post("/api/contacts", (req, res) => {
  const db = readDb();
  const { name, email, phone, subject, category, ongId, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Nombre, correo y mensaje son obligatorios" });
  }

  const newContact = {
    id: `cnt-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone || "No especificado",
    subject: subject || "Consulta general sobre adopción",
    category: category || "Adopción",
    ongId: ongId || "general",
    message: message.trim(),
    status: "Pendiente",
    createdAt: new Date().toISOString().split("T")[0]
  };

  db.contacts.unshift(newContact);
  writeDb(db);
  res.status(201).json(newContact);
});

app.put("/api/contacts/:id", requireRole(["admin", "ong"]), (req, res) => {
  const db = readDb();
  const index = db.contacts.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Consulta no encontrada" });
  }
  db.contacts[index] = {
    ...db.contacts[index],
    ...req.body,
    id: db.contacts[index].id
  };
  writeDb(db);
  res.json(db.contacts[index]);
});

app.delete("/api/contacts/:id", requireRole(["admin"]), (req, res) => {
  const db = readDb();
  db.contacts = db.contacts.filter((c) => c.id !== req.params.id);
  writeDb(db);
  res.json({ id: req.params.id, message: "Consulta eliminada correctamente" });
});

// Reset demo database
app.post("/api/reset", requireRole(["admin"]), (req, res) => {
  const fresh = resetDb();
  res.json({ message: "Base de datos restaurada con éxito", data: fresh });
});

app.listen(PORT, () => {
  console.log(`Animal Advisor Backend ejecutándose en http://localhost:${PORT}`);
});
