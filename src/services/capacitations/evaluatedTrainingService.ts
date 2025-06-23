// src/services/evaluatedTrainingService.ts
import api from '../../apiConfig/api';

export interface TrainingItem {
  id_capacitacion: number;
  fecha_inicio: string;
  fecha_fin: string;
  tipo_capacitacion: string;
  metodo_empleado: string;
  seguimiento: string;
  comentario: string;
  estado: string;
  duracion: string;
  is_evaluado: number;
  is_ultima_cap: number;
  id_colaborador: number;
  nombre_colaborador: string;
  id_documento: number;
  codigo_documento: string;
  descripcion_documento: string;
  id_facilitador: number;
  tipo_facilitador: string;
  nombre_facilitador: string;
  nota: string | null;
}

export const getEvaluatedTraining = async (): Promise<TrainingItem[]> => {
  try {
    const response = await api.get("/training");
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Error en la respuesta de la API");
  } catch (error) {
    console.error("Error al obtener datos de capacitación:", error);
    throw error;
  }
};
