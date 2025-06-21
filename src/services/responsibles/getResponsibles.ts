import api from "../../apiConfig/api";

export async function getResponsibles() {
  const response = await api.get("/responsible");
  return response.data.data;
}
