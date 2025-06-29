import { useState } from "react";
import {
  addQualifyTraining,
  type QualifyPayload,
} from "../../services/trainings/addTrainingQualifyService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export const useAddQualifyTraining = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitQualify = async (data: QualifyPayload[]) => {
    setLoading(true);
    setError(null);

    try {
      await addQualifyTraining(data);
      showCustomToast(
        "Calificación enviada",
        "Se guardaron correctamente las calificaciones.",
        "success"
      );
    } catch (err) {
      setError("No se pudo enviar la calificación.");
      showCustomToast("Error", "No se pudo enviar la calificación", "error");
    } finally {
      setLoading(false);
    }
  };

  return { submitQualify, loading, error };
};
