import React from "react";
import InputField from "./formComponents/InputField";
import SelectAutocomplete from "./formComponents/SelectAutocomplete";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

interface TrainingFormData {
  fechaInicio: string;
  fechaFin: string;
  facilitador: string;
  metodoEvaluacion: string;
  seguimiento: string;
  duracionHoras: string;
  nota: string;
  estadoAprobacion: string;
  comentario: string;
}

interface Option {
  nombre: string;
  valor: string;
}

interface FacilitadorOption {
  id_facilitador: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  nombre_completo: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <div className="border border-[#2ecc71] rounded-lg p-4 mb-6 bg-white">
    <h3 className="text-lg font-semibold text-green-700 mb-4 border-b border-[#2ecc71] pb-2">
      {title}
    </h3>
    {children}
  </div>
);

interface GeneralInfoSectionProps {
  form: TrainingFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  facilitadoresOptions: FacilitadorOption[];
  setForm: React.Dispatch<React.SetStateAction<TrainingFormData>>;
  filteredSeguimientoOptions: Option[];
  esMetodoTeorico: boolean;
  esMetodoPractico: boolean;
  today: string;
  isEvaluado?: boolean;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  form,
  handleChange,
  facilitadoresOptions,
  setForm,
  filteredSeguimientoOptions,
  today,
}) => (
  <FormSection title="Información General">
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
        onChange={(value: FacilitadorOption | FacilitadorOption[] | null) =>
          setForm((prev: TrainingFormData) => ({
            ...prev,
            facilitador: value && !Array.isArray(value) ? value.nombre_completo : "",
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
          onChange={(value: Option | Option[] | null) =>
            setForm((prev: TrainingFormData) => ({
              ...prev,
              seguimiento: value && !Array.isArray(value) ? value.valor : "",
            }))
          }
          placeholder="Seleccione seguimiento"
        />
      </div>


    </div>
  </FormSection>
);

interface EvaluationSectionProps {
  isEvaluado?: boolean;
  form: TrainingFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  esMetodoTeorico: boolean;
  esMetodoPractico: boolean;
  metodoEvaluacionOptions: Option[];
  estadoAprobacionOptions: Option[];
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  form,
  handleChange,
  esMetodoTeorico,
  esMetodoPractico,
  metodoEvaluacionOptions,
  estadoAprobacionOptions,
}) => {
  // Helper para manejar cambios en método de evaluación
  const handleMetodoChange = (value: Option | Option[] | null) => {
    const metodoValue = value && !Array.isArray(value) ? value.valor : "";
    const event = {
      target: {
        name: "metodoEvaluacion",
        value: metodoValue,
        type: "select"
      }
    } as any;
    handleChange(event);
  };

  // Helper para manejar cambios en estado de aprobación
  const handleEstadoChange = (value: Option | Option[] | null) => {
    const estadoValue = value && !Array.isArray(value) ? value.valor : "";
    const event = {
      target: {
        name: "estadoAprobacion",
        value: estadoValue,
        type: "select"
      }
    } as any;
    handleChange(event);
  };

  return (
    <FormSection title="Información de Evaluación">
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
          onChange={handleMetodoChange}
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
              onChange={handleEstadoChange}
              placeholder="Seleccione estado de aprobación"
            />
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              📝 <strong>Nota importante:</strong> El seguimiento se
              ajustará automáticamente según el estado de aprobación.
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

interface CommentSectionProps {
  form: TrainingFormData;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  form,
  handleChange,
}) => (
  <FormSection title="Comentario (Opcional)">
    <textarea
      id="comentario"
      name="comentario"
      className="w-full border border-[#2ecc71] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#2ecc71] resize-y min-h-[60px] bg-white"
      placeholder="Agrega un comentario sobre la capacitación..."
      value={form.comentario}
      onChange={handleChange}
      rows={2}
    />
  </FormSection>
);
