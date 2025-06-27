import { useState, useCallback } from "react";
import { useProceduresVersions } from "../proceduresVersionControll/useProceduresVersions";
import { useResponsibles } from "../procedureFormHooks/useResponsibles";
import { useProcedureActions } from "./useProcedureActions";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useVersionedProceduresController() {
  // Hook principal de datos con versiones
  const { 
    procedures: versionProcedures, 
    loading: versionLoading, 
    error: versionError,
  } = useProceduresVersions();

  // Hook de responsables
  const { responsibles, loading: loadingResponsibles } = useResponsibles();

  // Estado para control de versiones seleccionadas por fila
  const [selectedRevision, setSelectedRevision] = useState<Record<string, number>>({});

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  // Función mock para refetch (hasta implementar actualización de versiones)
  const refetchProcedures = useCallback(async () => {
    console.log("Refetching procedures...");
    // TODO: Implementar refetch real cuando se implemente el update
  }, []);

  // Acciones unificadas (edit, delete)
  const procedureActions = useProcedureActions({
    responsibles,
    refetchProcedures,
  });

  // Handler estable para cambiar versión seleccionada
  const handleVersionChange = useCallback((codigo: string, versionIndex: number) => {
    setSelectedRevision(prev => ({
      ...prev,
      [codigo]: versionIndex
    }));
  }, []);

  // Helper para obtener datos de la versión seleccionada
  const getSelectedVersionData = useCallback((row: any, field: string) => {
    if (row.versiones && Array.isArray(row.versiones)) {
      const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
      return row.versiones[idx]?.[field] || "";
    }
    return null;
  }, [selectedRevision]);

  // Filtrar procedimientos
  const filteredProcedures = versionProcedures.filter((proc) => {
    const matchesSearch = 
      proc.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesDepartment = 
      !departmentFilter || proc.departamento === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Obtener lista única de departamentos
  const departments = Array.from(
    new Set(versionProcedures.map((p) => p.departamento).filter(Boolean))
  );

  // Función para ver PDF
  const handleViewPdf = useCallback((procedure: any) => {
    // Obtener la versión seleccionada del procedimiento
    const versionIndex = selectedRevision[procedure.codigo] ?? procedure.versiones.length - 1;
    const selectedVersion = procedure.versiones[versionIndex];
    
    if (selectedVersion?.pdf) {
      // TODO: Abrir el PDF en una nueva ventana cuando se resuelvan los problemas de rutas
      // window.open(selectedVersion.pdf, '_blank');
      console.log('Ruta del archivo PDF:', selectedVersion.pdf);
      console.log('Versión seleccionada:', selectedVersion.version);
      console.log('Código del procedimiento:', procedure.codigo);
      showCustomToast(
        'PDF disponible',
        `El PDF de la versión ${selectedVersion.version} del procedimiento ${procedure.codigo} está disponible.`,
        'success'
      );
    } else {
      console.warn('No hay archivo PDF disponible para esta versión', selectedVersion);
      showCustomToast(
        'PDF no disponible',
        'No hay archivo PDF disponible para esta versión del procedimiento.',
        'error'
      );
    }
  }, [selectedRevision]);

  return {
    // Datos
    procedures: filteredProcedures,
    loading: versionLoading,
    error: versionError,
    responsibles,
    loadingResponsibles,
    departments,

    // Control de versiones
    selectedRevision,
    handleVersionChange,
    getSelectedVersionData,

    // Filtros y búsqueda
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,

    // Acciones
    handleEdit: procedureActions.handleEdit,
    handleDelete: procedureActions.handleDelete,
    handleViewPdf,

    // Props para modales
    editModal: procedureActions.editModal,
    deleteModal: procedureActions.deleteModal,
  };
}
