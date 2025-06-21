import api from "../../apiConfig/api";

export async function getCategories() {
  const response = await api.get("/categories");
  return response.data.data;
}
