import { useState } from "react";
import { addQualifyTraining } from "../../services/trainings/addTrainingQualifyService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

interface PayloadItem {
  id_capacitacion: number;
  id_colaborador: number;
  id_documento_normativo?: number;
  seguimiento: "satisfactorio" | "reprogramar" | "revaluacion";
  nota: number;
  comentario_final: string;
}

export const useAddQualifyTraining = () => {
  const [loading, setLoading] = useState(false);

  const submitQualify = async (payload: PayloadItem[]) => {
    setLoading(true);
    try {
      // Validación más exhaustiva del payload
      if (!payload || payload.length === 0) {
        throw new Error("No hay datos para guardar");
      }

      const errores: string[] = [];

      payload.forEach((item, index) => {
        const itemInfo = `Item ${index + 1}`;

        // Validar id_capacitacion
        if (!item.id_capacitacion || item.id_capacitacion <= 0) {
          errores.push(`${itemInfo}: ID de capacitación inválido`);
        }

        // Validar id_colaborador
        if (!item.id_colaborador || item.id_colaborador <= 0) {
          errores.push(`${itemInfo}: ID de colaborador inválido`);
        }

        // Validar seguimiento
        const validSeguimientos = ["satisfactorio", "reprogramar", "revaluacion"];
        if (!item.seguimiento || !validSeguimientos.includes(item.seguimiento)) {
          errores.push(`${itemInfo}: Seguimiento inválido (${item.seguimiento})`);
        }

        // Validar nota
        if (item.nota === null || item.nota === undefined || isNaN(item.nota)) {
          errores.push(`${itemInfo}: Nota inválida`);
        } else if (item.nota < 0 || item.nota > 100) {
          errores.push(`${itemInfo}: Nota debe estar entre 0 y 100`);
        }

        // Validar comentario_final (opcional pero si existe debe ser string)
        if (item.comentario_final !== undefined && typeof item.comentario_final !== 'string') {
          errores.push(`${itemInfo}: Comentario debe ser texto`);
        }
      });

    

      await addQualifyTraining(payload);

      showCustomToast("Éxito", "Calificaciones guardadas exitosamente", "success");
    } catch (error) {
      let errorMessage = "Error al guardar las calificaciones";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = (error as any).message;
      }

      showCustomToast("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    submitQualify,
    loading,
  };
};
