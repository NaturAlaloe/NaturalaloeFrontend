import { useEffect, useState, useMemo } from "react";
import type { Facilitador } from "../../services/listFacilitatorService";
import {
  getFacilitadores,
  deleteFacilitador,
  updateFacilitadorById,
} from "../../services/listFacilitatorService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useFacilitadores() {
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [facilitadorEditando, setFacilitadorEditando] = useState<Facilitador | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [facilitadorAEliminar, setFacilitadorAEliminar] = useState<Facilitador | null>(null);

  useEffect(() => {
    setLoading(true);
    getFacilitadores()
      .then((data) => setFacilitadores(data))
      .catch(() => showCustomToast("Error", "No se pudieron cargar los facilitadores", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Resetear página cuando cambie el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return facilitadores.filter((f) =>
      f.nombre.toLowerCase().includes(term) ||
      f.apellido1.toLowerCase().includes(term) ||
      f.apellido2.toLowerCase().includes(term) ||
      f.tipo_facilitador.toLowerCase().includes(term)
    );
  }, [facilitadores, searchTerm]);

  const handleEditClick = (facilitador: Facilitador, e: React.MouseEvent) => {
    e.stopPropagation();
    setFacilitadorEditando({ ...facilitador });
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!facilitadorEditando) return;
    const { name, value } = e.target;
    setFacilitadorEditando({
      ...facilitadorEditando,
      [name]: value,
    });
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!facilitadorEditando) return;

    const { id_facilitador, nombre, apellido1, apellido2 } = facilitadorEditando;

    if (!nombre.trim() || !apellido1.trim() || !apellido2.trim()) {
      showCustomToast("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    console.log("Datos a enviar para editar:", {
      id_facilitador,
      nombre: nombre.trim(),
      apellido1: apellido1.trim(),
      apellido2: apellido2.trim(),
    });
    const success = await updateFacilitadorById(id_facilitador, {
      nombre: nombre.trim(),
      apellido1: apellido1.trim(),
      apellido2: apellido2.trim(),
    });

    if (success) {
      setFacilitadores((prev) =>
        prev.map((f) => (f.id_facilitador === id_facilitador ? { ...facilitadorEditando } : f))
      );
      showCustomToast("Éxito", "Facilitador actualizado correctamente", "success");
      setShowEditModal(false);
      setFacilitadorEditando(null);
    } else {
      showCustomToast("Error", "Error al actualizar el facilitador", "error");
    }
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
    if (!facilitadorAEliminar) return;
    const { id_facilitador } = facilitadorAEliminar;
    const success = await deleteFacilitador(id_facilitador);

    if (success) {
      setFacilitadores((prev) => prev.filter((f) => f.id_facilitador !== id_facilitador));
      showCustomToast("Éxito", "Facilitador eliminado exitosamente", "success");
    } else {
      showCustomToast("Error", "Error al eliminar el facilitador", "error");
    }

    setShowDeleteModal(false);
    setFacilitadorAEliminar(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setFacilitadorAEliminar(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    filtered,
    currentPage,
    setCurrentPage,
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
    loading,
  };
}
