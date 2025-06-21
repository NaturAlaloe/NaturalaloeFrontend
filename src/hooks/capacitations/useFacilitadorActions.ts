import { useState } from "react";
import type { Facilitador } from "../../services/listFacilitatorService";
import { deletefacilitator } from "../../services/listFacilitatorService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Este hook maneja las acciones de edición y eliminación de facilitadores

export function useFacilitadorActions(updateFacilitador: (f: Facilitador) => void, removeFacilitador: (id: number) => void) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [facilitadorEditando, setFacilitadorEditando] = useState<Facilitador | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facilitadorAEliminar, setFacilitadorAEliminar] = useState<Facilitador | null>(null);

  const handleEditClick = (facilitador: Facilitador, e: React.MouseEvent) => {
    e.stopPropagation();
    setFacilitadorEditando({ ...facilitador });
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!facilitadorEditando) return;
    setFacilitadorEditando({
      ...facilitadorEditando,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!facilitadorEditando) return;
    updateFacilitador(facilitadorEditando);
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setFacilitadorEditando(null);
  };

  const handleDeleteClick = (facilitador: Facilitador, e: React.MouseEvent) => {
    e.stopPropagation();
    setFacilitadorAEliminar(facilitador);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!facilitadorAEliminar?.id_facilitador) return;
    const success = await deletefacilitator(facilitadorAEliminar.id_facilitador);
    if (success) {
      showCustomToast("Éxito", "Facilitador eliminado exitosamente", "success");
      removeFacilitador(facilitadorAEliminar.id_facilitador);
      setShowDeleteModal(false);
      setFacilitadorAEliminar(null);
    } else {
      showCustomToast("Error", "Error al eliminar el facilitador", "error");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setFacilitadorAEliminar(null);
  };

  return {
    showEditModal,
    facilitadorEditando,
    handleEditClick,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    showDeleteModal,
    facilitadorAEliminar,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
}