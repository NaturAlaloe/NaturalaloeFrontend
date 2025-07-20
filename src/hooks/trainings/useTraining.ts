import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import {
  createCapacitacion,
  validateCapacitacionData,
  type CreateCapacitacionRequest,
} from "../../services/trainings/addTrainingsService";
import {
  getFacilitadores,
  type Facilitador,
  getColaboradores,
  type Colaboradores,
  getProcedimientos,
  type Procedimientos,
} from "../../services/trainings/getTrainingsService";

const metodosEvaluacion = [
  { value: "", label: "Seleccione...", disabled: true },
  { value: "Teórico", label: "Teórico" },
  { value: "Práctico", label: "Práctico" },
];

interface FormData {
  titulo: string;
  facilitador: string;
  fecha: string;
  fechaFin: string;
  duracion: string;
  metodoEvaluacion: string;
  comentario?: string;
}

export function useCapacitation() {
  const [isEvaluado, setIsEvaluado] = useState(false);
  const [showAsignacionesModal, setShowAsignacionesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [loadingFacilitadores, setLoadingFacilitadores] = useState(false);
  const [colaboradoresDisponibles, setColaboradoresDisponibles] = useState<
    Colaboradores[]
  >([]);
  const [loadingColaboradores, setLoadingColaboradores] = useState(false);
  const [procedimientosDisponibles, setProcedimientosDisponibles] = useState<
    Procedimientos[]
  >([]);
  const [loadingProcedimientos, setLoadingProcedimientos] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    facilitador: "",
    fecha: "",
    fechaFin: "",
    duracion: "",
    metodoEvaluacion: "",
    comentario: "",
  });

  const [showColaboradoresTable, setShowColaboradoresTable] = useState(false);
  const [showPoesTable, setShowPoesTable] = useState(false);
  const [colaboradoresAsignados, setColaboradoresAsignados] = useState<any[]>(
    []
  );
  const [poesAsignados, setPoesAsignados] = useState<any[]>([]);

  const columnsColaboradores = [
    {
      name: "Nombre",
      selector: (row: any) => row?.nombreCompleto || "Sin nombre",
      sortable: true,
    },
    {
      name: "Puesto",
      selector: (row: any) => row?.puesto || "Sin puesto",
      sortable: true,
    },
  ];

  const columnsPoes = [
    {
      name: "Código",
      selector: (row: any) => row?.codigo || "Sin código",
      sortable: true,
    },
    {
      name: "Título",
      selector: (row: any) => row?.titulo || "Sin título",
      sortable: true,
    },
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingInitialData(true);
      try {
        await Promise.all([
          loadFacilitadores(),
          loadColaboradores(),
          loadProcedimientos(),
        ]);
      } finally {
        setLoadingInitialData(false);
      }
    };
    loadInitialData();
  }, []);

  // Limpiar método de evaluación cuando isEvaluado cambie a false
  useEffect(() => {
    if (!isEvaluado) {
      setFormData((prev) => ({ ...prev, metodoEvaluacion: "" }));
    }
  }, [isEvaluado]);

  const loadFacilitadores = async () => {
    try {
      setLoadingFacilitadores(true);
      const data = await getFacilitadores();
      setFacilitadores(data);
    } catch (error) {
      showCustomToast(
        "Error",
        "No se pudieron cargar los facilitadores",
        "error"
      );
    } finally {
      setLoadingFacilitadores(false);
    }
  };

  const loadProcedimientos = async () => {
    try {
      setLoadingProcedimientos(true);
      const data = await getProcedimientos();

      const procedimientosTransformados = data
        .filter(Boolean)
        .filter((proc) => {
          const estado = proc.estado_capacitacion;
          return (
            estado === null ||
            estado === "reevaluacion" ||
            estado === "reprogramacion" ||
            estado === "" ||
            estado === undefined
          );
        })
        .map((proc) => ({
          ...proc,
          id: proc.id_documento,
          titulo: `Documento ${proc.descripcion}`,
        }));

      const procedimientosUnicos = procedimientosTransformados.filter(
        (proc, index, array) =>
          array.findIndex((p) => p.id === proc.id) === index
      );

      setProcedimientosDisponibles(procedimientosUnicos);
    } catch (error) {
      showCustomToast(
        "Error",
        "No se pudieron cargar los procedimientos",
        "error"
      );
      setProcedimientosDisponibles([]);
    } finally {
      setLoadingProcedimientos(false);
    }
  };

  const loadColaboradores = async () => {
    try {
      setLoadingColaboradores(true);
      const data = await getColaboradores();

      const colaboradoresTransformados = data
        .filter(Boolean)
        .filter((colab) => {
          const estado = colab.estado_capacitacion;
          const incluir =
            estado === null ||
            estado === "reevaluacion" ||
            estado === "reprogramacion" ||
            estado === "" ||
            estado === undefined;

          return incluir;
        })
        .map((colab) => ({
          ...colab,
          id: colab.id_colaborador,
          nombreCompleto: colab.nombre_completo.trim(),
          nombre: colab.nombre_completo,
        }));

      const colaboradoresUnicos = colaboradoresTransformados.filter(
        (colab, index, array) =>
          array.findIndex((c) => c.id === colab.id) === index
      );

      setColaboradoresDisponibles(colaboradoresUnicos);
    } catch (error) {
      showCustomToast(
        "Error",
        "No se pudieron cargar los colaboradores",
        "error"
      );
      setColaboradoresDisponibles([]);
    } finally {
      setLoadingColaboradores(false);
    }
  };

  const getNombreCompletoFacilitador = (facilitador: Facilitador): string => {
    return `${facilitador.nombre} ${facilitador.apellido1} ${facilitador.apellido2}`.trim();
  };

  const getFacilitadorIdByNombre = (
    nombreCompleto: string
  ): number | undefined => {
    return facilitadores.find(
      (f) => getNombreCompletoFacilitador(f) === nombreCompleto
    )?.id_facilitador;
  };

  const getFacilitadoresOptions = (): string[] => {
    return facilitadores.map((f) => getNombreCompletoFacilitador(f));
  };

  const agregarColaboradores = (seleccionados: any[]) => {
    setColaboradoresAsignados((prev) => [
      ...prev,
      ...seleccionados.filter((c) => !prev.some((asig) => asig.id === c.id)),
    ]);
    setShowColaboradoresTable(false);
  };

  const agregarPoes = (seleccionados: any[]) => {
    setPoesAsignados((prev) => [
      ...prev,
      ...seleccionados.filter((p) => !prev.some((asig) => asig.id === p.id)),
    ]);
    setShowPoesTable(false);
  };

  const eliminarColaborador = (colaboradorId: number) => {
    setColaboradoresAsignados((prev) =>
      prev.filter((c) => c.id !== colaboradorId)
    );
  };

  const eliminarPoe = (poeId: number) => {
    setPoesAsignados((prev) => prev.filter((p) => p.id !== poeId));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      "titulo",
      "facilitador",
      "fecha",
      "fechaFin",
      "duracion",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData]
    );

    if (missingFields.length > 0) {
      showCustomToast("Error", "Todos los campos son obligatorios", "error");
      return false;
    }

    if (colaboradoresAsignados.length === 0) {
      showCustomToast("Error", "Debe asignar al menos un colaborador", "error");
      return false;
    }

    if (poesAsignados.length === 0) {
      showCustomToast(
        "Error",
        "Debe asignar al menos un documento normativo (POE)",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const facilitadorId = getFacilitadorIdByNombre(formData.facilitador);
      const capacitacionData: CreateCapacitacionRequest = {
        id_colaborador: colaboradoresAsignados.map((c) => c.id),
        id_facilitador: facilitadorId,
        id_documento_normativo: poesAsignados.map((p) => p.id),
        titulo_capacitacion: formData.titulo,
        fecha_inicio: formData.fecha,
        fecha_fin: formData.fechaFin,
        comentario: formData.comentario || undefined,
        is_evaluado: isEvaluado,
        metodo_empleado:
          isEvaluado &&
          formData.metodoEvaluacion &&
          formData.metodoEvaluacion !== "" &&
          formData.metodoEvaluacion !== "Seleccione..."
            ? formData.metodoEvaluacion
            : undefined,
        duracion: parseFloat(formData.duracion),
      };

      const validationErrors = validateCapacitacionData(capacitacionData);
      if (validationErrors.length > 0) {
        showCustomToast("Error de validación", validationErrors[0], "error");
        return;
      }

      const result = await createCapacitacion(capacitacionData);
      if (result.success) {
        showCustomToast(
          "Éxito",
          "La capacitación fue registrada correctamente",
          "success"
        );
        resetForm();
      } else {
        showCustomToast("Error", result.message, "error");
      }
    } catch (error) {
      showCustomToast(
        "Error",
        "Error inesperado al registrar la capacitación",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      facilitador: "",
      fecha: "",
      fechaFin: "",
      duracion: "",
      metodoEvaluacion: "",
      comentario: "",
    });
    setColaboradoresAsignados([]);
    setPoesAsignados([]);
    setIsEvaluado(false);
  };

  return {
    // Estados principales
    isEvaluado,
    setIsEvaluado,
    showAsignacionesModal,
    setShowAsignacionesModal,
    isLoading,
    loadingInitialData,
    // Datos del formulario
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    // Facilitadores
    facilitadores,
    loadingFacilitadores,
    getNombreCompletoFacilitador,
    getFacilitadoresOptions,
    getFacilitadorIdByNombre,
    // Colaboradores
    colaboradoresDisponibles,
    loadingColaboradores,
    colaboradoresAsignados,
    setColaboradoresAsignados,
    showColaboradoresTable,
    setShowColaboradoresTable,
    columnsColaboradores,
    agregarColaboradores,
    eliminarColaborador,
    // Procedimientos (POEs)
    procedimientosDisponibles,
    loadingProcedimientos,
    poesAsignados,
    setPoesAsignados,
    showPoesTable,
    setShowPoesTable,
    columnsPoes,
    agregarPoes,
    eliminarPoe,
    // Métodos de evaluación
    metodosEvaluacion,
  };
}
