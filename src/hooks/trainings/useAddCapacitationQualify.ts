import { useState } from "react";
import { addQualifyTraining } from "../../services/trainings/addTrainingQualifyService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

interface PayloadItem {
  id_capacitacion: number;
  seguimiento: "satisfactorio" | "reprogramar" | "revaluacion";
  nota: number;
  comentario_final: string;
}

export const useAddQualifyTraining = () => {
  const [loading, setLoading] = useState(false);

  const submitQualify = async (payload: PayloadItem[]) => {
    setLoading(true);
    try {
      console.log("🟡 [Hook] Payload recibido desde vista:", payload);
      console.log("🟡 [Hook] Validando payload...");
      
      // Validar que todos los elementos tienen los campos requeridos
      payload.forEach((item, index) => {
        console.log(`🔍 [Hook] Item ${index}:`, {
          id_capacitacion: item.id_capacitacion,
          seguimiento: item.seguimiento,
          nota: item.nota,
          comentario_final: item.comentario_final
        });
        
        if (!item.id_capacitacion) {
          throw new Error(`Item ${index}: id_capacitacion es requerido`);
        }
        if (!item.seguimiento) {
          throw new Error(`Item ${index}: seguimiento es requerido`);
        }
        if (item.nota === null || item.nota === undefined || isNaN(item.nota)) {
          throw new Error(`Item ${index}: nota debe ser un número válido`);
        }
      });
      
      console.log("✅ [Hook] Payload válido, enviando al servicio...");
      await addQualifyTraining(payload);
      console.log("✅ [Hook] Calificación guardada exitosamente");
      showCustomToast("Calificación guardada con éxito", undefined, "success");
    } catch (error) {
      console.error("🔴 [Hook] Error al guardar calificaciones:", error);
      
      // Mostrar error más específico
      let errorMessage = "Error al guardar";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
      showCustomToast("Error al guardar", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    submitQualify,
    loading,
  };
};
