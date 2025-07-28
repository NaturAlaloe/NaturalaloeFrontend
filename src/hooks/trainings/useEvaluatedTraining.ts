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
  is_evaluado: string;
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
  metodo_empleado?: string | null;
}

export const useEvaluatedTraining = (
  id_capacitacion: string,
  navigate?: (path: string) => void
) => {
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

        const poesMap = new Map<number, POESection>();

        allData.forEach((item) => {
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

          const metodoEvaluacion = item.metodo_empleado?.toLowerCase() || "";
          const esPractico =
            metodoEvaluacion === "práctico" || metodoEvaluacion === "practico";

          const colaborador: Colaborador = {
            id: item.id_colaborador,
            nombre: `${item.nombre} ${item.primer_apellido} ${item.segundo_apellido}`,
            nota: esPractico ? "0" : item.nota ?? "",
            seguimiento: item.seguimiento ? item.seguimiento.toLowerCase() : "",
            comentario: item.comentario ?? "",
            id_capacitacion: item.id_capacitacion,
            id_documento_normativo: poeId,
            is_evaluado: esPractico
              ? item.is_evaluado === 1 ||
                String(item.is_evaluado) === "aprobado"
                ? "aprobado"
                : "reprobado"
              : String(item.is_evaluado ?? "reprobado"),
          };

          poesMap.get(poeId)?.colaboradores.push(colaborador);
        });

        const poesSectionsArray = Array.from(poesMap.values());
        setPoesSections(poesSectionsArray);

        const first = allData[0];
        setTrainingInfo({
          titulo_capacitacion: first.titulo_capacitacion,
          codigo_documento: first.codigo_documento,
          tipo_capacitacion: first.tipo_capacitacion,
          fecha_inicio: first.fecha_inicio,
          fecha_fin: first.fecha_fin,
          estado: first.estado,
          metodo_empleado: first.metodo_empleado,
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
          c.id === id &&
          c.id_capacitacion === idCap &&
          c.id_documento_normativo === idPoe
            ? { ...c, [field]: processedValue }
            : c
        ),
      }))
    );
  };

  const handleGuardarTodos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const todosColaboradores = poesSections.flatMap((poe) => poe.colaboradores);

    if (todosColaboradores.length === 0) {
      showCustomToast("Error", "No hay colaboradores para evaluar.", "error");
      return;
    }

    const metodoEvaluacion = trainingInfo?.metodo_empleado?.toLowerCase() || "";
    const esPractico =
      metodoEvaluacion === "práctico" || metodoEvaluacion === "practico";
    const esTeorico =
      metodoEvaluacion === "teórico" || metodoEvaluacion === "teorico";

    const errores: string[] = [];

    todosColaboradores.forEach((colab) => {
      if (esTeorico) {
        if (!colab.nota || colab.nota.trim() === "") {
          errores.push("Notas incompletas");
        } else {
          const notaNum = Number(colab.nota);
          if (isNaN(notaNum)) {
            errores.push("Notas inválidas");
          } else if (notaNum < 0 || notaNum > 100) {
            errores.push("Notas fuera de rango");
          }
        }
      }

      if (esPractico) {
        if (
          !colab.is_evaluado ||
          (colab.is_evaluado !== "aprobado" &&
            colab.is_evaluado !== "reprobado")
        ) {
          errores.push("Estado de evaluación incompleto");
        }
      }

      if (
        !colab.seguimiento ||
        colab.seguimiento === "" ||
        colab.seguimiento === "Seleccione"
      ) {
        errores.push("Seguimiento incompleto");
      }

      const validSeguimientos = ["satisfactorio", "reprogramar", "revaluacion"];
      if (colab.seguimiento && !validSeguimientos.includes(colab.seguimiento)) {
        errores.push("Seguimiento inválido");
      }
    });

    const erroresUnicos = [...new Set(errores)];

    if (erroresUnicos.length > 0) {
      const mensajeError =
        erroresUnicos.length === 1
          ? erroresUnicos[0]
          : `• ${erroresUnicos.join("\n• ")}`;

      showCustomToast("Campos Incompletos", mensajeError, "error");
      return;
    }

    const calificaciones = todosColaboradores.map((colab) => {
      const item = {
        id_colaborador: colab.id,
        id_documento_normativo: colab.id_documento_normativo,
        seguimiento: colab.seguimiento as
          | "satisfactorio"
          | "reprogramar"
          | "revaluacion",
        nota: esTeorico ? Number(colab.nota) : null,
        comentario_final: colab.comentario?.trim() ?? "",
        is_aprobado: esPractico ? colab.is_evaluado : null,
      };

      return item;
    });

    try {
      const id_capacitacion = todosColaboradores[0].id_capacitacion;
      await submitQualify(id_capacitacion, calificaciones);

      if (navigate) {
        navigate("/training/listTraining");
      }
    } catch (error) {}
  };

  const createColumnsForPOE = (poeId: number) => {
    const metodoEvaluacion = trainingInfo?.metodo_empleado?.toLowerCase() || "";
    const esPractico =
      metodoEvaluacion === "práctico" || metodoEvaluacion === "practico";
    const esTeorico =
      metodoEvaluacion === "teórico" || metodoEvaluacion === "teorico";

    const baseColumns: any[] = [
      {
        name: "Nombre",
        selector: (row: Colaborador) => row.nombre,
        sortable: true,
      },
    ];

    if (esTeorico) {
      baseColumns.push({
        name: "Nota",
        cell: (row: Colaborador) =>
          React.createElement(InputField, {
            type: "number",
            name: `nota-${row.id}-${poeId}`,
            value: row.nota,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(
                row.id,
                row.id_capacitacion,
                poeId,
                "nota",
                e.target.value
              ),
            className: "w-20 text-sm",
            min: 0,
            max: 100,
          }),
      });
    }

    if (esPractico) {
      baseColumns.push({
        name: "Estado",
        cell: (row: Colaborador) => {
          let selectValue = "Reprobado";

          if (row.is_evaluado === "aprobado" || row.is_evaluado === "1") {
            selectValue = "Aprobado";
          }

          return React.createElement(SelectField, {
            name: `is_evaluado-${row.id}-${poeId}`,
            value: selectValue,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange(
                row.id,
                row.id_capacitacion,
                poeId,
                "is_evaluado",
                e.target.value === "Aprobado" ? "aprobado" : "reprobado"
              ),
            options: ["Reprobado", "Aprobado"],
          });
        },
      });
    }

    baseColumns.push({
      name: "Seguimiento",
      cell: (row: Colaborador) => {
        let selectValue = "Seleccione";

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
          options: ["Seleccione", "Satisfactorio", "Reprogramar", "Reevaluación"],
        });
      },
    });

    baseColumns.push({
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
    });

    return baseColumns;
  };

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
