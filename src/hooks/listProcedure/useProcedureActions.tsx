import { useCallback } from "react";
import { useProcedureEdit } from "./useProcedureEdit";
import { useProcedureDelete } from "./useProcedureDelete";
import { type Procedure } from "../../services/procedures/procedureService";

interface UseProcedureActionsProps {
  responsibles: any[];
  refetchProcedures: () => Promise<void>;
}

export function useProcedureActions({ responsibles, refetchProcedures }: UseProcedureActionsProps) {
  // Hooks modulares
  const editActions = useProcedureEdit({
    responsibles,
    updateProcedure: async (data: any) => {
      // TODO: Implementar actualización para datos versionados
      console.log("Actualizar procedimiento:", data);
      return { success: true };
    },
    fetchProcedures: refetchProcedures,
  });

  const deleteActions = useProcedureDelete(refetchProcedures);

  // Handlers unificados
  const handleEdit = useCallback((procedure: Procedure) => {
    editActions.startEdit(procedure);
  }, [editActions]);

  const handleDelete = useCallback((procedure: Procedure) => {
    deleteActions.startDelete(procedure);
  }, [deleteActions]);

  return {
    // Handlers
    handleEdit,
    handleDelete,

    // Estados y datos para modales
    editModal: {
      isOpen: editActions.editModalOpen,
      onClose: editActions.closeEdit,
      onSubmit: editActions.handleSubmit,
      data: editActions.editData,
      saving: editActions.saving,
      handlers: {
        handleCheckboxChange: (field: 'es_vigente' | 'es_nueva_version', checked: boolean) => {
          if (editActions.editData) {
            editActions.setEditData({
              ...editActions.editData,
              [field]: checked,
            });
          }
        },
        handleInputChange: (field: any, value: string) => {
          if (editActions.editData) {
            editActions.setEditData({
              ...editActions.editData,
              [field]: value,
            });
          }
        },
        handleFileChange: (file: File | null) => {
          if (editActions.editData) {
            editActions.setEditData({
              ...editActions.editData,
              pdf: file,
            });
          }
        },
      },
      responsibles,
      loadingResponsibles: false,
    },
    deleteModal: {
      isOpen: deleteActions.deleteModalOpen,
      onClose: deleteActions.cancelDelete,
      onConfirm: deleteActions.confirmDelete,
    },
  };
}
