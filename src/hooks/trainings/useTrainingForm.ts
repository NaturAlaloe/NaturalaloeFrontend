import { useState } from "react";

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

interface UseTrainingFormProps {
  initialData?: Partial<TrainingFormData & { esEvaluado: boolean }>;
}

interface SeguimientoOption {
  nombre: string;
  valor: string;
}

const seguimientoOptions: SeguimientoOption[] = [
  { nombre: "Satisfactorio", valor: "Satisfactorio" },
  { nombre: "Reprogramar", valor: "Reprogramar" },
  { nombre: "Reevaluación", valor: "Reevaluación" },
];

export const useTrainingForm = ({ initialData }: UseTrainingFormProps) => {
  const [isEvaluado, setIsEvaluado] = useState(
    initialData?.esEvaluado || false
  );
  
  const [form, setForm] = useState<TrainingFormData>({
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

  const esMetodoTeorico = form.metodoEvaluacion?.toLowerCase() === "teórico";
  const esMetodoPractico = form.metodoEvaluacion?.toLowerCase() === "práctico";
  const today = new Date().toISOString().split("T")[0];

  // Filtrar opciones de seguimiento según el método de evaluación y resultado
  const getFilteredSeguimientoOptions = (): SeguimientoOption[] => {
    // Solo filtrar si se ha evaluado Y se han ingresado los datos específicos del método
    if (isEvaluado && esMetodoTeorico && form.nota) {
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
    }

    if (isEvaluado && esMetodoPractico && form.estadoAprobacion) {
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

    // Si no se cumple ninguna condición específica, mostrar todas las opciones
    return seguimientoOptions;
  };

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
        setForm((prev: TrainingFormData) => ({
          ...prev,
          metodoEvaluacion: "",
          nota: "",
          estadoAprobacion: "",
        }));
      }
    }

    if (name === "metodoEvaluacion") {
      setForm((prev: TrainingFormData) => ({
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
      setForm((prev: TrainingFormData) => {
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
      setForm((prev: TrainingFormData) => {
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
      setForm((prev: TrainingFormData) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const updateForm = (updates: Partial<TrainingFormData>) => {
    setForm((prev: TrainingFormData) => ({ ...prev, ...updates }));
  };

  const filteredSeguimientoOptions = getFilteredSeguimientoOptions();

  return {
    // Estado
    isEvaluado,
    form,
    esMetodoTeorico,
    esMetodoPractico,
    today,
    filteredSeguimientoOptions,
    
    // Funciones
    setIsEvaluado,
    setForm,
    handleChange,
    updateForm,
  };
};
