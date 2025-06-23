import api from "../../apiConfig/api";

export async function getLastConsecutive() {
  try {
    const response = await api.get("/procedure");
    if (
      response.data &&
      response.data.success &&
      Array.isArray(response.data.data) &&
      response.data.data.length > 0 &&
      response.data.data[0].consecutivo_actual
    ) {
      return Number(response.data.data[0].consecutivo_actual);
    }
    return null;
  } catch (error) {
    return null;
  }
}