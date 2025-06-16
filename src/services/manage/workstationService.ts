import api from "../../apiConfig/api";

export const getWorkstations = async () => {
  const response = await api.get("/workstation");
  return response.data.data;
};