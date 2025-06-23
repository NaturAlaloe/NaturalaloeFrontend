import { useState } from "react";
import { createProcedure } from "../../services/procedures/createProceduresService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useCreateProcedureSubmit() {
  const [loading, setLoading] = useState(false);

  const submitProcedure = async (fields: {
    descripcion: string;
    id_area: number | string;
    id_departamento: number | string;
    id_categoria: number | string;
    codigo: string; // <-- Agregado
    id_responsable: number | string;
    version: number | string;
    fecha_creacion: string;
    fecha_vigencia: string;
    documento: File;
  }) => {
    setLoading(true);
    const formData = new FormData();
    console.log("Submitting procedure with fields:", fields);
    formData.append("descripcion", fields.descripcion);
    formData.append("id_area", String(Number(fields.id_area)));
    formData.append("id_departamento", String(Number(fields.id_departamento)));
    formData.append("id_categoria", String(Number(fields.id_categoria)));
    formData.append("codigo", fields.codigo); // <-- Agregado
    formData.append("id_responsable", String(Number(fields.id_responsable)));
    formData.append("version", String(Number(fields.version)));
    formData.append("fecha_creacion", fields.fecha_creacion);
    formData.append("fecha_vigencia", fields.fecha_vigencia);
    formData.append("documento", fields.documento);

    try {
      const response = await createProcedure(formData);
      const codigoGenerado = response?.data?.[0]?.[0]?.codigo_generado;
      if (codigoGenerado) {
        showCustomToast(
          "Procedimiento creado",
          `Código generado: ${codigoGenerado}`,
          "success"
        );
      }
      return response;
    } catch (error: any) {
      showCustomToast(
        "Error al crear procedimiento",
        error?.response?.data?.message || "Intenta nuevamente",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitProcedure, loading };
}