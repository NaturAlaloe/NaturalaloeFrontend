import { useState } from "react";
import type { userPasswordUpdate } from "../../services/updatePassword/updatePasswordService";
import { updateUserPassword } from "../../services/updatePassword/updatePasswordService";
import axios from "axios";
import { showCustomToast } from "../../components/globalComponents/CustomToaster"; // <-- Agrega esta línea


export function useEditUser() {
    const [loading, setLoading] = useState(false);
    const [error] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleEditUser = async (userData: userPasswordUpdate) => {
        try {
            const result = await updateUserPassword(userData);
            setSuccess(true);
            return result;
        } catch (err: any) {

            if (axios.isAxiosError(err)) {

                if (err.response?.status === 400) {
                    showCustomToast("Información", 'Datos faltantes', "info");
                } else if (err.response?.status === 401) {
                    showCustomToast("Información", "Contraseña actual incorrecta o token inválido.", "info");
                }else if (err.response?.status === 404) {
                    showCustomToast("Información", "Usuario no encontrado", "info");
                }else if (err.response?.status === 500) {
                    showCustomToast("Error", "Error del servidor, por favor intenta más tarde.", "error");
                } else {
                    showCustomToast("Error", err.message, "error");
                }
            } else {
                showCustomToast("Error al actualizar la contraseña", err.message, "error");
            }
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return { handleEditUser, loading, error, success };
}
