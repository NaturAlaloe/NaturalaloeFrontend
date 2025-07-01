import { useState } from "react";
import type { Collaborator } from "../../services/collaborators/addCollaboratorService";
import { addCollaborator } from "../../services/collaborators/addCollaboratorService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useAddCollaborator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Recibe los datos del colaborador y los envía al servicio
  const handleAddCollaborator = async (collaboratorData: Collaborator) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await addCollaborator(collaboratorData);
      setSuccess(!!result);
      showCustomToast("Éxito", "Colaborador agregado correctamente.", "success");
      return result;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "";
      if (msg.includes('cedula')) {
        showCustomToast("Error", "Ya existe un colaborador con esa cédula.", "error");
      } else if (msg.includes('telefono')) {
        showCustomToast("Error", "Ya existe un colaborador con ese teléfono.", "error");
      } else if (msg.includes('correo')) {
        showCustomToast("Error", "Ya existe un colaborador con ese correo.", "error");
      } else if (msg.includes('repetido')) {
        showCustomToast("Error", "Hay campos repetidos.", "error");
      } else {
        showCustomToast("Error", "Error al agregar colaborador.", "error");
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleAddCollaborator, loading, error, success };
}
