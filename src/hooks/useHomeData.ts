import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getColaboradoresPendientes, type Colaboradores } from "../services/trainings/getTrainingsService";

export function useHomeData() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<Colaboradores[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPendingTrainings() {
      setLoading(true);
      try {
        const colaboradores = await getColaboradoresPendientes();
        setPending(colaboradores);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setPending([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPendingTrainings();
  }, []);

  // Agrupar por colaborador y contar capacitaciones pendientes
  const topCollaborators = useMemo(() => {
    const collaboratorMap = new Map<string, {
      id_colaborador: string;
      nombre_completo: string;
      puesto: string;
      area: string;
      departamento: string;
      pendingCount: number;
      latestTraining: string;
      latestDate: string;
    }>();

    pending.forEach(item => {
      const key = item.id_colaborador.toString();
      if (collaboratorMap.has(key)) {
        const existing = collaboratorMap.get(key)!;
        existing.pendingCount += 1;
      } else {
        collaboratorMap.set(key, {
          id_colaborador: item.id_colaborador.toString(),
          nombre_completo: item.nombre_completo,
          puesto: item.puesto,
          area: item.area ?? "N/A",
          departamento: item.departamento ?? "N/A",
          pendingCount: 1,
          latestTraining: item.descripcion ?? "No description available",
          latestDate: new Date().toLocaleDateString('es-ES')
        });
      }
    });

    // Convertir a array y ordenar por cantidad de pendientes
    return Array.from(collaboratorMap.values())
      .sort((a, b) => b.pendingCount - a.pendingCount)
      .slice(0, 3); // Solo los top 3
  }, [pending]);

  // Función para manejar clic en tarjeta
  const handleCardClick = (collaboratorId: string) => {
    navigate(`/collaborators/${collaboratorId}`);
  };

  const totalPending = pending.length;

  return {
    loading,
    topCollaborators,
    totalPending,
    handleCardClick,
  };
}