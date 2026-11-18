# Resumen General del Proyecto y Guía de Explicación para Defensa — Animal Advisor

Este documento resume todos los módulos construidos, los cambios implementados y una **guía práctica de cómo explicar cada punto técnico** ante el jurado o profesor.

---

## 1. ¿Cómo explicar la Problemática y la Solución? (Introducción)

> **Guion sugerido para exponer:**
> *"Nuestro proyecto se llama **Animal Advisor (Guide to Pet Adoption)**. Aborda dos grandes problemas en la protección animal: la **saturación crítica de los refugios** (que superan el 85-90% de su capacidad y no pueden recibir nuevos rescatados) y los **procesos de adopción dispersos** en redes sociales que hacen que los adoptantes abandonen el trámite.*
> *Para solucionarlo, desarrollamos una plataforma full-stack dividida en tres actores separados por autenticación: el **Adoptante (Usuario Normal)**, las **ONGs / Albergues** y el **Administrador Supervisor**."*

---

## 2. Resumen de Cambios y Arquitectura Implementada

### A. Separación en 2 Carpetas (`frontend/` y `backend/`) + Nginx
- **`frontend/`**: Aplicación Single Page Application (SPA) creada con **React 18 + Vite + Tailwind CSS**.
- **`backend/`**: API REST propia creada con **Node.js + Express + Mongoose (MongoDB Atlas)**.
- **`nginx/` y `docker-compose.yml`**:
  - **Cómo explicarlo**: *"Usamos **Nginx** como servidor web y Reverse Proxy (`nginx/nginx.conf`). Nginx entrega los archivos estáticos compilados de React en el puerto 80, maneja el fallback `try_files $uri $uri/ /index.html` para que las rutas de React Router no den error 404 al recargar la página, y redirige todas las llamadas a `/api/*` hacia nuestro backend en el puerto 4000."*

---

### B. Identidad Visual Basada en el Logo (`uiux-designer` Skill)
- Se utilizó la skill `uiux-designer` para estructurar la jerarquía visual, contraste de accesibilidad (mínimo 4.5:1), tipografía amigable (`Varela Round` para títulos y `Nunito Sans` para cuerpo) y ausencia de emojis como iconos (usando exclusivamente iconos SVG de `lucide-react`).
- **Paleta extraída del logo oficial (`frontend/tailwind.config.js`)**:
  - **Azul Océano (`#154F6B`)**: Color institucional de las letras *"ANIMAL ADVISOR"*.
  - **Teal (`#1D6A8B`), Turquesa (`#44A8C6`) y Verde Menta (`#7AD6B7`)**: Colores del anillo degradado que rodea al perro y al gato.
  - **Ámbar Dorado (`#F29D38`)**: Tomado del perro Golden y la estrella del corazón; se utiliza en los botones principales de llamada a la acción (CTAs como *"Adoptar"*).
  - **Gris Pizarra (`#687582`)**: Tomado del gato gris y del subtítulo *"GUIDE TO PET ADOPTION"*.

---

### C. Uso de React Router y Protección de Rutas/Vistas (Doble Capa)
- **Cómo explicarlo**: *"Implementamos **React Router v6** en `frontend/src/App.jsx` con `<BrowserRouter>`, `<Routes>` y `<Route>`. Además, separamos mediante un sistema de Login (`/login`) lo que puede ver un usuario normal frente a lo que puede ver una ONG o el Administrador."*
- **Capa 1 — Protección en el Frontend (`ProtectedRoute.jsx`)**:
  - Rutas públicas para el adoptante: `/` (Landing Page con 6 secciones), `/catalogo`, `/contacto`, `/login`.
  - Ruta protegida para el adoptante autenticado: `/mi-cuenta` (`UserDashboardSection.jsx`).
  - Ruta protegida para ONGs: `/ong` (`OngPortalSection.jsx`) — envuelta en `<ProtectedRoute allowedRoles={["ong", "admin"]}>`.
  - Ruta protegida para el Administrador: `/admin` (`AdminPanelSection.jsx`) — envuelta en `<ProtectedRoute allowedRoles={["admin"]}>`.
  - Si un usuario normal o visitante intenta escribir `/admin` u `/ong` en el navegador, `ProtectedRoute` bloquea el renderizado de la vista y muestra una pantalla de **Acceso Restringido**.
- **Capa 2 — Protección en el Backend (`requireRole` Middleware en `backend/src/server.js`)**:
  - Cada petición de creación, edición o borrado desde Redux envía el encabezado `Authorization: Bearer <token>`.
  - El middleware `requireRole(["admin"])` o `requireRole(["ong", "admin"])` valida en el servidor que el token pertenezca al rol autorizado antes de modificar la base de datos.

---

### D. Estado Global con Redux Toolkit (`frontend/src/store/`)
- **Cómo explicarlo**: *"Toda la información compartida de la aplicación se maneja de forma centralizada en **Redux Toolkit** (`store.js`) mediante 6 slices y `createAsyncThunk` para las peticiones HTTP al backend:"*
  1. `authSlice.js`: Sesión del usuario logueado, token, rol activo (`user`, `ong`, `admin`) y estado de conexión a MongoDB Atlas.
  2. `petsSlice.js`: Catálogo global de mascotas y acciones CRUD (`fetchPets`, `createPet`, `updatePet`, `updatePetStatus`, `deletePet`).
  3. `ongsSlice.js`: Lista de ONGs aliadas, niveles de ocupación y CRUD (`fetchOngs`, `createOng`, `updateOng`, `deleteOng`).
  4. `adoptionsSlice.js`: Historial de adopciones y solicitudes (`fetchAdoptions`, `createAdoption`, `updateAdoption`, `deleteAdoption`).
  5. `contactsSlice.js`: Mensajes de contacto y asesoría (`fetchContacts`, `createContact`, `updateContact`, `deleteContact`).
  6. `uiSlice.js`: Control global de las notificaciones flotantes (*toasts*) y modales abiertos.

---

### E. Los 7 Custom Hooks Creados por Nosotros (`frontend/src/hooks/`)
El requisito pedía **mínimo 5 Custom Hooks**; creamos **7 Custom Hooks propios** con responsabilidades claras:

1. **`useDebounce.js`**:
   - *¿Qué hace?*: Espera 220ms después de que el usuario deja de escribir en el buscador antes de filtrar.
   - *¿Por qué es importante?*: Evita re-renderizados innecesarios en cada tecla presionada.
2. **`usePetFilters.js`**:
   - *¿Qué hace?*: Encapsula toda la lógica de filtrado multicriterio del catálogo (por especie Perro/Gato, tamaño, urgencia, ONG, estado, solo favoritos y búsqueda de texto) y el ordenamiento por urgencia.
3. **`useFormValidation.js`**:
   - *¿Qué hace?*: Hook reutilizable para manejar el estado de todos los formularios del sistema, validaciones en tiempo real, mensajes de error por campo y limpieza (`resetForm`).
4. **`useLocalStorageFavorites.js`**:
   - *¿Qué hace?*: Permite al adoptante marcar perros o gatos con el corazón de "Favoritos" y los guarda en `localStorage` para que no se pierdan al recargar la página.
5. **`useNotificationToast.js`**:
   - *¿Qué hace?*: Conecta con `uiSlice` de Redux para mostrar notificaciones emergentes de éxito, advertencia o error que desaparecen solas a los 4 segundos.
6. **`useShelterStats.js`**:
   - *¿Qué hace?*: Lee los slices de Redux y calcula en tiempo real el **porcentaje de saturación de los refugios** (plazas ocupadas vs. capacidad total), cantidad de casos urgentes y estadísticas de adopción.
7. **`useAuth.js`**:
   - *¿Qué hace?*: Expone de forma sencilla el usuario actual, banderas booleanas de rol (`isAdmin`, `isOng`, `isNormalUser`, `isAuthenticated`) y las funciones `login`, `register` y `signOut`.

---

### F. Las 4 Entidades con CRUD, Formularios y Tablas
El proyecto pedía **mínimo 3 entidades con CRUD, formularios y tablas**; implementamos **4**:

| # | Entidad | Dónde está su Formulario | Dónde está su Tabla Interactiva | Operaciones CRUD que realiza |
|---|---------|--------------------------|---------------------------------|------------------------------|
| **1** | **Mascotas (`pets`)** | `OngPortalSection.jsx` (Columna izquierda) | `OngPortalSection.jsx` (Columna derecha) | Registrar mascota (`POST`), listar/filtrar (`GET`), editar ficha o cambiar estado a Disponible/Adoptado/Baja (`PUT`/`PATCH`) y eliminar (`DELETE`). |
| **2** | **ONGs (`ongs`)** | `AdminPanelSection.jsx` (Pestaña *Supervisar ONGs*) | `AdminPanelSection.jsx` (Tabla de ONGs) | Registrar ONG (`POST`), listar ocupación (`GET`), editar capacidad o verificar ONG (`PUT`) y eliminar (`DELETE`). |
| **3** | **Historial de Adopciones (`adoptions`)** | `PetModals.jsx` (Adoptante) y `AdminPanelSection.jsx` (Admin) | `AdminPanelSection.jsx` (Pestaña *Historial de Adopciones*) | Enviar solicitud (`POST`), consultar historial (`GET`), aprobar/completar/rechazar o editar notas (`PUT`) y eliminar registro del historial (`DELETE`). |
| **4** | **Consultas de Contacto (`contacts`)** | `ContactSection.jsx` | `AdminPanelSection.jsx` (Pestaña *Consultas*) | Enviar consulta (`POST`), listar mensajes (`GET`), marcar como Respondido/Pendiente (`PUT`) y eliminar (`DELETE`). |

---

### G. Base de Datos Híbrida: MongoDB Atlas + Respaldo JSON Local
- **Cómo explicarlo**: *"En `backend/src/models/schemas.js` definimos los esquemas de **Mongoose** para **MongoDB Atlas**. Además, en `backend/src/data/db.js` programamos una arquitectura híbrida tolerante a fallos: si `MONGODB_URI` está configurada (ya sea desde `backend/.env` o pegándola en vivo desde la pestaña **MongoDB Atlas** del Panel Administrador), el sistema sincroniza todas las colecciones en la nube de MongoDB Atlas; y si no hay internet durante la exposición, opera automáticamente sobre `database.json` local sin que la aplicación se caiga."*
