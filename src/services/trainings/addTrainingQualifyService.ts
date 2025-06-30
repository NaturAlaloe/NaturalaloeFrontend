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
    console.log("🔵 [Service] Payload recibido para enviar:", data);
    const response = await api.post("/training/qualify", data);
    console.log("🟢 [Service] Respuesta del backend:", response.data);
  } catch (error) {
    console.error("🔴 [Service] Error al calificar la capacitación:", error);
    throw error;
  }
};
