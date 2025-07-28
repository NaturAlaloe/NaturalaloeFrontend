import api from "../../apiConfig/api";

export interface Facilitador {
  id_facilitador: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  tipo_facilitador: string;
}

export async function getFacilitadores(): Promise<Facilitador[]> {
  const response = await api.get("/facilitators");
  return (response.data.data as any[]).map((f) => ({
    id_facilitador: f.id_facilitador,
    nombre: f.nombre,
    apellido1: f.apellido1,
    apellido2: f.apellido2,
    tipo_facilitador: f.tipo_facilitador,
  }));
}
