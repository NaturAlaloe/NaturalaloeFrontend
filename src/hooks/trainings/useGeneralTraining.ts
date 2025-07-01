import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import {
  getFacilitadores,
  type Facilitador,
  getColaboradores,
  type Colaboradores,
} from "../../services/trainings/getTrainingsService";
import {
  getGeneral,
  type Genaral,
} from "../../services/trainings/getTrainigGeneralService";

interface FormData {
  titulo: string;
  facilitador: string;
  fecha: string;
  fechaFin: string;
  duracion: string;
  comentario?: string;
}

export function useGeneralTraining() {
  
  const [showAsignacionesModal, setShowAsignacionesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [loadingFacilitadores, setLoadingFacilitadores] = useState(false);
  const [colaboradoresDisponibles, setColaboradoresDisponibles] = useState<Colaboradores[]>([]);
  const [loadingColaboradores, setLoadingColaboradores] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    facilitador: "",
    fecha: "",
    fechaFin: "",
    duracion: "",
    comentario: "",
  });

  const [showColaboradoresTable, setShowColaboradoresTable] = useState(false);
  const [colaboradoresAsignados, setColaboradoresAsignados] = useState<any[]>([]);

  // Estados para generales
  const [generalesDisponibles, setGeneralesDisponibles] = useState<Genaral[]>([]);
  const [loadingGenerales, setLoadingGenerales] = useState(false);
  const [showGeneralesTable, setShowGeneralesTable] = useState(false);
  const [generalesAsignadas, setGeneralesAsignadas] = useState<any[]>([]);

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

  const columnsGenerales = [
    {
      name: "Código",
      selector: (row: any) => row?.codigo || "Sin código",
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row: any) => row?.descripcion || "Sin descripción",
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
          loadGenerales()
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
      showCustomToast("Error", "No se pudieron cargar los facilitadores", "error");
    } finally {
      setLoadingFacilitadores(false);
    }
  };

  const loadColaboradores = async () => {
    try {
      setLoadingColaboradores(true);
      const data = await getColaboradores();
      const colaboradoresTransformados = data
        .filter(Boolean)
        .map((colab) => ({
          ...colab,
          id: colab.id_colaborador,
          nombreCompleto: colab.nombre_completo.trim(),
          nombre: colab.nombre_completo,
        }));

      const colaboradoresUnicos = colaboradoresTransformados.filter(
        (colab, index, array) => array.findIndex((c) => c.id === colab.id) === index
      );

      setColaboradoresDisponibles(colaboradoresUnicos);
    } catch (error) {
      console.error("Error al cargar colaboradores:", error);
      showCustomToast("Error", "No se pudieron cargar los colaboradores", "error");
      setColaboradoresDisponibles([]);
    } finally {
      setLoadingColaboradores(false);
    }
  };

  const loadGenerales = async () => {
    try {
      setLoadingGenerales(true);
      const data = await getGeneral();
      const generalesTransformadas = data
        .filter(Boolean)
        .map((general) => ({
          ...general,
          id: general.id_general,
        }));

      setGeneralesDisponibles(generalesTransformadas);
    } catch (error) {
      console.error("Error al cargar generales:", error);
      showCustomToast("Error", "No se pudieron cargar las generales", "error");
      setGeneralesDisponibles([]);
    } finally {
      setLoadingGenerales(false);
    }
  };

  const getNombreCompletoFacilitador = (facilitador: Facilitador): string => {
    return `${facilitador.nombre} ${facilitador.apellido1} ${facilitador.apellido2}`.trim();
  };

  const getFacilitadorIdByNombre = (nombreCompleto: string): number | undefined => {
    return facilitadores.find(f => getNombreCompletoFacilitador(f) === nombreCompleto)?.id_facilitador;
  };

  const getFacilitadoresOptions = (): string[] => {
    return facilitadores.map(f => getNombreCompletoFacilitador(f));
  };

  const agregarColaboradores = (seleccionados: any[]) => {
    setColaboradoresAsignados(prev => [
      ...prev,
      ...seleccionados.filter(c => !prev.some(asig => asig.id === c.id))
    ]);
    setShowColaboradoresTable(false);
  };

  const agregarGenerales = (seleccionadas: any[]) => {
    setGeneralesAsignadas(prev => [
      ...prev,
      ...seleccionadas.filter(g => !prev.some(asig => asig.id === g.id))
    ]);
    setShowGeneralesTable(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['titulo', 'facilitador', 'fecha', 'fechaFin', 'duracion'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      showCustomToast("Error", "Todos los campos son obligatorios", "error");
      return false;
    }

    if (colaboradoresAsignados.length === 0) {
      showCustomToast("Error", "Debe asignar al menos un colaborador", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Implementar la lógica de guardado para capacitaciones generales
      // const facilitadorId = getFacilitadorIdByNombre(formData.facilitador);
      // const generalTrainingData = {
      //   id_colaborador: colaboradoresAsignados.map(c => c.id),
      //   id_facilitador: facilitadorId,
      //   titulo_capacitacion: formData.titulo,
      //   fecha_inicio: formData.fecha,
      //   fecha_fin: formData.fechaFin,
      //   comentario: formData.comentario || undefined,
      //   is_evaluado: isEvaluado,
      //   duracion: parseFloat(formData.duracion),
      // };

      // const result = await createGeneralTraining(generalTrainingData);
      // if (result.success) {
      //   showCustomToast("Éxito", "La capacitación general fue registrada correctamente", "success");
      //   resetForm();
      // } else {
      //   showCustomToast("Error", result.message, "error");
      // }

      // Placeholder hasta que implementes el servicio
      await new Promise(resolve => setTimeout(resolve, 1000));
      showCustomToast("Info", "Funcionalidad pendiente de implementar", "info");
      
    } catch (error) {
      console.error("Error al enviar capacitación general:", error);
      showCustomToast("Error", "Error inesperado al registrar la capacitación general", "error");
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
      comentario: "",
    });
    setColaboradoresAsignados([]);
    setGeneralesAsignadas([]);
  };

  return {
    // Estados principales
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

    // Generales
    generalesDisponibles,
    loadingGenerales,
    generalesAsignadas,
    setGeneralesAsignadas,
    showGeneralesTable,
    setShowGeneralesTable,
    columnsGenerales,
    agregarGenerales,
  };
}