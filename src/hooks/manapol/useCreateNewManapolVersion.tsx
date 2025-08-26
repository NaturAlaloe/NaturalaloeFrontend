import { useState } from "react";
import { createNewManapolVersion } from "../../services/manapol/manapolService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export interface CreateNewManapolVersionData {
  codigo: string;
  descripcion: string;
  id_responsable: string;
  nueva_version: number;
  fecha_creacion: string;
  fecha_vigencia: string;
  vigente: boolean;
  documento?: File | null;
}

interface UseCreateNewManapolVersionProps {
  onSuccess: () => Promise<void>;
}

const formatDateToBackend = (dateString: string | Date | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      if (
        typeof dateString === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ) {
        return dateString;
      }
      throw new Error("Fecha inválida");
    }
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export function useCreateNewManapolVersion({
  onSuccess,
}: UseCreateNewManapolVersionProps) {
  const [creating, setCreating] = useState(false);

  const createNewVersion = async (data: CreateNewManapolVersionData): Promise<boolean> => {
    setCreating(true);
    try {
      // Validación de campos obligatorios
      if (!data.codigo || data.nueva_version === undefined || data.nueva_version === null || data.vigente === undefined) {
        showCustomToast(
          "Error de validación",
          "Código, nueva versión y vigencia son obligatorios",
          "error"
        );
        return false;
      }

      // Validar que la nueva versión sea un número válido (>= 0)
      if (data.nueva_version < 0) {
        showCustomToast(
          "Error de validación",
          "La nueva versión debe ser un número mayor o igual a 0",
          "error"
        );
        return false;
      }

      // Preparar FormData
      const formData = new FormData();
      formData.append("codigo", data.codigo);
      formData.append("nueva_version", data.nueva_version.toString());
      formData.append("vigente", data.vigente ? "1" : "0");

      // Campos opcionales
      if (data.descripcion) {
        formData.append("descripcion", data.descripcion);
      }

      if (data.id_responsable) {
        formData.append("id_responsable", data.id_responsable);
      }

      if (data.fecha_creacion) {
        formData.append("fecha_creacion", formatDateToBackend(data.fecha_creacion));
      }

      if (data.fecha_vigencia) {
        formData.append("fecha_vigencia", formatDateToBackend(data.fecha_vigencia));
      }

      if (data.documento) {
        formData.append("documento", data.documento);
      }

      // Llamar al servicio
      await createNewManapolVersion(formData);

      showCustomToast(
        "Éxito",
        `Nueva versión ${data.nueva_version} creada correctamente`,
        "success"
      );

      // Recargar la lista
      await onSuccess();
      return true;

    } catch (error: any) {
      console.error("Error creating new Manapol version:", error);
      
      // El manejo de errores específicos ya está en el servicio
      showCustomToast(
        "Error",
        error.message || "No se pudo crear la nueva versión de Manapol",
        "error"
      );
      return false;
    } finally {
      setCreating(false);
    }
  };

  return {
    creating,
    createNewVersion,
  };
}
