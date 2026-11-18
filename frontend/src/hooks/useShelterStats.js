import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Custom Hook #6: useShelterStats
 * Calcula indicadores derivados en tiempo real a partir del estado global de Redux:
 * porcentaje de saturación de refugios, distribución por especie, casos urgentes
 * y tasa de éxito de adopciones.
 */
export function useShelterStats() {
  const pets = useSelector((state) => state.pets.items);
  const ongs = useSelector((state) => state.ongs.items);
  const adoptions = useSelector((state) => state.adoptions.items);
  const contacts = useSelector((state) => state.contacts.items);

  return useMemo(() => {
    const totalPets = pets.length;
    const availablePets = pets.filter((p) => p.status === "Disponible").length;
    const inProcessPets = pets.filter((p) => p.status === "En Proceso").length;
    const adoptedPets = pets.filter((p) => p.status === "Adoptado").length;
    const dogsCount = pets.filter((p) => p.species === "Perro").length;
    const catsCount = pets.filter((p) => p.species === "Gato").length;
    const urgentPetsCount = pets.filter(
      (p) => p.urgencyLevel === "Alta" && p.status === "Disponible"
    ).length;

    const totalCapacity = ongs.reduce(
      (acc, ong) => acc + (Number(ong.capacity) || 0),
      0
    );
    const totalOccupancy = ongs.reduce(
      (acc, ong) => acc + (Number(ong.currentOccupancy) || 0),
      0
    );
    const saturationPercentage =
      totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

    const criticalOngsCount = ongs.filter((ong) => {
      const cap = Number(ong.capacity) || 1;
      const occ = Number(ong.currentOccupancy) || 0;
      return occ / cap >= 0.85;
    }).length;

    const completedAdoptions = adoptions.filter(
      (a) => a.status === "Completada" || a.status === "Aprobada"
    ).length;
    const pendingAdoptions = adoptions.filter(
      (a) => a.status === "Pendiente"
    ).length;

    return {
      totalPets,
      availablePets,
      inProcessPets,
      adoptedPets,
      dogsCount,
      catsCount,
      urgentPetsCount,
      totalOngs: ongs.length,
      verifiedOngs: ongs.filter((o) => o.verified).length,
      totalCapacity,
      totalOccupancy,
      saturationPercentage,
      criticalOngsCount,
      totalAdoptions: adoptions.length,
      completedAdoptions,
      pendingAdoptions,
      totalContacts: contacts.length
    };
  }, [pets, ongs, adoptions, contacts]);
}
