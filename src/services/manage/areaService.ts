import api from "../../apiConfig/api";

export interface Area {
  id?: number | null;
  titulo: string;
  id_area_padre?: number | null;
}

export const getAreas = async (): Promise<Area[]> => {
  const res = await api.get("/area");
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data.areas)) return res.data.areas;
  return [];
};

export const createArea = async (area: Area): Promise<Area> => {
  // Solo manda titulo y id_area_padre si existe
  const payload: Partial<Area> = { titulo: area.titulo };
  if (area.id_area_padre) {
    payload.id_area_padre = area.id_area_padre;
  }
  const res = await api.post("/area", payload);
  return res.data;
};
