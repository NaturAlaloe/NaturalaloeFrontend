import { useState, useCallback, useEffect } from "react";
import { useProceduresVersions } from "../proceduresVersionControll/useProceduresVersions";
import { useResponsibles } from "../procedureFormHooks/useResponsibles";
import { useProcedureEdit } from "./useProcedureEdit";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { updateProcedure } from "../../services/procedures/updateProcedureService";
import { increaseVersion } from "../../services/procedures/increaseVersionService";
import { obsoleteProcedure } from "../../services/procedures/procedureService";

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

  // Estado para control de versiones seleccionadas por fila
  const [selectedRevision, setSelectedRevision] = useState<Record<string, number>>({});

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para obsoletar
  const [obsoleteModal, setObsoleteModal] = useState<{ open: boolean, id?: number }>({ open: false, id: undefined });
  const [reasonModal, setReasonModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [obsoleteLoading, setObsoleteLoading] = useState(false);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter]);

  // Inicializar versiones seleccionadas por defecto con la versión vigente
  useEffect(() => {
    if (versionProcedures.length > 0) {
      const initialSelection: Record<string, number> = {};
      versionProcedures.forEach((proc) => {
        // Buscar la versión vigente (vigente = 1)
        const vigenteIndex = proc.versiones.findIndex(v => v.vigente === 1);
        // Si no hay versión vigente, usar la última versión
        initialSelection[proc.codigo_poe] = vigenteIndex !== -1 ? vigenteIndex : proc.versiones.length - 1;
      });
      setSelectedRevision(initialSelection);
    }
  }, [versionProcedures]);

  // Acciones de edición
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
            version_actual: data.es_vigente ? 1 : 0, // Si es vigente, también es versión actual
            documento: data.pdf || undefined,
          };
          
          await increaseVersion(newVersionData);
          return { success: true };
        } else {
          // Actualizar procedimiento existente usando PUT /procedureList
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
            version_actual: data.es_vigente ? 1 : 0, // Si es vigente, también es versión actual
            documento: data.pdf || undefined,
          };
          
          await updateProcedure(updateData);
          return { success: true };
        }
      } catch (error: any) {
        console.error("Error al actualizar procedimiento:", error);
        
        // Mejorar el manejo de errores con mensajes más específicos
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
    fetchProcedures: refetchProcedures,
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
  const filteredProcedures = versionProcedures.filter((proc) => {
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
    new Set(versionProcedures.map((p) => p.departamento).filter(Boolean))
  );

  // Función para ver PDF
  const handleViewPdf = useCallback((procedure: any) => {
    // Obtener la versión seleccionada del procedimiento
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

  // Handler para marcar como obsoleto
  const handleAskObsolete = (id_documento: number) => setObsoleteModal({ open: true, id: id_documento });
  const handleConfirmObsolete = async () => {
    if (!obsoleteModal.id || !deleteReason.trim()) return;
    setObsoleteLoading(true);
    try {
      await obsoleteProcedure(obsoleteModal.id, deleteReason);
      showCustomToast("Procedimiento obsoleto", "El procedimiento fue marcado como obsoleto.", "success");
      setReasonModal(false);
      setObsoleteModal({ open: false, id: undefined });
      setDeleteReason("");
      refetchProcedures();
    } catch (e) {
      showCustomToast("Error", "No se pudo marcar como obsoleto.", "error");
    } finally {
      setObsoleteLoading(false);
    }
  };

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
    currentPage,
    setCurrentPage,

    // Acciones
    handleEdit: (procedure: any) => {
      // Obtener la versión seleccionada del procedimiento
      const versionIndex = selectedRevision[procedure.codigo_poe] ?? procedure.versiones.length - 1;
      const selectedVersion = procedure.versiones[versionIndex];
      
      // Preparar los datos en el formato que espera useProcedureEdit
      const editData = {
        // Campos requeridos por la interfaz Procedure
        id_documento: selectedVersion.id_documento,
        descripcion: selectedVersion.titulo,
        fecha_creacion: procedure.fecha_creacion,
        codigo: procedure.codigo_poe,
        id_poe: null, // No disponible en la nueva estructura
        titulo: selectedVersion.titulo, // useProcedureEdit usa este campo para el mapeo
        departamento: procedure.departamento,
        responsable: selectedVersion.responsable, // useProcedureEdit usa este campo para buscar el ID
        revision: selectedVersion.revision.toString(),
        fecha_vigencia: selectedVersion.fecha_vigencia,
        estado: selectedVersion.vigente === 1 ? 'activo' : 'inactivo',
        path: selectedVersion.ruta_documento || undefined, // Ruta del PDF actual
        // Agregar campos adicionales necesarios para la actualización
        categoria: procedure.categoria,
        id_area: procedure.id_area,
      };
      
      editActions.startEdit(editData);
    },
    handleViewPdf,

    // Props para modal de edición
    editModal: {
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

            // Si se marca "es_nueva_version", calcular automáticamente la próxima versión
            if (field === 'es_nueva_version' && checked) {
              const currentCode = editActions.editData.codigo;
              if (currentCode) {
                // Buscar el procedimiento en la lista para obtener todas sus versiones
                const procedure = versionProcedures.find(p => p.codigo_poe === currentCode);
                if (procedure && procedure.versiones && procedure.versiones.length > 0) {
                  // Encontrar la versión más alta
                  const maxVersion = Math.max(...procedure.versiones.map(v => v.revision));
                  updatedData.revision = (maxVersion + 1).toString();
                  
                  showCustomToast(
                    "Nueva versión calculada",
                    `Se ha asignado automáticamente la versión ${maxVersion + 1}`,
                    "info"
                  );
                }
              }
              
              // Marcar automáticamente como vigente cuando es nueva versión
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

            // Validación especial para el campo de revisión cuando es nueva versión
            if (field === 'revision' && editActions.editData.es_nueva_version) {
              const currentCode = editActions.editData.codigo;
              const newVersion = Number(value);
              
              if (currentCode && newVersion > 0) {
                // Buscar el procedimiento en la lista para validar que no exista esa versión
                const procedure = versionProcedures.find(p => p.codigo_poe === currentCode);
                if (procedure && procedure.versiones) {
                  const versionExists = procedure.versiones.some(v => v.revision === newVersion);
                  if (versionExists) {
                    showCustomToast(
                      "Versión duplicada",
                      `La versión ${newVersion} ya existe para este procedimiento`,
                      "error"
                    );
                    return; // No actualizar si la versión ya existe
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
    },

    // Props para modal de obsoletar
    obsoleteModal,
    setObsoleteModal,
    reasonModal,
    setReasonModal,
    deleteReason,
    setDeleteReason,
    obsoleteLoading,
    handleAskObsolete,
    handleConfirmObsolete,
  };
}
