import api from "../../apiConfig/api";

export interface ICollaborator {
  id_colaborador: string;
  nombre: string;
}

export const getCollaborators = async (search?: string): Promise<ICollaborator[]> => {
  try {
    const response = await api.get('/collaborator', {
      params: { search }
    });
    if (Array.isArray(response.data.data)) {
      return response.data.data.map((item: any) => ({
        id_colaborador: String(item.id_colaborador),
        nombre: item.nombre,
      }));
      console.log(response.data.data);
    }
    return [];
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return [];
  }
};