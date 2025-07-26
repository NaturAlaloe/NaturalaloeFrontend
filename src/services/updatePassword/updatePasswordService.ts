import api from '../../apiConfig/api';

export interface userPasswordUpdate {
    nuevaContrasena: string;
}

export async function updateUserPassword(userData: userPasswordUpdate) {
    try {
        const response = await api.put(`/change/Password`,
            {
                nuevaContrasena: userData.nuevaContrasena
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        throw error;
    }
}

