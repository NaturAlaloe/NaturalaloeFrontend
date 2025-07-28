import api from "../../apiConfig/api";

export interface RegisterIndividualTrainingPayload {
  id_colaborador: number;
  id_facilitador: number;
  id_documento_normativo: number;
  titulo_capacitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  comentario: string;
  is_evaluado: number;
  metodo_empleado: string | null;
  seguimiento: string;
  duracion: number;
  nota: number;
  is_aprobado: string | null;
}

export async function registerIndividualTraining(
  payload: RegisterIndividualTrainingPayload
) {
  const response = await api.post("/training/individual", payload);
  return response.data;
}
