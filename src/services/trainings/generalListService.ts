import api from "../../apiConfig/api";

export interface GeneralFromAPI {
  id_general: number;
  codigo: string;
  descripcion: string;
}

export interface General {
  id: number;
  codigo: string;
  titulo: string;
}

export const getGenerales = async (): Promise<General[]> => {
  const response = await api.get<{ data: GeneralFromAPI[] }>(
    "/training/generals"
  );

  return response.data.data.map((item) => ({
    id: item.id_general,
    codigo: item.codigo,
    titulo: item.descripcion,
  }));
};

export const createGeneral = async (data: {
  codigo: string;
  descripcion: string;
}) => {
  return await api.post("/training/generals", data);
};

export const updateGeneralById = async (
  id: number,
  data: { codigo: string; descripcion: string }
) => {
  return await api.put(`/training/generals/${id}`, data);
};

export const deleteGeneralById = async (id: number) => {
  return await api.delete(`/training/generals/${id}`);
};
