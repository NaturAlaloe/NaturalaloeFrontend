import api from "../../apiConfig/api";

export interface CapacitationQualify {
  id_capacitacion: number;
  seguimiento: string;
  nota: number;
  comentario_final: string;
}

export async function addCapacitationQualifyService(
  data: CapacitationQualify
): Promise<boolean> {
  try {
    console.log("addCapacitationQualifyService: enviando datos:", data);
    const response = await api.post("/training/qualify", data);

    console.log(
      "addCapacitationQualifyService: respuesta de la API:",
      response.data
    );
    return response.data.success || false;
  } catch (error) {
    console.error("Error al agregar calificación de capacitación:", error);
    throw error;
  }
}
