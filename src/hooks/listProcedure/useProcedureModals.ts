import { useState } from "react";

export function useProcedureModals() {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const openDetailsModal = () => {
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
  };

  return {
    detailsModalOpen,
    openDetailsModal,
    closeDetailsModal,
  };
}
