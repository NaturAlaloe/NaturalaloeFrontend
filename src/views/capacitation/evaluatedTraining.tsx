import { useParams } from "react-router-dom";
import {
  useEvaluatedTraining,
  type Colaborador,
} from "../../hooks/capacitations/useEvaluatedTraining";
import FormContainer from "../../components/formComponents/FormContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import CustomToaster from "../../components/globalComponents/CustomToaster";

const EvaluatedTraining = () => {
  const { codigo_documento } = useParams();
  const { 
    colaboradores, 
    trainingInfo,
    loading, 
    error, 
    saving,
    setColaboradores,
    saveEvaluations
  } = useEvaluatedTraining(codigo_documento || "");

  const handleChange = (
    id: number,
    field: keyof Colaborador,
    value: string
  ) => {
    setColaboradores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleGuardarTodos = async () => {
    if (colaboradores.length === 0) {
      showCustomToast(
        "No hay colaboradores para calificar",
        "Asegúrese de que esta capacitación tenga colaboradores asignados.",
        "info"
      );
      return;
    }

    // Validar que todas las notas estén llenas
    const colaboradoresSinNota = colaboradores.filter(c => !c.nota || c.nota.trim() === "");
    if (colaboradoresSinNota.length > 0) {
      showCustomToast(
        "Notas incompletas",
        "Por favor, complete todas las notas antes de guardar.",
        "info"
      );
      return;
    }

    // Validar que las notas estén en el rango correcto
    const notasInvalidas = colaboradores.filter(c => {
      const nota = parseFloat(c.nota);
      return isNaN(nota) || nota < 0 || nota > 100;
    });
    
    if (notasInvalidas.length > 0) {
      showCustomToast(
        "Notas inválidas",
        "Las notas deben estar entre 0 y 100.",
        "info"
      );
      return;
    }

    try {
      const success = await saveEvaluations();
      if (success) {
        showCustomToast(
          "Datos guardados con éxito",
          "Las calificaciones han sido almacenadas correctamente.",
          "success"
        );
      } else {
        showCustomToast(
          "Error al guardar",
          "No se pudieron guardar las calificaciones.",
          "error"
        );
      }
    } catch (err) {
      showCustomToast(
        "Error al guardar",
        "No se pudieron guardar las calificaciones.",
        "error"
      );
    }
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
          onChange={(e) => handleChange(row.id, "nota", e.target.value)}
          className="w-20 text-sm"
          min={0}
          max={100}
        />
      ),
    },
    {
      name: "Seguimiento",
      cell: (row: Colaborador) => (
        <SelectField
          name={`seguimiento-${row.id}`}
          value={row.seguimiento}
          onChange={(e) =>
            handleChange(row.id, "seguimiento", e.target.value)
          }
          options={["Satisfactorio", "Reprogramar", "Reevaluación"]}
        />
      ),
    },
    {
      name: "Comentario",
      cell: (row: Colaborador) => (
        <textarea
          name={`comentario-${row.id}`}
          value={row.comentario}
          onChange={(e) =>
            handleChange(row.id, "comentario", e.target.value)
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
  if (loading) return <p className="text-center">Cargando colaboradores...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  const getTitle = () => {
    if (trainingInfo) {
      return `Calificación de Colaboradores - ${trainingInfo.titulo_capacitacion}`;
    }
    return "Calificación de Colaboradores";
  };

  return (
    <>
      <FormContainer title={getTitle()}>
        {trainingInfo && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Información de la Capacitación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-600">Código:</span>{" "}
                <span className="text-green-800">{trainingInfo.codigo_documento}</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Tipo:</span>{" "}
                <span className="text-green-800">{trainingInfo.tipo_capacitacion}</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Fecha Inicio:</span>{" "}
                <span className="text-green-800">{new Date(trainingInfo.fecha_inicio).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Fecha Fin:</span>{" "}
                <span className="text-green-800">{new Date(trainingInfo.fecha_fin).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Estado:</span>{" "}
                <span className="text-green-800">{trainingInfo.estado}</span>
              </div>
            </div>
          </div>
        )}

        <GlobalDataTable
          columns={columns}
          data={colaboradores}
          pagination={true}
          rowsPerPage={10}
          customStyles={customStyles}
        />

        <div className="flex justify-center mt-6">
          <SubmitButton 
            onClick={handleGuardarTodos}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar calificaciones"}
          </SubmitButton>
        </div>
      </FormContainer>

      <CustomToaster />
    </>
  );
};

export default EvaluatedTraining;