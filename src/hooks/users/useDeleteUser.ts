import { useState } from "react";
import  {type UserDelete, deleteUser } from "../../services/users/deleteUserService";
import axios from "axios";
import { showCustomToast } from "../../components/globalComponents/CustomToaster"; 


export function DeleteUser() {
    const [loading, setLoading] = useState(false);
    const [error] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleDeleteUser = async (userData: UserDelete) => {
        try {
            const result = await deleteUser(userData);
            setSuccess(true);
            return result;
        } catch (err: any) {

            if (axios.isAxiosError(err)) {

                if (err.response?.status === 404) {
                    showCustomToast("Información", 'Colaborador no encontrado.', "info");
                } else if (err.response?.status === 500) {
                    showCustomToast("Error", "Error del servidor, por favor intenta más tarde.", "error");
                } else {
                    showCustomToast("Error", err.message, "error");
                }
            } else {
                showCustomToast("Error al actualizar colaborador", err.message, "error");
            }
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return { handleDeleteUser, loading, error, success };
}
