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
    console.log("🔵 [Service] URL de destino: /training/qualify");
    console.log("🔵 [Service] Método: POST");
    
    const response = await api.post("/training/qualify", data);
    
    console.log("🟢 [Service] Status de respuesta:", response.status);
    console.log("🟢 [Service] Headers de respuesta:", response.headers);
    console.log("🟢 [Service] Respuesta del backend:", response.data);
    
    // Verificar si la respuesta indica éxito
    if (response.data && response.data.success === false) {
      console.error("❌ [Service] El backend reportó fallo:", response.data);
      
      // Mostrar errores específicos si están disponibles
      if (response.data.errors && Array.isArray(response.data.errors)) {
        console.error("📋 [Service] Errores específicos del backend:");
        response.data.errors.forEach((error: any, index: number) => {
          console.error(`  ${index + 1}. Error:`, error);
        });
      }
      
      // Lanzar error con información específica
      const errorMessage = response.data.message || "Error desconocido del backend";
      const errorDetails = response.data.errors ? 
        response.data.errors.map((err: any) => JSON.stringify(err)).join(', ') : 
        "Sin detalles adicionales";
      
      throw new Error(`${errorMessage}. Detalles: ${errorDetails}`);
    }
    
    if (response.status >= 200 && response.status < 300) {
      console.log("✅ [Service] Petición exitosa");
    } else {
      console.warn("⚠️ [Service] Status inesperado:", response.status);
    }
  } catch (error: any) {
    console.error("🔴 [Service] Error al calificar la capacitación:", error);
    
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error("🔴 [Service] Status de error:", error.response.status);
      console.error("🔴 [Service] Headers de error:", error.response.headers);
      console.error("🔴 [Service] Datos de error:", error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error("🔴 [Service] No se recibió respuesta:", error.request);
    } else {
      // Algo pasó al configurar la petición
      console.error("🔴 [Service] Error de configuración:", error.message);
    }
    
    throw error;
  }
};
