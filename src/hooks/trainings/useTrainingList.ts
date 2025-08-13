import { useState, useEffect, useRef } from "react";
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
  isGrouped?: boolean;
  subTrainings?: Training[];
  colaboradores: {
    nombreCompleto: string;
    cedula: string;
    correo: string;
    telefono: string;
    area: string;
    departamento: string;
    puesto: string;
    nota?: number | null;
    is_aprobado?: string | null;
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
  const [showPoeModal, setShowPoeModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null
  );
  const didFetchRef = useRef(false);
  const navigate = useNavigate();

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const groupTrainingsByCollaborators = (
    apiData: TrainingList[]
  ): Training[] => {
    const trainingMap = new Map<string, Training>();
    const grupalByCapacitacionId = new Map<string, Map<string, Training>>();

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
        tipo:
          item.tipo_capacitacion === "grupal" && item.capacitacion === "general"
            ? "general"
            : item.tipo_capacitacion,
        capacitacion: item.capacitacion,
        evaluado:
          item.is_evaluado === "1" || item.is_evaluado === 1 ? "Sí" : "No",
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
            nota: item.nota,
            is_aprobado: item.is_aprobado,
          },
        ],
        profesor: {
          nombre: item.nombre_facilitador?.split(" ")[0] || "N/A",
          apellido:
            item.nombre_facilitador?.split(" ").slice(1).join(" ") || "",
          identificacion: item.id_facilitador.toString() || "N/A",
        },
        isSubRow: undefined,
      };

      if (item.tipo_capacitacion === "grupal") {
        const capacitacionId = item.id_capacitacion.toString();
        const poeKey = item.codigo_documento;

        if (!grupalByCapacitacionId.has(capacitacionId)) {
          grupalByCapacitacionId.set(
            capacitacionId,
            new Map<string, Training>()
          );
        }

        const poeMap = grupalByCapacitacionId.get(capacitacionId)!;

        if (poeMap.has(poeKey)) {
          const existingCap = poeMap.get(poeKey)!;
          existingCap.colaboradores.push(newTraining.colaboradores[0]);
        } else {
          poeMap.set(poeKey, newTraining);
        }
      } else {
        if (trainingMap.has(trainingId)) {
          const existingTraining = trainingMap.get(trainingId)!;
          existingTraining.colaboradores.push(newTraining.colaboradores[0]);
        } else {
          trainingMap.set(trainingId, newTraining);
        }
      }
    });

    const result: Training[] = Array.from(trainingMap.values());

    grupalByCapacitacionId.forEach((poeMap) => {
      const trainingsByPoe = Array.from(poeMap.values());

      if (trainingsByPoe.length > 1) {
        const firstCap = trainingsByPoe[0];
        const remainingCaps = trainingsByPoe.slice(1);
        const allColaboradores = trainingsByPoe.flatMap(
          (cap) => cap.colaboradores
        );
        const uniqueColaboradores = allColaboradores.filter(
          (colaborador, index, array) =>
            array.findIndex((c) => c.cedula === colaborador.cedula) === index
        );

        const groupedTraining: Training = {
          ...firstCap,
          id: firstCap.id,
          poe: `${firstCap.poe}`,
          isGrouped: true,
          subTrainings: remainingCaps,
          colaboradores: uniqueColaboradores,
        };
        result.push(groupedTraining);
      } else {
        result.push(trainingsByPoe[0]);
      }
    });

    return result;
  };

  const loadTrainings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiData = await getTrainingList();

      if (!Array.isArray(apiData)) {
        throw new Error("Los datos recibidos no son un array válido");
      }

      const groupedData = groupTrainingsByCollaborators(apiData);

      groupedData.sort((a, b) => a.titulo.localeCompare(b.titulo));

      setTrainings(groupedData);

      if (groupedData.length === 0) {
        showCustomToast("Info", "No se encontraron capacitaciones", "info");
      }
    } catch (error) {
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
    if (didFetchRef.current) return;
    didFetchRef.current = true;
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

  const navegarCapacitacionFinalizada = (id_capacitacion: string) => {
    navigate(`/training/evaluatedTraining/${id_capacitacion}`);
  };

  const totalPages = Math.ceil(filteredTrainings.length / rowsPerPage);

  const handleRowClick = (cap: Training) => {
    setSelectedTraining(cap);
    setShowModal(true);
  };

  const handlePoeClick = (cap: Training) => {
    if (cap.isGrouped && cap.subTrainings && cap.subTrainings.length > 0) {
      setSelectedTraining(cap);
      setShowPoeModal(true);
    }
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
    showPoeModal,
    setShowPoeModal,
    navegarCapacitacionFinalizada,
    selectedTraining: selectedTraining,
    setSelectedTraining: setSelectedTraining,
    handleRowClick,
    handlePoeClick,
    totalCount: filteredTrainings.length,
    isLoading,
    error,
    loadTrainings: loadTrainings,
  };
}
