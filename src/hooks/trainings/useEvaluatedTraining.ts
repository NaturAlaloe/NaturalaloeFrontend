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
}

export interface TrainingInfo {
  titulo_capacitacion: string;
  codigo_documento: string;
  tipo_capacitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export const useEvaluatedTraining = (codigoDocumento: string) => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [trainingInfo, setTrainingInfo] = useState<TrainingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { submitQualify, loading: saving } = useAddQualifyTraining();

  useEffect(() => {
    if (!codigoDocumento) {
      setColaboradores([]);
      setTrainingInfo(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const allData: TrainingItem[] = await getEvaluatedTraining(
          codigoDocumento
        );

        if (allData.length === 0) {
          setError("No se encontraron datos de la capacitación");
          setColaboradores([]);
          setTrainingInfo(null);
          setLoading(false);
          return;
        }

        const colaboradoresFormateados: Colaborador[] = allData.map((item) => {
          return {
            id: item.id_colaborador,
            nombre: `${item.nombre} ${item.primer_apellido} ${item.segundo_apellido}`,
            nota: item.nota ?? "",
            seguimiento: item.seguimiento ? item.seguimiento.toLowerCase() : "",
            comentario: item.comentario ?? "",
            id_capacitacion: item.id_capacitacion,
          };
        });

        const first = allData[0];
        setTrainingInfo({
          titulo_capacitacion: first.titulo_capacitacion,
          codigo_documento: first.codigo_documento,
          tipo_capacitacion: first.tipo_capacitacion,
          fecha_inicio: first.fecha_inicio,
          fecha_fin: first.fecha_fin,
          estado: first.estado,
        });

        setColaboradores(colaboradoresFormateados);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los datos de la capacitación");
        setColaboradores([]);
        setTrainingInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codigoDocumento]);

  const handleChange = (
    id: number,
    idCap: number,
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
      console.log(
        `🔄 [handleChange] Convertido "${value}" a "${processedValue}"`
      );
    }

    setColaboradores((prev) =>
      prev.map((c) =>
        c.id === id && c.id_capacitacion === idCap
          ? { ...c, [field]: processedValue }
          : c
      )
    );
  };

  const handleGuardarTodos = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const incompletos = colaboradores.some(
      (colab) =>
        colab.nota === "" ||
        colab.nota === null ||
        isNaN(Number(colab.nota)) ||
        !colab.seguimiento ||
        colab.seguimiento === "Seleccionar"
    );

    if (incompletos) {
      showCustomToast(
        "Error",
        "Debe completar la nota y seleccionar un seguimiento válido para todos los colaboradores.",
        "error"
      );
      return;
    }

    const payload = colaboradores.map((colab) => {
      const validSeguimientos = ["satisfactorio", "reprogramar", "revaluacion"];
      if (!validSeguimientos.includes(colab.seguimiento)) {
        throw new Error(
          `Seguimiento inválido para ${colab.nombre}: "${colab.seguimiento}"`
        );
      }

      const item = {
        id_capacitacion: colab.id_capacitacion,
        seguimiento: colab.seguimiento as
          | "satisfactorio"
          | "reprogramar"
          | "revaluacion",
        nota: Number(colab.nota),
        comentario_final: colab.comentario?.trim() ?? "",
      };

      return item;
    });

    submitQualify(payload);
  };

  const columns = [
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
          name: `nota-${row.id}`,
          value: row.nota,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(row.id, row.id_capacitacion, "nota", e.target.value),
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
          name: `seguimiento-${row.id}`,
          value: selectValue,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange(
              row.id,
              row.id_capacitacion,
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
          name: `comentario-${row.id}`,
          value: row.comentario,
          onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange(
              row.id,
              row.id_capacitacion,
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
    colaboradores,
    trainingInfo,
    loading,
    error,
    saving,
    setColaboradores,
    handleChange,
    handleGuardarTodos,
    columns,
    customStyles,
  };
};
