# Animal Advisor — Guide to Pet Adoption

Plataforma web integral para abordar la problemática de la **gestión y difusión en la adopción de perros y gatos**, reduciendo la saturación de los refugios y centralizando los procesos de adopción dispersos.

---

## Estructura del Proyecto (Separado en `backend/`, `frontend/` y `nginx/`)

```text
Proyecto final front2/
├── backend/                  # Backend Propio (Node.js + Express REST API)
│   ├── src/
│   │   ├── data/
│   │   │   ├── seedData.js   # Datos iniciales (Mascotas, ONGs, Adopciones, Contactos)
│   │   │   └── db.js         # Persistencia automática en JSON (database.json)
│   │   └── server.js         # Endpoints CRUD completos (/api/pets, /api/ongs, /api/adoptions, /api/contacts)
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Frontend SPA (React 18 + Vite + Tailwind + Redux Toolkit + React Router)
│   ├── public/
│   │   └── logo.jpg          # Logo oficial de Animal Advisor
│   ├── src/
│   │   ├── components/       # 8 Secciones relevantes + Modales + Tablas + Formularios
│   │   ├── hooks/            # 6 Custom Hooks creados a medida
│   │   ├── store/            # Estado global con Redux Toolkit (5 slices)
│   │   ├── App.jsx           # Configuración de React Router y Landing Page
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   ├── nginx.conf            # Servidor Web y Reverse Proxy para Producción / Docker
│   └── nginx.windows.conf    # Configuración de Nginx para ejecución local en Windows
└── docker-compose.yml        # Orquestación de Backend + Frontend con Nginx
```

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
4. `useLocalStorageFavorites.js`: Persiste la lista de mascotas favoritas del adoptante en `localStorage`.
5. `useNotificationToast.js`: Dispara alertas visuales conectadas al slice `ui` de Redux Toolkit.
6. `useShelterStats.js`: Calcula en tiempo real el porcentaje de saturación de los refugios y estadísticas globales desde Redux.

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
