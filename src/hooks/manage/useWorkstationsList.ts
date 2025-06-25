import { useState, useMemo, useEffect } from "react";
import { useWorkstations } from "./useWorkstations";
import { addWorkstation, updateWorkstation, deleteWorkstation as deleteWorkstationApi } from "../../services/manage/workstationService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Lógica de UI, modal, filtros, inputs, etc.
export function useWorkstationsList() {
  const {
    workstations,
    loading,
    error,
    refetch,
  } = useWorkstations();

  // UI states
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editWorkstation, setEditWorkstation] = useState<any | null>(null);
  const [deleteWorkstation, setDeleteWorkstation] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Form states
  const [workstationInput, setWorkstationInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");

  // Filtro memoizado
  const filteredWorkstations = useMemo(
    () =>
      workstations.filter((w) =>
        (
          (w.titulo_puesto || w.nombre_puesto || "") +
          " " +
          (w.titulo_departamento || w.nombre_departamento || "")
        )
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [workstations, search]
  );

  // Handlers
  const handleOpenAdd = () => {
    setEditIndex(null);
    setWorkstationInput("");
    setDepartmentInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (workstation: any) => {
    setEditWorkstation(workstation);
    setWorkstationInput(workstation?.titulo_puesto || "");
    setDepartmentInput(workstation?.id_departamento?.toString() || "");
    setModalOpen(true);
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editWorkstation) {
        await updateWorkstation(editWorkstation.id_puesto, {
          titulo: workstationInput,
          id_departamento: Number(departmentInput),
        });
        showCustomToast("Éxito", "Puesto actualizado correctamente", "success");
      } else {
        await addWorkstation({
          id_departamento: Number(departmentInput),
          nombre_puesto: workstationInput,
        });
        showCustomToast("Éxito", "Puesto agregado correctamente", "success");
      }
      setModalOpen(false);
      setEditWorkstation(null);
      refetch();
    } catch (err) {
      showCustomToast("Error al guardar", "Intenta de nuevo", "error");
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteWorkstation) {
        await deleteWorkstationApi(deleteWorkstation.id_puesto);
        showCustomToast("Éxito", "Puesto eliminado correctamente", "success");
      }
      setDeleteWorkstation(null);
      refetch();
    } catch (err) {
      showCustomToast("Error al eliminar", "Intenta de nuevo", "error");
    }
  };

  return {
    workstations,
    loading,
    error,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editIndex,
    setEditIndex,
    deleteIndex,
    setDeleteIndex,
    editWorkstation,
    setEditWorkstation,
    deleteWorkstation,
    setDeleteWorkstation,
    workstationInput,
    setWorkstationInput,
    departmentInput,
    setDepartmentInput,
    filteredWorkstations,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
    currentPage,
    setCurrentPage,
  };
}