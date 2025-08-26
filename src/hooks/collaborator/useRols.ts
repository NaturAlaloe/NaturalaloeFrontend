import { useState, useEffect, useCallback } from 'react';
import type { IRole } from '../../services/manage/rolService';
import { getRoles, getRolesByCollaborator, assignRolesToCollaborator, unassignRolesFromCollaborator } from '../../services/manage/rolService';

interface ColaboradorSeleccionado {
  id: string;
  nombre: string;
  cedula: string;
  puesto: string;
}

const useRoles = () => {
  // Estados principales
  const [roles, setRoles] = useState<IRole[]>([]);
  const [collaboratorRoles, setCollaboratorRoles] = useState<IRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [errorRoles, setErrorRoles] = useState<string | null>(null);
  
  // Estados para la vista
  const [rolesSeleccionados, setRolesSeleccionados] = useState<string[]>([]);
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState<ColaboradorSeleccionado | null>(null);

  // Cargar todos los roles disponibles
  const fetchAllRoles = useCallback(async () => {
    setLoadingRoles(true);
    setErrorRoles(null);
    
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setErrorRoles('Error al cargar los roles');
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  // Cargar roles específicos del colaborador
  const fetchCollaboratorRoles = useCallback(async (id_colaborador: string) => {
    if (!id_colaborador) {
      setCollaboratorRoles([]);
      return;
    }

    setLoadingRoles(true);
    setErrorRoles(null);
    
    try {
      const data = await getRolesByCollaborator(id_colaborador);
      setCollaboratorRoles(data);
    } catch (err) {
      setCollaboratorRoles([]);
      setErrorRoles('Error al cargar roles del colaborador');
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  // Manejar selección de colaborador
  const handleColaboradorSeleccion = useCallback((
    id: string,
    nombre?: string,
    apellido1?: string,
    apellido2?: string,
    cedula?: string,
    puesto?: string
  ) => {
    const nombreCompleto = [nombre, apellido1, apellido2].filter(Boolean).join(' ').trim() || 'Sin nombre';
    
    const nuevoColaborador = {
      id,
      nombre: nombreCompleto,
      cedula: cedula || 'Sin cédula',
      puesto: puesto || 'Sin puesto'
    };
    
    // Primero limpiar estados
    setRolesSeleccionados([]);
    setCollaboratorRoles([]);
    setErrorRoles(null);
    
    // Luego establecer el nuevo colaborador
    setColaboradorSeleccionado(nuevoColaborador);
  }, []);

  // Manejar selección de roles
  const handleRolSeleccion = useCallback((rol: string) => {
    if (rol !== colaboradorSeleccionado?.puesto) {
      setRolesSeleccionados(prev => {
        const isSelected = prev.includes(rol);
        if (isSelected) {
          return prev.filter(r => r !== rol);
        } else {
          return [...prev, rol];
        }
      });
    }
  }, [colaboradorSeleccionado?.puesto]);

  // Limpiar selección de colaborador
  const clearColaboradorSeleccion = useCallback(() => {
    setColaboradorSeleccionado(null);
    setRolesSeleccionados([]);
    setCollaboratorRoles([]);
  }, []);

  // Asignar roles al colaborador
  const assignRoles = useCallback(async (roleNames: string[]) => {
    if (!colaboradorSeleccionado?.id || roleNames.length === 0) return;
    
    setLoadingRoles(true);
    setErrorRoles(null);
    
    try {
      const roleIds = roles
        .filter(role => roleNames.includes(role.nombre_rol))
        .map(role => role.id_rol);
        
      await assignRolesToCollaborator(colaboradorSeleccionado.id, roleIds);
      
      // Actualizar roles del colaborador después de la asignación
      await fetchCollaboratorRoles(colaboradorSeleccionado.id);
    } catch (err) {
      setErrorRoles('Error al asignar roles');
      throw err;
    } finally {
      setLoadingRoles(false);
    }
  }, [colaboradorSeleccionado?.id, roles, fetchCollaboratorRoles]);

  // Desasignar roles del colaborador
  const unassignRoles = useCallback(async (roleNames: string[]) => {
    if (!colaboradorSeleccionado?.id || roleNames.length === 0) return;
    
    setLoadingRoles(true);
    setErrorRoles(null);
    
    try {
      const roleIds = roles
        .filter(role => roleNames.includes(role.nombre_rol))
        .map(role => role.id_rol);
        
      await unassignRolesFromCollaborator(colaboradorSeleccionado.id, roleIds);
      
      // Actualizar roles del colaborador después de la desasignación
      await fetchCollaboratorRoles(colaboradorSeleccionado.id);
    } catch (err) {
      setErrorRoles('Error al desasignar roles');

      throw err;
    } finally {
      setLoadingRoles(false);
    }
  }, [colaboradorSeleccionado?.id, roles, fetchCollaboratorRoles]);

  // Procesar asignación y desasignación de roles
  const processRoleChanges = useCallback(async () => {
    if (!colaboradorSeleccionado) {
      throw new Error('Por favor, selecciona un colaborador.');
    }

    const rolesExistentes = collaboratorRoles.map(role => role.nombre_rol);
    const puesto = colaboradorSeleccionado.puesto;
    const rolesAAsignar = rolesSeleccionados.filter(rol => !rolesExistentes.includes(rol) && rol !== puesto);
    const rolesADesasignar = rolesExistentes.filter(rol => !rolesSeleccionados.includes(rol) && rol !== puesto);

    if (rolesAAsignar.length === 0 && rolesADesasignar.length === 0) {
      throw new Error('No hay cambios para guardar.');
    }

    // Procesar secuencialmente para evitar conflictos
    if (rolesADesasignar.length > 0) {
      await unassignRoles(rolesADesasignar);
    }
    
    if (rolesAAsignar.length > 0) {
      await assignRoles(rolesAAsignar);
    }
    
    // Refrescar roles del colaborador una vez más para asegurar consistencia
    await fetchCollaboratorRoles(colaboradorSeleccionado.id);
  }, [colaboradorSeleccionado, collaboratorRoles, rolesSeleccionados, assignRoles, unassignRoles, fetchCollaboratorRoles]);

  // Efectos
  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  useEffect(() => {
    if (colaboradorSeleccionado?.id) {
      // Agregar un pequeño delay para asegurar que el estado esté limpio
      const timer = setTimeout(() => {
        fetchCollaboratorRoles(colaboradorSeleccionado.id);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [colaboradorSeleccionado?.id, fetchCollaboratorRoles]);

  // Sincronizar rolesSeleccionados con los roles actuales del colaborador
  useEffect(() => {
    if (colaboradorSeleccionado && collaboratorRoles.length >= 0) {
      const puesto = colaboradorSeleccionado.puesto;
      const rolesDelColaborador = collaboratorRoles.map(role => role.nombre_rol);
      
      // Solo incluir el puesto si no es 'Sin puesto' y no está ya en los roles del colaborador
      const nuevosSeleccionados = [
        ...(puesto && puesto !== 'Sin puesto' ? [puesto] : []),
        ...rolesDelColaborador.filter(role => role !== puesto),
      ].filter(Boolean);
      
      // Solo actualizar si hay cambios reales
      const currentSelected = rolesSeleccionados.sort();
      const newSelected = nuevosSeleccionados.sort();
      
      if (JSON.stringify(currentSelected) !== JSON.stringify(newSelected)) {
        setRolesSeleccionados(nuevosSeleccionados);
      }
    } else if (!colaboradorSeleccionado) {
      setRolesSeleccionados([]);
    }
  }, [colaboradorSeleccionado?.id, collaboratorRoles]);

  return { 
    // Estados
    roles, 
    collaboratorRoles, 
    loadingRoles, 
    errorRoles,
    rolesSeleccionados,
    colaboradorSeleccionado,
    
    // Funciones
    handleColaboradorSeleccion,
    handleRolSeleccion,
    clearColaboradorSeleccion,
    processRoleChanges,
    setRolesSeleccionados
  };
};

export default useRoles;