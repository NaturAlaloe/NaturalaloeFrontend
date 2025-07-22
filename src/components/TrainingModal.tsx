import React, { useState } from "react";
import InputField from "./formComponents/InputField";
import SelectAutocomplete from "./formComponents/SelectAutocomplete";
import GlobalModal from "./globalComponents/GlobalModal";
import useCollaboratorFacilitator from "../hooks/collaborator/useCollaboratorFacilitator";
import { useTrainingRegister } from "../hooks/trainings/useTrainingRegister";

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
const seguimientoOptions = [
  { nombre: "Satisfactorio", valor: "Satisfactorio" },
  { nombre: "Reprogramar", valor: "Reprogramar" },
  { nombre: "Reevaluación", valor: "Reevaluación" },
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
    estadoAprobacion: initialData?.estadoAprobacion || "",
    comentario: initialData?.comentario || "",
  });

  const { facilitadores } = useCollaboratorFacilitator();

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name === "esEvaluado") {
      setIsEvaluado(!!checked);
      if (!checked) {
        setForm((prev) => ({
          ...prev,
          metodoEvaluacion: "",
          nota: "",
          estadoAprobacion: "",
        }));
      }
    }

    if (name === "metodoEvaluacion") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
        nota: "",
        estadoAprobacion: "",
        seguimiento: "",
      }));
    }
    // Si cambia la nota y es método teórico, verificar si el seguimiento actual sigue siendo válido
    else if (name === "nota" && esMetodoTeorico) {
      const nuevaNota = Number(value);
      setForm((prev) => {
        const newForm = { ...prev, [name]: value };

        const optionsForNewNota =
          nuevaNota >= 80
            ? seguimientoOptions.filter(
                (opt) => opt.valor.toLowerCase() === "satisfactorio"
              )
            : seguimientoOptions.filter(
                (opt) =>
                  opt.valor.toLowerCase() === "reevaluación" ||
                  opt.valor.toLowerCase() === "reprogramar"
              );

        const seguimientoActualValido = optionsForNewNota.some(
          (opt) => opt.valor.toLowerCase() === prev.seguimiento.toLowerCase()
        );

        if (!seguimientoActualValido) {
          newForm.seguimiento = "";
        }

        return newForm;
      });
    }
    // Si cambia el estado de aprobación y es método práctico, verificar si el seguimiento actual sigue siendo válido
    else if (name === "estadoAprobacion" && esMetodoPractico) {
      setForm((prev) => {
        const newForm = { ...prev, [name]: value };

        // Verificar si el seguimiento actual sigue siendo válido con el nuevo estado
        const optionsForNewEstado =
          value.toLowerCase() === "aprobado"
            ? seguimientoOptions.filter(
                (opt) => opt.valor.toLowerCase() === "satisfactorio"
              )
            : seguimientoOptions.filter(
                (opt) =>
                  opt.valor.toLowerCase() === "reevaluación" ||
                  opt.valor.toLowerCase() === "reprogramar"
              );

        const seguimientoActualValido = optionsForNewEstado.some(
          (opt) => opt.valor.toLowerCase() === prev.seguimiento.toLowerCase()
        );

        if (!seguimientoActualValido) {
          newForm.seguimiento = "";
        }

        return newForm;
      });
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(isEvaluado, form);
  };

  const esMetodoTeorico = form.metodoEvaluacion?.toLowerCase() === "teórico";
  const esMetodoPractico = form.metodoEvaluacion?.toLowerCase() === "práctico";
  const today = new Date().toISOString().split("T")[0];

  // Filtrar opciones de seguimiento según el método de evaluación y resultado
  const getFilteredSeguimientoOptions = () => {
    if (isEvaluado && esMetodoTeorico) {
      const nota = Number(form.nota);
      if (!isNaN(nota)) {
        if (nota >= 80) {
          return seguimientoOptions.filter(
            (opt) => opt.valor.toLowerCase() === "satisfactorio"
          );
        } else if (nota < 80) {
          return seguimientoOptions.filter(
            (opt) =>
              opt.valor.toLowerCase() === "reevaluación" ||
              opt.valor.toLowerCase() === "reprogramar"
          );
        }
      }
      return seguimientoOptions;
    }

    if (isEvaluado && esMetodoPractico) {
      if (form.estadoAprobacion) {
        if (form.estadoAprobacion.toLowerCase() === "aprobado") {
          return seguimientoOptions.filter(
            (opt) => opt.valor.toLowerCase() === "satisfactorio"
          );
        } else if (form.estadoAprobacion.toLowerCase() === "reprobado") {
          return seguimientoOptions.filter(
            (opt) =>
              opt.valor.toLowerCase() === "reevaluación" ||
              opt.valor.toLowerCase() === "reprogramar"
          );
        }
      }
      return seguimientoOptions;
    }

    return seguimientoOptions;
  };

  const filteredSeguimientoOptions = getFilteredSeguimientoOptions();

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
          {/* Sección de campos principales */}
          <div className="border border-[#2ecc71] rounded-lg p-4 mb-6 bg-white">
            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b border-[#2ecc71] pb-2">
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Fecha Inicio"
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleChange}
                required
                className="bg-white"
                max={today}
              />
              <InputField
                label="Fecha Fin"
                type="date"
                name="fechaFin"
                value={form.fechaFin}
                onChange={handleChange}
                required
                className="bg-white"
                max={today}
              />
              <InputField
                label="Duración"
                type="number"
                name="duracionHoras"
                value={form.duracionHoras}
                onChange={handleChange}
                required
                className="bg-white"
                min={0}
                placeholder="Ingrese duración en horas"
              />

              <SelectAutocomplete
                label="Facilitador"
                options={facilitadoresOptions}
                optionLabel="nombre_completo"
                optionValue="id_facilitador"
                value={
                  facilitadoresOptions.find(
                    (f) => f.nombre_completo === form.facilitador
                  ) || null
                }
                onChange={(value: any) =>
                  setForm((prev) => ({
                    ...prev,
                    facilitador: value ? value.nombre_completo : "",
                  }))
                }
                placeholder="Selecciona un facilitador"
              />

              <div className="space-y-2">
                <SelectAutocomplete
                  label="Seguimiento"
                  options={filteredSeguimientoOptions}
                  optionLabel="nombre"
                  optionValue="valor"
                  value={
                    filteredSeguimientoOptions.find(
                      (opt) => opt.valor === form.seguimiento
                    ) || null
                  }
                  onChange={(value: any) =>
                    setForm((prev) => ({
                      ...prev,
                      seguimiento: value?.valor || "",
                    }))
                  }
                  placeholder="Seleccione seguimiento"
                />
                {isEvaluado && esMetodoTeorico && form.nota && (
                  <div
                    className={`text-sm p-2 rounded ${
                      Number(form.nota) >= 80
                        ? "text-green-600 bg-green-50"
                        : "text-orange-600 bg-orange-50"
                    }`}
                  >
                    {Number(form.nota) >= 80 ? (
                      <>
                        ✅ <strong>Nota aprobatoria</strong>: Solo
                        seguimiento "Satisfactorio" disponible
                      </>
                    ) : (
                      <>
                        ⚠️ <strong>Nota no aprobatoria</strong>: Solo
                        seguimiento "Reevaluación" y "Reprogramar"
                        disponibles
                      </>
                    )}
                  </div>
                )}
                {isEvaluado &&
                  esMetodoPractico &&
                  form.estadoAprobacion && (
                    <div
                      className={`text-sm p-2 rounded ${
                        form.estadoAprobacion.toLowerCase() === "aprobado"
                          ? "text-green-600 bg-green-50"
                          : "text-orange-600 bg-orange-50"
                      }`}
                    >
                      {form.estadoAprobacion.toLowerCase() ===
                      "aprobado" ? (
                        <>
                          ✅ <strong>Estado aprobado</strong>: Solo
                          seguimiento "Satisfactorio" disponible
                        </>
                      ) : (
                        <>
                          ⚠️ <strong>Estado reprobado</strong>: Solo
                          seguimiento "Reevaluación" y "Reprogramar"
                          disponibles
                        </>
                      )}
                    </div>
                  )}
              </div>

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
            </div>
          </div>

          {/* Sección de evaluación */}
          {isEvaluado && (
            <div className="border border-[#2ecc71] rounded-lg p-4 mb-6 bg-white">
              <h3 className="text-lg font-semibold text-green-700 mb-4 border-b border-[#2ecc71] pb-2">
                Información de Evaluación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectAutocomplete
                  label="Método de evaluación"
                  options={metodoEvaluacionOptions}
                  optionLabel="nombre"
                  optionValue="valor"
                  value={
                    metodoEvaluacionOptions.find(
                      (opt) => opt.valor === form.metodoEvaluacion
                    ) || null
                  }
                  onChange={(value: any) =>
                    setForm((prev) => ({
                      ...prev,
                      metodoEvaluacion: value?.valor || "",
                      nota: "",
                      estadoAprobacion: "",
                    }))
                  }
                  placeholder="Seleccione método"
                />

                {/* Campo de nota solo para método teórico */}
                {esMetodoTeorico && (
                  <div className="space-y-2">
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
                      placeholder="Ingrese nota entre 0 y 100"
                    />
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      📝 <strong>Nota importante:</strong> La nota mínima de
                      aprobación es 80 puntos.
                    </div>
                  </div>
                )}

                {/* Campo de estado aprobación solo para método práctico */}
                {esMetodoPractico && (
                  <div className="space-y-2">
                    <SelectAutocomplete
                      label="Estado de aprobación"
                      options={estadoAprobacionOptions}
                      optionLabel="nombre"
                      optionValue="valor"
                      value={
                        estadoAprobacionOptions.find(
                          (opt) => opt.valor === form.estadoAprobacion
                        ) || null
                      }
                      onChange={(value: any) =>
                        setForm((prev) => ({
                          ...prev,
                          estadoAprobacion: value?.valor || "",
                        }))
                      }
                      placeholder="Seleccione estado de aprobación"
                    />
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      📝 <strong>Nota importante:</strong> El seguimiento se
                      ajustará automáticamente según el estado de aprobación.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campo de comentario - ancho completo */}
          <div className="border border-[#2ecc71] rounded-lg p-4 mb-6 bg-white">
            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b border-[#2ecc71] pb-2">
              Comentario (Opcional)
            </h3>
            <textarea
              id="comentario"
              name="comentario"
              className="w-full border border-[#2ecc71] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#2ecc71] resize-y min-h-[60px] bg-white"
              placeholder="Agrega un comentario sobre la capacitación..."
              value={form.comentario}
              onChange={handleChange}
              rows={2}
            />
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
    </GlobalModal>
  );
}
