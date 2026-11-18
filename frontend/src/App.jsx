import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchPets } from "./store/slices/petsSlice";
import { fetchOngs } from "./store/slices/ongsSlice";
import { fetchAdoptions } from "./store/slices/adoptionsSlice";
import { fetchContacts } from "./store/slices/contactsSlice";
import { fetchDbStatus } from "./store/slices/authSlice";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProblemImpactSection from "./components/ProblemImpactSection";
import CatalogSection from "./components/CatalogSection";
import AdoptionStepsSection from "./components/AdoptionStepsSection";
import OngPortalSection from "./components/OngPortalSection";
import AdminPanelSection from "./components/AdminPanelSection";
import SheltersDirectorySection from "./components/SheltersDirectorySection";
import ContactSection from "./components/ContactSection";
import LoginSection from "./components/LoginSection";
import UserDashboardSection from "./components/UserDashboardSection";
import ProtectedRoute from "./components/ProtectedRoute";
import PetModals from "./components/PetModals";
import ToastContainer from "./components/ToastContainer";
import Footer from "./components/Footer";

function ScrollToTopOnRoute() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

/**
 * Landing Page para el Usuario Normal / Visitante (6 Secciones Públicas Relevantes).
 * Los paneles internos de ONG (/ong) y Administrador (/admin) están separados
 * mediante autenticación en sus rutas protegidas.
 */
function LandingPage() {
  return (
    <>
      {/* Sección 1: Hero y Propuesta de Valor */}
      <HeroSection />
      {/* Sección 2: Diagnóstico de la Problemática y Saturación de Refugios */}
      <ProblemImpactSection />
      {/* Sección 3: Catálogo Interactivo de Mascotas con Filtros */}
      <CatalogSection />
      {/* Sección 4: Guía del Proceso de Adopción en 4 Pasos */}
      <AdoptionStepsSection />
      {/* Sección 5: Directorio de Albergues y ONGs Verificadas */}
      <SheltersDirectorySection />
      {/* Sección 6: Sección de Contacto, Asesoría y Preguntas Frecuentes */}
      <ContactSection />
    </>
  );
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOngs());
    dispatch(fetchPets());
    dispatch(fetchAdoptions());
    dispatch(fetchContacts());
    dispatch(fetchDbStatus());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-ice text-slate-800">
      <ScrollToTopOnRoute />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Vista Pública / Usuario Normal */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/catalogo"
            element={
              <>
                <CatalogSection />
                <AdoptionStepsSection />
                <ContactSection />
              </>
            }
          />
          <Route
            path="/contacto"
            element={
              <>
                <ContactSection />
                <SheltersDirectorySection />
              </>
            }
          />

          {/* Login y Registro (Separación de Roles) */}
          <Route path="/login" element={<LoginSection />} />

          {/* Panel de Usuario Normal Autenticado */}
          <Route
            path="/mi-cuenta"
            element={
              <ProtectedRoute allowedRoles={["user", "ong", "admin"]}>
                <UserDashboardSection />
                <CatalogSection />
              </ProtectedRoute>
            }
          />

          {/* Pestaña Protegida para ONGs (y Administrador) */}
          <Route
            path="/ong"
            element={
              <ProtectedRoute allowedRoles={["ong", "admin"]}>
                <OngPortalSection />
                <SheltersDirectorySection />
              </ProtectedRoute>
            }
          />

          {/* Panel Protegido Exclusivo para el Administrador */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanelSection />
                <ProblemImpactSection />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <PetModals />
      <ToastContainer />
      <Footer />
    </div>
  );
}
