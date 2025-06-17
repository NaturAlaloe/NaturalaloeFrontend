import api from "../../apiConfig/api";

export interface Facilitador {
  id_facilitador: number;
  nombre: string;
  apellido: string;
  tipo_facilitador: string;
}

export async function getFacilitadores(): Promise<Facilitador[]> {
  const response = await api.get("/facilitadores");
  return response.data.data as Facilitador[];
}
