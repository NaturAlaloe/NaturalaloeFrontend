import { useState } from "react";
import { createProcedure } from "../../services/procedures/createProceduresService";

export function useCreateProcedureSubmit() {
  const [loading, setLoading] = useState(false);

  const submitProcedure = async (fields: {
    descripcion: string;
    id_area: number | string;
    id_departamento: number | string;
    id_categoria: number | string;
    id_responsable: number | string;
    version: number | string;
    fecha_creacion: string;
    fecha_vigencia: string;
    documento: File;
  }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("descripcion", fields.descripcion);
    formData.append("id_area", String(Number(fields.id_area)));
    formData.append("id_departamento", String(Number(fields.id_departamento)));
    formData.append("id_categoria", String(Number(fields.id_categoria)));
    formData.append("id_responsable", String(Number(fields.id_responsable)));
    formData.append("version", String(Number(fields.version)));
    formData.append("fecha_creacion", fields.fecha_creacion);
    formData.append("fecha_vigencia", fields.fecha_vigencia);
    formData.append("documento", fields.documento);

    const debugObj: Record<string, any> = {};
    formData.forEach((value, key) => {
      debugObj[key] = value;
    });
    console.log("[Procedimiento] Enviando a la API (objeto):", debugObj);
    for (const [key, value] of formData.entries()) {
      if (key === "documento" && value instanceof File) {
        console.log(
          `[Procedimiento] campo: ${key} (File) -> nombre: ${value.name}, size: ${value.size}`
        );
      } else {
        console.log(`[Procedimiento] campo: ${key} ->`, value);
      }
    }

    try {
      const response = await createProcedure(formData);
      return response;
    } catch (error: any) {
      console.log(
        "Error al crear procedimiento:",
        error?.response?.data?.message || "Intenta nuevamente"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitProcedure, loading };
}