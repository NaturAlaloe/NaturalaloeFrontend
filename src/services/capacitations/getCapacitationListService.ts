import api from "../../apiConfig/api";

export interface CapacitationList {
  id_capacitacion: 15;
  fecha_inicio: Date;
  fecha_fin: Date;
  tipo_capacitacion: string;
  metodo_empleado: string;
  seguimiento: string;
  comentario: string;
  estado: string;
  duracion: string;
  is_evaluado: string;
  is_ultima_cap: string;
  id_colaborador: string;
  nombre_colaborador: string;
  id_documento: number;
  codigo_documento: string;
  titulo_capacitacion: string;
  id_facilitador: number;
  tipo_facilitador: string;
  nombre_facilitador: string;
  nota: number;
}

export async function getCapacitationList(): Promise<CapacitationList[]> {
  try {
    const response = await api.get("/training");
    if (!response.data || !response.data.data) {
      return [];
    }
    return response.data.data || [];
  } catch (error) {
    console.error("Error al obtener la lista de capacitaciones:", error);
    return [];
  }
}
