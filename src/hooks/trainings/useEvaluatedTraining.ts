// src/hooks/capacitations/useEvaluatedTraining.ts
import { useEffect, useState } from "react";
import React from "react";
import {
  getEvaluatedTraining,
  type TrainingItem,
} from "../../services/trainings/getEvaluatedTrainingService";
import { useAddQualifyTraining } from "./useAddCapacitationQualify";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";

export interface Colaborador {
  id: number;
  nombre: string;
  nota: string;
  seguimiento: string;
  comentario: string;
  id_capacitacion: number;
  id_documento_normativo?: number;
}

export interface POESection {
  id_poe: number;
  codigo_poe: string;
  titulo_poe: string;
  colaboradores: Colaborador[];
}

export interface TrainingInfo {
  titulo_capacitacion: string;
  codigo_documento: string;
  tipo_capacitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export const useEvaluatedTraining = (id_capacitacion: string) => {
  const [poesSections, setPoesSections] = useState<POESection[]>([]);
  const [trainingInfo, setTrainingInfo] = useState<TrainingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { submitQualify, loading: saving } = useAddQualifyTraining();

  useEffect(() => {
    if (!id_capacitacion) {
      setPoesSections([]);
      setTrainingInfo(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const allData: TrainingItem[] = await getEvaluatedTraining(
          id_capacitacion
        );

        if (allData.length === 0) {
          setError("No se encontraron datos de la capacitación");
          setPoesSections([]);
          setTrainingInfo(null);
          setLoading(false);
          return;
        }

        // Agrupar colaboradores por POE usando id_documento_normativo
        const poesMap = new Map<number, POESection>();

        allData.forEach((item) => {
          // Usar id_documento_normativo como identificador del POE
          const poeId = item.id_documento_normativo || 0;
          const poeCode = item.codigo_documento || "Sin Código";
          const poeTitle = `POE: ${poeCode}`;
          
          if (!poesMap.has(poeId)) {
            poesMap.set(poeId, {
              id_poe: poeId,
              codigo_poe: poeCode,
              titulo_poe: poeTitle,
              colaboradores: [],
            });
          }

          const colaborador: Colaborador = {
            id: item.id_colaborador,
            nombre: `${item.nombre} ${item.primer_apellido} ${item.segundo_apellido}`,
            nota: item.nota ?? "",
            seguimiento: item.seguimiento ? item.seguimiento.toLowerCase() : "",
            comentario: item.comentario ?? "",
            id_capacitacion: item.id_capacitacion,
            id_documento_normativo: poeId,
          };

          poesMap.get(poeId)?.colaboradores.push(colaborador);
        });

        const poesSectionsArray = Array.from(poesMap.values());
        setPoesSections(poesSectionsArray);

        // Información de la capacitación (se toma del primer item)
        const first = allData[0];
        setTrainingInfo({
          titulo_capacitacion: first.titulo_capacitacion,
          codigo_documento: first.codigo_documento,
          tipo_capacitacion: first.tipo_capacitacion,
          fecha_inicio: first.fecha_inicio,
          fecha_fin: first.fecha_fin,
          estado: first.estado,
        });

        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los datos de la capacitación");
        setPoesSections([]);
        setTrainingInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_capacitacion]);

  const handleChange = (
    id: number,
    idCap: number,
    idPoe: number,
    field: keyof Colaborador,
    value: string
  ) => {
    let processedValue = value;

    if (field === "seguimiento") {
      switch (value) {
        case "Satisfactorio":
          processedValue = "satisfactorio";
          break;
        case "Reprogramar":
          processedValue = "reprogramar";
          break;
        case "Reevaluación":
          processedValue = "revaluacion";
          break;
        default:
          processedValue = "";
      }
    }

    setPoesSections((prev) =>
      prev.map((poeSection) => ({
        ...poeSection,
        colaboradores: poeSection.colaboradores.map((c) =>
          c.id === id && c.id_capacitacion === idCap && c.id_documento_normativo === idPoe
            ? { ...c, [field]: processedValue }
            : c
        ),
      }))
    );
  };

  const handleGuardarTodos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Obtener todos los colaboradores de todas las secciones de POE
    const todosColaboradores = poesSections.flatMap(poe => poe.colaboradores);

    if (todosColaboradores.length === 0) {
      showCustomToast(
        "Error",
        "No hay colaboradores para evaluar.",
        "error"
      );
      return;
    }

    // Validación más estricta de campos
    const errores: string[] = [];

    todosColaboradores.forEach((colab) => {
      const colaboradorInfo = `Colaborador ${colab.nombre}`;

      // Validar anot
      if (!colab.nota || colab.nota.trim() === "") {
        errores.push(`${colaboradorInfo}: La nota es obligatoria.`);
      } else {
        const notaNum = Number(colab.nota);
        if (isNaN(notaNum)) {
          errores.push(`${colaboradorInfo}: La nota debe ser un número válido.`);
        } else if (notaNum < 0 || notaNum > 100) {
          errores.push(`${colaboradorInfo}: La nota debe estar entre 0 y 100.`);
        }
      }

      // Validar seguimiento
      if (!colab.seguimiento || colab.seguimiento === "" || colab.seguimiento === "Seleccionar") {
        errores.push(`${colaboradorInfo}: Debe seleccionar un seguimiento válido.`);
      }

      // Validar que el seguimiento sea válido
      const validSeguimientos = ["satisfactorio", "reprogramar", "revaluacion"];
      if (colab.seguimiento && !validSeguimientos.includes(colab.seguimiento)) {
        errores.push(`${colaboradorInfo}: El seguimiento "${colab.seguimiento}" no es válido.`);
      }
    });

    

    const payload = todosColaboradores.map((colab) => {
      const item = {
        id_capacitacion: colab.id_capacitacion,
        id_colaborador: colab.id,
        id_documento_normativo: colab.id_documento_normativo,
        seguimiento: colab.seguimiento as
          | "satisfactorio"
          | "reprogramar"
          | "revaluacion",
        nota: Number(colab.nota),
        comentario_final: colab.comentario?.trim() ?? "",
      };

      return item;
    });

    try {
      await submitQualify(payload);
    } catch (error) {
      // El error ya se maneja en submitQualify
    }
  };

  const createColumnsForPOE = (poeId: number) => [
    {
      name: "Nombre",
      selector: (row: Colaborador) => row.nombre,
      sortable: true,
    },
    {
      name: "Nota",
      cell: (row: Colaborador) =>
        React.createElement(InputField, {
          type: "number",
          name: `nota-${row.id}-${poeId}`,
          value: row.nota,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(row.id, row.id_capacitacion, poeId, "nota", e.target.value),
          className: "w-20 text-sm",
          min: 0,
          max: 100,
        }),
    },
    {
      name: "Seguimiento",
      cell: (row: Colaborador) => {
        let selectValue = "Seleccionar";

        switch (row.seguimiento.toLowerCase()) {
          case "satisfactorio":
            selectValue = "Satisfactorio";
            break;
          case "reprogramar":
            selectValue = "Reprogramar";
            break;
          case "revaluacion":
          case "reevaluación":
            selectValue = "Reevaluación";
            break;
          default:
            selectValue = "Seleccionar";
        }

        return React.createElement(SelectField, {
          name: `seguimiento-${row.id}-${poeId}`,
          value: selectValue,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange(
              row.id,
              row.id_capacitacion,
              poeId,
              "seguimiento",
              e.target.value
            ),
          options: [
            "Seleccionar",
            "Satisfactorio",
            "Reprogramar",
            "Reevaluación",
          ],
        });
      },
    },
    {
      name: "Comentario",
      cell: (row: Colaborador) =>
        React.createElement("textarea", {
          name: `comentario-${row.id}-${poeId}`,
          value: row.comentario,
          onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange(
              row.id,
              row.id_capacitacion,
              poeId,
              "comentario",
              e.target.value
            ),
          rows: 3,
          className:
            "w-full border border-[#2AAC67] rounded-lg px-2 py-1 text-sm text-[#2AAC67] resize-none",
        }),
    },
  ];

  const customStyles = {
    table: {
      style: {
        border: "1px solid #D1D5DB",
        borderRadius: "0.5rem",
        overflow: "hidden",
      },
    },
    rows: {
      style: {
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "#F0FFF4",
          color: "#2AAC67",
        },
      },
    },
    headRow: {
      style: {
        backgroundColor: "#F0FFF4",
      },
    },
    headCells: {
      style: {
        color: "#2AAC67",
        fontWeight: "normal",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        fontFamily: "inherit",
      },
    },
    cells: {
      style: {
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        fontFamily: "inherit",
        color: "#2AAC67",
      },
    },
  };

  return {
    poesSections,
    trainingInfo,
    loading,
    error,
    saving,
    setPoesSections,
    handleChange,
    handleGuardarTodos,
    createColumnsForPOE,
    customStyles,
  };
};
