import axios from "axios";

const API_URL = "https://naturalaloebackend-production.up.railway.app/api/collaborator";

export async function addCollaborator(collaboratorData: {
  id_colaborador: number;
  id_puesto: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  numero: string;
  correo: string;
}) {
  try {
    const response = await axios.post(API_URL, collaboratorData); // Cambiado a POST
    return response.data;
  } catch (error) {
    console.error("Error al insertar el usuario:", error);
    throw error;
  }
}