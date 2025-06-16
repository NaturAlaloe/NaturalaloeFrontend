import { useEffect, useState, useMemo } from "react";
import { getFacilitadores, type Facilitador } from "../../services/listFacilitatorService";

export function useFacilitadoresList() {
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    getFacilitadores().then(data => {
      setFacilitadores(data);
    });
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
        f.id_facilitador === updated.id_facilitador ? updated : f
      )
    );
  };

  const removeFacilitador = (id: number) => {
    setFacilitadores(prev => prev.filter(f => f.id_facilitador !== id));
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
    removeFacilitador,
  };
}

export type { Facilitador };
