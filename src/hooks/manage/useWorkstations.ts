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
      setWorkstations(data);
    } catch {
      setError("Error al cargar puestos");
    } finally {
      setLoading(false);
    }
  };

  // Aquí puedes agregar lógica de add, update, delete si la necesitas

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