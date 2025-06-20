import api from '../../apiConfig/api';

export interface Collaborator {
  id_colaborador: number;
  id_puesto: number;
  nombre: string;
  apellido: string;
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