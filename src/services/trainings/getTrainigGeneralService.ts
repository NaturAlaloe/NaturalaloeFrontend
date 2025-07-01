import api from "../../apiConfig/api";

export interface Capacitation_General {
  id_capacitacion_general: number;
  titulo: string;
  fecha_capacitacion: Date;
  id_colaborador: number;
  nombre_completo: string;
}

export async function getCapacitationGeneralList(): Promise<
  Capacitation_General[]
> {
  try {
    const response = await api.get("/training/general");
    if (!response.data || !response.data.data) {
      return [];
    }
    return response.data.data || [];
  } catch (error) {
    return [];
  }
}

export interface Genaral {
  id_general: number;
  codigo: string;
  descripcion: string;
}

export async function getGeneral(): Promise<Genaral[]> {
  try {
    const response = await api.get(`/training/generals/`);
    if (!response.data || !response.data.data) {
      return [];
    }
    return response.data.data || null;
  } catch (error) {
    return [];
  }
}
