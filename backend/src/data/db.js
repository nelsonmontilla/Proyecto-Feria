const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const initialData = require("./seedData");

const BCRYPT_REGEX = /^\$2[aby]\$\d{2}\$/;
const {
  UserModel,
  OngModel,
  PetModel,
  AdoptionModel,
  ContactModel
} = require("../models/schemas");

const DB_FILE = path.join(__dirname, "database.json");

let isMongoConnected = false;
let mongoConnectionError = null;

async function connectMongoAtlas(customUri) {
  const uri = customUri || process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    isMongoConnected = false;
    return {
      connected: false,
      mode: "local-json",
      message:
        "Usando persistencia JSON local (Configura MONGODB_URI en backend/.env para usar MongoDB Atlas)"
    };
  }

  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri.trim(), {
      serverSelectionTimeoutMS: 6000
    });
    isMongoConnected = true;
    mongoConnectionError = null;
    console.log("✅ Conectado exitosamente a MongoDB Atlas");

    await seedMongoIfNeeded();

    return {
      connected: true,
      mode: "mongodb-atlas",
      message: "Conectado a MongoDB Atlas Cloud"
    };
  } catch (err) {
    isMongoConnected = false;
    mongoConnectionError = err.message;
    console.warn(
      "⚠️ No se pudo conectar a MongoDB Atlas, usando respaldo JSON local:",
      err.message
    );
    return {
      connected: false,
      mode: "local-json",
      error: err.message
    };
  }
}

async function seedMongoIfNeeded() {
  if (!isMongoConnected) return;
  const local = readDb();

  const userCount = await UserModel.countDocuments();
  if (userCount === 0 && local.users?.length) {
    await UserModel.insertMany(local.users);
  }

  const ongCount = await OngModel.countDocuments();
  if (ongCount === 0 && local.ongs?.length) {
    await OngModel.insertMany(local.ongs);
  }

  const petCount = await PetModel.countDocuments();
  if (petCount === 0 && local.pets?.length) {
    await PetModel.insertMany(local.pets);
  }

  const adpCount = await AdoptionModel.countDocuments();
  if (adpCount === 0 && local.adoptions?.length) {
    await AdoptionModel.insertMany(local.adoptions);
  }

  const cntCount = await ContactModel.countDocuments();
  if (cntCount === 0 && local.contacts?.length) {
    await ContactModel.insertMany(local.contacts);
  }
}

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
      return JSON.parse(JSON.stringify(initialData));
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);

    // Ensure all initial seed users exist and migrate any legacy plaintext passwords to bcrypt
    if (!parsed.users) parsed.users = [];
    let updatedUsers = false;
    for (const seedUser of initialData.users) {
      if (!parsed.users.some((u) => u.email === seedUser.email)) {
        parsed.users.push(seedUser);
        updatedUsers = true;
      }
    }
    for (const user of parsed.users) {
      if (user.password && !BCRYPT_REGEX.test(user.password)) {
        user.password = bcrypt.hashSync(user.password, 10);
        updatedUsers = true;
      }
    }
    if (updatedUsers) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database.json, falling back to initialData:", err);
    return JSON.parse(JSON.stringify(initialData));
  }
}

async function syncToMongo(data) {
  if (!isMongoConnected) return;
  try {
    await Promise.all([
      UserModel.deleteMany({}),
      OngModel.deleteMany({}),
      PetModel.deleteMany({}),
      AdoptionModel.deleteMany({}),
      ContactModel.deleteMany({})
    ]);
    await Promise.all([
      data.users?.length ? UserModel.insertMany(data.users) : Promise.resolve(),
      data.ongs?.length ? OngModel.insertMany(data.ongs) : Promise.resolve(),
      data.pets?.length ? PetModel.insertMany(data.pets) : Promise.resolve(),
      data.adoptions?.length
        ? AdoptionModel.insertMany(data.adoptions)
        : Promise.resolve(),
      data.contacts?.length
        ? ContactModel.insertMany(data.contacts)
        : Promise.resolve()
    ]);
  } catch (err) {
    console.error("Error sincronizando con MongoDB Atlas:", err.message);
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    if (isMongoConnected) {
      syncToMongo(data);
    }
    return true;
  } catch (err) {
    console.error("Error writing database.json:", err);
    return false;
  }
}

function resetDb() {
  const fresh = JSON.parse(JSON.stringify(initialData));
  writeDb(fresh);
  return fresh;
}

function getDbStatus() {
  return {
    isMongoConnected,
    mode: isMongoConnected
      ? "MongoDB Atlas (Cloud)"
      : "JSON Local + Ready for MongoDB Atlas",
    hasUriConfigured: Boolean(
      process.env.MONGODB_URI && process.env.MONGODB_URI.trim()
    ),
    lastError: mongoConnectionError
  };
}

module.exports = {
  readDb,
  writeDb,
  resetDb,
  connectMongoAtlas,
  getDbStatus
};
