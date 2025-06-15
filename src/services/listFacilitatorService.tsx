import api from "../apiConfig/api";

export interface Facilitador {
  id?: number;
  nombre: string;
  apellido: string;
  tipo_facilitador: string;
  estado?: boolean; // opcional para manejar estado lógico
}

export async function getFacilitadores(): Promise<Facilitador[]> {
  try {
    const response = await api.get("/facilitadores");
    console.log("Respuesta facilitadores:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener facilitadores:", error);
    return [];
  }
}

export async function deletefacilitator(id: number): Promise<boolean> {
  try {
    await api.patch(`/facilitador/${id}`, { estado: false });
    return true;
  } catch (error) {
    console.error("Error al eliminar lógicamente facilitador:", error);
    return false;
  }
}
