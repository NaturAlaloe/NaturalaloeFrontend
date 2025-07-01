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
      payload.forEach((item, index) => {
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

      await addQualifyTraining(payload);

      showCustomToast("Calificación guardada con éxito", undefined, "success");
    } catch (error) {
      let errorMessage = "Error al guardar";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
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
