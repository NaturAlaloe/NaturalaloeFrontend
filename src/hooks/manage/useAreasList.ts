import { useState } from "react";
import { useAreas } from "./useAreas";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Este hook maneja la lógica de la lista de áreas, incluyendo búsqueda, edición, adición y eliminación de áreas.

export function useAreasList() {
  const { areas, loading, error, addArea } = useAreas();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [areaInput, setAreaInput] = useState("");
  const [areaPadreInput, setAreaPadreInput] = useState<number | undefined>(undefined);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const filteredAreas = Array.isArray(areas)
    ? areas.filter((a) => a.titulo.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleOpenAdd = () => {
    setEditIndex(null);
    setAreaInput("");
    setAreaPadreInput(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (idx: number) => {
    setEditIndex(idx);
    setAreaInput(filteredAreas[idx].titulo);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (areaInput.trim() === "") return;
    if (editIndex !== null) {
      setModalOpen(false);
    } else {
      try {
        await addArea({
          titulo: areaInput,
          id_area_padre: areaPadreInput ?? undefined,
        });
        showCustomToast("Éxito", "Área agregada correctamente", "success");
        setModalOpen(false);
        setAreaInput("");
        setAreaPadreInput(undefined);
      } catch (err) {
        showCustomToast("Error", "Error al agregar área", "error");
      }
    }
  };

  const handleDelete = () => {
    setDeleteIndex(null);
  };

  return {
    areas,
    loading,
    error,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editIndex,
    setEditIndex,
    areaInput,
    setAreaInput,
    areaPadreInput,
    setAreaPadreInput,
    deleteIndex,
    setDeleteIndex,
    filteredAreas,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  };
}