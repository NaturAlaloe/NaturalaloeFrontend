// src/services/capacitations/addEvaluatedTrainingService.ts
import api from "../../apiConfig/api";

export interface EvaluatedTrainingPayload {
  id_capacitacion: number;
  seguimiento: string;
  nota: number;
  comentario_final: string;
}

export const addEvaluatedTraining = async (
  payload: EvaluatedTrainingPayload | EvaluatedTrainingPayload[]
) => {
  try {
    const response = await api.post("/training/qualify", payload);
    return response.data;
  } catch (error) {
    console.error("Error al calificar capacitación:", error);
    throw error;
  }
};
