import api from '../../apiConfig/api';

export interface UserDelete {
    id_usuario: number;
}

export async function deleteUser(userData: UserDelete) {
    try {
        const response = await api.delete(`/user/${userData.id_usuario}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        throw error;
    }
}

