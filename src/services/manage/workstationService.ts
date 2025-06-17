import api from "../../apiConfig/api";

export const getWorkstations = async () => {
  const response = await api.get("/workstation");
  return response.data.data;
};

export const addWorkstation = async (data: { id_departamento: number; nombre_puesto: string }) => {
  const response = await api.post("/workstation", data);
  return response.data;
};

export const updateWorkstation = async (id_puesto: number, data: { titulo: string; id_departamento: number }) => {
  const response = await api.put(`/position/${id_puesto}`, data);
  return response.data;
};

export const deleteWorkstation = async (id_puesto: number) => {
  const response = await api.delete(`/workstation/${id_puesto}`);
  return response.data;
};