import api from "../../apiConfig/api";

// Estructura del backend
export interface GeneralFromAPI {
  id_general: number;
  codigo: string;
  descripcion: string;
}

// Estructura en el frontend
export interface General {
  id: number;
  codigo: string;
  titulo: string;
}

// GET: Obtener lista de generales
export const getGenerales = async (): Promise<General[]> => {
  const response = await api.get<{ data: GeneralFromAPI[] }>("/training/generals");

  return response.data.data.map((item) => ({
    id: item.id_general,
    codigo: item.codigo,
    titulo: item.descripcion,
  }));
};

// POST: Crear un nuevo general
export const createGeneral = async (data: { codigo: string; descripcion: string }) => {
  return await api.post("/training/generals", data);
};

// PUT: Actualizar un general por ID
export const updateGeneralById = async (
  id: number,
  data: { codigo: string; descripcion: string }
) => {
  return await api.put(`/training/generals/${id}`, data);
};

// DELETE: Eliminar un general por ID
export const deleteGeneralById = async (id: number) => {
  return await api.delete(`/training/generals/${id}`);
};
