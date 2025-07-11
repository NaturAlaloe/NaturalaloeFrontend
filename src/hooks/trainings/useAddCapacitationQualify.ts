import { useState } from "react";
import { addQualifyTraining } from "../../services/trainings/addTrainingQualifyService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

interface PayloadItem {
  id_colaborador: number;
  id_documento_normativo?: number;
  seguimiento: "satisfactorio" | "reprogramar" | "revaluacion";
  nota: number | null;
  comentario_final: string;
  is_aprobado?: string | null;
}

export const useAddQualifyTraining = () => {
  const [loading, setLoading] = useState(false);

  const submitQualify = async (
    id_capacitacion: number,
    calificaciones: PayloadItem[],
    metodoEvaluacion?: string | null
  ) => {
    setLoading(true);
    try {
      if (!calificaciones || calificaciones.length === 0) {
        showCustomToast(
          "Información",
          "No hay colaboradores para evaluar.",
          "info"
        );
        return;
      }

      const errores: string[] = [];
      const metodo = metodoEvaluacion?.toLowerCase() || "";
      const esPractico = metodo === "práctico" || metodo === "practico";
      const esTeorico = metodo === "teórico" || metodo === "teorico";

      calificaciones.forEach((item, index) => {
        const colaboradorInfo = `Colaborador ${index + 1}`;

        if (!item.id_colaborador || item.id_colaborador <= 0) {
          errores.push(`${colaboradorInfo}: Falta el ID del colaborador`);
        }
        if (esTeorico) {
          if (
            item.nota === null ||
            item.nota === undefined ||
            isNaN(item.nota)
          ) {
            errores.push(
              `${colaboradorInfo}: La nota es obligatoria para evaluación teórica`
            );
          } else if (item.nota < 0 || item.nota > 100) {
            errores.push(
              `${colaboradorInfo}: La nota debe estar entre 0 y 100`
            );
          }
        } else if (esPractico) {
          if (
            !item.is_aprobado ||
            (item.is_aprobado !== "aprobado" &&
              item.is_aprobado !== "reprobado")
          ) {
            errores.push(
              `${colaboradorInfo}: Debe especificar si está aprobado o reprobado para evaluación práctica`
            );
          }
        }

        const validSeguimientos = [
          "satisfactorio",
          "reprogramar",
          "revaluacion",
        ];
        if (!item.seguimiento) {
          errores.push(
            `${colaboradorInfo}: Debe seleccionar un tipo de seguimiento`
          );
        } else if (!validSeguimientos.includes(item.seguimiento)) {
          errores.push(
            `${colaboradorInfo}: El seguimiento "${item.seguimiento}" no es válido`
          );
        }

        if (
          item.comentario_final !== undefined &&
          typeof item.comentario_final !== "string"
        ) {
          errores.push(
            `${colaboradorInfo}: El comentario debe ser texto válido`
          );
        }
      });

      if (errores.length > 0) {
        const mensajeError = errores.join("\n");
        showCustomToast("Errores de validación", mensajeError, "error");
        return;
      }

      const payload = {
        id_capacitacion,
        calificaciones,
      };

      await addQualifyTraining(payload);

      showCustomToast(
        "Éxito",
        "Calificaciones guardadas exitosamente",
        "success"
      );
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
