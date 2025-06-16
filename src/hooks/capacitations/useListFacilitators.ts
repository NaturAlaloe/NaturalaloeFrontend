import { useEffect, useState, useMemo } from "react";
import { getFacilitadores, type Facilitador } from "../../services/listFacilitatorService";

// Este hook maneja la lista de facilitadores, incluyendo búsqueda, actualización y eliminación

export function useFacilitadoresList() {
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    filtered,
    updateFacilitador,
    removeFacilitador,
  };
}

export type { Facilitador };
