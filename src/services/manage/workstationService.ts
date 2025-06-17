import api from "../../apiConfig/api";

export const getWorkstations = async () => {
  const response = await api.get("/workstation");
  return response.data.data;
};

// Nueva función para actualizar un puesto
export const updateWorkstation = async (id_puesto: number, data: { titulo: string; id_departamento: number }) => {
  const response = await api.put(`/position/${id_puesto}`, data);
  return response.data;
};

export const deleteWorkstation = async (id_puesto: number) => {
  const response = await api.delete(`/workstation/${id_puesto}`);
  return response.data;
};