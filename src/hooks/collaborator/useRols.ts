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
      console.error('Error al cargar roles:', err);
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
      console.error('Error al obtener roles del colaborador:', err);
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
    
    setColaboradorSeleccionado(nuevoColaborador);
    setRolesSeleccionados([]);
  }, []);

  // Manejar selección de roles
  const handleRolSeleccion = useCallback((rol: string) => {
    if (rol !== colaboradorSeleccionado?.puesto) {
      setRolesSeleccionados(prev =>
        prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
      );
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
      console.error('Error al asignar roles:', err);
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
      console.error('Error al desasignar roles:', err);
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

    if (rolesAAsignar.length > 0) {
      await assignRoles(rolesAAsignar);
    }
    if (rolesADesasignar.length > 0) {
      await unassignRoles(rolesADesasignar);
    }
  }, [colaboradorSeleccionado, collaboratorRoles, rolesSeleccionados, assignRoles, unassignRoles]);

  // Efectos
  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  useEffect(() => {
    if (colaboradorSeleccionado?.id) {
      fetchCollaboratorRoles(colaboradorSeleccionado.id);
    }
  }, [colaboradorSeleccionado?.id, fetchCollaboratorRoles]);

  // Sincronizar rolesSeleccionados con los roles actuales del colaborador
  useEffect(() => {
    if (colaboradorSeleccionado) {
      const puesto = colaboradorSeleccionado.puesto;
      const nuevosSeleccionados = [
        ...(puesto && puesto !== 'Sin puesto' ? [puesto] : []),
        ...collaboratorRoles.map(role => role.nombre_rol).filter(role => role !== puesto),
      ].filter(Boolean);
      
      setRolesSeleccionados(nuevosSeleccionados);
    } else {
      setRolesSeleccionados([]);
    }
  }, [colaboradorSeleccionado, collaboratorRoles]);

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