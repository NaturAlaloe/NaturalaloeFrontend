import { useState } from "react";
import {
  registerIndividualTraining,
  type RegisterIndividualTrainingPayload,
} from "../../services/training/registerIndividualTrainingService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useRegisterIndividualTraining() {
  const [loading, setLoading] = useState(false);

  const register = async (payload: RegisterIndividualTrainingPayload) => {
    setLoading(true);
    try {
      await registerIndividualTraining(payload);
      return true;
    } catch (error: any) {
      console.error("Error al registrar capacitación:", error);

      // Mostrar mensaje de error más específico
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se pudo registrar la capacitación";

      showCustomToast("Error", errorMessage, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}
