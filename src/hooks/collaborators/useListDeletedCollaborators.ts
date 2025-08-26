import { useState, useEffect, useMemo } from "react";
import {
  getListDeletedCollaborators,
  type DeletedCollaborator,
} from "../../services/collaborators/getListDeletedCollaborators";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

const useListDeletedCollaborators = () => {
  const [deletedCollaborators, setDeletedCollaborators] = useState<
    DeletedCollaborator[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Estados para el modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<DeletedCollaborator | null>(null);

  // Resetear página cuando cambie el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchDeletedCollaborators = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getListDeletedCollaborators();
      
      if (!data) {
        showCustomToast("Información", "No se encontraron colaboradores eliminados", "info");
        setDeletedCollaborators([]);
        return;
      }
      
      if (!Array.isArray(data)) {
        showCustomToast("Error", "Los datos recibidos no tienen el formato esperado", "error");
        setDeletedCollaborators([]);
        return;
      }
      
      setDeletedCollaborators(data);
      
      if (data.length === 0) {
        showCustomToast("Información", "No hay colaboradores eliminados", "info");
      }
      
    } catch (err: any) {
      let errorMessage = "No se pudieron cargar los colaboradores eliminados.";
      
      if (err.response) {
        // Error de respuesta del servidor
        switch (err.response.status) {
          case 404:
            errorMessage = "No se encontró el endpoint para colaboradores eliminados";
            break;
          case 401:
            errorMessage = "No tienes autorización para ver esta información";
            break;
          case 403:
            errorMessage = "No tienes permisos para acceder a esta información";
            break;
          case 500:
            errorMessage = "Error interno del servidor. Intenta más tarde";
            break;
          default:
            errorMessage = err.response?.data?.message || errorMessage;
        }
      } else if (err.request) {
        // Error de red o conexión
        errorMessage = "Error de conexión. Verifica tu conexión a internet";
      } else {
        // Error de configuración u otro
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      setDeletedCollaborators([]);
      showCustomToast("Error", errorMessage, "error");
      console.error("Error fetching deleted collaborators:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedCollaborators();
  }, []);

  // Funciones para el modal
  const handleOpenModal = (collaborator: DeletedCollaborator) => {
    try {
      if (!collaborator) {
        showCustomToast("Error", "No se pudo cargar la información del colaborador", "error");
        return;
      }
      setSelectedCollaborator(collaborator);
      setModalOpen(true);
    } catch (err: any) {
      showCustomToast("Error", "Error al abrir el modal de detalles", "error");
      console.error("Error opening modal:", err);
    }
  };

  const handleCloseModal = () => {
    try {
      setModalOpen(false);
      setSelectedCollaborator(null);
    } catch (err: any) {
      showCustomToast("Error", "Error al cerrar el modal", "error");
      console.error("Error closing modal:", err);
    }
  };

  // Función para parsear datos que pueden venir como string o array
  const parseArrayData = (data: string | null): string[] => {
    try {
      if (!data) return [];
      if (typeof data === "string") {
        try {
          // Intentar parsear como JSON si es un string
          const parsed = JSON.parse(data);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // Si no es JSON válido, dividir por coma o devolver como array de un elemento
          return data.includes(",")
            ? data.split(",").map((item) => item.trim()).filter(item => item.length > 0)
            : [data];
        }
      }
      return Array.isArray(data) ? data : [data];
    } catch (err: any) {
      showCustomToast("Error", "Error al procesar los datos del colaborador", "error");
      console.error("Error parsing array data:", err);
      return [];
    }
  };

  // Lógica de filtrado
  const filteredCollaborators = useMemo(() => {
    if (!searchTerm) return deletedCollaborators;

    const s = searchTerm.toLowerCase();
    return deletedCollaborators.filter(
      (collaborator) =>
        collaborator.id_colaborador.toString().includes(s) ||
        collaborator.cedula.toString().includes(s) ||
        collaborator.nombre_completo.toLowerCase().includes(s) ||
        collaborator.correo.toLowerCase().includes(s) ||
        collaborator.numero.toString().includes(s) ||
        collaborator.roles.toLowerCase().includes(s)
    );
  }, [deletedCollaborators, searchTerm]);

  // Definición de columnas
  const columns = useMemo(
    () => [
      {
        name: "Cédula",
        selector: (row: DeletedCollaborator) => row.cedula,
        sortable: true,
      },
      {
        name: "Nombre Completo",
        selector: (row: DeletedCollaborator) => row.nombre_completo,
        sortable: true,
      },
      {
        name: "Correo",
        selector: (row: DeletedCollaborator) => row.correo,
        sortable: true,
      },
      {
        name: "Teléfono",
        selector: (row: DeletedCollaborator) => row.numero,
        sortable: true,
      },
      {
        name: "Acciones",
        cell: () =>
          // Este será renderizado por la vista
          null,
        ignoreRowClick: true,
        button: true,
        width: "100px",
      },
    ],
    []
  );

  // Configuración para el componente noDataComponent
  const noDataConfig = useMemo(
    () => ({
      hasSearchTerm: !!searchTerm,
      searchTerm,
    }),
    [searchTerm]
  );

  return {
    // Estados básicos
    deletedCollaborators,
    loading,
    error,

    // Lógica de búsqueda y paginación
    searchTerm,
    setSearchTerm,
    filteredCollaborators,
    currentPage,
    setCurrentPage,

    // Configuración de tabla
    columns,
    noDataConfig,

    // Modal
    modalOpen,
    setModalOpen,
    selectedCollaborator,
    setSelectedCollaborator,
    handleOpenModal,
    handleCloseModal,
    parseArrayData,

    // Acciones
    refetch: fetchDeletedCollaborators,
  };
};

export default useListDeletedCollaborators;
