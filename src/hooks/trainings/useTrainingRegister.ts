import { useState } from "react";
import { useRegisterIndividualTraining } from "./useRegisterIndividualTraining";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useTrainingRegister({
  facilitadores,
  initialData,
  onClose,
}: any) {
  const [errorMsg] = useState<string | null>(null);
  const { register, loading } = useRegisterIndividualTraining();

  const handleRegister = async (isEvaluado: boolean, form: any) => {
    if (!form.fechaInicio) {
      showCustomToast("Error", "La fecha de inicio es obligatoria.", "error");
      return;
    }
    if (!form.fechaFin) {
      showCustomToast("Error", "La fecha de fin es obligatoria.", "error");
      return;
    }
    if (new Date(form.fechaFin) < new Date(form.fechaInicio)) {
      showCustomToast(
        "Error",
        "La fecha de fin no puede ser anterior a la fecha de inicio.",
        "error"
      );
      return;
    }
    if (
      !form.duracionHoras ||
      isNaN(Number(form.duracionHoras)) ||
      Number(form.duracionHoras) <= 0
    ) {
      showCustomToast(
        "Error",
        "La duración debe ser un número mayor a 0.",
        "error"
      );
      return;
    }
    if (!form.facilitador) {
      showCustomToast("Error", "Debe seleccionar un facilitador.", "error");
      return;
    }
    if (!form.seguimiento) {
      showCustomToast("Error", "Debe seleccionar un seguimiento.", "error");
      return;
    }

    const facilitadorSeleccionado = facilitadores.find(
      (f: any) =>
        `${f.nombre} ${f.apellido1} ${f.apellido2}`.trim() === form.facilitador
    );
    const id_facilitador = facilitadorSeleccionado?.id_facilitador;

    const id_colaborador = initialData?.id_colaborador;
    const id_documento_normativo = initialData?.id_documento_normativo;

    if (!id_colaborador) {
      showCustomToast(
        "Error",
        "No se encontró el colaborador. Intente de nuevo.",
        "error"
      );
      return;
    }
    if (!id_documento_normativo) {
      showCustomToast(
        "Error",
        "No se encontró el documento normativo. Intente de nuevo.",
        "error"
      );
      return;
    }
    if (!id_facilitador) {
      showCustomToast(
        "Error",
        "El facilitador seleccionado no es válido.",
        "error"
      );
      return;
    }

    if (isEvaluado) {
      if (!form.metodoEvaluacion) {
        showCustomToast(
          "Error",
          "Debe seleccionar un método de evaluación.",
          "error"
        );
        return;
      }
      if (
        form.nota === "" ||
        isNaN(Number(form.nota)) ||
        Number(form.nota) < 0 ||
        Number(form.nota) > 100
      ) {
        showCustomToast(
          "Error",
          "La nota debe ser un número entre 0 y 100.",
          "error"
        );
        return;
      }
    }

    const payload = {
      id_colaborador,
      id_facilitador,
      id_documento_normativo,
      titulo_capacitacion:
        initialData?.titulo_capacitacion || "Capacitación Individual",
      fecha_inicio: form.fechaInicio,
      fecha_fin: form.fechaFin,
      tipo_capacitacion: "individual",
      comentario: initialData?.comentario || "",
      is_evaluado: isEvaluado ? 1 : 0,
      metodo_empleado: isEvaluado ? form.metodoEvaluacion : null,
      seguimiento: form.seguimiento,
      duracion: Number(form.duracionHoras) || 0,
      nota: isEvaluado ? Number(form.nota) : 0,
    };
    const ok = await register(payload);
    if (ok) {
      showCustomToast(
        "Éxito",
        "Capacitación registrada correctamente",
        "success"
      );
      if (typeof onClose === "function") onClose();
    }
  };

  return { errorMsg, loading, handleRegister };
}
