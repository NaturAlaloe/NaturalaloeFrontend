import { useState, useMemo, useEffect } from "react";
import { useRolesProceduresContext } from "./RolesProceduresContext";
import { getAllManapol } from "../../services/procedures/procedureRolesService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Este es el hook que maneja los roles y sus manapol

export function useRolesManapolList() {
  const { 
    rolesProcedures, 
    loading, 
    saveManapol, 
    removeManapol
  } = useRolesProceduresContext();

  // Estados para búsqueda y paginación
  const [search, setSearch] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Estados para modal Manapol
  const [modalManapolOpen, setModalManapolOpen] = useState(false);
  const [rolActualManapol, setRolActualManapol] = useState<any | null>(null);
  const [manapolSeleccionados, setManapolSeleccionados] = useState<string[]>([]);
  const [modalSearchManapol, setModalSearchManapol] = useState("");
  const [manapolActivos, setManapolActivos] = useState<any[]>([]);
  const [modalLoadingManapol, setModalLoadingManapol] = useState(false);
  const [savingManapol, setSavingManapol] = useState(false);

  // Effect para resetear paginación
  useEffect(() => {
    setResetPaginationToggle(prev => !prev);
  }, [search]);

  // Effect para cargar TODOS los manapol cuando se abre el modal
  useEffect(() => {
    if (modalManapolOpen) {
      setModalLoadingManapol(true);
      
      getAllManapol().then((manapol) => {
       
        
        const processedManapol = manapol.map((m: any) => ({
          id_documento: m.id_documento,
          codigo: m.codigo_rm || m.codigo, // Usar codigo_rm para manapol
          titulo: m.titulo,
          descripcion: m.titulo,
          nombre: m.titulo,
          // Mantener el campo original para debugging
          codigo_rm: m.codigo_rm,
        }));
        
        setManapolActivos(processedManapol);
        setModalLoadingManapol(false);
      }).catch((error) => {
        console.error(' Error al cargar manapol:', error);
        setModalLoadingManapol(false);
        showCustomToast("Error", "No se pudieron cargar los manapol disponibles", "error");
      });
    }
  }, [modalManapolOpen]);

  // Effect para cargar manapol asignados cuando se abre el modal
  useEffect(() => {
    if (rolActualManapol && modalManapolOpen) {
      const itemsAsignados = rolActualManapol.manapol?.map((m: any) => m.id_documento.toString()) || [];

      setManapolSeleccionados(itemsAsignados);
    }
  }, [rolActualManapol, modalManapolOpen]);

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
      const manapolMatch = rol.manapol?.some((m: any) => 
        m.codigo?.toLowerCase().includes(search.toLowerCase())
      );
      return nombreMatch || procedimientosMatch || politicasMatch || manapolMatch;
    });

    return filtered.sort((a, b) => {
      const aHasItems = (a.procedimientos && a.procedimientos.length > 0) || 
                       (a.politicas && a.politicas.length > 0) ||
                       (a.manapol && a.manapol.length > 0);
      const bHasItems = (b.procedimientos && b.procedimientos.length > 0) || 
                       (b.politicas && b.politicas.length > 0) ||
                       (b.manapol && b.manapol.length > 0);
      
      if (aHasItems && !bHasItems) return -1;
      if (!aHasItems && bHasItems) return 1;
      return 0;
    });
  }, [rolesProcedures, search]);

  // Filtrar manapol en el modal
  const manapolFiltradosModal = useMemo(() => {
    if (!modalSearchManapol.trim()) {
      return manapolActivos;
    }

    const searchTerm = modalSearchManapol.toLowerCase();
    const filtered = manapolActivos.filter((item: any) => 
      item.id_documento?.toString().toLowerCase().includes(searchTerm) ||
      item.codigo?.toLowerCase().includes(searchTerm) ||
      item.titulo?.toLowerCase().includes(searchTerm) ||
      item.descripcion?.toLowerCase().includes(searchTerm)
    );
    return filtered;
  }, [manapolActivos, modalSearchManapol]);

  // Handlers para modal Manapol
  const handleOpenModalManapol = (rol: any) => {
    setRolActualManapol(rol);
    setModalSearchManapol("");
    setModalManapolOpen(true);
  };

  const handleCloseModalManapol = () => {
    setModalManapolOpen(false);
    setRolActualManapol(null);
    setManapolSeleccionados([]);
    setModalSearchManapol("");
  };

  const handleSaveManapol = async () => {
    if (!rolActualManapol) {
      handleCloseModalManapol();
      return;
    }

    try {
      const seleccionOriginal = rolActualManapol.manapol?.map((m: any) => m.id_documento) || [];
      const nuevosElementos = manapolSeleccionados
        .map(Number)
        .filter(id => !seleccionOriginal.includes(id));
      const elementosEliminados = seleccionOriginal.filter((id: number) => 
        !manapolSeleccionados.map(Number).includes(id)
      );

    

      if (elementosEliminados.length > 0) {
        await removeManapol(rolActualManapol.id_rol, elementosEliminados);
      }

      if (nuevosElementos.length > 0) {
        await saveManapol(rolActualManapol.id_rol, nuevosElementos);
      }

      if (nuevosElementos.length === 0 && elementosEliminados.length === 0) {
        showCustomToast("Información", "No hay cambios para guardar", "info");
      } else {
        showCustomToast("Éxito", "Manapol actualizados correctamente", "success");
      }
    } catch (error: any) {
      console.error('Error en handleSaveManapol:', error);
      showCustomToast("Error", "No se pudieron guardar los cambios en manapol", "error");
    } finally {
      handleCloseModalManapol();
    }
  };

  const handleSeleccionChangeManapol = (seleccion: string[]) => {
  
    
    setManapolSeleccionados(seleccion);
  };

  const handleSaveManapolWithLoading = async () => {
    setSavingManapol(true);
    try {
      await handleSaveManapol();
    } finally {
      setSavingManapol(false);
    }
  };

  return {
    // Estados compartidos
    loading,
    search,
    setSearch,
    rolesFiltrados,
    resetPaginationToggle,
    
    // Estados y handlers específicos de Manapol
    modalManapolOpen,
    handleOpenModalManapol,
    handleCloseModalManapol,
    rolActualManapol,
    manapolSeleccionados,
    setManapolSeleccionados,
    modalSearchManapol,
    setModalSearchManapol,
    manapolFiltradosModal,
    handleSaveManapol,
    handleSaveManapolWithLoading,
    modalLoadingManapol,
    handleSeleccionChangeManapol,
    savingManapol,
  };
}