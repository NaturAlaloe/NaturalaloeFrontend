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
      showCustomToast(
        "Éxito",
        "Capacitación registrada correctamente",
        "success"
      );
      return true;
    } catch (error) {
      showCustomToast("Error", "No se pudo registrar la capacitación", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}
