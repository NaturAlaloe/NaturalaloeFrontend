import { useEffect, useState } from "react";
import { getWorkstations } from "../../services/manage/workstationService";

// Solo lógica de CRUD y fetch
export function useWorkstations() {
  const [workstations, setWorkstations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkstations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkstations();
      // Normaliza los nombres de las propiedades
      const normalized = data.map((w: any) => ({
        ...w,
        titulo_puesto: w.titulo_puesto || w.nombre_puesto || "",
        titulo_departamento: w.titulo_departamento || w.nombre_departamento || "",
      }));
      setWorkstations(normalized);
    } catch {
      setError("Error al cargar puestos");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchWorkstations();
  }, []);

  return {
    workstations,
    loading,
    error,
    refetch: fetchWorkstations,
    setWorkstations,
  };
}