import { useState } from "react";
import type { CollaboratorUpdate } from "../../services/collaborators/editCollaboratorService";
import { updateCollaborator } from "../../services/collaborators/editCollaboratorService";
import axios from "axios";
import { showCustomToast } from "../../components/globalComponents/CustomToaster"; // <-- Agrega esta línea


export function useEditCollaborator() {
    const [loading, setLoading] = useState(false);
    const [error] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleEditCollaborator = async (collaboratorData: CollaboratorUpdate) => {
        try {
            const result = await updateCollaborator(collaboratorData);
            setSuccess(true);
            return result;
        } catch (err: any) {

            if (axios.isAxiosError(err)) {

                if (err.response?.status === 400) {
                    showCustomToast("Información", 'Debe enviar al menos número o correo para actualizar el colaborador', "info");
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

    return { handleEditCollaborator, loading, error, success };
}
