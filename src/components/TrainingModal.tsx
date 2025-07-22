import React from "react";
import GlobalModal from "./globalComponents/GlobalModal";
import useCollaboratorFacilitator from "../hooks/collaborator/useCollaboratorFacilitator";
import { useTrainingRegister } from "../hooks/trainings/useTrainingRegister";
import { useTrainingForm } from "../hooks/trainings/useTrainingForm";
import {
  GeneralInfoSection,
  EvaluationSection,
  CommentSection,
} from "./training/TrainingFormSections";

interface TrainingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

const metodoEvaluacionOptions = [
  { nombre: "Teórico", valor: "Teórico" },
  { nombre: "Práctico", valor: "Práctico" },
];

const estadoAprobacionOptions = [
  { nombre: "Aprobado", valor: "Aprobado" },
  { nombre: "Reprobado", valor: "Reprobado" },
];

export default function TrainingModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: TrainingModalProps) {
  const { facilitadores } = useCollaboratorFacilitator();
  
  const {
    isEvaluado,
    form,
    esMetodoTeorico,
    esMetodoPractico,
    today,
    filteredSeguimientoOptions,
    handleChange,
    setForm,
  } = useTrainingForm({ initialData });

  // Crear opciones para el SelectAutocomplete con nombre completo
  const facilitadoresOptions = facilitadores.map((f) => ({
    ...f,
    nombre_completo: `${f.nombre} ${f.apellido1} ${f.apellido2}`.trim(),
  }));

  const { errorMsg, loading, handleRegister } = useTrainingRegister({
    facilitadores,
    isEvaluado,
    form,
    initialData,
    onClose,
    onSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(isEvaluado, form);
  };

  return (
    <GlobalModal
      open={open}
      onClose={onClose}
      title="Registro de Capacitación"
      maxWidth="md"
      backgroundColor="#f8fefb"
    >
      <div className="p-4">
        {errorMsg && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <GeneralInfoSection
            form={form}
            handleChange={handleChange}
            facilitadoresOptions={facilitadoresOptions}
            setForm={setForm}
            filteredSeguimientoOptions={filteredSeguimientoOptions}
            isEvaluado={isEvaluado}
            esMetodoTeorico={esMetodoTeorico}
            esMetodoPractico={esMetodoPractico}
            today={today}
          />

          <EvaluationSection
            isEvaluado={isEvaluado}
            form={form}
            handleChange={handleChange}
            esMetodoTeorico={esMetodoTeorico}
            esMetodoPractico={esMetodoPractico}
            metodoEvaluacionOptions={metodoEvaluacionOptions}
            estadoAprobacionOptions={estadoAprobacionOptions}
          />

          <CommentSection form={form} handleChange={handleChange} />

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#2ecc71] text-white font-bold rounded-full px-12 py-3 text-lg shadow-md hover:bg-[#27ae60] transition"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </GlobalModal>
  );
}
