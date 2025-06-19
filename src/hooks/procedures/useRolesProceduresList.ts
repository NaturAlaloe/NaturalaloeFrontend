import { useState, useMemo, useEffect } from "react";
import { useRolesProcedures } from "./useRolesProcedures";
import { getActiveProcedures } from "../../services/procedures/procedureService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useRolesProceduresList() {
  const { rolesProcedures, loading, saveProcedures } = useRolesProcedures();

  // Estados UI
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [rolActual, setRolActual] = useState<any | null>(null);
  const [procedimientosSeleccionados, setProcedimientosSeleccionados] = useState<number[]>([]);
  const [modalSearch, setModalSearch] = useState("");
  const [procedimientosActivos, setProcedimientosActivos] = useState<any[]>([]);

  // Cargar procedimientos activos al abrir el modal
  useEffect(() => {
    if (modalOpen) {
      getActiveProcedures().then((procedimientos) => {
        // Mapear para que tengan los campos que espera el modal
        console.log("Procedimientos activos:", procedimientos); // Para depuración
        setProcedimientosActivos(
          procedimientos.map((p: any) => ({
            id_documento: p.id_documento,
            poe: p.id_documento?.toString(), // Usar id_documento como clave de selección
            titulo: p.titulo,
          }))
        );
      });
    }
  }, [modalOpen]);

  // Filtrar roles por búsqueda
  const rolesFiltrados = useMemo(
    () =>
      rolesProcedures.filter((rol) =>
        rol.nombre_rol.toLowerCase().includes(search.toLowerCase())
      ),
    [rolesProcedures, search]
  );

  // Abrir modal y cargar procedimientos asignados
  const handleOpenModal = (rol: any) => {
    setRolActual(rol);
    setProcedimientosSeleccionados(rol.procedimientos.map((p: any) => p.id_documento));
    setModalSearch("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRolActual(null);
    setProcedimientosSeleccionados([]);
    setModalSearch("");
  };

  // Guardar asignación
  const handleSaveProcedimientos = async () => {
    if (rolActual) {
      try {
        await saveProcedures(rolActual.id_rol, procedimientosSeleccionados);
        showCustomToast("Éxito", "Procedimientos asignados correctamente", "success");
      } catch (error: any) {
        showCustomToast(
          "Error",
          error?.response?.data?.message || "No se pudieron asignar los procedimientos",
          "error"
        );
      }
    }
    handleCloseModal();
  };

  // Procedimientos filtrados en el modal (de todos los activos)
  const procedimientosFiltradosModal =
    procedimientosActivos.filter(
      (p: any) =>
        p.poe?.toLowerCase().includes(modalSearch.toLowerCase()) ||
        p.titulo?.toLowerCase().includes(modalSearch.toLowerCase())
    ) || [];

  return {
    loading,
    search,
    setSearch,
    rolesFiltrados,
    modalOpen,
    handleOpenModal,
    handleCloseModal,
    rolActual,
    procedimientosSeleccionados,
    setProcedimientosSeleccionados,
    modalSearch,
    setModalSearch,
    procedimientosFiltradosModal,
    handleSaveProcedimientos,
  };
}