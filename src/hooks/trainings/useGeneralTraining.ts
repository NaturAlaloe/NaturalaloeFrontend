import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import React from "react";
import { Delete } from "@mui/icons-material";
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
import {
  createCapacitacion,
  type CreateCapacitacionRequest,
  validateCapacitacionData,
} from "../../services/trainings/addTrainingGeneralService";

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
  const [colaboradoresDisponibles, setColaboradoresDisponibles] = useState<
    Colaboradores[]
  >([]);
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
  const [colaboradoresAsignados, setColaboradoresAsignados] = useState<any[]>(
    []
  );

  const [generalesDisponibles, setGeneralesDisponibles] = useState<Genaral[]>(
    []
  );
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

  const columnsColaboradoresAsignados = [
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
    {
      name: "Acciones",
      cell: (row: any) =>
        React.createElement(
          "button",
          {
            className:
              "action-button text-red-600 hover:text-red-800 transition-colors",
            onClick: () => eliminarColaborador(row.id),
            title: "Eliminar colaborador",
          },
          React.createElement(Delete, { fontSize: "small" })
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
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

  const columnsGeneralesAsignadas = [
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
    {
      name: "Acciones",
      cell: (row: any) =>
        React.createElement(
          "button",
          {
            className:
              "action-button text-red-600 hover:text-red-800 transition-colors",
            onClick: () => eliminarGeneral(row.id),
            title: "Eliminar general",
          },
          React.createElement(Delete, { fontSize: "small" })
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingInitialData(true);
      try {
        await Promise.all([
          loadFacilitadores(),
          loadColaboradores(),
          loadGenerales(),
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
      showCustomToast(
        "Error",
        "No se pudieron cargar los facilitadores",
        "error"
      );
    } finally {
      setLoadingFacilitadores(false);
    }
  };

  const loadColaboradores = async () => {
    try {
      setLoadingColaboradores(true);
      const data = await getColaboradores();
      const colaboradoresTransformados = data.filter(Boolean).map((colab) => ({
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

  const loadGenerales = async () => {
    try {
      setLoadingGenerales(true);
      const data = await getGeneral();
      const generalesTransformadas = data.filter(Boolean).map((general) => ({
        ...general,
        id: general.id_general,
      }));

      setGeneralesDisponibles(generalesTransformadas);
    } catch (error) {
      showCustomToast("Error", "No se pudieron cargar las generales", "error");
      setGeneralesDisponibles([]);
    } finally {
      setLoadingGenerales(false);
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

  const agregarGenerales = (seleccionadas: any[]) => {
    setGeneralesAsignadas((prev) => [
      ...prev,
      ...seleccionadas.filter((g) => !prev.some((asig) => asig.id === g.id)),
    ]);
    setShowGeneralesTable(false);
  };

  const eliminarColaborador = (colaboradorId: number) => {
    setColaboradoresAsignados((prev) =>
      prev.filter((c) => c.id !== colaboradorId)
    );
  };

  const eliminarGeneral = (generalId: number) => {
    setGeneralesAsignadas((prev) => prev.filter((g) => g.id !== generalId));
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

    if (generalesAsignadas.length === 0) {
      showCustomToast(
        "Error",
        "Debe asignar al menos una capacitación general",
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

      if (!facilitadorId) {
        showCustomToast(
          "Error",
          "No se pudo encontrar el facilitador seleccionado",
          "error"
        );
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const colaborador of colaboradoresAsignados) {
        for (const general of generalesAsignadas) {
          const capacitacionData: CreateCapacitacionRequest = {
            titulo_capacitacion: formData.titulo,
            id_general: general.id,
            id_colaborador: colaborador.id,
            fecha_inicio: formData.fecha,
            fecha_fin: formData.fechaFin,
            id_facilitador: facilitadorId,
            duracion: parseFloat(formData.duracion),
            comentario: formData.comentario || "",
          };

          const validationErrors = validateCapacitacionData(capacitacionData);
          if (validationErrors.length > 0) {
            errors.push(
              `Colaborador ${colaborador.nombreCompleto} - General ${
                general.descripcion
              }: ${validationErrors.join(", ")}`
            );
            errorCount++;
            continue;
          }

          try {
            const result = await createCapacitacion(capacitacionData);
            if (result.success) {
              successCount++;
            } else {
              errors.push(
                `Colaborador ${colaborador.nombreCompleto} - General ${general.descripcion}: ${result.message}`
              );
              errorCount++;
            }
          } catch (error) {
            errors.push(
              `Colaborador ${colaborador.nombreCompleto} - General ${general.descripcion}: Error inesperado`
            );
            errorCount++;
          }
        }
      }

      if (successCount > 0 && errorCount === 0) {
        showCustomToast(
          "Éxito",
          `Se registraron ${successCount} capacitaciones generales correctamente`,
          "success"
        );
        resetForm();
      } else if (successCount > 0 && errorCount > 0) {
        showCustomToast(
          "Información",
          `Se registraron ${successCount} capacitaciones. ${errorCount} fallaron`,
          "info"
        );
      } else {
        showCustomToast(
          "Error",
          `No se pudo registrar ninguna capacitación. ${
            errors[0] || "Error desconocido"
          }`,
          "error"
        );
      }
    } catch (error) {
      showCustomToast(
        "Error",
        "Error inesperado al registrar la capacitación general",
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
      comentario: "",
    });
    setColaboradoresAsignados([]);
    setGeneralesAsignadas([]);
  };

  return {
    showAsignacionesModal,
    setShowAsignacionesModal,
    isLoading,
    loadingInitialData,
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    facilitadores,
    loadingFacilitadores,
    getNombreCompletoFacilitador,
    getFacilitadoresOptions,
    getFacilitadorIdByNombre,
    colaboradoresDisponibles,
    loadingColaboradores,
    colaboradoresAsignados,
    setColaboradoresAsignados,
    showColaboradoresTable,
    setShowColaboradoresTable,
    columnsColaboradores,
    columnsColaboradoresAsignados,
    agregarColaboradores,
    eliminarColaborador,
    generalesDisponibles,
    loadingGenerales,
    generalesAsignadas,
    setGeneralesAsignadas,
    showGeneralesTable,
    setShowGeneralesTable,
    columnsGenerales,
    columnsGeneralesAsignadas,
    agregarGenerales,
    eliminarGeneral,
  };
}
