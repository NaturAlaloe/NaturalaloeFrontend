import api from "../../apiConfig/api";


export interface Collaborator {

    cedula: string;
    id_puesto: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    fecha_nacimiento: string;
    numero: string;
    correo: string;
}


export async function addCollaborator(collaboratorData: Collaborator) {
  try {
    const response = await api.post("/collaborator", collaboratorData);
    return response.data;
  } catch (error) {
    console.error("Error al insertar el usuario:", error);
    throw error;
  }
}