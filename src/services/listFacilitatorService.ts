import api from "../apiConfig/api";

export interface Facilitador {
  id_facilitador: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  tipo_facilitador: string;
  estado?: number;
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

export async function deleteFacilitador(id_facilitador: number): Promise<boolean> {
  try {
    await api.delete(`/facilitators/${id_facilitador}`);
    return true;
  } catch (error) {
    console.error("Error al eliminar facilitador:", error);
    return false;
  }
}


export const updateFacilitadorById = async (id_facilitador: number, data: { nombre: string; apellido1: string, apellido2: string }) => {
  const response = await api.put( `/facilitator/${id_facilitador}`, data);
  return response.data;
};
