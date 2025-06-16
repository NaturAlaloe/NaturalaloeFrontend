import { useState, useMemo } from "react";
import { useDepartments } from "./useDepartments";
import { useAreas } from "./useAreas";

// Este hook maneja la lógica del listado de departamentos y su interacción con áreas

export function useDepartmentsList() {
  const {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();
  const { areas, loading: loadingAreas } = useAreas();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [departmentInput, setDepartmentInput] = useState("");
  const [areaInput, setAreaInput] = useState<number | "">("");
  const [codigoInput, setCodigoInput] = useState<number | "">("");

  const filteredDepartments = useMemo(
    () =>
      Array.isArray(departments)
        ? departments.filter((d) =>
            d.titulo_departamento.toLowerCase().includes(search.toLowerCase()) ||
            d.titulo_area?.toLowerCase().includes(search.toLowerCase()) ||
            (d.codigo?.toString() ?? "").includes(search)
          )
        : [],
    [departments, search]
  );

  // Abrir modal para agregar
  const handleOpenAdd = () => {
    setEditIndex(null);
    setDepartmentInput("");
    setAreaInput("");
    setCodigoInput("");
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (idx: number) => {
    const dep = filteredDepartments[idx];
    setEditIndex(idx);
    setDepartmentInput(dep.titulo_departamento);
    setAreaInput(dep.id_area);
    setCodigoInput(dep.codigo);
    setModalOpen(true);
  };

  // Guardar (agregar o editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentInput.trim() || !areaInput || !codigoInput) return;
    if (editIndex !== null) {
      const dep = filteredDepartments[editIndex];
      await updateDepartment(dep.id_departamento, {
        titulo: departmentInput,
        id_area: Number(areaInput),
        codigo: Number(codigoInput),
      });
    } else {
      await addDepartment({
        titulo: departmentInput,
        id_area: Number(areaInput),
        codigo: Number(codigoInput),
      });
    }
    setModalOpen(false);
    setDepartmentInput("");
    setAreaInput("");
    setCodigoInput("");
    setEditIndex(null);
  };

  // Eliminar
  const handleDelete = async () => {
    if (deleteIndex === null) return;
    const dep = filteredDepartments[deleteIndex];
    await deleteDepartment(dep.id_departamento);
    setDeleteIndex(null);
  };

  return {
    areas,
    loading,
    loadingAreas,
    error,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editIndex,
    setEditIndex,
    deleteIndex,
    setDeleteIndex,
    departmentInput,
    setDepartmentInput,
    areaInput,
    setAreaInput,
    codigoInput,
    setCodigoInput,
    filteredDepartments,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  };
}