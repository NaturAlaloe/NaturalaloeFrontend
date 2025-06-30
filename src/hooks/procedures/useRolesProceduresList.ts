import { useState, useMemo, useEffect, useRef } from "react";

import { useRolesProcedures } from "./useRolesProcedures";
import { getActiveProcedures } from "../../services/procedures/procedureService";
import { getActivePolitics } from "../../services/politics/politicsService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useRolesProceduresList() {
  const { rolesProcedures, loading, saveProcedures, refreshData, removeProcedures } = useRolesProcedures();

  // Estados UI - Agregar loading para el modal
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [rolActual, setRolActual] = useState<any | null>(null);
  const [procedimientosSeleccionados, setProcedimientosSeleccionados] = useState<number[]>([]);
  const [modalSearch, setModalSearch] = useState("");
  const [procedimientosActivos, setProcedimientosActivos] = useState<any[]>([]);
  const [politicasActivas, setPoliticasActivas] = useState<any[]>([]);
  const [tipoAsignacion, setTipoAsignacion] = useState<'poe' | 'politica'>('poe');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [modalLoading, setModalLoading] = useState(false); 


  const prevSeleccionRef = useRef<number[]>([]);


  useEffect(() => {
    setResetPaginationToggle(prev => !prev);
  }, [search]);


  useEffect(() => {
    if (modalOpen) {
      setModalLoading(true);

      Promise.all([
        getActiveProcedures().then((procedimientos) => {
          setProcedimientosActivos(
            procedimientos.map((p: any) => ({
              id_documento: p.id_documento,
              poe: p.id_documento?.toString(),
              codigo: p.codigo,
              titulo: p.titulo,
            }))
          );
        }),

        getActivePolitics().then((politicas) => {
          setPoliticasActivas(
            politicas.map((p: any) => ({
              id_politica: p.id_documento,
              numero_politica: p.codigo?.toString(),
              codigo: p.codigo,
              titulo: p.titulo || p.nombre,
            }))
          );
        })
      ]).finally(() => {
        setModalLoading(false);
      });
    }
  }, [modalOpen]);

  const rolesFiltrados = useMemo(
    () => {
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
    },
    [rolesProcedures, search]
  );

  // Abrir modal y cargar items asignados según el tipo 
  const handleOpenModal = (rol: any) => {
    setRolActual(rol);
    
    let itemsAsignados: number[] = [];
    if (tipoAsignacion === 'poe') {
      itemsAsignados = rol.procedimientos?.map((p: any) => p.id_documento) || [];
    } else {
      itemsAsignados = rol.politicas?.map((p: any) => p.id_politica) || [];
    }
    
    setProcedimientosSeleccionados(itemsAsignados);
    prevSeleccionRef.current = itemsAsignados;
    
    setModalSearch("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRolActual(null);
    setProcedimientosSeleccionados([]);
    setModalSearch("");
  };

  // Guardar asignación según el tipo - VERSIÓN COMPLETAMENTE CORREGIDA
  const handleSaveProcedimientos = async () => {
    if (!rolActual) {
      handleCloseModal();
      return;
    }

    try {
      // Obtener la selección original al abrir el modal
      let seleccionOriginal: number[] = [];
      if (tipoAsignacion === 'poe') {
        seleccionOriginal = rolActual.procedimientos?.map((p: any) => p.id_documento) || [];
      } else {
        seleccionOriginal = rolActual.politicas?.map((p: any) => p.id_politica) || [];
      }

      // Calcular diferencias
      const nuevosElementos = procedimientosSeleccionados.filter(id => !seleccionOriginal.includes(id));
      const elementosEliminados = seleccionOriginal.filter(id => !procedimientosSeleccionados.includes(id));

      console.log('=== GUARDAR CAMBIOS ===');
      console.log('Selección original:', seleccionOriginal);
      console.log('Selección actual:', procedimientosSeleccionados);
      console.log('Nuevos elementos:', nuevosElementos);
      console.log('Elementos eliminados:', elementosEliminados);

      // Procesar eliminaciones primero
      if (elementosEliminados.length > 0) {
        console.log('🗑️ Eliminando elementos:', elementosEliminados);
        if (tipoAsignacion === 'poe') {
          await removeProcedures(rolActual.id_rol, elementosEliminados);
        } else {
          // await removePolitics(rolActual.id_rol, elementosEliminados);
          console.log('Eliminación de políticas pendiente de implementar');
        }
      }

      // Procesar nuevas asignaciones
      if (nuevosElementos.length > 0) {
        console.log('➕ Asignando nuevos elementos:', nuevosElementos);
        if (tipoAsignacion === 'poe') {
          await saveProcedures(rolActual.id_rol, nuevosElementos);
        } else {
          // await savePolitics(rolActual.id_rol, nuevosElementos);
          console.log('Asignación de políticas pendiente de implementar');
        }
      }

      // Mostrar mensaje apropiado
      if (nuevosElementos.length === 0 && elementosEliminados.length === 0) {
        showCustomToast("Información", "No hay cambios para guardar", "info");
      } else {
        const tipoTexto = tipoAsignacion === 'poe' ? 'procedimientos' : 'políticas';
        let mensaje = '';
        if (nuevosElementos.length > 0 && elementosEliminados.length > 0) {
          mensaje = `${tipoTexto} actualizados correctamente`;
        } else if (nuevosElementos.length > 0) {
          mensaje = `${tipoTexto} asignados correctamente`;
        } else {
          mensaje = `${tipoTexto} desasignados correctamente`;
        }
        showCustomToast("Éxito", mensaje, "success");
      }
      
      // Refrescar datos después de cualquier operación
      if (refreshData) {
        await refreshData();
      }
      
    } catch (error: any) {
      console.error('Error en handleSaveProcedimientos:', error);
      showCustomToast(
        "Error",
        error?.response?.data?.message || `No se pudieron guardar los cambios en ${tipoAsignacion === 'poe' ? 'procedimientos' : 'políticas'}`,
        "error"
      );
    } finally {
      // Siempre cerrar el modal al final
      handleCloseModal();
    }
  };

  // Items filtrados en el modal según el tipo seleccionado - MEJORADO CON BÚSQUEDA POR ID
  const itemsFiltradosModal = useMemo(() => {
    const items = tipoAsignacion === 'poe' ? procedimientosActivos : politicasActivas;

    if (!modalSearch.trim()) {
      return items;
    }

    const searchTerm = modalSearch.toLowerCase();

    return items.filter((item: any) => {
      if (tipoAsignacion === 'poe') {
        // Para POE: buscar por ID documento, código y título
        return (
          item.id_documento?.toString().toLowerCase().includes(searchTerm) ||
          item.poe?.toLowerCase().includes(searchTerm) ||
          item.codigo?.toLowerCase().includes(searchTerm) ||
          item.titulo?.toLowerCase().includes(searchTerm)
        );
      } else {
        // Para políticas: buscar por ID, número de política, código y título
        return (
          item.id_politica?.toString().toLowerCase().includes(searchTerm) ||
          item.numero_politica?.toLowerCase().includes(searchTerm) ||
          item.codigo?.toLowerCase().includes(searchTerm) ||
          item.titulo?.toLowerCase().includes(searchTerm)
        );
      }
    });
  }, [tipoAsignacion, procedimientosActivos, politicasActivas, modalSearch]);

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
    procedimientosFiltradosModal: itemsFiltradosModal,
    handleSaveProcedimientos,
    resetPaginationToggle,
    tipoAsignacion,
    setTipoAsignacion,
    modalLoading, // Agregar el nuevo estado
  };
}