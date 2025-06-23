import api from "../../apiConfig/api";

// Interfaces para capacitaciones
export interface CreateCapacitacionRequest {
  id_colaborador: number[]; // Array de IDs de colaboradores
  id_facilitador?: number; // Opcional
  id_documento_normativo: number[]; // Array de IDs de documentos normativos
  titulo_capacitacion: string;
  fecha_inicio: string; // Formato: "YYYY-MM-DD"
  fecha_fin: string; // Formato: "YYYY-MM-DD"
  comentario?: string; // Opcional
  is_evaluado: boolean; // true o false
  metodo_empleado: string; // Ej: "teórico", "práctico", etc.
  duracion: number; // En horas (puede ser decimal como 2.5)
}

export interface CreateCapacitacionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Crear/Agendar nueva capacitación
export const createCapacitacion = async (capacitacion: CreateCapacitacionRequest): Promise<CreateCapacitacionResponse> => {
  try {
    console.log("POST /training", capacitacion);
    const response = await api.post("/training", capacitacion);
    return {
      success: true,
      message: "Capacitación agendada exitosamente",
      data: response.data
    };
  } catch (error: any) {
    console.error("Error al crear capacitación:", error);
    
    const errorMessage = error.response?.data?.message || "Error al agendar la capacitación";
    
    return {
      success: false,
      message: errorMessage,
      data: error.response?.data
    };
  }
};


export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};


export const validateCapacitacionData = (data: CreateCapacitacionRequest): string[] => {
  const errors: string[] = [];

  if (!data.id_colaborador || data.id_colaborador.length === 0) {
    errors.push("Debe seleccionar al menos un colaborador");
  }

  if (!data.id_documento_normativo || data.id_documento_normativo.length === 0) {
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

  if (data.fecha_inicio && data.fecha_fin && data.fecha_inicio > data.fecha_fin) {
    errors.push("La fecha de inicio no puede ser posterior a la fecha de fin");
  }

  if (!data.metodo_empleado || data.metodo_empleado.trim() === "") {
    errors.push("El método empleado es requerido");
  }

  if (!data.duracion || data.duracion <= 0) {
    errors.push("La duración debe ser mayor a 0");
  }

  return errors;
};