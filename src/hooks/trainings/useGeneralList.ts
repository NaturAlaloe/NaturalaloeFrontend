import { useState, useEffect } from "react";
import type { General } from "../../services/trainings/generalListService";
import {
  getGenerales,
  createGeneral,
  updateGeneralById,
  deleteGeneralById,
} from "../../services/trainings/generalListService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useGenerales() {
  const [generales, setGenerales] = useState<General[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState<General | null>(null);
  const [selected, setSelected] = useState<General | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenerales = async () => {
      try {
        const data = await getGenerales();
        setGenerales(data);
      } catch (error) {
        console.error("Error al obtener los generales", error);
        showCustomToast("", "Error al obtener los generales");
      } finally {
        setLoading(false);
      }
    };

    fetchGenerales();
  }, []);

  const openAdd = () => {
    setEditing({ id: 0, codigo: "", titulo: "" });
    setModalOpen(true);
  };

  const openEdit = (general: General) => {
    setEditing(general);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  // *** Nuevo para eliminar ***
  const openDelete = (general: General) => {
    setSelected(general);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelected(null);
  };

  const updateGeneral = async (general: General) => {
    try {
      if (general.id === 0) {
        const response = await createGeneral({
          codigo: general.codigo,
          descripcion: general.titulo,
        });

        const nuevo: General = {
          id: response.data.data?.id_general || Math.floor(Math.random() * 10000),
          codigo: general.codigo,
          titulo: general.titulo,
        };

        setGenerales((prev) => [...prev, nuevo]);
        showCustomToast("Exito", "General creado correctamente");
      } else {
        await updateGeneralById(general.id, {
          codigo: general.codigo,
          descripcion: general.titulo,
        });

        setGenerales((prev) =>
          prev.map((g) => (g.id === general.id ? general : g))
        );
        showCustomToast("Exito", "General actualizado correctamente");
      }

      closeModal();
    } catch (error) {
      console.error("Error al guardar el general", error);
      showCustomToast("Error", "No se pudo guardar el general");
    }
  };

  const deleteGeneral = async (id: number) => {
    try {
      await deleteGeneralById(id);
      setGenerales((prev) => prev.filter((g) => g.id !== id));
      showCustomToast("Exito", "General eliminado correctamente");
      closeDeleteModal();
    } catch (error) {
      console.error("Error al eliminar general", error);
      showCustomToast("Error", "No se pudo eliminar el general");
    }
  };

  return {
    generales,
    loading,
    modalOpen,
    editing,
    selected,
    deleteModalOpen,
    setEditing,
    openAdd,
    openEdit,
    openDelete,
    closeModal,
    closeDeleteModal,
    updateGeneral,
    deleteGeneral,
  };
}
