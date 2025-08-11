import api from "../../apiConfig/api";

export async function getManapolList() {
  const response = await api.get("/registerMan/versions");
  return response.data.data; 
}

export async function createManapol(formData: FormData) {
  const response = await api.post("/registerMan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export const updateManapol = async (formData: FormData) => {
  const response = await api.put(`/registerMan/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// export const createNewManapolVersion = async (formData: FormData) => {
//   const response = await api.put(`/registerMan/increase`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };
