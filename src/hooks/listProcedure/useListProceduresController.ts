import { useState } from "react";
import { useProceduresList, type Procedure } from "./useProceduresList";
import { useResponsibles } from "../procedureFormHooks/useResponsibles";
import { useProcedureEdit } from "./useProcedureEdit";
import { useProcedureDelete } from "./useProcedureDelete";
import { useProcedureModals } from "./useProcedureModals";
import { useEditModalHandlers } from "./useEditModalHandlers";
import { useEditModal } from "./useEditModal";
import { useDeleteModal } from "./useDeleteModal";
import { useDetailsModal } from "./useDetailsModal";

export function useListProceduresController() {
  // Hook principal de datos
  const {
    procedures,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    departments,
    updateProcedure,
    fetchProcedures,
  } = useProceduresList();

  // Hook de responsables
  const { responsibles, loading: loadingResponsibles } = useResponsibles();

  // Hooks modulares
  const editActions = useProcedureEdit({
    responsibles,
    updateProcedure,
    fetchProcedures,
  });

  const deleteActions = useProcedureDelete(fetchProcedures);

  const modalActions = useProcedureModals();

  // Hook para manejar cambios en los datos de edición
  const editModalHandlers = useEditModalHandlers({
    editData: editActions.editData,
    onDataChange: editActions.setEditData,
  });

  // Hooks de componentes de modales
  const { EditModal } = useEditModal();
  const { DeleteModal } = useDeleteModal();
  const { DetailsModal } = useDetailsModal();

  // Estado local adicional
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);

  // Filtrado de procedimientos
  const filteredProcedures = procedures.filter((proc) => {
    const matchesSearch =
      proc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.revision.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      !departmentFilter || proc.departamento === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Handlers unificados
  const handleViewDetails = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    modalActions.openDetailsModal();
  };

  const handleEdit = (procedure: Procedure) => {
    editActions.startEdit(procedure);
  };

  const handleDelete = (procedure: Procedure) => {
    deleteActions.startDelete(procedure);
  };

  return {
    // Datos
    procedures: filteredProcedures,
    loading,
    error,
    selectedProcedure,
    responsibles,
    loadingResponsibles,
    departments,

    // Búsqueda y filtros
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,

    // Acciones de tabla
    handleViewDetails,
    handleEdit,
    handleDelete,

    // Estados y acciones de edición
    editModal: {
      isOpen: editActions.editModalOpen,
      data: editActions.editData,
      saving: editActions.saving,
      onClose: editActions.closeEdit,
      onSubmit: editActions.handleSubmit,
      onDataChange: editActions.setEditData,
      handlers: editModalHandlers,
    },

    // Estados y acciones de eliminación
    deleteModal: {
      isOpen: deleteActions.deleteModalOpen,
      procedure: deleteActions.procedureToDelete,
      onClose: deleteActions.cancelDelete,
      onConfirm: deleteActions.confirmDelete,
    },

    // Estados y acciones de detalles
    detailsModal: {
      isOpen: modalActions.detailsModalOpen,
      onClose: () => {
        modalActions.closeDetailsModal();
        setSelectedProcedure(null);
      },
    },

    // Componentes de modales
    modals: {
      editModal: {
        component: EditModal,
        props: {
          isOpen: editActions.editModalOpen,
          onClose: editActions.closeEdit,
          onSubmit: editActions.handleSubmit,
          data: editActions.editData,
          saving: editActions.saving,
          handlers: editModalHandlers,
          responsibles: responsibles,
          loadingResponsibles: loadingResponsibles,
        },
      },
      deleteModal: {
        component: DeleteModal,
        props: {
          isOpen: deleteActions.deleteModalOpen,
          onClose: deleteActions.cancelDelete,
          onConfirm: deleteActions.confirmDelete,
        },
      },
      detailsModal: {
        component: DetailsModal,
        props: {
          isOpen: modalActions.detailsModalOpen,
          onClose: () => {
            modalActions.closeDetailsModal();
            setSelectedProcedure(null);
          },
          procedure: selectedProcedure,
        },
      },
    },
  };
}
