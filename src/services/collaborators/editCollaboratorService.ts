import api from '../../apiConfig/api';

export interface CollaboratorUpdate {
    id_colaborador: number;
    numero: string;
    correo: string;
}

export async function updateCollaborator(collaboratorData: CollaboratorUpdate) {
    try {
        const response = await api.put(`/collaborator/${collaboratorData.id_colaborador}`,
            {
                numero: collaboratorData.numero,
                correo: collaboratorData.correo
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el colaborador:", error);
        throw error;
    }
}

