import { useEffect, useState, useMemo } from "react";
import { getFacilitadores, type Facilitador } from "../../services/listFacilitatorService";

export function useFacilitadoresList() {
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    getFacilitadores().then(setFacilitadores);
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return facilitadores.filter(f =>
      f.nombre.toLowerCase().includes(term) ||
      f.apellido.toLowerCase().includes(term) ||
      f.tipo_facilitador.toLowerCase().includes(term)
    );
  }, [facilitadores, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const updateFacilitador = (updated: Facilitador) => {
    setFacilitadores(prev =>
      prev.map(f =>
        f.nombre === updated.nombre && f.apellido === updated.apellido
          ? updated
          : f
      )
    );
    // Aquí podrías agregar PUT al backend si lo necesitas
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    filtered,
    paginated,
    totalPages,
    updateFacilitador,
  };
}
export type { Facilitador };

