import { useState, type ChangeEvent, type FormEvent } from "react";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { 
  createCapacitacion, 
  validateCapacitacionData,
  type CreateCapacitacionRequest 
} from "../../services/capacitations/addCapacitationsService";

// Datos quemados de ejemplo
const facilitadores = [
  { nombre: "Juan Pérez" },
  { nombre: "Ana Gómez" },
  { nombre: "Luis Martínez" },
  { nombre: "Marta Díaz" },
];

const tiposCapacitacion = [
  { value: "", label: "Seleccione...", disabled: true },
  { value: "Interna", label: "Interna" },
  { value: "Externa", label: "Externa" },
];

const metodosEvaluacion = [
  { value: "", label: "Seleccione...", disabled: true },
  { value: "Teórico", label: "Teórico" },
  { value: "Práctico", label: "Práctico" },
];

const colaboradoresDisponibles = [
  { id: 1, nombre: "Juan Pérez", puesto: "Operador" },
  { id: 2, nombre: "Ana Gómez", puesto: "Supervisor" },
  { id: 3, nombre: "Luis Martínez", puesto: "Analista" },
];

const poesDisponibles = [
  { id: 1, codigo: "700-30-0001", titulo: "POE Ventas" },
  { id: 2, codigo: "900-30-0001", titulo: "POE Calidad" },
];

const columnsColaboradores = [
  { name: "Nombre", selector: (row: any) => row.nombre, sortable: true },
  { name: "Puesto", selector: (row: any) => row.puesto, sortable: true },
];

const columnsPoes = [
  { name: "Código", selector: (row: any) => row.codigo, sortable: true },
  { name: "Título", selector: (row: any) => row.titulo, sortable: true },
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

  // Estado para tablas de selección en el modal
  const [showColaboradoresTable, setShowColaboradoresTable] = useState(false);
  const [showPoesTable, setShowPoesTable] = useState(false);
  const [colaboradoresAsignados, setColaboradoresAsignados] = useState<any[]>(
    []
  );
  const [poesAsignados, setPoesAsignados] = useState<any[]>([]);
  const [selectedColaboradores, setSelectedColaboradores] = useState<any[]>([]);
  const [selectedPoes, setSelectedPoes] = useState<any[]>([]);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      // Validaciones básicas del formulario
      if (isGeneralMode) {
        // En modo General, solo se requiere el título
        if (!formData.titulo) {
          showCustomToast("Error", "El título es obligatorio", "error");
          return;
        }
      } else {
        // En modo normal, todos los campos son obligatorios
        if (
          !formData.titulo ||
          !formData.facilitador ||
          !formData.fecha ||
          !formData.fechaFin ||
          !formData.duracion
        ) {
          showCustomToast("Error", "Todos los campos son obligatorios", "error");
          return;
        }
      }

      // Validar que hay colaboradores y POEs asignados
      if (colaboradoresAsignados.length === 0) {
        showCustomToast("Error", "Debe asignar al menos un colaborador", "error");
        return;
      }

      if (poesAsignados.length === 0) {
        showCustomToast("Error", "Debe asignar al menos un documento normativo (POE)", "error");
        return;
      }

      // Preparar datos para el API
      const capacitacionData: CreateCapacitacionRequest = {
        id_colaborador: colaboradoresAsignados.map(c => c.id),
        id_facilitador: formData.facilitador ? parseInt(formData.facilitador) : undefined,
        id_documento_normativo: poesAsignados.map(p => p.id),
        titulo_capacitacion: formData.titulo,
        fecha_inicio: formData.fecha,
        fecha_fin: formData.fechaFin,
        comentario: formData.comentario || undefined,
        is_evaluado: isEvaluado,
        metodo_empleado: formData.metodoEvaluacion,
        duracion: parseFloat(formData.duracion)
      };

      // Validar datos antes de enviar
      const validationErrors = validateCapacitacionData(capacitacionData);
      if (validationErrors.length > 0) {
        showCustomToast("Error de validación", validationErrors[0], "error");
        return;
      }

      // Enviar a la API
      const result = await createCapacitacion(capacitacionData);

      if (result.success) {
        const modeText = isGeneralMode ? "general" : "completa";
        showCustomToast(
          "Éxito",
          `La capacitación ${modeText} fue registrada correctamente`,
          "success"
        );

        // Limpiar formulario después del éxito
        resetForm();
      } else {
        showCustomToast("Error", result.message, "error");
      }

    } catch (error) {
      console.error("Error al enviar capacitación:", error);
      showCustomToast("Error", "Error inesperado al registrar la capacitación", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar el formulario
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
  };  return {
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
    tiposCapacitacion,
    metodosEvaluacion,
    colaboradoresDisponibles,
    poesDisponibles,
    columnsColaboradores,
    columnsPoes,
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
    isLoading,
    resetForm,
  };
}
