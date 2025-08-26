import api from "../../apiConfig/api";

export interface PutCollaborator {
  id_colaborador: number;
  id_rol_nuevo: number;
  motivo: string;
}

export const putRolsCollaborators = async (
  data: PutCollaborator
): Promise<any> => {
  try {
    const response = await api.put("/rols/principal", data);

    if (response.data.success) {
      return response.data;
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

export interface GetCollaborators {
  id_rol: number;
  nombre_rol: string;
}

export const getRolsCollaborators = async (): Promise<GetCollaborators[]> => {
  try {
    const response = await api.get("/rols");

    if (response.data) {
      // Si response.data tiene success y data
      if (
        response.data.success &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        
        return response.data.data;
      }
    }

    return [];
  } catch (error: any) {
    throw error;
  }
};
