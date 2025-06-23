import api from "../../apiConfig/api";

export async function getProceduresVersions() {
  try {
    const response = await api.get("/procedure/versions");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener versiones de procedimientos:", error);
    return [];
  }
}
