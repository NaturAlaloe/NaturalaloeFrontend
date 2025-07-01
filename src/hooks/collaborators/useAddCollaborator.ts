import { useState } from "react";
import type { Collaborator } from "../../services/collaborators/addCollaboratorService";
import { addCollaborator } from "../../services/collaborators/addCollaboratorService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster"; // <-- Agrega esta línea
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
        if (status === 409) {
          showCustomToast("Información", ' La cédula o el correo electrónico ya está en uso.', "info");
        } else if (status === 500) {
          showCustomToast("Error", "Error al insertar colaborador desde el servidor", "error");
        }
      } else {
        showCustomToast("Error", err.message, "error");
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddCollaborator, loading, error, success };
}
