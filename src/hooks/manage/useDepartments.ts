import { useEffect, useState } from "react";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/manage/departmentService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

//Este hook maneja la lógica del crud de departamentos

export function useDepartments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      setError("Error al obtener departamentos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (department: { titulo: string; id_area: number; codigo: number }) => {
    setLoading(true);
    setError(null);
    try {
      await addDepartment(department);
      await fetchDepartments();
      showCustomToast("Éxito", "Departamento agregado correctamente", "success");
      return true;
    } catch (err) {
      setError("Error al agregar departamento");
      showCustomToast("Error", "Error al agregar departamento", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEditDepartment = async (
    id: number,
    department: { titulo: string; codigo: number; id_departamento: number; id_area: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      await updateDepartment(id, department);
      await fetchDepartments();
      showCustomToast("Éxito", "Departamento actualizado correctamente", "success");
      return true;
    } catch (err) {
      setError("Error al actualizar departamento");
      showCustomToast("Error", "Error al actualizar departamento", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteDepartment(id);
      await fetchDepartments();
      showCustomToast("Éxito", "Departamento eliminado correctamente", "success");
      return true;
    } catch (err: any) {
      // Extrae el mensaje del backend si existe
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error al eliminar departamento";
      setError(backendMsg);
      showCustomToast("Error", backendMsg, "info");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    addDepartment: handleAddDepartment,
    updateDepartment: handleEditDepartment,
    deleteDepartment: handleDeleteDepartment,
    refetch: fetchDepartments,
  };
}