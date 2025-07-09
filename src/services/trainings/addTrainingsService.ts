import api from "../../apiConfig/api";

export interface CreateCapacitacionRequest {
  id_colaborador: number[];
  id_facilitador?: number;
  id_documento_normativo: number[];
  titulo_capacitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  comentario?: string;
  is_evaluado: boolean;
  metodo_empleado?: string;
  duracion: number;
}

export interface CreateCapacitacionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const createCapacitacion = async (
  capacitacion: CreateCapacitacionRequest
): Promise<CreateCapacitacionResponse> => {
  try {
    console.log("POST /training", capacitacion);
    const response = await api.post("/training", capacitacion);
    return {
      success: true,
      message: "Capacitación agendada exitosamente",
      data: response.data,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Error al agendar la capacitación";

    return {
      success: false,
      message: errorMessage,
      data: error.response?.data,
    };
  }
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const validateCapacitacionData = (
  data: CreateCapacitacionRequest
): string[] => {
  const errors: string[] = [];

  if (!data.id_colaborador || data.id_colaborador.length === 0) {
    errors.push("Debe seleccionar al menos un colaborador");
  }

  if (
    !data.id_documento_normativo ||
    data.id_documento_normativo.length === 0
  ) {
    errors.push("Debe seleccionar al menos un documento normativo");
  }

  if (!data.titulo_capacitacion || data.titulo_capacitacion.trim() === "") {
    errors.push("El título de la capacitación es requerido");
  }

  if (!data.fecha_inicio) {
    errors.push("La fecha de inicio es requerida");
  }

  if (!data.fecha_fin) {
    errors.push("La fecha de fin es requerida");
  }

  if (
    data.fecha_inicio &&
    data.fecha_fin &&
    data.fecha_inicio > data.fecha_fin
  ) {
    errors.push("La fecha de inicio no puede ser posterior a la fecha de fin");
  }

  if (
    data.is_evaluado &&
    (!data.metodo_empleado ||
      data.metodo_empleado.trim() === "" ||
      data.metodo_empleado === "Seleccione...")
  ) {
    errors.push(
      "El método empleado es requerido cuando la capacitación es evaluada"
    );
  }

  if (!data.duracion || data.duracion <= 0) {
    errors.push("La duración debe ser mayor a 0");
  }

  return errors;
};
