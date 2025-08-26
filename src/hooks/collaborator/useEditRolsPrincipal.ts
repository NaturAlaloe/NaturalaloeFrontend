import { useState } from "react";
import {
  putRolsCollaborators,
  getRolsCollaborators,
  type PutCollaborator,
  type GetCollaborators,
} from "../../services/collaborators/putRolsCollaborators";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export const useEditRolsPrincipal = () => {
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<GetCollaborators[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<any>(null);
  const [formData, setFormData] = useState({
    id_rol_nuevo: 0,
    motivo: "",
  });

  // Cargar roles disponibles cuando se abre el modal
  const fetchAvailableRoles = async () => {
    setRolesLoading(true);
    try {
      const roles = await getRolsCollaborators();
      console.log("Roles recibidos:", roles); // Debug log
      console.log("Tipo de roles:", typeof roles); // Debug log
      console.log("Es array:", Array.isArray(roles)); // Debug log
      
      // Verificar si roles es válido y es un array
      if (roles && Array.isArray(roles)) {
        setAvailableRoles(roles);
      } else {
        console.warn("Roles no válidos recibidos:", roles);
        setAvailableRoles([]);
        showCustomToast("Advertencia", "No se encontraron roles disponibles", "info");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al cargar los roles disponibles";
      showCustomToast("Error", errorMessage, "error");
      console.error("Error fetching roles:", error);
      setAvailableRoles([]); // Asegurar que se establezca un array vacío en caso de error
    } finally {
      setRolesLoading(false);
    }
  };

  // Abrir modal para cambiar rol
  const openChangeRoleModal = (collaborator: any) => {
    console.log("=== ABRIENDO MODAL DE CAMBIO DE ROL ===");
    console.log("Colaborador seleccionado:", collaborator);
    
    setSelectedCollaborator(collaborator);
    setFormData({
      id_rol_nuevo: 0,
      motivo: "",
    });
    
    console.log("Estableciendo modalOpen a true");
    setModalOpen(true);
    
    console.log("Iniciando fetchAvailableRoles...");
    fetchAvailableRoles();
  };

  // Cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedCollaborator(null);
    setFormData({
      id_rol_nuevo: 0,
      motivo: "",
    });
    setAvailableRoles([]);
  };

  // Manejar cambio en el formulario
  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Actualizar rol principal
  const handleUpdateRole = async (): Promise<boolean> => {
    if (!selectedCollaborator) {
      showCustomToast("Error", "No hay colaborador seleccionado", "error");
      return false;
    }

    if (!formData.id_rol_nuevo || formData.id_rol_nuevo === 0) {
      showCustomToast("Error", "Debe seleccionar un rol", "error");
      return false;
    }

    if (!formData.motivo.trim()) {
      showCustomToast(
        "Error",
        "Debe proporcionar un motivo para el cambio",
        "error"
      );
      return false;
    }

    setLoading(true);
    try {
      const dataToSend: PutCollaborator = {
        id_colaborador: selectedCollaborator.id_colaborador,
        id_rol_nuevo: formData.id_rol_nuevo,
        motivo: formData.motivo.trim(),
      };

      await putRolsCollaborators(dataToSend);

      showCustomToast(
        "Éxito",
        "Rol principal actualizado correctamente",
        "success"
      );
      closeModal();
      return true;
    } catch (error: any) {
      let errorMessage = "Error al actualizar el rol principal";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || "Datos inválidos";
            break;
          case 401:
            errorMessage = "No tienes autorización para realizar esta acción";
            break;
          case 403:
            errorMessage = "No tienes permisos para cambiar roles";
            break;
          case 404:
            errorMessage = "Colaborador o rol no encontrado";
            break;
          case 500:
            errorMessage = "Error interno del servidor";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet";
      } else {
        errorMessage = error.message || errorMessage;
      }

      showCustomToast("Error", errorMessage, "error");
      console.error("Error updating role:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estados
    loading,
    rolesLoading,
    modalOpen,
    selectedCollaborator,
    availableRoles,
    formData,

    // Acciones
    openChangeRoleModal,
    closeModal,
    handleFormChange,
    handleUpdateRole,
    fetchAvailableRoles, // Agregar esta función para que esté disponible

    // Utilidades
    isFormValid: formData.id_rol_nuevo > 0 && formData.motivo.trim().length > 0,
  };
};

export default useEditRolsPrincipal;
