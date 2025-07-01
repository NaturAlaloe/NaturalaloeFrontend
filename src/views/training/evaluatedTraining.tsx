import React from "react";
import {
  useEvaluatedTraining,
  type Colaborador,
} from "../../hooks/trainings/useEvaluatedTraining";
import FormContainer from "../../components/formComponents/FormContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import CustomToaster, { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { useAddQualifyTraining } from "../../hooks/trainings/useAddCapacitationQualify";
import { useParams } from "react-router-dom";

const Evaluacion = () => {
  const { codigo_documento } = useParams();

  const {
    colaboradores,
    trainingInfo,
    loading,
    error,
    setColaboradores,
  } = useEvaluatedTraining(codigo_documento || "");

  const { submitQualify, loading: saving } = useAddQualifyTraining();

  const handleChange = (
    id: number,
    idCap: number,
    field: keyof Colaborador,
    value: string
  ) => {
    let processedValue = value;
    
    // Si es el campo seguimiento, convertir el valor del select al formato de la BD
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
      console.log(`🔄 [handleChange] Convertido "${value}" a "${processedValue}"`);
    }
    
    setColaboradores((prev) =>
      prev.map((c) =>
        c.id === id && c.id_capacitacion === idCap ? { ...c, [field]: processedValue } : c
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
      console.log(`🔍 [DEBUG] Colaborador: ${colab.nombre}, Seguimiento: "${colab.seguimiento}", Nota: ${colab.nota}`);
      
      // Validar que el seguimiento es válido
      const validSeguimientos = ["satisfactorio", "reprogramar", "revaluacion"];
      if (!validSeguimientos.includes(colab.seguimiento)) {
        console.error(`❌ [DEBUG] Seguimiento inválido para ${colab.nombre}: "${colab.seguimiento}"`);
        throw new Error(`Seguimiento inválido para ${colab.nombre}: "${colab.seguimiento}"`);
      }

      const item = {
        id_capacitacion: colab.id_capacitacion,
        seguimiento: colab.seguimiento as "satisfactorio" | "reprogramar" | "revaluacion",
        nota: Number(colab.nota),
        comentario_final: colab.comentario?.trim() ?? "",
      };
      
      console.log(`✅ [DEBUG] Item procesado:`, item);
      return item;
    });

    console.log(`🚀 [DEBUG] Payload completo a enviar:`, payload);
    
    // Agregar este log adicional para verificar la estructura exacta
    console.log(`📝 [DEBUG] Payload JSON:`, JSON.stringify(payload, null, 2));
    
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
      cell: (row: Colaborador) => (
        <InputField
          type="number"
          name={`nota-${row.id}`}
          value={row.nota}
          onChange={(e) =>
            handleChange(row.id, row.id_capacitacion, "nota", e.target.value)
          }
          className="w-20 text-sm"
          min={0}
          max={100}
        />
      ),
    },
    {
      name: "Seguimiento",
      cell: (row: Colaborador) => {
        // Mapear el valor de la base de datos al valor del select
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
        
        console.log(`🔍 [SelectField] Colaborador: ${row.nombre}, valor BD: "${row.seguimiento}", valor select: "${selectValue}"`);
        
        return (
          <SelectField
            name={`seguimiento-${row.id}`}
            value={selectValue}
            onChange={(e) =>
              handleChange(
                row.id,
                row.id_capacitacion,
                "seguimiento",
                e.target.value
              )
            }
            options={["Seleccionar", "Satisfactorio", "Reprogramar", "Reevaluación"]}
          />
        );
      }
    },
    {
      name: "Comentario",
      cell: (row: Colaborador) => (
        <textarea
          name={`comentario-${row.id}`}
          value={row.comentario}
          onChange={(e) =>
            handleChange(
              row.id,
              row.id_capacitacion,
              "comentario",
              e.target.value
            )
          }
          rows={3}
          className="w-full border border-[#2AAC67] rounded-lg px-2 py-1 text-sm text-[#2AAC67] resize-none"
        />
      ),
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

  if (loading)
    return <p className="text-center">Cargando colaboradores...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <FormContainer title="Calificación de Colaboradores" onSubmit={handleGuardarTodos}>
        {trainingInfo && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Información de la Capacitación
            </h3>
            <div className="text-sm text-green-800 space-y-2">
              <div>
                <span className="font-medium text-green-600">Código:</span>{" "}
                {trainingInfo.codigo_documento}
              </div>
              <div>
                <span className="font-medium text-green-600">Tipo:</span>{" "}
                {trainingInfo.tipo_capacitacion}
              </div>
              <div>
                <span className="font-medium text-green-600">Estado:</span>{" "}
                {trainingInfo.estado}
              </div>
            </div>
          </div>
        )}

        <GlobalDataTable
          columns={columns}
          data={colaboradores}
          pagination
          rowsPerPage={10}
          customStyles={customStyles}
        />

        <div className="flex justify-center mt-6">
          <SubmitButton disabled={saving} type="submit">
            {saving ? "Guardando..." : "Guardar calificaciones"}
          </SubmitButton>
        </div>
      </FormContainer>
      <CustomToaster />
    </>
  );
};

export default Evaluacion;
