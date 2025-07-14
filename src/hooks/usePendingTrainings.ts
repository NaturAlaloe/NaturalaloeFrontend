import { useEffect, useState, useMemo } from "react";
import { getColaboradoresPendientes, type Colaboradores } from "../services/trainings/getTrainingsService";
import { getAreas, type Area } from "../services/manage/areaService";

const ITEMS_PER_PAGE = 9;

export function usePendingTrainings() {
  const [pending, setPending] = useState<Colaboradores[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros y paginación
  const [filterArea, setFilterArea] = useState("");
  const [filterNombre, setFilterNombre] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [colaboradores, areasData] = await Promise.all([
          getColaboradoresPendientes(),
          getAreas(),
        ]);

        // Asignar los colaboradores al estado
        setPending(colaboradores);
        setAreas(areasData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setPending([]); // Asegurar estado limpio en caso de error
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  // Filtros combinados con useMemo
  const filtered = useMemo(() => {
    return pending.filter(
      item =>
        (!filterArea || item.area === filterArea) &&
        (!filterNombre || item.nombre_completo?.toLowerCase().includes(filterNombre.toLowerCase()))
    );
  }, [pending, filterArea, filterNombre]);

  // Calcular total de páginas
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)), 
    [filtered.length]
  );

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPage(1);
  }, [filterArea, filterNombre]);

  // Asegurar que la página actual no exceda el total de páginas
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Paginación calculada
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, page]);

  return {
    loading,
    areas,
    pending,
    filtered,
    paginated,
    filterArea,
    setFilterArea,
    filterNombre,
    setFilterNombre,
    page,
    setPage,
    totalPages,
  };
}