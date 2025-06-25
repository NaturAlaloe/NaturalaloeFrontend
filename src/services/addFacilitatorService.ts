import api from "../apiConfig/api";
export interface Facilitador {
  id_facilitador: number;
  tipo_facilitador: string;
  disponibilidad: number;
  estado: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  identificacion: string;
}

export const getColaboradoresDisponibles = async (): Promise<Facilitador[]> => {
  const response = await api.get("/collaborators");
  const lista = response.data.data || [];

  return lista.map((colab: any) => ({
    id_facilitador: colab.id_colaborador,
    tipo_facilitador: "interno",
    disponibilidad: 1,
    estado: 1,
    nombre: colab.nombre,
    apellido1: colab.apellido1,
    apellido2: colab.apellido2,
    identificacion: colab.id_colaborador.toString(),
  }));
};

export const createFacilitador = async (facilitador: {
  tipo_facilitador: "interno" | "externo";
  nombre: string;
  apellido1: string;
  apellido2: string;
  identificacion?: string;
  id_colaborador?: number;
}) => {
  try {
    const response = await api.post("/facilitator", facilitador);
    return response.data;
  } catch (error) {
    console.error("Error al crear facilitador:", error);
    throw error;
  }
};
