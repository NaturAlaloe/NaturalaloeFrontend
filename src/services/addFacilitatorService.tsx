import api from "../apiConfig/api";

export interface Facilitador {
  id_facilitador: number;
  tipo_facilitador: string;
  disponibilidad: number;
  estado: number;
  nombre: string;
  apellido: string;
  identificacion: string;
}

// Obtener facilitadores internos
export const getFacilitadoresInternos = async (): Promise<Facilitador[]> => {
  const response = await api.get("/facilitadoresDisponibles");
  const lista = response.data.data || [];
  return lista.filter((f: Facilitador) => f.tipo_facilitador === "interno");
};

// Crear facilitador (POST)
export const createFacilitador = async (facilitador: {
  tipo_facilitador: "interno" | "externo";
  nombre: string;
  apellido: string;
  identificacion: string;
  id_colaborador?: number; // opcional
}) => {
  try {
    console.log("POST /facilitator", facilitador);
    const response = await api.post("/facilitator", facilitador);
    return response.data;
  } catch (error) {
    console.error("Error al crear facilitador:", error);
    throw error;
  }
};
