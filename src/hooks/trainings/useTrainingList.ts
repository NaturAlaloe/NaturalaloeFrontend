import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTrainingList,
  type TrainingList,
} from "../../services/trainings/getTrainingsListService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export interface Training {
  isSubRow: any;
  id: string;
  poe: string;
  titulo: string;
  duracion: number;
  fechaInicio: string;
  fechaFinal: string;
  comentario: string;
  tipo: string;
  capacitacion: string;
  evaluado: string;
  metodo: string;
  seguimiento: string;
  estado: string;
  isGrouped?: boolean; // Para identificar capacitaciones agrupadas
  subTrainings?: Training[]; // Para almacenar las capacitaciones por POE
  colaboradores: {
    nombreCompleto: string;
    cedula: string;
    correo: string;
    telefono: string;
    area: string;
    departamento: string;
    puesto: string;
  }[];
  profesor: {
    nombre: string;
    apellido: string;
    identificacion: string;
  };
}

export function useTrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedTraining, setSelectedTraining] =
    useState<Training | null>(null);
  const navigate = useNavigate();

  // Función personalizada para manejar el cambio de término de búsqueda
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Resetear a la primera página cuando se busque
  };

  const groupTrainingsByCollaborators = (
    apiData: TrainingList[]
  ): Training[] => {
    const trainingMap = new Map<string, Training>();
    const grupalByTitle = new Map<string, Map<string, Training>>();

    apiData.forEach((item) => {
      const trainingId = item.id_capacitacion.toString();

      const newTraining: Training = {
        id: trainingId,
        poe: item.codigo_documento || "N/A",
        titulo: item.titulo_capacitacion || "N/A",
        duracion: parseFloat(item.duracion) || 0,
        fechaInicio: new Date(item.fecha_inicio).toISOString().split("T")[0],
        fechaFinal: new Date(item.fecha_fin).toISOString().split("T")[0],
        comentario: item.comentario || "N/A",
        tipo: item.tipo_capacitacion === "grupal" && item.capacitacion === "general" ? "general" : item.tipo_capacitacion,
        capacitacion: item.capacitacion,
        evaluado: item.is_evaluado === "1" || item.is_evaluado === 1 ? "Sí" : "No",
        metodo: item.metodo_empleado || "N/A",
        seguimiento: item.seguimiento || "N/A",
        estado: item.estado || "N/A",
        colaboradores: [
          {
            nombreCompleto: item.nombre_colaborador || "N/A",
            cedula: item.id_colaborador?.toString() || "N/A",
            correo: "N/A",
            telefono: "N/A",
            area: "N/A",
            departamento: "N/A",
            puesto: "N/A",
          },
        ],
        profesor: {
          nombre: item.nombre_facilitador?.split(" ")[0] || "N/A",
          apellido: item.nombre_facilitador?.split(" ").slice(1).join(" ") || "",
          identificacion: item.id_facilitador.toString() || "N/A",
        },
        isSubRow: undefined
      };

      // Si es grupal, agrupar por título y luego por POE
      if (item.tipo_capacitacion === "grupal") {
        const titleKey = item.titulo_capacitacion;
        const poeKey = item.codigo_documento;

        if (!grupalByTitle.has(titleKey)) {
          grupalByTitle.set(titleKey, new Map<string, Training>());
        }

        const poeMap = grupalByTitle.get(titleKey)!;
        
        if (poeMap.has(poeKey)) {
          // Si ya existe este POE, agregar el colaborador
          const existingCap = poeMap.get(poeKey)!;
          existingCap.colaboradores.push(newTraining.colaboradores[0]);
        } else {
          // Si no existe este POE, agregarlo
          poeMap.set(poeKey, newTraining);
        }
      } else {
        // Para individuales, usar la lógica original
        if (trainingMap.has(trainingId)) {
          const existingTraining = trainingMap.get(trainingId)!;
          existingTraining.colaboradores.push(
            newTraining.colaboradores[0]
          );
        } else {
          trainingMap.set(trainingId, newTraining);
        }
      }
    });

    // Crear capacitaciones agrupadas para grupales
    const result: Training[] = Array.from(trainingMap.values());

    grupalByTitle.forEach((poeMap, title) => {
      const trainingsByPoe = Array.from(poeMap.values());
      
      if (trainingsByPoe.length > 1) {
        // Crear una capacitación agrupada
        const firstCap = trainingsByPoe[0];
        
        // Los POEs restantes se mostrarán como elementos internos del collapse
        const remainingCaps = trainingsByPoe.slice(1);
        
        // Agregar todos los colaboradores de todas las capacitaciones por POE
        const allColaboradores = trainingsByPoe.flatMap(cap => cap.colaboradores);
        
        // Eliminar colaboradores duplicados basándose en la cédula
        const uniqueColaboradores = allColaboradores.filter((colaborador, index, array) => 
          array.findIndex(c => c.cedula === colaborador.cedula) === index
        );
        
        const groupedTraining: Training = {
          ...firstCap,
          id: `grouped_${title}`,
          poe: `${firstCap.poe}`,
          isGrouped: true,
          subTrainings: remainingCaps, // Todos los POEs restantes como elementos internos
          colaboradores: uniqueColaboradores, // Colaboradores únicos
        };
        result.push(groupedTraining);
      } else {
        // Si solo hay un POE, agregar directamente
        result.push(trainingsByPoe[0]);
      }
    });

    return result;
  };

  const loadTrainings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Cargando capacitaciones desde la API...");

      const apiData = await getTrainingList();
      console.log("Datos recibidos de la API:", apiData);

      if (!Array.isArray(apiData)) {
        throw new Error("Los datos recibidos no son un array válido");
      }

      const groupedData = groupTrainingsByCollaborators(apiData);
      console.log("Datos agrupados:", groupedData);

      setTrainings(groupedData);

      if (groupedData.length === 0) {
        showCustomToast("Info", "No se encontraron capacitaciones", "info");
      }
    } catch (error) {
      console.error("Error al cargar capacitaciones:", error);
      setError("No se pudieron cargar las capacitaciones");
      showCustomToast(
        "Error",
        "No se pudieron cargar las capacitaciones",
        "error"
      );
      setTrainings([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadTrainings();
  }, []);

  const filteredTrainings = trainings.filter((cap) => {
    const matchesSearch =
      cap.poe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.seguimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const navegarCapacitacionFinalizada = (codigoDocumento: string) => {
    navigate(`/training/evaluatedTraining/${codigoDocumento}`);
  };

  const totalPages = Math.ceil(filteredTrainings.length / rowsPerPage);

  const handleRowClick = (cap: Training) => {
    setSelectedTraining(cap);
    setShowModal(true);
  };

  return {
    trainings: filteredTrainings,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    showModal,
    setShowModal,
    navegarCapacitacionFinalizada,
    selectedTraining: selectedTraining,
    setSelectedTraining: setSelectedTraining,
    handleRowClick,
    totalCount: filteredTrainings.length,
    isLoading,
    error,
    loadTrainings: loadTrainings,
  };
}
