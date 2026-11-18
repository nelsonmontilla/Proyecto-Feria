# Animal Advisor — Guide to Pet Adoption

Plataforma web integral full-stack para abordar la problemática de la **gestión y difusión en la adopción de perros y gatos**, reduciendo la saturación crítica de los refugios y centralizando los procesos de adopción dispersos.

---

## Estructura del Proyecto (Separado en `backend/`, `frontend/` y `nginx/`)

```text
Proyecto final front2/
├── backend/                     # Backend Propio (Node.js + Express REST API + Mongoose)
│   ├── src/
│   │   ├── data/
│   │   │   ├── seedData.js      # Datos iniciales (Usuarios por rol, Mascotas, ONGs, Adopciones, Contactos)
│   │   │   └── db.js            # Gestor híbrido: MongoDB Atlas Cloud + Respaldo JSON (database.json)
│   │   ├── models/
│   │   │   └── schemas.js       # Esquemas Mongoose para MongoDB Atlas (User, Ong, Pet, Adoption, Contact)
│   │   └── server.js            # Endpoints CRUD, Autenticación y Middleware de Roles (requireRole)
│   ├── .env.example             # Plantilla de configuración para PORT y MONGODB_URI
│   ├── Dockerfile
│   └── package.json
├── frontend/                    # Frontend SPA (React 18 + Vite + Tailwind + Redux Toolkit + React Router v6)
│   ├── public/
│   │   └── logo.jpg             # Logo oficial de Animal Advisor
│   ├── src/
│   │   ├── components/          # Secciones de Landing Page, Vistas Protegidas, Modales, Tablas y Formularios
│   │   ├── hooks/               # 7 Custom Hooks creados a medida
│   │   ├── store/               # Estado global con Redux Toolkit (6 slices)
│   │   ├── App.jsx              # Enrutamiento React Router v6 y Protección de Rutas
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   ├── nginx.conf               # Servidor Web SPA y Reverse Proxy para Producción / Docker
│   └── nginx.windows.conf       # Configuración de Nginx para ejecución local en Windows
├── docker-compose.yml           # Orquestación de Backend + Frontend con Nginx
├── CHECKLIST_ENTREGABLES.md     # Checklist de cumplimiento de todos los requisitos de evaluación
├── GUIA_MONGODB_ATLAS.md        # Guía paso a paso para conectar con MongoDB Atlas
└── RESUMEN_CAMBIOS_Y_EXPLICACION.md # Resumen técnico y guía de defensa del proyecto
```

---

## Credenciales de Acceso Rápido por Rol (`/login`)

El sistema separa mediante autenticación las vistas y permisos de **Usuario Normal (Adoptante)**, **ONGs Independientes** y **Administrador General**:

| Rol | Correo Electrónico | Contraseña | Permisos y Alcance |
|-----|--------------------|------------|--------------------|
| **Administrador** | `admin@animaladvisor.org` | `admin123` | Acceso al **Panel Admin (`/admin`)**: supervisa todas las ONGs, controla/elimina registros del historial de adopciones, gestiona consultas y configura MongoDB Atlas. |
| **ONG #1 (Caracas)** | `ong@huellasesperanza.org` | `ong123` | Acceso a **Pestaña ONG (`/ong`)**: visualiza, registra, edita y da de baja **únicamente** las mascotas de *Fundación Huellas de Esperanza*. |
| **ONG #2 (Valencia)** | `ong@patitasunidas.org` | `ong123` | Acceso a **Pestaña ONG (`/ong`)**: visualiza, registra, edita y da de baja **únicamente** las mascotas de *Refugio Patitas Unidas*. |
| **ONG #3 (Barquisimeto)** | `ong@bigotesycolitas.org` | `ong123` | Acceso a **Pestaña ONG (`/ong`)**: visualiza, registra, edita y da de baja **únicamente** las mascotas de *Santuario Bigotes y Colitas*. |
| **Usuario Normal** | `usuario@correo.com` | `user123` | Acceso a la vista pública, postulación de adopciones y su panel personal (`/mi-cuenta`) con su lista privada de mascotas favoritas. |

---

## Paleta de Colores (Alineada con el Logo de Animal Advisor)

- **Deep Ocean Navy (`#154F6B`)**: Tipografía principal *"ANIMAL ADVISOR"* y anillo exterior del emblema.
- **Mid Teal (`#1D6A8B`)**: Transición media del anillo circular y encabezados secundarios.
- **Turquoise Cyan (`#44A8C6`)**: Acento luminoso del emblema y bordes interactivos.
- **Soft Aqua Mint (`#7AD6B7`)**: Gradiente superior derecho del anillo e indicadores positivos.
- **Warm Golden Amber (`#F29D38`)**: Inspirado en el perro Golden y la estrella del corazón; usado para botones de acción principal (CTAs).
- **Cool Cat Slate (`#687582`)**: Inspirado en el gato gris y el subtítulo *"GUIDE TO PET ADOPTION"*.

---

## Entidades Modificables con CRUD Completo (Formularios + Tablas)

1. **Mascotas en Adopción (`/api/pets`)**:
   - **Formulario**: Registro y edición de perros y gatos en la Pestaña ONG (`OngPortalSection.jsx`).
   - **Tabla**: Tabla interactiva de gestión para las ONG con buscador, cambio rápido de estado (`Disponible`, `En Proceso`, `Adoptado`, `Baja`), edición y eliminación definitiva.
   - **Aislamiento por ONG**: Cada ONG que inicia sesión solo visualiza y administra las mascotas que pertenecen a su propia organización (`pet.ongId === user.ongId`).
2. **ONGs y Refugios Aliados (`/api/ongs`)**:
   - **Formulario**: Registro y auditoría de ONGs en el Panel Administrador (`AdminPanelSection.jsx`).
   - **Tabla**: Tabla de supervisión de ONGs con control de capacidad/ocupación, verificación en un clic, edición y eliminación.
3. **Historial y Solicitudes de Adopción (`/api/adoptions`)**:
   - **Formulario**: Formulario modal para adoptantes (`PetModals.jsx`) y formulario administrativo de control (`AdminPanelSection.jsx`).
   - **Tabla**: Tabla del historial de adopciones habilitada al administrador para aprobar, completar, rechazar, auditar o eliminar registros.
4. **Consultas de Contacto y Asesoría (`/api/contacts`)**:
   - **Formulario**: Formulario de contacto en `ContactSection.jsx`.
   - **Tabla**: Bandeja administrativa para marcar consultas como respondidas o eliminarlas.

---

## Custom Hooks Creados (`frontend/src/hooks/`)

1. `useDebounce.js`: Optimiza las búsquedas en vivo en el catálogo y tablas administrativas.
2. `usePetFilters.js`: Gestiona el filtrado multicriterio (especie, tamaño, urgencia, ONG, estado, favoritos y texto) y ordenamiento del catálogo.
3. `useFormValidation.js`: Controla el estado, validaciones por campo y envío de todos los formularios CRUD.
4. `useLocalStorageFavorites.js`: Requiere sesión iniciada y persiste la lista privada de mascotas favoritas de cada usuario autenticado (`animal_advisor_favorites_user_${user.id}`).
5. `useNotificationToast.js`: Dispara alertas visuales conectadas al slice `ui` de Redux Toolkit.
6. `useShelterStats.js`: Calcula en tiempo real el porcentaje de saturación de los refugios y estadísticas globales desde Redux.
7. `useAuth.js`: Gestiona la autenticación, sesión activa, cierre de sesión y validación de roles (`admin`, `ong`, `user`).

---

## Ejecución del Proyecto

### Opción 1: Ejecución en Entorno Local (Node.js + Vite)

1. **Iniciar el Backend Propio (Puerto 4000)**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Iniciar el Frontend (Puerto 5173 con proxy a `/api`)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Opción 2: Despliegue con Nginx y Docker Compose

```bash
docker compose up --build -d
```
El servidor **Nginx** servirá el Frontend compilado en `http://localhost:80` y redirigirá automáticamente todas las peticiones `/api/*` al contenedor del Backend en `http://backend:4000`.
