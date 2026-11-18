# Guía Paso a Paso: Cómo Conectar Animal Advisor a MongoDB Atlas

Esta guía te explica desde cero cómo crear tu base de datos gratuita en la nube con **MongoDB Atlas** y conectarla al backend de **Animal Advisor**.

---

## Paso 1: Crear tu Cuenta y Clúster Gratuito en MongoDB Atlas

1. Ingresa a [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) e inicia sesión (puedes entrar con tu cuenta de Google o GitHub).
2. Haz clic en el botón **"+ Create"** o **"Build a Database"**.
3. Selecciona la opción **M0 (Free / Gratuito)**, que sirve para proyectos académicos y de producción ligera sin costo.
4. En **Provider**, deja seleccionado **AWS** (o el de tu preferencia) y elige la región más cercana (por ejemplo `us-east-1` N. Virginia).
5. En **Name**, puedes dejar `Cluster0` o poner `AnimalAdvisorCluster` y haz clic en **"Create Deployment"**.

---

## Paso 2: Crear el Usuario de Base de Datos (Database Access)

Al crear el clúster, aparecerá una ventana llamada **Security Quickstart** (o puedes ir en el menú izquierdo a **Security → Database Access**):

1. En **Username**, escribe un usuario sencillo sin caracteres especiales, por ejemplo:
   ```text
   animaladmin
   ```
2. En **Password**, escribe una contraseña sencilla con letras y números (evita símbolos como `@`, `#`, `/` o `:` para que no rompan la URL), por ejemplo:
   ```text
   AnimalAdvisor2026
   ```
3. Haz clic en **"Create Database User"**.

---

## Paso 3: Permitir el Acceso de Red / IP (Network Access)

Para que tu computadora (y el contenedor de Nginx/Docker o cualquier red en la universidad) pueda conectarse sin bloqueos de IP:

1. En el menú lateral izquierdo de MongoDB Atlas, ve a **Security → Network Access**.
2. Haz clic en el botón verde **"+ Add IP Address"**.
3. Haz clic en **"Allow Access from Anywhere"** (se llenará automáticamente con `0.0.0.0/0`).
4. Haz clic en **"Confirm"** y espera unos 30 segundos a que el estado diga **Active**.

---

## Paso 4: Copiar tu Cadena de Conexión (`MONGODB_URI`)

1. En el menú lateral izquierdo, ve a **Database** (o **Clusters**).
2. Al lado del nombre de tu clúster (`Cluster0`), haz clic en el botón **"Connect"**.
3. Selecciona la primera opción: **"Drivers"** (Node.js).
4. Verás una cadena de conexión parecida a esta:
   ```text
   mongodb+srv://animaladmin:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Cópiala y **reemplaza `<db_password>`** por la contraseña real que creaste en el Paso 2 (`AnimalAdvisor2026`), y agrega el nombre de la base de datos `animal_advisor` después de `.mongodb.net/`. Te quedará así:
   ```text
   mongodb+srv://animaladmin:AnimalAdvisor2026@cluster0.abcde.mongodb.net/animal_advisor?retryWrites=true&w=majority
   ```

---

## Paso 5: Conectar la Cadena en el Proyecto Animal Advisor

Tienes **2 formas** de conectarla (ambas están programadas y listas):

### Forma A: Pegarla en el archivo `backend/.env` (Recomendada para que quede fija)
1. Abre el archivo `backend/.env` de este proyecto.
2. Pega tu cadena en la variable `MONGODB_URI`:
   ```env
   PORT=4000
   MONGODB_URI=mongodb+srv://animaladmin:AnimalAdvisor2026@cluster0.abcde.mongodb.net/animal_advisor?retryWrites=true&w=majority
   ```
3. Guarda el archivo y reinicia el backend (`cd backend && npm start`).
4. En la consola verás el mensaje:
   ```text
   ✅ Conectado exitosamente a MongoDB Atlas
   ```

### Forma B: Pegarla directamente desde el Panel Administrador de la Web (Sin reiniciar nada)
1. Abre la página web en `http://localhost:5173/login`.
2. Haz clic en **"1. Entrar como Administrador"** (`admin@animaladvisor.org` / `admin123`).
3. En el **Panel del Administrador (`/admin`)**, haz clic en la cuarta pestaña llamada **"MongoDB Atlas"**.
4. Pega tu cadena `mongodb+srv://...` en el campo de texto y presiona **"Conectar y Sincronizar con MongoDB Atlas"**.

---

## Paso 6: Verificar tus Datos en la Nube de MongoDB Atlas

Una vez conectado, el backend de **Animal Advisor** crea y llena automáticamente las 5 colecciones en tu nube. Para verlas:

1. Entra a tu cuenta de MongoDB Atlas → **Database** → haz clic en **"Browse Collections"**.
2. Verás la base de datos **`animal_advisor`** con las colecciones:
   - `users` (Cuentas de Administrador, ONG y Usuarios)
   - `ongs` (Refugios y fundaciones aliadas)
   - `pets` (Perros y gatos del catálogo)
   - `adoptions` (Solicitudes e historial de adopciones)
   - `contacts` (Mensajes de contacto y asesoría)
3. Cada vez que crees, edites o elimines una mascota, ONG o registro de adopción en la web, el cambio se guardará automáticamente en tu clúster de **MongoDB Atlas**.
