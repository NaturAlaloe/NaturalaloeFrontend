import { useState } from "react";
import { obsoleteManapol, reactivateManapol } from "../../services/manapol/manapolService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

interface UseObsoleteManapolProps {
  onSuccess: () => Promise<void>;
}

export function useObsoleteManapol({ onSuccess }: UseObsoleteManapolProps) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [obsoleteLoading, setObsoleteLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<{ id: number; isObsolete: boolean } | null>(null);

  const handleAskObsolete = (id: number, isObsolete: boolean = false) => {
    setSelectedRecord({ id, isObsolete });
    setConfirmModalOpen(true);
  };

  const handleAskReason = () => {
    setDeleteReason("");
    setConfirmModalOpen(false);
    setReasonModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRecord || !deleteReason.trim()) return;
    
    setObsoleteLoading(true);
    try {
      if (selectedRecord.isObsolete) {
        // Reactivar
        await reactivateManapol(selectedRecord.id, deleteReason);
        showCustomToast(
          "Registro reactivado", 
          "El registro Manapol fue reactivado exitosamente.", 
          "success"
        );
      } else {
        // Obsoletar
        await obsoleteManapol(selectedRecord.id, deleteReason);
        showCustomToast(
          "Registro obsoleto", 
          "El registro Manapol fue marcado como obsoleto.", 
          "success"
        );
      }
      
      await onSuccess();
      handleCloseModals();
      
    } catch (error: any) {
      const action = selectedRecord.isObsolete ? 'reactivar' : 'marcar como obsoleto';
      showCustomToast(
        "Error", 
        error.message || `No se pudo ${action} el registro.`, 
        "error"
      );
    } finally {
      setObsoleteLoading(false);
    }
  };

  const handleCloseModals = () => {
    setConfirmModalOpen(false);
    setReasonModalOpen(false);
    setDeleteReason("");
    setSelectedRecord(null);
  };

  return {
    // Estados
    confirmModalOpen,
    reasonModalOpen,
    deleteReason,
    obsoleteLoading,
    selectedRecord,

    // Funciones
    handleAskObsolete,
    handleAskReason,
    handleConfirmAction,
    handleCloseModals,
    setDeleteReason,
  };
}
