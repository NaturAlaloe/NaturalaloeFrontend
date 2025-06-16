import { useState } from "react";
import { useAreas } from "./useAreas";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Este hook maneja la lógica de la lista de áreas, incluyendo búsqueda, edición, adición y eliminación de áreas.

export function useAreasList() {
  const { areas, loading, error, addArea, updateArea, removeArea } = useAreas();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [areaInput, setAreaInput] = useState("");
  const [areaPadreInput, setAreaPadreInput] = useState<number | undefined>(undefined);
  const [deleteAreaObj, setDeleteAreaObj] = useState<any | null>(null);
  const [editAreaObj, setEditAreaObj] = useState<any | null>(null);

  const filteredAreas = Array.isArray(areas)
    ? areas.filter((a) => a.titulo.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleOpenAdd = () => {
    setEditIndex(null);
    setAreaInput("");
    setAreaPadreInput(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (area: any) => {
    setEditAreaObj(area);
    setAreaInput(area.titulo);
    setModalOpen(true);
  };

  const handleOpenDelete = (area: any) => {
    setDeleteAreaObj(area);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (areaInput.trim() === "") return;
    if (editAreaObj) {
      try {
        const updatePayload = {
          id_area: editAreaObj.id_area,
          titulo: areaInput,
          activa: true,
        };
        console.log("Actualizando área con:", updatePayload);
        await updateArea(updatePayload);
        showCustomToast("Éxito", "Área actualizada correctamente", "success");
        setModalOpen(false);
        setEditAreaObj(null);
        setAreaInput("");
        setAreaPadreInput(undefined);
      } catch (err) {
        showCustomToast("Error", "Error al actualizar área", "error");
      }
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

  const handleDelete = async () => {
    if (deleteAreaObj) {
      try {
        await removeArea(deleteAreaObj.id_area);
        showCustomToast("Éxito", "Área eliminada correctamente", "success");
      } catch (err) {
        showCustomToast("Error", "Error al eliminar área", "error");
      }
      setDeleteAreaObj(null);
    }
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
    deleteAreaObj,
    setDeleteAreaObj,
    editAreaObj,
    setEditAreaObj,
    filteredAreas,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDelete,
    handleSave,
    handleDelete,
  };
}