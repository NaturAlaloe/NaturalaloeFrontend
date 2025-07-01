import api from "../../apiConfig/api";

export interface CreateCapacitacionRequest {
  titulo_capacitacion: string;
  id_general: number;
  id_colaborador: number;
  fecha_inicio: string;
  fecha_fin: string;
  id_facilitador: number;
  duracion: number;
  comentario: string;
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
    const response = await api.post(
      "/training/capacitationGenerals",
      capacitacion
    );
    return {
      success: true,
      message: "Capacitación General agendada exitosamente",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error al crear capacitación:", error);

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

  if (!data.titulo_capacitacion) {
    errors.push("El título de la capacitación es obligatorio");
  }

  if (!data.id_general) {
    errors.push("Debe seleccionar una capacitación general");
  }

  if (!data.id_colaborador) {
    errors.push("Debe seleccionar un colaborador");
  }

  if (!data.fecha_inicio) {
    errors.push("La fecha de inicio es obligatoria");
  }

  if (!data.fecha_fin) {
    errors.push("La fecha de fin es obligatoria");
  }

  if (data.fecha_inicio > data.fecha_fin) {
    errors.push("La fecha de inicio no puede ser mayor que la fecha de fin");
  }

  if (data.duracion <= 0) {
    errors.push("La duración debe ser un número positivo");
  }

  return errors;
};
