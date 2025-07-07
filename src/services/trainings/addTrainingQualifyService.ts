import api from "../../apiConfig/api";

export interface QualifyPayload {
  id_capacitacion: number;
  id_colaborador: number;
  id_documento_normativo?: number;
  seguimiento: "satisfactorio" | "reprogramar" | "revaluacion";
  nota: number;
  comentario_final: string;
}

export const addQualifyTraining = async (
  data: QualifyPayload[]
): Promise<void> => {
  try {
    const response = await api.post("/training/qualify", data);

    if (response.data && response.data.success === false) {
      const errorMessage =
        response.data.message || "Error desconocido del backend";
      const errorDetails = response.data.errors
        ? response.data.errors.map((err: any) => JSON.stringify(err)).join(", ")
        : "Sin detalles adicionales";

      throw new Error(`${errorMessage}. Detalles: ${errorDetails}`);
    }
  } catch (error: any) {
    throw error;
  }
};
