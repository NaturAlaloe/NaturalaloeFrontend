import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCapacitationList, type CapacitationList } from "../../services/capacitations/getCapacitationListService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export interface Capacitation {
  id: string;
  poe: string;
  titulo: string;
  duracion: number;
  fechaInicio: string;
  fechaFinal: string;
  comentario: string;
  tipo: string;
  evaluado: string;
  metodo: string;
  seguimiento: string;
  estado: string;
  colaborador: {
    nombreCompleto: string;
    cedula: string;
    correo: string;
    telefono: string;
    area: string;
    departamento: string;
    puesto: string;
  };
  profesor: {
    nombre: string;
    apellido: string;
    identificacion: string;
  };
}

export function useCapacitationList() {
  // Estados para datos de la API
  const [capacitations, setCapacitations] = useState<Capacitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [poeFilter, setPoeFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [seguimientoFilter, setSeguimientoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedCapacitation, setSelectedCapacitation] = useState<Capacitation | null>(null);
  const navigate = useNavigate();

  // Función para transformar datos de la API al formato de la interfaz
  const transformApiDataToCapacitation = (apiData: CapacitationList): Capacitation => {
    return {
      id: apiData.id_capacitacion.toString(),
      poe: apiData.codigo_documento || "N/A",
      titulo: apiData.descripcion_documento || "Sin título",
      duracion: parseFloat(apiData.duracion) || 0,
      fechaInicio: new Date(apiData.fecha_inicio).toISOString().split('T')[0],
      fechaFinal: new Date(apiData.fecha_fin).toISOString().split('T')[0],
      comentario: apiData.comentario || "Sin comentarios",
      tipo: apiData.tipo_capacitacion || "Individual",
      evaluado: apiData.is_evaluado === "1" ? "Sí" : "No",
      metodo: apiData.metodo_empleado || "N/A",
      seguimiento: apiData.seguimiento || "N/A",
      estado: apiData.estado || "N/A",
      colaborador: {
        nombreCompleto: apiData.nombre_colaborador || "Sin nombre",
        cedula: apiData.id_colaborador || "N/A",
        correo: "N/A", // No viene en la API
        telefono: "N/A", // No viene en la API
        area: "N/A", // No viene en la API
        departamento: "N/A", // No viene en la API
        puesto: "N/A", // No viene en la API
      },
      profesor: {
        nombre: apiData.nombre_facilitador?.split(' ')[0] || "Sin nombre",
        apellido: apiData.nombre_facilitador?.split(' ').slice(1).join(' ') || "",
        identificacion: apiData.id_facilitador.toString() || "N/A",
      },
    };
  };

  // Función para cargar capacitaciones desde la API
  const loadCapacitations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Cargando capacitaciones desde la API...");
      
      const apiData = await getCapacitationList();
      console.log("Datos recibidos de la API:", apiData);
      
      if (!Array.isArray(apiData)) {
        throw new Error("Los datos recibidos no son un array válido");
      }

      const transformedData = apiData.map(transformApiDataToCapacitation);
      console.log("Datos transformados:", transformedData);
      
      setCapacitations(transformedData);
      
      if (transformedData.length === 0) {
        showCustomToast("Info", "No se encontraron capacitaciones", "info");
      }
      
    } catch (error) {
      console.error("Error al cargar capacitaciones:", error);
      setError("No se pudieron cargar las capacitaciones");
      showCustomToast("Error", "No se pudieron cargar las capacitaciones", "error");
      setCapacitations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadCapacitations();
  }, []);

  // Generar listas únicas para filtros
  const poes = Array.from(new Set(capacitations.map((c) => c.poe)));
  const estados = Array.from(new Set(capacitations.map((c) => c.estado)));
  const tipos = Array.from(new Set(capacitations.map((c) => c.tipo)));
  const seguimientos = Array.from(new Set(capacitations.map((c) => c.seguimiento)));

  const filteredCapacitations = capacitations.filter((cap) => {
    const matchesSearch =
      cap.poe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.seguimiento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPoe = !poeFilter || cap.poe === poeFilter;
    const matchesEstado = !estadoFilter || cap.estado === estadoFilter;
    const matchesSeguimiento =
      !seguimientoFilter || cap.seguimiento === seguimientoFilter;
    const matchesTipo = !tipoFilter || cap.tipo === tipoFilter;
    return (
      matchesSearch &&
      matchesPoe &&
      matchesEstado &&
      matchesSeguimiento &&
      matchesTipo
    );
  });

  const navegarCapacitacionFinalizada = () => {
    navigate("/capacitation/evaluatedTraining");
  };

  const paginatedCapacitations = filteredCapacitations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredCapacitations.length / rowsPerPage);

  const handleRowClick = (cap: Capacitation) => {
    setSelectedCapacitation(cap);
    setShowModal(true);
  };  return {
    capacitations: paginatedCapacitations,
    searchTerm,
    setSearchTerm,
    poeFilter,
    setPoeFilter,
    estadoFilter,
    setEstadoFilter,
    tipoFilter,
    setTipoFilter,
    seguimientoFilter,
    setSeguimientoFilter,
    poes,
    estados,
    tipos,
    seguimientos,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    showModal,
    setShowModal,
    navegarCapacitacionFinalizada,
    selectedCapacitation,
    setSelectedCapacitation,
    handleRowClick,
    totalCount: filteredCapacitations.length,
    // Nuevas propiedades para manejar el estado de carga
    isLoading,
    error,
    loadCapacitations, // Función para recargar datos manualmente
  };
}


