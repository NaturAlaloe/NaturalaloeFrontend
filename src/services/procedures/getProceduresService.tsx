import api from "../../apiConfig/api";

export async function getProceduresActive() {
  const response = await api.get("/procedureActive");
  return response.data.data;
}
