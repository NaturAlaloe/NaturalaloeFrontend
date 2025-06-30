import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InputField from "./formComponents/InputField";
import SelectField from "./formComponents/SelectField";
import AutocompleteField from "./formComponents/AutocompleteField";
import useCollaboratorFacilitator from "../hooks/collaborator/useCollaboratorFacilitator";
import { useTrainingRegister } from "../hooks/training/useTrainingRegister";

interface TrainingModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

const metodoEvaluacionOptions = ["Teórico", "Práctico"];
const seguimientoOptions = ["Satisfactorio", "Reprogramar", "Reevaluación"];

export default function TrainingModal({
  open,
  onClose,
  initialData,
}: TrainingModalProps) {
  const [isEvaluado, setIsEvaluado] = useState(
    initialData?.esEvaluado || false
  );
  const [form, setForm] = useState({
    fechaInicio: initialData?.fechaInicio || "",
    fechaFin: initialData?.fechaFin || "",
    facilitador: initialData?.facilitador || "",
    metodoEvaluacion: initialData?.metodoEvaluacion || "",
    seguimiento: initialData?.seguimiento || "",
    duracionHoras: initialData?.duracionHoras || "",
    nota: initialData?.nota || "",
  });

  const { facilitadores, nombres: facilitadoresList } =
    useCollaboratorFacilitator();

  const { errorMsg, loading, handleRegister } =
    useTrainingRegister({
      facilitadores,
      isEvaluado,
      form,
      initialData,
      onClose,
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    if (name === "esEvaluado") {
      setIsEvaluado(!!checked);
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(isEvaluado, form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 24,
          p: 3,
          minWidth: 500,
          width: "90%",
          maxWidth: 900,
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div
            className="w-full"
            style={{
              border: "2px solid #2ecc71",
              borderRadius: "1rem",
              padding: "2rem 1.5rem",
              background: "#f8fefb",
              boxShadow: "0 2px 10px rgba(42,172,103,0.08)",
            }}
          >
            <div className="flex items-center justify-center mb-8 gap-3">
              <AssignmentIcon sx={{ color: "#2ecc71", fontSize: 36 }} />
              <h2 className="text-[#2ecc71] font-bold text-2xl m-0">
                Registro de Capacitación
              </h2>
            </div>
            {errorMsg && (
              <div className="mb-4 text-red-600 text-center font-semibold">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <InputField
                  label="Fecha Inicio"
                  type="date"
                  name="fechaInicio"
                  value={form.fechaInicio}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
                <InputField
                  label="Fecha Fin"
                  type="date"
                  name="fechaFin"
                  value={form.fechaFin}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
                <InputField
                  label="Duración (Horas)"
                  type="number"
                  name="duracionHoras"
                  value={form.duracionHoras}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  min={0}
                />
                {/* Campo facilitador con AutocompleteField */}
                <AutocompleteField
                  label="Facilitador"
                  name="facilitador"
                  value={form.facilitador}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      facilitador: value,
                    }))
                  }
                  options={facilitadoresList}
                  required
                  className="bg-white"
                  placeholder="Selecciona un facilitador"
                />
                <SelectField
                  label="Seguimiento"
                  name="seguimiento"
                  value={form.seguimiento}
                  onChange={handleChange}
                  options={seguimientoOptions}
                  className="bg-white min-h-[50px]"
                  required
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="esEvaluado"
                    name="esEvaluado"
                    checked={isEvaluado}
                    onChange={handleChange}
                    className="accent-[#2ecc71] mr-2 w-5 h-5"
                  />
                  <label
                    htmlFor="esEvaluado"
                    className="font-semibold text-[#2ecc71]"
                  >
                    Es Evaluado
                  </label>
                </div>
                {isEvaluado && (
                  <>
                    <SelectField
                      label="Método de evaluación"
                      name="metodoEvaluacion"
                      value={form.metodoEvaluacion}
                      onChange={handleChange}
                      options={metodoEvaluacionOptions}
                      className="bg-white min-h-[50px]"
                      required
                    />
                    <InputField
                      label="Nota de la capacitación"
                      type="number"
                      name="nota"
                      value={form.nota}
                      onChange={handleChange}
                      min={0}
                      max={100}
                      className="bg-white"
                      required
                    />
                  </>
                )}
              </div>
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
        </div>
      </Box>
    </Modal>
  );
}
