import axios from "axios";

export interface Collaborator {
  name: string;
  email: string;
  // Agrega aquí los demás campos necesarios
}

const API_URL = "https://naturalaloebackend-production.up.railway.app/api/collaborator";

export async function addCollaborator(collaboratorData: Collaborator) {
  try {
    const response = await axios.post(API_URL, collaboratorData);
    return response.data;
  } catch (error) {
    console.error("Error al insertar el usuario:", error);
    throw error;
  }
}