import api from "../../apiConfig/api";

export async function createProcedure(formData: FormData) {
  const response = await api.post("/procedure", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}