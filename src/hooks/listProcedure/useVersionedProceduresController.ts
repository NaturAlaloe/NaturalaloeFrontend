import { useState, useCallback, useEffect } from "react";
import { useProceduresVersions } from "../proceduresVersionControll/useProceduresVersions";
import { useResponsibles } from "../procedureFormHooks/useResponsibles";
import { useProcedureEdit } from "./useProcedureEdit";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { updateProcedure } from "../../services/procedures/updateProcedureService";
import { increaseVersion } from "../../services/procedures/increaseVersionService";
import { obsoleteProcedure, unobsoleteProcedure, getObsoleteProcedures } from "../../services/procedures/procedureService";

type ProcedureFilter = 'active' | 'obsolete';

export function useVersionedProceduresController() {
  // Hook principal de datos con versiones
  const { 
    procedures: versionProcedures, 
    loading: versionLoading, 
    error: versionError,
    refetch: refetchProcedures
  } = useProceduresVersions();

  // Hook de responsables
  const { responsibles, loading: loadingResponsibles } = useResponsibles();

  // Estado para el filtro de procedimientos
  const [procedureFilter, setProcedureFilter] = useState<ProcedureFilter>('active');
  const [obsoleteProcedures, setObsoleteProcedures] = useState<any[]>([]);
  const [loadingObsolete, setLoadingObsolete] = useState(false);

  // Estado para control de versiones seleccionadas por fila
  const [selectedRevision, setSelectedRevision] = useState<Record<string, number>>({});

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para obsoletar/reactivar
  const [obsoleteModal, setObsoleteModal] = useState<{ open: boolean, id?: number }>({ open: false, id: undefined });
  const [reasonModal, setReasonModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [obsoleteLoading, setObsoleteLoading] = useState(false);

  // Función para cargar procedimientos obsoletos
  const loadObsoleteProcedures = async () => {
    setLoadingObsolete(true);
    try {
      const data = await getObsoleteProcedures();
      console.log("Procedimientos obsoletos cargados:", data);
      setObsoleteProcedures(data);
    } catch (error) {
      console.error("Error loading obsolete procedures:", error);
      showCustomToast("Error", "No se pudieron cargar los procedimientos obsoletos", "error");
      setObsoleteProcedures([]);
    } finally {
      setLoadingObsolete(false);
    }
  };

  // Cargar procedimientos obsoletos cuando se selecciona el filtro
  useEffect(() => {
    if (procedureFilter === 'obsolete') {
      loadObsoleteProcedures();
    }
  }, [procedureFilter]);

  // Función para manejar el cambio de filtro
  const handleFilterChange = (filter: ProcedureFilter) => {
    setProcedureFilter(filter);
    setCurrentPage(1);
    setSearch("");
    setSelectedRevision({});
  };

  // Obtener los procedimientos según el filtro actual
  const currentProcedures = procedureFilter === 'active' ? versionProcedures : obsoleteProcedures;
  const currentLoading = procedureFilter === 'active' ? versionLoading : loadingObsolete;

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter]);

  // Inicializar versiones seleccionadas por defecto con la versión vigente
  useEffect(() => {
    if (currentProcedures.length > 0) {
      const initialSelection: Record<string, number> = {};
      currentProcedures.forEach((proc) => {
        if (proc.versiones && Array.isArray(proc.versiones)) {
          // Buscar la versión vigente (vigente = 1)
          const vigenteIndex = proc.versiones.findIndex((v: { vigente: number }) => v.vigente === 1);
          // Si no hay versión vigente, usar la última versión
          initialSelection[proc.codigo_poe] = vigenteIndex !== -1 ? vigenteIndex : proc.versiones.length - 1;
        }
      });
      setSelectedRevision(initialSelection);
    }
  }, [currentProcedures]);

  // Acciones de edición - solo para procedimientos activos
  const editActions = useProcedureEdit({
    responsibles,
    updateProcedure: async (data: any) => {
      try {
        // Verificar si es nueva versión o actualización existente
        if (data.es_nueva_version) {
          // Crear nueva versión del procedimiento
          const newVersionData = {
            codigo: data.codigo,
            descripcion: data.descripcion,
            id_responsable: Number(data.id_responsable),
            nueva_version: Number(data.revision),
            fecha_creacion: data.fecha_creacion,
            fecha_vigencia: data.fecha_vigencia,
            vigente: data.es_vigente ? 1 : 0,
            version_actual: data.es_vigente ? 1 : 0,
            documento: data.pdf || undefined,
          };
          
          await increaseVersion(newVersionData);
          return { success: true };
        } else {
          // Actualizar procedimiento existente
          const updateData = {
            id_documento: data.id_documento,
            codigo: data.codigo,
            descripcion: data.descripcion,
            id_area: data.id_area,
            id_responsable: Number(data.id_responsable),
            version: Number(data.revision),
            fecha_creacion: data.fecha_creacion,
            fecha_vigencia: data.fecha_vigencia,
            vigente: data.es_vigente ? 1 : 0,
            version_actual: data.es_vigente ? 1 : 0,
            documento: data.pdf || undefined,
          };
          
          await updateProcedure(updateData);
          return { success: true };
        }
      } catch (error: any) {
        console.error("Error al actualizar procedimiento:", error);
        
        let errorMessage = "Error inesperado al actualizar el procedimiento";
        
        if (error?.response?.status === 400) {
          errorMessage = "Datos inválidos. Verifique que todos los campos estén correctos";
        } else if (error?.response?.status === 404) {
          errorMessage = "El procedimiento no fue encontrado";
        } else if (error?.response?.status === 500) {
          errorMessage = "Error interno del servidor. Intente nuevamente";
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        return { 
          success: false, 
          error: errorMessage
        };
      }
    },
    fetchProcedures: procedureFilter === 'active' ? refetchProcedures : loadObsoleteProcedures,
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
      const idx = selectedRevision[row.codigo_poe] ?? row.versiones.length - 1;
      return row.versiones[idx]?.[field] || "";
    }
    return null;
  }, [selectedRevision]);

  // Filtrar procedimientos
  const filteredProcedures = currentProcedures.filter((proc) => {
    const matchesSearch = 
      proc.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.codigo_poe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesDepartment = 
      !departmentFilter || proc.departamento === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Obtener lista única de departamentos
  const departments = Array.from(
    new Set(currentProcedures.map((p) => p.departamento).filter(Boolean))
  );

  // Función para buscar
  const setSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Función para ver PDF
  const handleViewPdf = useCallback((procedure: any) => {
    const versionIndex = selectedRevision[procedure.codigo_poe] ?? procedure.versiones.length - 1;
    const selectedVersion = procedure.versiones[versionIndex];
    
    if (selectedVersion?.ruta_documento) {
      window.open(selectedVersion.ruta_documento, '_blank');
      showCustomToast(
        'Documento abierto exitosamente',
        `Procedimiento ${procedure.codigo_poe} - Versión ${selectedVersion.revision}`,
        'success'
      );
    } else {
      console.warn('No hay archivo PDF disponible para esta versión', selectedVersion);
      showCustomToast(
        'Documento no disponible',
        `No se encontró el archivo PDF para la versión ${selectedVersion?.revision || 'actual'} del procedimiento ${procedure.codigo_poe}`,
        'error'
      );
    }
  }, [selectedRevision]);

  // Handler para marcar como obsoleto o reactivar
  const handleAskObsolete = (id_documento: number) => setObsoleteModal({ open: true, id: id_documento });
  
  const handleAskReason = () => {
    setDeleteReason("");
    setReasonModal(true);
  };

  const handleConfirmAction = async () => {
    if (!obsoleteModal.id || !deleteReason.trim()) return;
    
    setObsoleteLoading(true);
    try {
      if (procedureFilter === 'active') {
        await obsoleteProcedure(obsoleteModal.id, deleteReason);
        showCustomToast("Procedimiento obsoleto", "El procedimiento fue marcado como obsoleto.", "success");
        await refetchProcedures();
      } else {
        await unobsoleteProcedure(obsoleteModal.id, deleteReason);
        showCustomToast("Procedimiento reactivado", "El procedimiento fue reactivado exitosamente.", "success");
        await loadObsoleteProcedures();
      }
      
      setReasonModal(false);
      setObsoleteModal({ open: false, id: undefined });
      setDeleteReason("");
    } catch (e: any) {
      const action = procedureFilter === 'active' ? 'marcar como obsoleto' : 'reactivar';
      showCustomToast("Error", `No se pudo ${action} el procedimiento.`, "error");
    } finally {
      setObsoleteLoading(false);
    }
  };

  return {
    // Datos
    procedures: filteredProcedures,
    loading: currentLoading,
    error: versionError,
    responsibles,
    loadingResponsibles,
    departments,

    // Filtro de procedimientos
    procedureFilter,
    handleFilterChange,

    // Control de versiones
    selectedRevision,
    handleVersionChange,
    getSelectedVersionData,

    // Filtros y búsqueda
    searchTerm,
    setSearchTerm: setSearch,
    departmentFilter,
    setDepartmentFilter,
    currentPage,
    setCurrentPage,

    // Acciones
    handleEdit: (procedure: any) => {
      // Solo permitir edición en procedimientos activos
      if (procedureFilter === 'obsolete') {
        showCustomToast("Información", "No se pueden editar procedimientos obsoletos", "info");
        return;
      }
      
      const versionIndex = selectedRevision[procedure.codigo_poe] ?? procedure.versiones.length - 1;
      const selectedVersion = procedure.versiones[versionIndex];
      
      const editData = {
        id_documento: selectedVersion.id_documento,
        descripcion: selectedVersion.titulo,
        fecha_creacion: procedure.fecha_creacion,
        codigo: procedure.codigo_poe,
        id_poe: null,
        titulo: selectedVersion.titulo,
        departamento: procedure.departamento,
        responsable: selectedVersion.responsable,
        revision: selectedVersion.revision.toString(),
        fecha_vigencia: selectedVersion.fecha_vigencia,
        estado: selectedVersion.vigente === 1 ? 'activo' : 'inactivo',
        path: selectedVersion.ruta_documento || undefined,
        categoria: procedure.categoria,
        id_area: procedure.id_area,
      };
      
      editActions.startEdit(editData);
    },
    handleViewPdf,

    // Props para modal de edición - solo para activos
    editModal: procedureFilter === 'active' ? {
      isOpen: editActions.editModalOpen,
      onClose: editActions.closeEdit,
      onSubmit: editActions.handleSubmit,
      data: editActions.editData ? {
        ...editActions.editData,
      } : null,
      saving: editActions.saving,
      handlers: {
        handleCheckboxChange: (field: 'es_vigente' | 'es_nueva_version', checked: boolean) => {
          if (editActions.editData) {
            const updatedData = {
              ...editActions.editData,
              [field]: checked,
            };

            if (field === 'es_nueva_version' && checked) {
              const currentCode = editActions.editData.codigo;
              if (currentCode) {
                const procedure = versionProcedures.find(p => p.codigo_poe === currentCode);
                if (procedure && procedure.versiones && procedure.versiones.length > 0) {
                  const maxVersion = Math.max(...procedure.versiones.map(v => v.revision));
                  updatedData.revision = (maxVersion + 1).toString();
                  
                  showCustomToast(
                    "Nueva versión calculada",
                    `Se ha asignado automáticamente la versión ${maxVersion + 1}`,
                    "info"
                  );
                }
              }
              
              updatedData.es_vigente = true;
            }

            editActions.setEditData(updatedData);
          }
        },
        handleInputChange: (field: any, value: string) => {
          if (editActions.editData) {
            const updatedData = {
              ...editActions.editData,
              [field]: value,
            };

            if (field === 'revision' && editActions.editData.es_nueva_version) {
              const currentCode = editActions.editData.codigo;
              const newVersion = Number(value);
              
              if (currentCode && newVersion > 0) {
                const procedure = versionProcedures.find(p => p.codigo_poe === currentCode);
                if (procedure && procedure.versiones) {
                  const versionExists = procedure.versiones.some(v => v.revision === newVersion);
                  if (versionExists) {
                    showCustomToast(
                      "Versión duplicada",
                      `La versión ${newVersion} ya existe para este procedimiento`,
                      "error"
                    );
                    return;
                  }
                }
              }
            }

            editActions.setEditData(updatedData);
          }
        },
        handleFileChange: (file: File | null) => {
          if (editActions.editData) {
            editActions.setEditData({
              ...editActions.editData,
              pdf: file,
            });
          }
        },
      },
      responsibles,
      loadingResponsibles: false,
    } : {
      isOpen: false,
      onClose: () => {},
      onSubmit: () => {},
      data: null,
      saving: false,
      handlers: {
        handleCheckboxChange: () => {},
        handleInputChange: () => {},
        handleFileChange: () => {},
      },
      responsibles: [],
      loadingResponsibles: false,
    },

    // Props para modal de obsoletar/reactivar
    obsoleteModal,
    setObsoleteModal,
    reasonModal,
    setReasonModal,
    deleteReason,
    setDeleteReason,
    obsoleteLoading,
    handleAskObsolete,
    handleAskReason,
    handleConfirmAction,
  };
}