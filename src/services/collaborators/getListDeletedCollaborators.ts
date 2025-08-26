import api from "../../apiConfig/api";

export interface DeletedCollaborator {
  id_colaborador: number;
  cedula: number;
  nombre_completo: string;
  correo: string;
  numero: number;
  estado: number;
  roles: string;
  capacitaciones_realizadas: string | null;
  capacitaciones_generales: string | null;
}

export const getListDeletedCollaborators = async (): Promise<
  DeletedCollaborator[]
> => {
  try {
    const response = await api.get("/inactive/collaborator");

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(
      `Error en la respuesta de la API: ${
        response.data.message || "Sin mensaje"
      }`
    );
  } catch (error: any) {
    throw error;
  }
};
