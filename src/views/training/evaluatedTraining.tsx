import {
  useEvaluatedTraining,
} from "../../hooks/trainings/useEvaluatedTraining";
import FormContainer from "../../components/formComponents/FormContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import SubmitButton from "../../components/formComponents/SubmitButton";
import CustomToaster from "../../components/globalComponents/CustomToaster";
import { useParams } from "react-router-dom";
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';

const Evaluacion = () => {
  const { id_capacitacion } = useParams();

  const {
    poesSections,
    trainingInfo,
    loading,
    saving,
    handleGuardarTodos,
    createColumnsForPOE,
    customStyles,
  } = useEvaluatedTraining(id_capacitacion || "");

  if (loading) return <FullScreenSpinner />;

  return (
    <>
      <FormContainer title="Calificación de Colaboradores" onSubmit={handleGuardarTodos}>
        {/* Información del método de evaluación */}
        {trainingInfo && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-blue-800">
                {trainingInfo.titulo_capacitacion}
              </h3>
            </div>
            <div className="text-sm text-blue-700">
              <span className="font-medium">Método de evaluación: </span>
              <span className="capitalize font-semibold">
                {trainingInfo.metodo_empleado || "No especificado"}
              </span>
            </div>
            {trainingInfo.metodo_empleado && (
              <div className="mt-2 text-xs text-blue-600">
                {trainingInfo.metodo_empleado.toLowerCase() === "teórico" || trainingInfo.metodo_empleado.toLowerCase() === "teorico" ? (
                  "📝 Evaluación teórica: Ingrese la nota numérica (0-100). Se requiere nota ≥80 para aprobar."
                ) : trainingInfo.metodo_empleado.toLowerCase() === "práctico" || trainingInfo.metodo_empleado.toLowerCase() === "practico" ? (
                  "✅ Evaluación práctica: Seleccione Aprobado o Reprobado según el desempeño."
                ) : (
                  "ℹ️ Método de evaluación no reconocido. Se mostrarán ambas opciones."
                )}
              </div>
            )}
          </div>
        )}

        {/* Secciones por POE */}
        <div className="space-y-6">
          {poesSections.map((poeSection) => (
            <div key={poeSection.id_poe} className="border border-[#2AAC67] rounded-lg overflow-hidden">
              {/* Header del POE */}
              <div className="bg-[#2AAC67] text-white p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-semibold">
                    {poeSection.codigo_poe}
                  </h3>
                  <span className="text-sm mt-1 md:mt-0">
                    {poeSection.titulo_poe}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  Colaboradores asignados: {poeSection.colaboradores.length}
                </div>
              </div>

              {/* Tabla de colaboradores */}
              <div className="bg-white">
                <GlobalDataTable
                  columns={createColumnsForPOE(poeSection.id_poe)}
                  data={poeSection.colaboradores}
                  customStyles={customStyles}
                  pagination={false}
                  dense={true}
                  noDataComponent={
                    <div className="px-6 py-8 text-center text-gray-500">
                      No hay colaboradores asignados a este POE
                    </div>
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay POEs */}
        {poesSections.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              No hay POEs ni colaboradores para evaluar en esta capacitación.
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Debug Info:</div>
              <div>ID Capacitación: {id_capacitacion}</div>
              <div>POEs encontrados: {poesSections.length}</div>
              <div>Estado de carga: {loading.toString()}</div>
            </div>
            {trainingInfo && (
              <div className="text-xs text-blue-500 mt-2">
                Capacitación encontrada: {trainingInfo.titulo_capacitacion}
              </div>
            )}
            <div className="text-xs text-orange-500 mt-2">
              💡 Revisa la consola del navegador para más detalles
            </div>
          </div>
        )}

        {/* Botón de guardar */}
        {poesSections.length > 0 && (
          <div className="flex justify-center mt-6">
            <SubmitButton disabled={saving} type="submit">
              {saving ? "Guardando..." : "Guardar calificaciones"}
            </SubmitButton>
          </div>
        )}
      </FormContainer>
      <CustomToaster />
    </>
  );
};

export default Evaluacion;
