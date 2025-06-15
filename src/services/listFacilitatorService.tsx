import api from "../apiConfig/api";

export interface Facilitador {
    id?: number;
    nombre: string;
    apellido: string;
    tipo_facilitador: string;
  }
  
  export async function getFacilitadores(): Promise<Facilitador[]> {
    try {
      const response = await api.get("/facilitadores");
      console.log("Respuesta facilitadores:", response.data);
      return response.data.data; // ✅ accede al array
    } catch (error) {
      console.error("Error al obtener facilitadores:", error);
      return [];
    }
  }