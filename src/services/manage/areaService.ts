import api from "../../apiConfig/api";

export interface Area {
  id_area?: number | null;
  titulo: string;
  id_area_padre?: number | null;
  activa?: boolean;
}

export const getAreas = async (): Promise<Area[]> => {
  const res = await api.get("/area");
  console.log("getAreas response:", res.data);
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data.areas)) return res.data.areas;
  return [];
};

export const createArea = async (area: Area): Promise<Area> => {
  const payload: Partial<Area> = { titulo: area.titulo };
  if (typeof area.id_area_padre === "number" && area.id_area_padre !== null) {
    payload.id_area_padre = area.id_area_padre;
  }
  const res = await api.post("/area", payload);
  return res.data;
};

export const updateArea = async (area: Area): Promise<Area> => {
  const payload: Partial<Area> = { 
    id_area: area.id_area, // <-- importante
    titulo: area.titulo,
  };
  if (typeof area.activa === "boolean") {
    payload.activa = area.activa;
  }
  const res = await api.put(`/area`, payload); 
  return res.data;
};

export const deleteArea = async (id: number) => {
  await api.delete(`/area/${id}`);
};
