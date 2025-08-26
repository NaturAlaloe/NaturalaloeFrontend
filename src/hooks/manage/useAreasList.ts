import { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
        
        await updateArea(updatePayload);
        showCustomToast("Éxito", "Área actualizada correctamente", "success");
        setModalOpen(false);
        setEditAreaObj(null);
        setAreaInput("");
        setAreaPadreInput(undefined);
      } catch (err: any) {
        // Extrae el mensaje del backend si existe
        const backendMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error al actualizar área";
        showCustomToast("Atención", backendMsg, "info");
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
      } catch (err: any) {
        // Extrae el mensaje del backend si existe
        const backendMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error al agregar área";
        showCustomToast("Atención", backendMsg, "info");
      }
    }
  };

  const handleDelete = async () => {
    if (deleteAreaObj) {
      try {
        await removeArea(deleteAreaObj.id_area);
        showCustomToast("Éxito", "Área eliminada correctamente", "success");
      } catch (err: any) {
        // Extrae el mensaje del backend si existe
        const backendMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error al eliminar área";
        showCustomToast("Atención", backendMsg, "info");
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
    currentPage,
    setCurrentPage,
  };
}