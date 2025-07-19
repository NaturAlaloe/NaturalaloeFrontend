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
  return response.data.data;
}

export async function getPoliticsList() {
  const response = await api.get("/police/versions");
  return response.data.data; 
}

export async function getActivePolitics() {
  const response = await api.get("/policeActive");
  return response.data.data;
}

// Nueva función para obtener políticas obsoletas
export async function getObsoletePolitics() {
  const response = await api.get("/police/obsolete");
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


  //MALA 
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

export const unobsoletePolitics = async (
  id_documento: number,
  razon_cambio: string
) => {
  console.log("Reactivating politics with ID:", id_documento, "Reason:", razon_cambio);
  const response = await api.put(`/police/unobsolete`, {
    id_documento,
    razon_cambio,
  });
  return response.data;
};