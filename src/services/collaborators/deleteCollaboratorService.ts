import api from '../../apiConfig/api';

export interface CollaboratorDelete {
    id_colaborador: number;
}

export async function deleteCollaborator(collaboratorData: CollaboratorDelete) {
    try {
        const response = await api.delete(`/collaborator/${collaboratorData.id_colaborador}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el colaborador:", error);
        throw error;
    }
}

