import api from '../../apiConfig/api';

export interface CollaboratorUpdate {
    id_colaborador: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    numero: string;
    correo: string;
}

export async function updateCollaborator(collaboratorData: CollaboratorUpdate) {
    try {
        const response = await api.put(`/collaborator/${collaboratorData.id_colaborador}`,
            {
                numero: collaboratorData.numero,
                nombre: collaboratorData.nombre,
                apellido1: collaboratorData.apellido1,
                apellido2: collaboratorData.apellido2,
                correo: collaboratorData.correo
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el colaborador:", error);
        throw error;
    }
}

