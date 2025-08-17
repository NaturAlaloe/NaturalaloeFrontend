import api from "../apiConfig/api";
import { getAreas, type Area as AreaType } from "./manage/areaService";
import { getResponsibles } from "./responsibles/getResponsibles";
import { getActiveProcedures, type Procedure } from "./procedures/procedureService";

export interface Document {
  id_documento: number;
  codigo: string;
  titulo: string;
  tipo: string;
  razon: string;
}

export interface POE {
  id_documento: number;
  codigo: string;
  titulo: string;
}

// Adaptamos los tipos para que coincidan con los servicios existentes
export interface Area {
  id: number;
  nombre: string;
}

export interface Responsable {
  id: number;
  nombre: string;
}

export interface KpiBatchYearPayload {
  id_area: number;
  id_responsable: number;
  estado: string;
  cantidad_planificada: number;
  docs_json: string;
  usuario: string;
}

export interface KpiBatchYearFormData {
  idArea: number | null;
  idResponsable: number | null;
  estado: "actualizar" | "obsoleto"; // Cambiado de "obsoletar" a "obsoleto"
}

export const kpiBatchYearService = {
  async createKpiBatch(formData: KpiBatchYearFormData, docs: Document[]): Promise<any> {
    const docsForPayload = docs.map(doc => ({
      codigo: doc.codigo,
      tipo: doc.tipo,
      razon: doc.razon
    }));

    const payload: KpiBatchYearPayload = {
      id_area: formData.idArea!,
      id_responsable: formData.idResponsable!,
      estado: formData.estado,
      cantidad_planificada: docs.length,
      docs_json: JSON.stringify(docsForPayload),
      usuario: "prueba usuario ver si se trae desde el jwt",
    };

    const response = await api.post("/procedures/kpi/year", payload);
    return response.data;
  },

  async getPOEs(): Promise<POE[]> {
    try {
      const procedures = await getActiveProcedures();
      // Transformar los procedimientos al formato POE que necesitamos
      console.log("Procedures fetched:", procedures);
      return procedures.map((proc: Procedure) => ({
        id_documento: proc.id_documento,
        codigo: proc.codigo,
        titulo: proc.titulo
      }));
      console
    } catch (error) {
      console.error("Error fetching POEs:", error);
      return [];
    }
  },

  async getAreas(): Promise<Area[]> {
    try {
      const areasData = await getAreas();
      return areasData
        .filter((area: AreaType) => area.id_area && area.id_area > 0)
        .map((area: AreaType) => ({
          id: area.id_area!,
          nombre: area.titulo
        }));
    } catch (error) {
      console.error("Error fetching areas:", error);
      return [];
    }
  },

  async getResponsables(): Promise<Responsable[]> {
    try {
      const responsablesData = await getResponsibles();
      return responsablesData.map((resp: any) => ({
        id: resp.id_responsable,
        nombre: resp.nombre_responsable,
      }));
    } catch (error) {
      console.error("Error fetching responsables:", error);
      return [];
    }
  },

  getEstadoOptions() {
    return [
      { id: "actualizar", nombre: "Actualizar" },
      { id: "obsoleto", nombre: "Obsoletar" } // Cambiado el id de "obsoletar" a "obsoleto"
    ];
  },

  validateFormData(formData: KpiBatchYearFormData, docs: Document[]): { isValid: boolean; errorMessage?: string } {
    if (!formData.idArea || !formData.idResponsable) {
      return {
        isValid: false,
        errorMessage: "Debe seleccionar un área y un responsable."
      };
    }

    if (docs.length === 0) {
      return {
        isValid: false,
        errorMessage: "Debe seleccionar al menos un POE."
      };
    }

    const invalidDocs = docs.some(d => !d.razon);
    if (invalidDocs) {
      return {
        isValid: false,
        errorMessage: "Todos los POEs deben tener una razón especificada."
      };
    }

    return { isValid: true };
  },

  parseError(error: any): string {
    if (error.response?.data?.message?.includes("fk_kpi_responsable") || 
        error.response?.data?.message?.includes("FOREIGN KEY") && 
        error.response?.data?.message?.includes("id_responsable")) {
      return "ID de responsable que no existe";
    }
    else if (error.response?.data?.message?.includes("fk_kpi_area") || 
             error.response?.data?.message?.includes("FOREIGN KEY") && 
             error.response?.data?.message?.includes("id_area")) {
      return "ID de área que no existe";
    }
    else if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    return "Error al crear lote de KPIs para reglas anuales";
  }
};