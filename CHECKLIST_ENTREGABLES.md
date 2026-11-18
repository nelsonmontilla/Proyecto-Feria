# Checklist Oficial de Requerimientos y Entregables — Animal Advisor

Documento de verificación técnica y funcional del proyecto **Animal Advisor — Guide to Pet Adoption**, abordando la problemática de la **gestión y difusión en la adopción de perros y gatos** (refugios saturados y procesos de adopción dispersos).

---

## 1. Requerimientos Funcionales del Sistema

- [x] **Catálogo interactivo con filtros y sección de contacto para que los adoptantes consulten las mascotas disponibles**
  - **Catálogo interactivo**: `frontend/src/components/CatalogSection.jsx` (filtros por especie Perro/Gato, tamaño, urgencia, ONG, estado, favoritos y barra de búsqueda con *debounce*).
  - **Favoritos privados con inicio de sesión obligatorio**: `frontend/src/hooks/useLocalStorageFavorites.js` (para guardar o filtrar favoritos el sistema exige haber iniciado sesión y guarda una lista independiente por cada `user.id`).
  - **Modal de Ficha Detallada y Solicitud de Adopción**: `frontend/src/components/PetModals.jsx`.
  - **Sección de Contacto, Asesoría y Preguntas Frecuentes**: `frontend/src/components/ContactSection.jsx`.

- [x] **Pestaña para que las ONG puedan registrar, visualizar y dar de baja a las mascotas en adopción (Independiente por ONG)**
  - **Componente**: `frontend/src/components/OngPortalSection.jsx` (Ruta protegida `/ong`).
  - **Independencia estricta por ONG**: Cada cuenta de ONG autenticado (`user.ongId`) solo visualiza en la tabla y solo puede registrar, editar o dar de baja las mascotas que pertenecen a su propia ONG (validado tanto en `OngPortalSection.jsx` como en el backend `backend/src/server.js`).

- [x] **Panel habilitado al administrador para supervisar las ONG y controlar o eliminar registros del historial de adopciones**
  - **Componente**: `frontend/src/components/AdminPanelSection.jsx` (Ruta protegida `/admin`).
  - Permite supervisar, registrar, editar capacidad/ocupación, verificar y eliminar ONGs (`/api/ongs`), así como controlar, auditar estados o eliminar registros del **Historial de Adopciones** (`/api/adoptions`).

---

## 2. Checklist de Requerimientos Técnicos Evaluables

### [x] Mínimo 3 entidades modificables con CRUD (Se implementaron 4 entidades completas)
- [x] **Entidad 1: Mascotas en Adopción (`pets`)**
  - **Endpoints**: `GET /api/pets`, `POST /api/pets`, `PUT /api/pets/:id`, `PATCH /api/pets/:id/status`, `DELETE /api/pets/:id`
  - **Redux Slice**: `frontend/src/store/slices/petsSlice.js`
- [x] **Entidad 2: ONGs y Refugios Aliados (`ongs`)**
  - **Endpoints**: `GET /api/ongs`, `POST /api/ongs`, `PUT /api/ongs/:id`, `DELETE /api/ongs/:id`
  - **Redux Slice**: `frontend/src/store/slices/ongsSlice.js`
- [x] **Entidad 3: Historial y Solicitudes de Adopción (`adoptions`)**
  - **Endpoints**: `GET /api/adoptions`, `POST /api/adoptions`, `PUT /api/adoptions/:id`, `DELETE /api/adoptions/:id`
  - **Redux Slice**: `frontend/src/store/slices/adoptionsSlice.js`
- [x] **Entidad 4 (Adicional): Consultas de Contacto y Asesoría (`contacts`)**
  - **Endpoints**: `GET /api/contacts`, `POST /api/contacts`, `PUT /api/contacts/:id`, `DELETE /api/contacts/:id`
  - **Redux Slice**: `frontend/src/store/slices/contactsSlice.js`

---

### [x] Formularios para manejar las entidades
- [x] **Formulario 1 — Registro y Edición de Mascotas (ONG)**: En `frontend/src/components/OngPortalSection.jsx` (con `ongId` bloqueado a la ONG que inició sesión).
- [x] **Formulario 2 — Registro Exclusivo y Auditoría de ONGs (Admin)**: En `frontend/src/components/AdminPanelSection.jsx` (Pestaña *Supervisar y Registrar ONGs* — único lugar donde se dan de alta nuevas ONGs y su contraseña de acceso).
- [x] **Formulario 3 — Control del Historial de Adopciones (Admin)**: En `frontend/src/components/AdminPanelSection.jsx` (Pestaña *Historial de Adopciones*).
- [x] **Formulario 4 — Postulación de Adopción (Adoptante)**: En `frontend/src/components/PetModals.jsx`.
- [x] **Formulario 5 — Consulta de Contacto y Asesoría**: En `frontend/src/components/ContactSection.jsx`.
- [x] **Formulario 6 — Login General y Registro Público Exclusivo de Adoptantes**: En `frontend/src/components/LoginSection.jsx` (el registro público solo permite crear cuentas de adoptante `role: "user"`).

---

### [x] Tablas donde se pueda manejar las entidades
- [x] **Tabla 1 — Gestión de Mascotas en Adopción (ONG)**: En `frontend/src/components/OngPortalSection.jsx` (muestra exclusivamente las mascotas de la ONG que inició sesión, con buscador en vivo, selector de estado rápido, botón de edición, botón de *Dar Baja* y botón de eliminar).
- [x] **Tabla 2 — Supervisión de ONGs Aliadas (Admin)**: En `frontend/src/components/AdminPanelSection.jsx` (con indicador de saturación, botón de verificación en un clic, edición y eliminación).
- [x] **Tabla 3 — Control del Historial de Adopciones (Admin)**: En `frontend/src/components/AdminPanelSection.jsx` (con selector de estado `Pendiente`, `Aprobada`, `Completada`, `Rechazada`, edición de notas y eliminación de registros del historial).
- [x] **Tabla 4 — Bandeja de Consultas de Contacto (Admin)**: En `frontend/src/components/AdminPanelSection.jsx` (con cambio de estado `Pendiente` / `Respondido` y eliminación).

---

### [x] Backend Propio + Integración con MongoDB Atlas
- [x] **Servidor Propio REST API**: En `backend/src/server.js` (Node.js + Express en puerto `4000`).
- [x] **Middleware de Seguridad por Rol y Propiedad de ONG (`requireRole`)**: En `backend/src/server.js`.
- [x] **Esquemas de Mongoose (MongoDB Atlas)**: En `backend/src/models/schemas.js` (`UserModel`, `OngModel`, `PetModel`, `AdoptionModel`, `ContactModel`).
- [x] **Gestor Híbrido MongoDB Atlas + Respaldo JSON Local**: En `backend/src/data/db.js` y `backend/src/data/seedData.js`.

---

### [x] Mínimo 6 secciones relevantes + Landing Page incluida
La **Landing Page (`/`)** incluye **6 secciones públicas completas** con navegación por scroll suave (`#problematica`, `#catalogo`, `#proceso-adopcion`, `#directorio-ongs`, `#contacto`) además de las **3 vistas adicionales protegidas por rol**:
- [x] **Sección 1 — Hero & Propuesta de Valor con Métricas en Tiempo Real**: `frontend/src/components/HeroSection.jsx`
- [x] **Sección 2 — Diagnóstico de la Problemática y Monitor de Saturación por ONG**: `frontend/src/components/ProblemImpactSection.jsx`
- [x] **Sección 3 — Catálogo Interactivo de Mascotas con Filtros Multicriterio**: `frontend/src/components/CatalogSection.jsx`
- [x] **Sección 4 — Guía Estandarizada del Proceso de Adopción en 4 Pasos**: `frontend/src/components/AdoptionStepsSection.jsx`
- [x] **Sección 5 — Directorio Nacional de Albergues y ONGs Verificadas**: `frontend/src/components/SheltersDirectorySection.jsx`
- [x] **Sección 6 — Sección de Contacto, Asesoría y Preguntas Frecuentes (FAQ)**: `frontend/src/components/ContactSection.jsx`
- [x] **Sección 7 — Portal de Gestión Independiente para ONGs**: `frontend/src/components/OngPortalSection.jsx`
- [x] **Sección 8 — Panel de Supervisión del Administrador**: `frontend/src/components/AdminPanelSection.jsx`
- [x] **Sección 9 — Portal de Login, Registro y Panel del Adoptante**: `frontend/src/components/LoginSection.jsx` y `frontend/src/components/UserDashboardSection.jsx`

---

### [x] Diseño completamente responsive + Colores concordantes con el Logo
- [x] **Diseño Mobile-First y Responsive**: Grillas adaptables (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `xl:grid-cols-12`), menú móvil/tablet desplegable (`Navbar.jsx` alineado en una sola fila sin desbordamientos) y tablas con `overflow-x-auto`.
- [x] **Paleta extraída del Logo Oficial (`frontend/public/logo.jpg`)**:
  - `brand.navy` (`#154F6B`) — Azul Océano Profundo del texto *"ANIMAL ADVISOR"* y anillo exterior.
  - `brand.teal` (`#1D6A8B`) y `brand.cyan` (`#44A8C6`) — Tonos turquesa del aro circular.
  - `brand.mint` (`#7AD6B7`) — Verde agua luminoso del anillo superior.
  - `brand.amber` (`#F29D38`) — Dorado cálido del perro y estrella del corazón para CTAs.
  - `brand.slate` (`#687582`) — Gris pizarra del gato y subtítulo *"GUIDE TO PET ADOPTION"*.

---

### [x] Hacer uso de 5 Custom Hooks creados por ustedes (Se crearon 7 Custom Hooks)
Ubicados en la carpeta `frontend/src/hooks/`:
- [x] **1. `useDebounce.js`**: Retrasa la ejecución de búsquedas por texto en el catálogo y tablas para optimizar el rendimiento en React.
- [x] **2. `usePetFilters.js`**: Gestiona el filtrado multicriterio (especie, tamaño, urgencia, ONG, estado, favoritos) y el ordenamiento del catálogo.
- [x] **3. `useFormValidation.js`**: Controla el estado de los inputs, validaciones personalizadas, errores por campo y reinicio de todos los formularios CRUD.
- [x] **4. `useLocalStorageFavorites.js`**: Exige sesión iniciada y guarda una lista privada de mascotas favoritas por cada usuario (`animal_advisor_favorites_user_${user.id}`).
- [x] **5. `useNotificationToast.js`**: Dispara y limpia notificaciones flotantes conectadas al estado global de Redux.
- [x] **6. `useShelterStats.js`**: Calcula en tiempo real el porcentaje de saturación de los albergues, cupos ocupados y estadísticas por especie desde Redux.
- [x] **7. `useAuth.js`**: Maneja el inicio de sesión, registro, cierre de sesión y validación de roles (`admin`, `ong`, `user`).

---

### [x] Uso de REDUX como manejador de estado global
Configurado con **Redux Toolkit (`@reduxjs/toolkit` y `react-redux`)** en `frontend/src/store/store.js`:
- [x] `authSlice.js`: Estado global del usuario autenticado, rol activo, `ongId`, token y estado de conexión con MongoDB Atlas.
- [x] `petsSlice.js`: Estado global y *thunks* asíncronos del catálogo e inventario de mascotas.
- [x] `ongsSlice.js`: Estado global y *thunks* asíncronos de las ONGs y su capacidad.
- [x] `adoptionsSlice.js`: Estado global y *thunks* asíncronos del historial y solicitudes de adopción.
- [x] `contactsSlice.js`: Estado global y *thunks* asíncronos de los mensajes de contacto.
- [x] `uiSlice.js`: Estado global de modales activos y cola de notificaciones *toast*.

---

### [x] Uso de React Router + Rutas y Vistas Protegidas
Configurado con `react-router-dom` en `frontend/src/App.jsx` y `frontend/src/components/ProtectedRoute.jsx`:
- [x] **`/`**: Landing Page pública para adoptantes y visitantes (6 secciones).
- [x] **`/catalogo`**: Vista dedicada del Catálogo Interactivo de Mascotas.
- [x] **`/contacto`**: Vista dedicada de Contacto, Asesoría y Preguntas Frecuentes.
- [x] **`/login`**: Vista de Inicio de Sesión y Registro con separación de roles y botones de prueba para Admin, ONG 1, ONG 2 y Usuario Normal.
- [x] **`/mi-cuenta` (Ruta Protegida — Requiere Login)**: Panel personal con las mascotas favoritas privadas de ese usuario y sus solicitudes (`UserDashboardSection.jsx`).
- [x] **`/ong` (Ruta Protegida — Solo Rol `ong` y `admin`)**: Pestaña de gestión de mascotas aislada para la ONG que inició sesión (`OngPortalSection.jsx`).
- [x] **`/admin` (Ruta Protegida — Solo Rol `admin`)**: Panel de supervisión del Administrador (`AdminPanelSection.jsx`).

---

### [x] Separación en 2 Carpetas (`backend/` y `frontend/`) + Servidor Nginx
- [x] **`backend/`**: API REST independiente con su propio `package.json` y `Dockerfile`.
- [x] **`frontend/`**: Aplicación React independiente con su propio `package.json` y `Dockerfile`.
- [x] **`nginx/nginx.conf` y `nginx/nginx.windows.conf` + `docker-compose.yml`**: Servidor web Nginx que sirve los estáticos del Frontend y redirige mediante *Reverse Proxy* todas las peticiones `/api/*` hacia el Backend.
