import { useState, useMemo } from "react";
import { useWorkstations } from "./useWorkstations";

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

  // Form states
  const [workstationInput, setWorkstationInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");

  // Filtro memoizado
  const filteredWorkstations = useMemo(
    () =>
      workstations.filter((w) =>
        (w.titulo_puesto + " " + w.titulo_departamento)
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

  const handleOpenEdit = (idx: number) => {
    setEditIndex(idx);
    setWorkstationInput(filteredWorkstations[idx]?.titulo_puesto || "");
    setDepartmentInput(filteredWorkstations[idx]?.id_departamento?.toString() || "");
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para agregar o editar (POST/PUT)
    setModalOpen(false);
    setEditIndex(null);
    refetch();
  };

  const handleDelete = () => {
    // Aquí iría la lógica para eliminar (DELETE)
    setDeleteIndex(null);
    refetch();
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
    workstationInput,
    setWorkstationInput,
    departmentInput,
    setDepartmentInput,
    filteredWorkstations,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  };
}