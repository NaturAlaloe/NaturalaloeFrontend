import { useState } from "react";
import { type Procedure } from "../../services/procedures/procedureService";
import { deleteProcedure } from "../../services/procedures/procedureService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useProcedureDelete(fetchProcedures: () => Promise<void>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null);

  const startDelete = (procedure: Procedure) => {
    setProcedureToDelete(procedure);
    setDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProcedureToDelete(null);
  };

  const confirmDelete = async () => {
    if (!procedureToDelete) return;

    try {
      const result = await deleteProcedure(procedureToDelete.id_documento);
      showCustomToast(
        "Éxito",
        result.message || "Procedimiento eliminado correctamente",
        "success"
      );
      await fetchProcedures();
    } catch (err: any) {
      showCustomToast(
        "Error",
        err.message || "No se pudo eliminar el procedimiento",
        "error"
      );
    } finally {
      setDeleteModalOpen(false);
      setProcedureToDelete(null);
    }
  };

  return {
    deleteModalOpen,
    procedureToDelete,
    startDelete,
    cancelDelete,
    confirmDelete,
  };
}
