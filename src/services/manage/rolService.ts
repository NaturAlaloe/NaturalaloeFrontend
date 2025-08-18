import api from "../../apiConfig/api";

export interface IRole {
  id_rol: number;
  nombre_rol: string;
  isEditable?: boolean; // Para marcar el puesto como no editable
}

export const getRoles = async (): Promise<IRole[]> => {
  try {
    const response = await api.get('/rols');
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error al obtener roles:', error);
    return [];
  }
};

export const getRolesByCollaborator = async (id_colaborador: string | number): Promise<IRole[]> => {
  try {
    const response = await api.get(`/rolesColaborators/${id_colaborador}`);
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error al obtener roles del colaborador:', error);
    return [];
  }
};

export const assignRolesToCollaborator = async (id_colaborador: string | number, roleIds: number[]): Promise<void> => {
  try {
    for (const id_rol of roleIds) {
      const asignacion = { id_colaborador, id_rol };
      await api.post('/rolsAssign', asignacion);
    }
  } catch (error) {
    console.error('Error al asignar roles:', error);
    throw error;
  }
};

export const unassignRolesFromCollaborator = async (id_colaborador: string | number, roleIds: number[]): Promise<void> => {
  try {
    for (const id_rol of roleIds) {
      const desasignacion = { id_colaborador, id_rol };
      await api.delete('/rolsUnassign', { data: desasignacion }); 
    }
  } catch (error) {
    console.error('Error al desasignar roles:', error);
    throw error;
  }
};