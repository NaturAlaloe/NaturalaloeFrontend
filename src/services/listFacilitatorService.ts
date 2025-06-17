import api from "../apiConfig/api";

export interface Facilitador {
  id_facilitador: number;
  nombre: string;
  apellido: string;
  tipo_facilitador: string;
  estado?: number;
}

export async function getFacilitadores(): Promise<Facilitador[]> {
  try {
    const response = await api.get("/facilitadores");
    return response.data.data 
  } catch (error) {
    console.error("Error al obtener facilitadores:", error);
    return [];
  }
}


export async function deletefacilitator(id_facilitador: number): Promise<boolean> {
  try {
    await api.delete(`/facilitador/${id_facilitador}`);
    console.log(`Facilitador con ID ${id_facilitador} eliminado.`);
    return true;
  } catch (error) {
    console.error("Error al eliminar facilitador:", error);
    return false;
  }
}

