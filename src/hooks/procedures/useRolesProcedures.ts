import { useEffect, useState } from "react";
import {
  getRolesWithProcedures,
  getRolesWithPolitics,
  getAllRoles,
  assignProceduresToRole,
  unassignProceduresFromRole,
  assignPoliticsToRole,
  unassignPoliticsFromRole,
} from "../../services/procedures/procedureRolesService";

// Este es el hook que maneja los roles y sus procedimientos/políticas

export interface Procedure {
  id_documento: number;
  codigo: string;
  descripcion: string;
}

export interface Politica {
  id_documento: number;
  codigo: string;
  numero_politica: string;
  titulo: string;
  nombre: string;
  descripcion?: string;
}

export interface RoleProcedures {
  id_rol: number;
  nombre_rol: string;
  procedimientos: Procedure[];
  politicas: Politica[];
}

export function useRolesProcedures() {
  const [rolesProcedures, setRolesProcedures] = useState<RoleProcedures[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRolesProcedures = async () => {
    setLoading(true);
    try {
      const allRoles = await getAllRoles();
      const rolesWithProcedures = await getRolesWithProcedures();
      const rolesWithPolitics = await getRolesWithPolitics();
      
      const proceduresByRole: { [id_rol: number]: Procedure[] } = {};
      rolesWithProcedures.forEach((item: any) => {
        if (!proceduresByRole[item.id_rol]) {
          proceduresByRole[item.id_rol] = [];
        }
        proceduresByRole[item.id_rol].push({
          id_documento: item.id_documento,
          codigo: item.codigo,
          descripcion: item.descripcion,
        });
      });

      const politicsByRole: { [id_rol: number]: Politica[] } = {};
      rolesWithPolitics.forEach((item: any) => {
        if (!politicsByRole[item.id_rol]) {
          politicsByRole[item.id_rol] = [];
        }
        politicsByRole[item.id_rol].push({
          id_documento: item.id_documento,
          codigo: item.codigo,
          numero_politica: item.codigo,
          titulo: item.descripcion || item.codigo,
          nombre: item.descripcion || item.codigo,
          descripcion: item.descripcion,
        });
      });
      
      const rolesProceduresComplete = allRoles.map((role: any) => ({
        id_rol: role.id_rol,
        nombre_rol: role.nombre_rol,
        procedimientos: proceduresByRole[role.id_rol] || [],
        politicas: politicsByRole[role.id_rol] || [],
      }));
      
      setRolesProcedures(rolesProceduresComplete);
    } catch (error) {
      console.error('Error al obtener roles, procedimientos y políticas:', error);
      setRolesProcedures([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProcedures = async (id_rol: number, procedimientos: number[]) => {
    await assignProceduresToRole(id_rol, procedimientos);
    await fetchRolesProcedures();
  };

  const removeProcedures = async (id_rol: number, procedimientos: number[]) => {
    await unassignProceduresFromRole(id_rol, procedimientos);
    await fetchRolesProcedures();
  };

  const savePolitics = async (id_rol: number, politicas: number[]) => {
    await assignPoliticsToRole(id_rol, politicas);
    await fetchRolesProcedures();
  };

  const removePolitics = async (id_rol: number, politicas: number[]) => {
    await unassignPoliticsFromRole(id_rol, politicas);
    await fetchRolesProcedures();
  };

  useEffect(() => {
    fetchRolesProcedures();
  }, []);

  return { 
    rolesProcedures, 
    loading, 
    fetchRolesProcedures, 
    saveProcedures, 
    removeProcedures,
    savePolitics,
    removePolitics,
    refreshData: fetchRolesProcedures
  };
}