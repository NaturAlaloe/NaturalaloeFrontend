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
      // Extrae el mensaje del backend si existe
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error al cargar áreas";
      setError(backendMsg);
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
      // Extrae el mensaje del backend si existe
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error al agregar área";
      setError(backendMsg);
      throw err;
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
      // Extrae el mensaje del backend si existe
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error al actualizar área";
      setError(backendMsg);
      throw err;
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
      // Extrae el mensaje del backend si existe
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error al eliminar área";
      setError(backendMsg);
      throw err; // Re-throw para que useAreasList pueda manejar el error específico
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