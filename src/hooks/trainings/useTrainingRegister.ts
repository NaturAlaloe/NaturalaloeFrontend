import { useState } from "react";
import { useRegisterIndividualTraining } from "./useRegisterIndividualTraining";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useTrainingRegister({
  facilitadores,
  initialData,
  onClose,
  onSuccess,
}: any) {
  const [errorMsg] = useState<string | null>(null);
  const { register, loading } = useRegisterIndividualTraining();

  const handleRegister = async (isEvaluado: boolean, form: any) => {
    if (!isEvaluado) {
      showCustomToast(
        "Error",
        "La capacitación individual debe ser evaluada.",
        "error"
      );
      return;
    }

    if (!form.fechaInicio) {
      showCustomToast("Error", "La fecha de inicio es obligatoria.", "error");
      return;
    }
    if (!form.fechaFin) {
      showCustomToast("Error", "La fecha de fin es obligatoria.", "error");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(form.fechaInicio);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(form.fechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    if (fechaInicio > today) {
      showCustomToast(
        "Error",
        "La fecha de inicio no puede ser mayor a la fecha actual.",
        "error"
      );
      return;
    }

    if (fechaFin > today) {
      showCustomToast(
        "Error",
        "La fecha de fin no puede ser mayor a la fecha actual.",
        "error"
      );
      return;
    }

    if (fechaFin < fechaInicio) {
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
    if (
      !form.facilitador ||
      form.facilitador === "No hay facilitadores disponibles"
    ) {
      showCustomToast(
        "Error",
        "Debe seleccionar un facilitador válido.",
        "error"
      );
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

    if (
      !Number.isInteger(Number(id_colaborador)) ||
      Number(id_colaborador) <= 0
    ) {
      showCustomToast("Error", "ID de colaborador inválido.", "error");
      return;
    }

    if (
      !Number.isInteger(Number(id_facilitador)) ||
      Number(id_facilitador) <= 0
    ) {
      showCustomToast("Error", "ID de facilitador inválido.", "error");
      return;
    }

    if (
      !Number.isInteger(Number(id_documento_normativo)) ||
      Number(id_documento_normativo) <= 0
    ) {
      showCustomToast("Error", "ID de documento normativo inválido.", "error");
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

      const esMetodoTeorico =
        form.metodoEvaluacion?.toLowerCase() === "teórico";
      const esMetodoPractico =
        form.metodoEvaluacion?.toLowerCase() === "práctico";

      if (esMetodoTeorico) {
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

      if (esMetodoPractico) {
        if (!form.estadoAprobacion) {
          showCustomToast(
            "Error",
            "Debe seleccionar el estado de aprobación.",
            "error"
          );
          return;
        }
      }
    }

    let seguimientoFormatted = form.seguimiento.toLowerCase();
    if (seguimientoFormatted === "reevaluación") {
      seguimientoFormatted = "revaluacion";
    }

    let isAprobado = null;
    if (isEvaluado && form.metodoEvaluacion?.toLowerCase() === "práctico") {
      isAprobado =
        form.estadoAprobacion?.toLowerCase() === "aprobado"
          ? "aprobado"
          : "reprobado";
    }

    const payload = {
      id_colaborador: Number(id_colaborador),
      id_facilitador: Number(id_facilitador),
      id_documento_normativo: Number(id_documento_normativo),
      titulo_capacitacion:
        initialData?.titulo_capacitacion || "Capacitación Individual",
      fecha_inicio: form.fechaInicio,
      fecha_fin: form.fechaFin,
      comentario: form.comentario || "",
      metodo_empleado: isEvaluado ? form.metodoEvaluacion : null,
      seguimiento: seguimientoFormatted,
      duracion: Number(form.duracionHoras) || 0,
      nota:
        isEvaluado && form.metodoEvaluacion?.toLowerCase() === "teórico"
          ? Number(form.nota)
          : 0,
      is_aprobado: isAprobado,
      is_evaluado: isEvaluado ? 1 : 0,
    };

    const ok = await register(payload);
    if (ok) {
      showCustomToast(
        "Éxito",
        "Capacitación registrada correctamente",
        "success"
      );
      if (typeof onSuccess === "function") onSuccess(); // Llamar onSuccess primero
      if (typeof onClose === "function") onClose();
    }
  };

  return { errorMsg, loading, handleRegister };
}
