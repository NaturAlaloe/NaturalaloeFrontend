import api from "../../apiConfig/api";

export interface TrainingList {
  id_capacitacion: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  tipo_capacitacion: "individual" | "grupal";
  capacitacion: "especifica" | "general";
  titulo_capacitacion: string;
  metodo_empleado: string | null;
  seguimiento: string | null;
  comentario: string;
  estado: string;
  duracion: string;
  is_evaluado: string | number | null;
  is_ultima_cap: string | number | null;
  id_colaborador: string | number;
  nombre_colaborador: string;
  id_documento: number;
  codigo_documento: string;
  descripcion_documento?: string;
  id_facilitador: number;
  tipo_facilitador: string;
  nombre_facilitador: string;
  nota: number | null;
  is_aprobado: string | null;
}

export async function getTrainingList(): Promise<TrainingList[]> {
  try {
    const response = await api.get("/training/all");
    if (!response.data || !response.data.data) {
      return [];
    }
    return response.data.data || [];
  } catch (error) {
    return [];
  }
}
