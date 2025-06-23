import api from '../../apiConfig/api';

export interface Facilitador {
  id_facilitador: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
}
export async function getFacilitadores(): Promise<Facilitador[]> {
  try {
    const response = await api.get("/facilitatorsList");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener facilitadores:", error);
    return [];
  }
}
export interface Colaboradores{
  id_colaborador: number;
  id_puesto: number;
  id_capacitacion: number;
  nombre_completo: string;
  estado_capacitacion: string;
  puesto: string;
}
export async function getColaboradores(): Promise<Colaboradores[]> {
  try {
    const response = await api.get("/training/pending");
    if (!response.data || !response.data.data) {
      return [];
    }
    return response.data.data || [];
  } catch (error) {
    console.error("Error al obtener colaboradores:", error);
    return [];
  }
}
export interface Procedimientos{
  id_documento: number;
  codigo: string;
}
export async function getProcedimientos(): Promise<Procedimientos[]> {
  try {
    const response = await api.get(`/procedureActive`);
    if (!response.data || !response.data.data) {
      return [];
    }
    return response.data.data || [];
  } catch (error) {
    console.error("Error al obtener procedimientos:", error);
    return [];
  }
}