import { useState, useEffect } from "react";
import {
  getCapacitationGeneralList,
  type Capacitation_General,
} from "../../services/capacitations/getCapacitationGeneral";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export interface CapacitationGeneral {
  id: string;
  titulo: string;
  estado: string;
  fechaCreacion: string;
  colaboradores: {
    id: number;
    nombre: string;
    puesto: string;
    departamento: string;
    cedula: string;
  }[];
}
export function useCapacitationGeneralList() {
  const [capacitations, setCapacitations] = useState<CapacitationGeneral[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedCapacitation, setSelectedCapacitation] =
    useState<CapacitationGeneral | null>(null);

  const transformApiDataToCapacitationGeneral = (
    apiData: Capacitation_General[]
  ): CapacitationGeneral[] => {
    const groupedData = apiData.reduce((acc, item) => {
      const id = item.id_capacitacion_general.toString();

      if (!acc[id]) {
        acc[id] = {
          id: id,
          titulo: item.titulo,
          estado: "Finalizado",
          fechaCreacion: new Date(item.fecha_capacitacion)
            .toISOString()
            .split("T")[0],
          colaboradores: [],
        };
      }

      const colaboradorExiste = acc[id].colaboradores.some(
        (c) => c.id === item.id_colaborador
      );
      if (!colaboradorExiste) {
        acc[id].colaboradores.push({
          id: item.id_colaborador,
          nombre: item.nombre_completo,
          puesto: "N/A",
          departamento: "N/A",
          cedula: item.id_colaborador.toString(),
        });
      }

      return acc;
    }, {} as Record<string, CapacitationGeneral>);

    return Object.values(groupedData);
  };

  const loadCapacitationsGeneral = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Cargando capacitaciones generales desde la API...");

      const apiData = await getCapacitationGeneralList();
      console.log("Datos recibidos de la API:", apiData);

      if (!Array.isArray(apiData)) {
        throw new Error("Los datos recibidos no son un array válido");
      }

      const transformedData = transformApiDataToCapacitationGeneral(apiData);
      console.log("Datos transformados:", transformedData);

      setCapacitations(transformedData);

      if (transformedData.length === 0) {
        showCustomToast(
          "Info",
          "No se encontraron capacitaciones generales",
          "info"
        );
      }
    } catch (error) {
      console.error("Error al cargar capacitaciones generales:", error);
      setError("No se pudieron cargar las capacitaciones generales");
      showCustomToast(
        "Error",
        "No se pudieron cargar las capacitaciones generales",
        "error"
      );
      setCapacitations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCapacitationsGeneral();
  }, []);

  const estados = Array.from(new Set(capacitations.map((c) => c.estado)));

  const filteredCapacitations = capacitations.filter((cap) => {
    const matchesSearch =
      cap.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !estadoFilter || cap.estado === estadoFilter;

    return matchesSearch && matchesEstado;
  });

  const paginatedCapacitations = filteredCapacitations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredCapacitations.length / rowsPerPage);

  const handleRowClick = (cap: CapacitationGeneral) => {
    setSelectedCapacitation(cap);
    setShowModal(true);
  };

  return {
    capacitations: paginatedCapacitations,
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    estados,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    showModal,
    setShowModal,
    selectedCapacitation,
    setSelectedCapacitation,
    handleRowClick,
    totalCount: filteredCapacitations.length,
    isLoading,
    error,
    loadCapacitationsGeneral,
  };
}
