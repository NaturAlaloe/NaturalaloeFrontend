import { useState, useMemo } from "react";

export interface Facilitador {
  id: number;
  nombre: string;
  apellido: string;
  tipo: string;
}

const initialData: Facilitador[] = [
  { id: 1, nombre: "Juan", apellido: "Pérez", tipo: "Interno" },
  { id: 2, nombre: "Ana", apellido: "García", tipo: "Externo" },
  { id: 3, nombre: "Luis", apellido: "Martínez", tipo: "Interno" },
];

export function useFacilitadoresList() {
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filtered = useMemo(() => {
    return facilitadores.filter((fac) => {
      const term = searchTerm.toLowerCase();
      return (
        fac.nombre.toLowerCase().includes(term) ||
        fac.apellido.toLowerCase().includes(term) ||
        fac.tipo.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, facilitadores]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [currentPage, filtered]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const updateFacilitador = (updated: Facilitador) => {
    setFacilitadores((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
  };

  return {
    facilitadores,
    filtered,
    paginated,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    updateFacilitador,
  };
}
