// src/services/capacitations/addCapacitationQualifyService.ts
import api from "../../apiConfig/api";

export interface QualifyPayload {
  id_capacitacion: number;
  seguimiento: "satisfactorio" | "reprogramar" | "revaluacion";
  nota: number;
  comentario_final: string;
}

export const addQualifyTraining = async (
  data: QualifyPayload[]
): Promise<void> => {
  try {
    await api.post("/training/qualify", data);
  } catch (error) {
    console.error("Error al calificar la capacitación:", error);
    throw error;
  }
};
