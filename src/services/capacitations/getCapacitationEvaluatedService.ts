import api from "../../apiConfig/api";

export interface TrainingCollaboratorData {
  id_capacitacion: number;
  titulo_capacitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  is_evaluado: number;
  tipo_capacitacion: string;
  estado: string;
  seguimiento: string;
  id_documento_normativo: number;
  codigo_documento: string;
  id_colaborador: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
}

export async function getTrainingByIdService(
  codigoDocumento: string
): Promise<TrainingCollaboratorData[]> {
  try {
    console.log("getTrainingByIdService: usando codigo_documento:", codigoDocumento);
    const response = await api.get(`/api/training/pending/${codigoDocumento}`);
    console.log("getTrainingByIdService: respuesta de la API:", response.data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching training data:", error);
    throw error;
  }
}

export interface SaveEvaluationData {
  id_colaborador: number;
  id_capacitacion: number;
  nota: string;
  seguimiento: string;
  comentario: string;
}

export async function saveEvaluationsService(
  evaluations: SaveEvaluationData[]
): Promise<boolean> {
  try {
    console.log("saveEvaluationsService: enviando evaluaciones:", evaluations);
    
    // Intentar con el endpoint correcto para guardar evaluaciones
    const response = await api.post('/api/training/qualify', evaluations);
    
    console.log("saveEvaluationsService: respuesta de la API:", response.data);
    return response.data.success || false;
  } catch (error) {
    console.error("Error saving evaluations:", error);
    throw error;
  }
}

// Servicio para calificar la capacitación completa
export interface QualifyTrainingData {
  id_capacitacion: number;
  seguimiento: "satisfactorio" | "reprogramar" | "reevaluacion";
  nota: number;
  comentario_final: string;
}

export async function qualifyTrainingService(
  qualificationData: QualifyTrainingData | QualifyTrainingData[]
): Promise<boolean> {
  try {
    console.log("qualifyTrainingService: enviando calificación:", qualificationData);
    const response = await api.post('/api/training/qualify', qualificationData);
    
    console.log("qualifyTrainingService: respuesta de la API:", response.data);
    return response.data.success || false;
  } catch (error) {
    console.error("Error qualifying training:", error);
    throw error;
  }
}