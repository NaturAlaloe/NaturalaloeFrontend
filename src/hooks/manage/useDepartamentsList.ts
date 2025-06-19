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
  const [deleteIndex, setDeleteIndex] = useState<{ id_departamento: number } | null>(null);
  const [departmentInput, setDepartmentInput] = useState("");
  const [areaInput, setAreaInput] = useState<number | "">("");
  const [codigoInput, setCodigoInput] = useState<number | "">("");
  const [editDepartment, setEditDepartment] = useState<any | null>(null);
  const filteredDepartments = useMemo(
    () =>
      Array.isArray(departments)
        ? departments.filter((d) =>
            d.titulo_departamento.toLowerCase().includes(search.toLowerCase()) ||
            d.titulo_area?.toLowerCase().includes(search.toLowerCase()) ||
            (d.codigo?.toString() ?? "").includes(search) ||
            (d.codigo_departamento?.toString() ?? "").includes(search)
          )
        : [],
    [departments, search]
  );

  // Abrir modal para agregar
  const handleOpenAdd = () => {
    setEditIndex(null);
    setEditDepartment(null);
    setDepartmentInput("");
    setAreaInput("");
    setCodigoInput("");
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (dep: any) => {
    setEditDepartment(dep);
    setEditIndex(null); // ya no lo necesitas para editar
    setDepartmentInput(dep.titulo_departamento);
    setAreaInput(dep.id_area);
    setCodigoInput(dep.codigo_departamento ?? dep.codigo ?? "");
    setModalOpen(true);
  };

  // Guardar (agregar o editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentInput.trim()) return;
    if (editDepartment) {
      const payload = {
        titulo: departmentInput,
        codigo: Number(codigoInput),
        id_departamento: editDepartment.id_departamento,
        id_area: Number(areaInput), // <-- AGREGA ESTA LÍNEA
      };
      await updateDepartment(editDepartment.id_departamento, payload);
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
    setEditDepartment(null);
  };

  // Eliminar
  const handleDelete = async () => {
    if (!deleteIndex) return;
    await deleteDepartment(deleteIndex.id_departamento);
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
    editDepartment,
    setEditDepartment,
    filteredDepartments,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  };
}