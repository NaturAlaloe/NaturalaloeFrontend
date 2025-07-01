import { useState } from "react";
import type { Collaborator } from "../../services/collaborators/addCollaboratorService";
import { addCollaborator } from "../../services/collaborators/addCollaboratorService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import axios from "axios";

export function useAddCollaborator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddCollaborator = async (collaboratorData: Collaborator) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await addCollaborator(collaboratorData);
      setSuccess(true);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const errorMessage = err.response?.data?.message?.toLowerCase() || '';
        
        if (status === 409) {
          if (errorMessage.includes('cédula') || errorMessage.includes('cedula')) {
            showCustomToast("Información", 'La cédula ya está en uso.', "info");
          } else if (errorMessage.includes('correo') || errorMessage.includes('email')) {
            showCustomToast("Información", 'El correo electrónico ya está en uso.', "info");
          } else {
            showCustomToast("Información", 'Datos duplicados. La cédula o correo ya están en uso.', "info");
          }
        } else if (status === 500) {
          showCustomToast("Error", "Error al insertar colaborador desde el servidor", "error");
        } else {
          showCustomToast("Error", "Error desconocido al agregar colaborador", "error");
        }
      } else {
        showCustomToast("Error", err.message || "Error al agregar colaborador", "error");
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddCollaborator, loading, error, success };
}