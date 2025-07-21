// src/services/procedures/procedureService.ts
import api from "../../apiConfig/api";

export interface Procedure {
  id_documento: number;
  descripcion: string;
  path?: string;
  pdf?: string;
  fecha_creacion: string;
  codigo: string;
  id_poe: number | null;
  titulo: string;
  departamento: string;
  responsable: string;
  revision: string;
  fecha_vigencia: string;
  estado: string;
}

export const getActiveProcedures = async (): Promise<Procedure[]> => {
  try {
    const response = await api.get("/procedureActive");
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Error al obtener procedimientos");
    }

    // Normalizar los datos para asegurar consistencia
    return response.data.data.map((proc: any) => ({
      id_documento: proc.id_documento,
      descripcion: proc.descripcion || proc.titulo,
      titulo: proc.titulo,
      departamento: proc.departamento,
      responsable: proc.responsable,
      revision: proc.revision,
      fecha_creacion: proc.fecha_creacion,
      fecha_vigencia: proc.fecha_vigencia,
      estado: proc.estado,
      codigo: proc.codigo,
      id_poe: proc.id_poe,
      path: proc.path || proc.pdf,
      pdf: proc.pdf || proc.path
    }));
  } catch (error) {
    console.error("Error in getActiveProcedures:", error);
    throw new Error("No se pudieron cargar los procedimientos activos");
  }
};

// Nueva función para obtener procedimientos obsoletos
export const getObsoleteProcedures = async () => {
  try {
    const response = await api.get("/procedure/obsolete/versions");
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Error al obtener procedimientos obsoletos");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error in getObsoleteProcedures:", error);
    throw new Error("No se pudieron cargar los procedimientos obsoletos");
  }
};

// OBSOLETAR POES
export const obsoleteProcedure = async (id_documento: number, razon_cambio: string) => {
  try {
    const response = await api.put("/procedure/obsolete", {
      id_documento,
      razon_cambio,
    });
    console.log("Response from obsoleteProcedure:", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: "Error al marcar como obsoleto" };
  }
};

// Nueva función para reactivar procedimientos
export const unobsoleteProcedure = async (id_documento: number, razon_cambio: string) => {
  try {
    console.log("Reactivating procedure with ID:", id_documento, "Reason:", razon_cambio);
    const response = await api.put("/procedure/unobsolete", {
      id_documento,
      razon_cambio,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: "Error al reactivar procedimiento" };
  }
};