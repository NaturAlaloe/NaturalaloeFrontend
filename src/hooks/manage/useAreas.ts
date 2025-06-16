import { useEffect, useState } from "react";
import { getAreas, createArea, type Area, updateArea as updateAreaApi, deleteArea as deleteAreaApi } from '../../services/manage/areaService';

// Este hook maneja la lógica ddel crud de áreas, incluyendo la obtención, adición y manejo de errores.

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAreas();
      setAreas(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError("Error al cargar áreas");
    } finally {
      setLoading(false);
    }
  };

  const addArea = async (area: Area) => {
    setLoading(true);
    setError(null);
    try {
      await createArea(area);
      await fetchAreas(); // Refresca la lista desde el backend
    } catch (err: any) {
      setError("Error al agregar área");
    } finally {
      setLoading(false);
    }
  };

  const updateArea = async (area: Area) => {
    setLoading(true);
    setError(null);
    try {
      await updateAreaApi(area);
      await fetchAreas(); // Refresca la lista desde el backend
    } catch (err: any) {
      setError("Error al actualizar área");
    } finally {
      setLoading(false);
    }
  };

  const removeArea = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAreaApi(id);
      await fetchAreas(); // Refresca la lista desde el backend
    } catch (err: any) {
      setError("Error al eliminar área");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return {
    areas,
    loading,
    error,
    fetchAreas,
    addArea,
    updateArea,
    removeArea,
  };
}