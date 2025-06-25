// src/hooks/capacitations/useAddEvaluatedTraining.ts
import { useState } from "react";
import {
  addEvaluatedTraining,
  type EvaluatedTrainingPayload,
} from "../../services/capacitations/addEvaluatedTrainingService";

export const useAddEvaluatedTraining = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEvaluatedTraining = async (
    data: EvaluatedTrainingPayload[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      await addEvaluatedTraining(data);
      return true;
    } catch (err) {
      setError("No se pudo guardar la calificación.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitEvaluatedTraining, loading, error };
};
