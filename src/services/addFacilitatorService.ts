import api from "../apiConfig/api";

export interface Facilitador {
  id_facilitador: number;
  tipo_facilitador: string;
  disponibilidad: number;
  estado: number;
  nombre: string;
  apellido: string;
  identificacion: string; // Representa el id_colaborador (cedula)
}

// Obtener colaboradores disponibles como facilitadores internos
export const getColaboradoresDisponibles = async (): Promise<Facilitador[]> => {
  const response = await api.get("/collaborators");
  const lista = response.data.data || [];

  return lista.map((colab: any) => ({
    id_facilitador: colab.id_colaborador,  // ID para el select
    tipo_facilitador: "interno",
    disponibilidad: 1,
    estado: 1,
    nombre: colab.nombre,
    apellido: colab.apellido,
    identificacion: colab.id_colaborador.toString(), // Cedula
  }));
};

// Crear facilitador
export const createFacilitador = async (facilitador: {
  tipo_facilitador: "interno" | "externo";
  nombre: string;
  apellido: string;
  identificacion: string;
  id_colaborador?: number;
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
