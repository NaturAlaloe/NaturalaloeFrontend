import api from "../../apiConfig/api";

export interface TrainingItem {
  id_capacitacion: number;
  titulo_capacitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo_capacitacion: string;
  estado: string;
  seguimiento: string;
  codigo_documento: string;
  id_colaborador: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  nota?: string | null;
  comentario?: string | null;
  id_documento_normativo?: number;
  is_evaluado?: number;
}

export const getEvaluatedTraining = async (
  id_capacitacion: string
): Promise<TrainingItem[]> => {
  try {
    const response = await api.get(`/training/pending/${id_capacitacion}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(`Error en la respuesta de la API: ${response.data.message || 'Sin mensaje'}`);
  } catch (error: any) {
    throw error;
  }
};
