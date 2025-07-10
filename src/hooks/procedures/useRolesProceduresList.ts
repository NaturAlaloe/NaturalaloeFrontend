import { useState, useMemo, useEffect } from "react";
import { useRolesProceduresContext } from "./RolesProceduresContext";
import { getActiveProcedures } from "../../services/procedures/procedureService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Este es el hook que maneja los roles y sus procedimientos  

export function useRolesProceduresList() {
  const { 
    rolesProcedures, 
    loading, 
    saveProcedures, 
    removeProcedures
  } = useRolesProceduresContext();

  // Estados para búsqueda y paginación
  const [search, setSearch] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Estados para modal POE
  const [modalPOEOpen, setModalPOEOpen] = useState(false);
  const [rolActualPOE, setRolActualPOE] = useState<any | null>(null);
  const [procedimientosSeleccionados, setProcedimientosSeleccionados] = useState<number[]>([]);
  const [modalSearchPOE, setModalSearchPOE] = useState("");
  const [procedimientosActivos, setProcedimientosActivos] = useState<any[]>([]);
  const [modalLoadingPOE, setModalLoadingPOE] = useState(false);
  const [savingProcedimientos, setSavingProcedimientos] = useState(false);
  

  // Effect para resetear paginación
  useEffect(() => {
    setResetPaginationToggle(prev => !prev);
  }, [search]);

  // Effect para cargar procedimientos cuando se abre el modal
  useEffect(() => {
    if (modalPOEOpen) {
      setModalLoadingPOE(true);
      
      getActiveProcedures().then((procedimientos) => {
        setProcedimientosActivos(
          procedimientos.map((p: any) => ({
            id_documento: p.id_documento,
            poe: p.id_documento?.toString(),
            codigo: p.codigo,
            titulo: p.titulo,
          }))
        );
        setModalLoadingPOE(false);
      }).catch(() => {
        setModalLoadingPOE(false);
      });
    }
  }, [modalPOEOpen]);

  // Effect para cargar procedimientos asignados cuando se abre el modal
  useEffect(() => {
    if (rolActualPOE && modalPOEOpen) {
      const itemsAsignados = rolActualPOE.procedimientos?.map((p: any) => p.id_documento) || [];
      setProcedimientosSeleccionados(itemsAsignados);
    }
  }, [rolActualPOE, modalPOEOpen]);

  // Filtrar roles
  const rolesFiltrados = useMemo(() => {
    const filtered = rolesProcedures.filter((rol) => {
      const nombreMatch = rol.nombre_rol.toLowerCase().includes(search.toLowerCase());
      const procedimientosMatch = rol.procedimientos?.some((p: any) => 
        p.codigo?.toLowerCase().includes(search.toLowerCase())
      );
      const politicasMatch = rol.politicas?.some((p: any) => 
        p.numero_politica?.toString().toLowerCase().includes(search.toLowerCase())
      );
      return nombreMatch || procedimientosMatch || politicasMatch;
    });

    return filtered.sort((a, b) => {
      const aHasItems = (a.procedimientos && a.procedimientos.length > 0) || 
                       (a.politicas && a.politicas.length > 0);
      const bHasItems = (b.procedimientos && b.procedimientos.length > 0) || 
                       (b.politicas && b.politicas.length > 0);
      
      if (aHasItems && !bHasItems) return -1;
      if (!aHasItems && bHasItems) return 1;
      return 0;
    });
  }, [rolesProcedures, search]);

  // Filtrar procedimientos en el modal
  const procedimientosFiltradosModal = useMemo(() => {
    if (!modalSearchPOE.trim()) {
      return procedimientosActivos;
    }

    const searchTerm = modalSearchPOE.toLowerCase();
    return procedimientosActivos.filter((item: any) => 
      item.id_documento?.toString().toLowerCase().includes(searchTerm) ||
      item.poe?.toLowerCase().includes(searchTerm) ||
      item.codigo?.toLowerCase().includes(searchTerm) ||
      item.titulo?.toLowerCase().includes(searchTerm)
    );
  }, [procedimientosActivos, modalSearchPOE]);

  // Handlers para modal POE
  const handleOpenModalPOE = (rol: any) => {
    setRolActualPOE(rol);
    setModalSearchPOE("");
    setModalPOEOpen(true);
  };

  const handleCloseModalPOE = () => {
    setModalPOEOpen(false);
    setRolActualPOE(null);
    setProcedimientosSeleccionados([]);
    setModalSearchPOE("");
  };

  const handleSaveProcedimientos = async () => {
    if (!rolActualPOE) {
      handleCloseModalPOE();
      return;
    }

    try {
      const seleccionOriginal = rolActualPOE.procedimientos?.map((p: any) => p.id_documento) || [];
      const nuevosElementos = procedimientosSeleccionados.filter(id => !seleccionOriginal.includes(id));
      const elementosEliminados = seleccionOriginal.filter((id: number) => !procedimientosSeleccionados.includes(id));

      console.log(' Enviando cambios POE:', {
        rol: rolActualPOE.nombre_rol,
        nuevos: nuevosElementos,
        eliminados: elementosEliminados
      });

      if (elementosEliminados.length > 0) {
        await removeProcedures(rolActualPOE.id_rol, elementosEliminados);
      }

      if (nuevosElementos.length > 0) {
        await saveProcedures(rolActualPOE.id_rol, nuevosElementos);
      }

      if (nuevosElementos.length === 0 && elementosEliminados.length === 0) {
        showCustomToast("Información", "No hay cambios para guardar", "info");
      } else {
        showCustomToast("Éxito", "Procedimientos actualizados correctamente", "success");
      }
    } catch (error: any) {
      console.error('Error en handleSaveProcedimientos:', error);
      showCustomToast("Error", "No se pudieron guardar los cambios en procedimientos", "error");
    } finally {
      handleCloseModalPOE();
    }
  };

  const handleSeleccionChangePOE = (seleccion: string[]) => {
    const numericSeleccion = seleccion.map(Number);
    setProcedimientosSeleccionados(numericSeleccion);
  };

  const handleSaveProcedimientosWithLoading = async () => {
    setSavingProcedimientos(true);
    try {
      await handleSaveProcedimientos();
    } finally {
      setSavingProcedimientos(false);
    }
  };

  return {
    // Estados compartidos
    loading,
    search,
    setSearch,
    rolesFiltrados,
    resetPaginationToggle,
    
    // Estados y handlers específicos de POE
    modalPOEOpen,
    handleOpenModalPOE,
    handleCloseModalPOE,
    rolActualPOE,
    procedimientosSeleccionados,
    setProcedimientosSeleccionados,
    modalSearchPOE,
    setModalSearchPOE,
    procedimientosFiltradosModal,
    handleSaveProcedimientos,
    handleSaveProcedimientosWithLoading,
    modalLoadingPOE,
    handleSeleccionChangePOE,
    savingProcedimientos,
  };
}