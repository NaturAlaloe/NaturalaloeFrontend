import { useState, useMemo, useEffect } from "react";
import { useRolesProceduresContext } from "./RolesProceduresContext";
import { getActivePolitics } from "../../services/politics/politicsService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Este es el hook que maneja las políticas de los roles

export function useRolesPoliticsList() {
  const { 
    rolesProcedures,
    savePolitics, 
    removePolitics
  } = useRolesProceduresContext();

  // Estados para modal Políticas
  const [modalPoliticsOpen, setModalPoliticsOpen] = useState(false);
  const [rolActualPolitics, setRolActualPolitics] = useState<any | null>(null);
  const [politicasSeleccionadas, setPoliticasSeleccionadas] = useState<number[]>([]);
  const [modalSearchPolitics, setModalSearchPolitics] = useState("");
  const [politicasActivas, setPoliticasActivas] = useState<any[]>([]);
  const [modalLoadingPolitics, setModalLoadingPolitics] = useState(false);

  // Effect para cargar políticas cuando se abre el modal
  useEffect(() => {
    if (modalPoliticsOpen) {
      setModalLoadingPolitics(true);
      
      getActivePolitics().then((politicas) => {
        const politicasMapeadas = politicas.map((p: any) => ({
          id_documento: p.id_documento,
          numero_politica: p.codigo?.toString(),
          codigo: p.codigo,
          titulo: p.titulo || p.nombre,
        }));
        
        setPoliticasActivas(politicasMapeadas);
        setModalLoadingPolitics(false);
      }).catch((error) => {
        console.error('Error cargando políticas:', error);
        setModalLoadingPolitics(false);
      });
    }
  }, [modalPoliticsOpen]);

  // Effect para cargar políticas asignadas cuando se abre el modal
  useEffect(() => {
    if (rolActualPolitics && modalPoliticsOpen && rolesProcedures.length > 0) {
      // Buscar el rol actualizado en rolesProcedures
      const rolActualizado = rolesProcedures.find(r => r.id_rol === rolActualPolitics.id_rol);
      if (rolActualizado) {
        const itemsAsignados = rolActualizado.politicas?.map((p: any) => p.id_documento) || [];
        setPoliticasSeleccionadas(itemsAsignados);
      }
    }
  }, [rolActualPolitics, modalPoliticsOpen, rolesProcedures]);

  // Filtrar políticas en el modal
  const politicasFiltradosModal = useMemo(() => {
    if (!modalSearchPolitics.trim()) {
      return politicasActivas;
    }

    const searchTerm = modalSearchPolitics.toLowerCase();
    return politicasActivas.filter((item: any) => 
      item.id_documento?.toString().toLowerCase().includes(searchTerm) ||
      item.numero_politica?.toLowerCase().includes(searchTerm) ||
      item.codigo?.toLowerCase().includes(searchTerm) ||
      item.titulo?.toLowerCase().includes(searchTerm)
    );
  }, [politicasActivas, modalSearchPolitics]);

  // Handlers para modal Políticas
  const handleOpenModalPolitics = (rol: any) => {
    setRolActualPolitics(rol);
    setModalSearchPolitics("");
    setModalPoliticsOpen(true);
  };

  const handleCloseModalPolitics = () => {
    setModalPoliticsOpen(false);
    setRolActualPolitics(null);
    setPoliticasSeleccionadas([]);
    setModalSearchPolitics("");
  };

  const handleSavePolitics = async () => {
    if (!rolActualPolitics) {
      handleCloseModalPolitics();
      return;
    }

    try {
      const seleccionOriginal = rolActualPolitics.politicas?.map((p: any) => p.id_documento) || [];
      const nuevosElementos = politicasSeleccionadas.filter(id => !seleccionOriginal.includes(id));
      const elementosEliminados = seleccionOriginal.filter((id: number) => !politicasSeleccionadas.includes(id));

      console.log(' Enviando cambios Políticas:', {
        rol: rolActualPolitics.nombre_rol,
        nuevos: nuevosElementos,
        eliminados: elementosEliminados
      });

      if (elementosEliminados.length > 0) {
        await removePolitics(rolActualPolitics.id_rol, elementosEliminados);
      }

      if (nuevosElementos.length > 0) {
        await savePolitics(rolActualPolitics.id_rol, nuevosElementos);
      }

      if (nuevosElementos.length === 0 && elementosEliminados.length === 0) {
        showCustomToast("Información", "No hay cambios para guardar", "info");
      } else {
        showCustomToast("Éxito", "Políticas actualizadas correctamente", "success");
        console.log('Políticas guardadas, datos actualizados automáticamente');
      }
    } catch (error: any) {
      console.error(' Error en handleSavePolitics:', error);
      showCustomToast("Error", "No se pudieron guardar los cambios en políticas", "error");
    } finally {
      handleCloseModalPolitics();
    }
  };

  const handleSeleccionChangePolitics = (seleccion: string[]) => {
    const numericSeleccion = seleccion.map(Number);
    setPoliticasSeleccionadas(numericSeleccion);
  };

  return {
    // Estados y handlers específicos de Políticas
    modalPoliticsOpen,
    handleOpenModalPolitics,
    handleCloseModalPolitics,
    rolActualPolitics,
    politicasSeleccionadas,
    setPoliticasSeleccionadas,
    modalSearchPolitics,
    setModalSearchPolitics,
    politicasFiltradosModal,
    handleSavePolitics,
    modalLoadingPolitics,
    handleSeleccionChangePolitics,
  };
}