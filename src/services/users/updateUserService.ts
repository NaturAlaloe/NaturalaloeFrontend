import api from '../../apiConfig/api';

export interface UserUpdate {
    userId: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
}

export async function updateUser(userData: UserUpdate) {
    try {
        const response = await api.put(`/user/${userData.userId}`,
            {
                nombre: userData.nombre,
                apellido1: userData.apellido1,
                apellido2: userData.apellido2,
                email: userData.email
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        throw error;
    }
}
