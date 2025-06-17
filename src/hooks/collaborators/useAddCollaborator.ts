import { useState } from "react";
import type { Collaborator } from "../../services/collaborators/addCollaboratorService";
import { addCollaborator } from "../../services/collaborators/addCollaboratorService";

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
      return result;
    } catch (err) {
      setError("Error al agregar colaborador");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleAddCollaborator, loading, error, success };
}
