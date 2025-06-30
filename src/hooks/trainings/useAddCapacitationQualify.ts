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
      await addQualifyTraining(payload);
      showCustomToast("Calificación guardada con éxito", undefined, "success");
    } catch (error) {
      console.error("🔴 [Hook] Error al guardar calificaciones:", error);
      showCustomToast("Error al guardar", "Intente nuevamente", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    submitQualify,
    loading,
  };
};
