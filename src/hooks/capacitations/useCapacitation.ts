import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import {
  createCapacitacion,
  validateCapacitacionData,
  type CreateCapacitacionRequest,
  createCapacitacionGeneral,
} from "../../services/capacitations/addCapacitationsService";
import {
  getFacilitadores,
  type Facilitador,
  getColaboradores,
  type Colaboradores,
  getProcedimientos,
  type Procedimientos,
} from "../../services/capacitations/getCapacitationsService";

const metodosEvaluacion = [
  { value: "", label: "Seleccione...", disabled: true },
  { value: "Teórico", label: "Teórico" },
  { value: "Práctico", label: "Práctico" },
];

interface FormData {
  titulo: string;
  tipoCapacitacion: string;
  facilitador: string;
  fecha: string;
  fechaFin: string;
  duracion: string;
  metodoEvaluacion: string;
  comentario?: string;
}
export function useCapacitation() {
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showFacilitadorModal, setShowFacilitadorModal] = useState(false);
  const [isEvaluado, setIsEvaluado] = useState(false);
  const [showAsignacionesModal, setShowAsignacionesModal] = useState(false);
  const [isGeneralMode, setIsGeneralMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);  const [loadingFacilitadores, setLoadingFacilitadores] = useState(false);
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
    tipoCapacitacion: "",
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
  const [selectedColaboradores, setSelectedColaboradores] = useState<any[]>([]);
  const [selectedPoes, setSelectedPoes] = useState<any[]>([]);

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
          loadProcedimientos()
        ]);
      } finally {
        setLoadingInitialData(false);
      }
    };
    
    loadInitialData();
  }, []);
  const loadFacilitadores = async () => {
    try {
      setLoadingFacilitadores(true);
      const data = await getFacilitadores();
      setFacilitadores(data);
    } catch (error) {
      console.error("Error al cargar facilitadores:", error);
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

      if (!Array.isArray(data)) {
        console.error("Los datos de procedimientos no son un array:", data);
        setProcedimientosDisponibles([]);
        return;
      }

      const procedimientosTransformados = data
        .filter((proc) => proc)
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
      console.error("Error al cargar procedimientos:", error);
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

      if (!Array.isArray(data)) {
        console.error("Los datos de colaboradores no son un array:", data);
        setColaboradoresDisponibles([]);
        return;
      }

      const colaboradoresTransformados = data
        .filter((colab) => colab)
        .map((colab) => ({
          ...colab,
          id: colab.id_colaborador,
          nombreCompleto: `${colab.nombre_completo}`.trim(),
          nombre: colab.nombre_completo,
        }));

      const colaboradoresUnicos = colaboradoresTransformados.filter(
        (colab, index, array) =>
          array.findIndex((c) => c.id === colab.id) === index
      );

      setColaboradoresDisponibles(colaboradoresUnicos);
    } catch (error) {
      console.error("Error al cargar colaboradores:", error);
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
    const facilitador = facilitadores.find(
      (f) => getNombreCompletoFacilitador(f) === nombreCompleto
    );
    return facilitador?.id_facilitador;
  };

  const getFacilitadoresOptions = (): string[] => {
    return facilitadores.map((f) => getNombreCompletoFacilitador(f));
  };
  const agregarColaboradores = (seleccionados: any[]) => {
    setColaboradoresAsignados((prev) => [
      ...prev,
      ...seleccionados.filter(
        (c) => !prev.some((asig: any) => asig.id === c.id)
      ),
    ]);
    setShowColaboradoresTable(false);
  };

  const agregarPoes = (seleccionados: any[]) => {
    setPoesAsignados((prev) => [
      ...prev,
      ...seleccionados.filter(
        (p) => !prev.some((asig: any) => asig.id === p.id)
      ),
    ]);
    setShowPoesTable(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleGeneralMode = () => {
    setIsGeneralMode(!isGeneralMode);
  };

  const getFormTitle = () => {
    return `Registro de Capacitación${isGeneralMode ? " - Modo General" : ""}`;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isGeneralMode) {
        if (!formData.titulo) {
          showCustomToast("Error", "El título es obligatorio", "error");
          return;
        }
      } else {
        if (
          !formData.titulo ||
          !formData.facilitador ||
          !formData.fecha ||
          !formData.fechaFin ||
          !formData.duracion
        ) {
          showCustomToast(
            "Error",
            "Todos los campos son obligatorios",
            "error"
          );
          return;
        }
      }

      if (colaboradoresAsignados.length === 0) {
        showCustomToast(
          "Error",
          "Debe asignar al menos un colaborador",
          "error"
        );
        return;
      }

      if (!isGeneralMode && poesAsignados.length === 0) {
        showCustomToast(
          "Error",
          "Debe asignar al menos un documento normativo (POE)",
          "error"
        );
        return;
      }

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
        metodo_empleado: formData.metodoEvaluacion,
        duracion: parseFloat(formData.duracion),
      };

      const validationErrors = validateCapacitacionData(capacitacionData);
      if (validationErrors.length > 0) {
        showCustomToast("Error de validación", validationErrors[0], "error");
        return;
      }

      const result = await createCapacitacion(capacitacionData);
      if (result.success) {
        const modeText = isGeneralMode ? "general" : "completa";
        showCustomToast(
          "Éxito",
          `La capacitación ${modeText} fue registrada correctamente`,
          "success"
        );
        resetForm();
      } else {
        showCustomToast("Error", result.message, "error");
      }
    } catch (error) {
      console.error("Error al enviar capacitación:", error);
      showCustomToast(
        "Error",
        "Error inesperado al registrar la capacitación",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitGeneral = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.titulo || formData.titulo.trim() === "") {
        showCustomToast("Error", "El título es obligatorio", "error");
        return;
      }

      if (colaboradoresAsignados.length === 0) {
        showCustomToast(
          "Error",
          "Debe asignar al menos un colaborador",
          "error"
        );
        return;
      }

      const capacitacionGeneralData = {
        titulo: formData.titulo.trim(),
        id_colaborador: colaboradoresAsignados.map((c) => c.id),
      };

      const result = await createCapacitacionGeneral(capacitacionGeneralData);

      if (result && result.success !== false) {
        showCustomToast(
          "Éxito",
          "La capacitación general fue registrada correctamente",
          "success"
        );
        resetForm();
      } else {
        const errorMessage =
          result?.message ||
          "Error desconocido al registrar la capacitación general";
        showCustomToast("Error", errorMessage, "error");
      }
    } catch (error: any) {
      console.error("Error al enviar capacitación general:", error);
      let errorMessage =
        "Error inesperado al registrar la capacitación general";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showCustomToast("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      tipoCapacitacion: "",
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
    setIsGeneralMode(false);
  };

  return {
    showColaboradorModal,
    setShowColaboradorModal,
    showFacilitadorModal,
    setShowFacilitadorModal,
    isEvaluado,
    setIsEvaluado,
    showAsignacionesModal,
    setShowAsignacionesModal,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    facilitadores,
    metodosEvaluacion,
    colaboradoresDisponibles,
    columnsColaboradores,
    procedimientosDisponibles,
    columnsPoes,
    loadingProcedimientos,
    loadProcedimientos,
    showColaboradoresTable,
    setShowColaboradoresTable,
    showPoesTable,
    setShowPoesTable,
    colaboradoresAsignados,
    setColaboradoresAsignados,
    poesAsignados,
    setPoesAsignados,
    selectedColaboradores,
    setSelectedColaboradores,
    selectedPoes,
    setSelectedPoes,
    agregarColaboradores,
    agregarPoes,
    isGeneralMode,
    setIsGeneralMode,
    toggleGeneralMode,
    getFormTitle,
    isLoading,    resetForm,
    loadingFacilitadores,
    loadingInitialData,
    getNombreCompletoFacilitador,
    getFacilitadoresOptions,
    getFacilitadorIdByNombre,
    loadingColaboradores,
    loadColaboradores,
    handleSubmitGeneral,
  };
}
