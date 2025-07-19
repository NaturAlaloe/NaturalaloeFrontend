import api from "../../apiConfig/api";

export interface Facilitador {
  id_facilitador: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
}
export async function getFacilitadores(): Promise<Facilitador[]> {
  try {
    const response = await api.get("/facilitators");
    return response.data.data;
  } catch (error) {
    return [];
  }
}
export interface Colaboradores {
  id_colaborador: number;
  id_puesto?: number;
  id_capacitacion: number | null;
  nombre_completo: string;
  estado_capacitacion: string | null;
  puesto: string;
  area?: string;
  departamento?: string;
  descripcion?: string;
  codigo?: string;
  version?: string;
  id_documento?: number;
  nombre_rol?: string;
}
export async function getColaboradores(): Promise<Colaboradores[]> {
  try {
    const response = await api.get("/training/pending");
    if (!response.data || !response.data.data) {
      return [];
    }
    return response.data.data || [];
  } catch (error) {
    return [];
  }
}

export async function getColaboradoresPendientes(): Promise<Colaboradores[]> {
  try {
    const response = await api.get("/training/pending");

    if (response.data && response.data.data) {
      return response.data.data
        .filter(
          (item: any) =>
            item.id_capacitacion === null &&
            item.estado_capacitacion === null &&
            item.seguimiento === null &&
            item.comentario === null
        )
        .map((item: any) => ({
          id_colaborador: item.id_colaborador,
          id_capacitacion: item.id_capacitacion,
          nombre_completo: item.nombre_completo,
          estado_capacitacion: item.estado_capacitacion,
          puesto: item.puesto,
          area: item.area,
          departamento: item.departamento,
          descripcion: item.descripcion,
          codigo: item.codigo,
          version: item.version,
          id_documento: item.id_documento,
          nombre_rol: item.nombre_rol,
        }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching colaboradores pendientes:", error);
    return [];
  }
}
export interface Procedimientos {
  id_documento: number;
  codigo: string;
  descripcion: string;
  estado_capacitacion?: string;
}
export async function getProcedimientos(): Promise<Procedimientos[]> {
  try {
    const response = await api.get("/training/pending");
    if (!response.data || !response.data.data) {
      return [];
    }
    return response.data.data || [];
  } catch (error) {
    return [];
  }
}
