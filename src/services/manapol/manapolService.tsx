import api from "../../apiConfig/api";

export async function getManapolList() {
    const response = await api.get("/registerMan/versions")
    return response.data.data; // Extraer la propiedad 'data' del response
}