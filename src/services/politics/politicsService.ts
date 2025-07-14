import api from "../../apiConfig/api";

export async function createPolitics(data: FormData) {
    const response = await api.post("/police", data, {
    headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
}

export async function getPoliticsConsecutive() {
  const response = await api.get("/police/consecutive");
  return response.data.data[0]?.consecutivo_actual || "";
}

export async function getPoliticsList() {
  const response = await api.get("/police/versions");
  return response.data.data; 
}



export async function getActivePolitics() {
  const response = await api.get("/policeActive");
  return response.data.data;
}



export const updatePolitics = async (
  formData: FormData
) => {
  const response = await api.put(`/police`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    };

export const createNewPoliticsVersion = async (
  formData: FormData
) => {
  const response = await api.put(`/police/increase`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    };
    
export const obsoletePolitics = async (
  id_documento: number,
  razon_cambio: string
) => {
  console.log("Obsoleting politics with ID:", id_documento, "Reason:", razon_cambio);
  const response = await api.put(`/police/obsolete`, {
    id_documento,
    razon_cambio,
  });
  return response.data;
};
