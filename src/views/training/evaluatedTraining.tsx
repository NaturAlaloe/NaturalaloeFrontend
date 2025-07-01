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
  const { codigo_documento } = useParams();

  const {
    colaboradores,
    trainingInfo,
    loading,
    saving,
    handleGuardarTodos,
    columns,
    customStyles,
  } = useEvaluatedTraining(codigo_documento || "");

  if (loading) return <FullScreenSpinner />;

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
