import { useState, useEffect } from 'react';
import type { IRole } from '../../services/manage/rolService';
import { getRoles, getRolesByCollaborator, assignRolesToCollaborator, unassignRolesFromCollaborator } from '../../services/manage/rolService';

const useRoles = (id_colaborador?: string | number) => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [collaboratorRoles, setCollaboratorRoles] = useState<IRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [errorRoles, setErrorRoles] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
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
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (id_colaborador) {
      const fetchCollaboratorRoles = async () => {
        setLoadingRoles(true);
        try {
          const data = await getRolesByCollaborator(id_colaborador);
          setCollaboratorRoles(data);
        } catch (err) {
          console.error('Error al obtener roles del colaborador:', err);
          setCollaboratorRoles([]); 
        } finally {
          setLoadingRoles(false);
        }
      };
      fetchCollaboratorRoles();
    } else {
      setCollaboratorRoles([]);
    }
  }, [id_colaborador]);

  const assignRoles = async (roleNames: string[]) => {
    if (!id_colaborador) return;
    setLoadingRoles(true);
    try {
      const roleIds = roles
        .filter(role => roleNames.includes(role.nombre_rol))
        .map(role => role.id_rol);
      await assignRolesToCollaborator(id_colaborador, roleIds);
      const updatedRoles = await getRolesByCollaborator(id_colaborador);
      setCollaboratorRoles(updatedRoles);
    } catch (err) {
      setErrorRoles('Error al asignar roles');
      console.error('Error al asignar roles:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  const unassignRoles = async (roleNames: string[]) => {
    if (!id_colaborador) return;
    setLoadingRoles(true);
    try {
      const roleIds = roles
        .filter(role => roleNames.includes(role.nombre_rol))
        .map(role => role.id_rol);
      await unassignRolesFromCollaborator(id_colaborador, roleIds);
      const updatedRoles = await getRolesByCollaborator(id_colaborador);
      setCollaboratorRoles(updatedRoles);
    } catch (err) {
      setErrorRoles('Error al desasignar roles');
      console.error('Error al desasignar roles:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  return { roles, collaboratorRoles, loadingRoles, errorRoles, assignRoles, unassignRoles };
};

export default useRoles;