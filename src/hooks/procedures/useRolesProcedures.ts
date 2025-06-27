import { useEffect, useState } from "react";
import {
  getRolesWithProcedures,
  getAllRoles,
  assignProceduresToRole,
  unassignProceduresFromRole, // <-- Importa la función
} from "../../services/procedures/procedureRolesService";

// Este hook maneja la lógica de roles y procedimientos
// y proporciona una interfaz para interactuar con los roles y sus procedimientos asignados.

export interface Procedure {
  id_documento: number;
  codigo: string;
  descripcion: string;
}

export interface RoleProcedures {
  id_rol: number;
  nombre_rol: string;
  procedimientos: Procedure[];
}

export function useRolesProcedures() {
  const [rolesProcedures, setRolesProcedures] = useState<RoleProcedures[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRolesProcedures = async () => {
    setLoading(true);
    try {
      // Obtener todos los roles
      const allRoles = await getAllRoles();
      
      // Obtener roles con procedimientos asignados
      const rolesWithProcedures = await getRolesWithProcedures();
      
      // Crear un mapa de procedimientos por rol
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
      
      // Combinar todos los roles con sus procedimientos (o array vacío si no tienen)
      const rolesProceduresComplete = allRoles.map((role: any) => ({
        id_rol: role.id_rol,
        nombre_rol: role.nombre_rol,
        procedimientos: proceduresByRole[role.id_rol] || [],
      }));
      
      setRolesProcedures(rolesProceduresComplete);
    } catch (error) {
      console.error('Error al obtener roles y procedimientos:', error);
      setRolesProcedures([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProcedures = async (id_rol: number, procedimientos: number[]) => {
    await assignProceduresToRole(id_rol, procedimientos);
    fetchRolesProcedures();
  };

  // Nueva función para desasignar procedimientos
  const removeProcedures = async (id_rol: number, procedimientos: number[]) => {
    await unassignProceduresFromRole(id_rol, procedimientos);
    fetchRolesProcedures();
  };

  useEffect(() => {
    fetchRolesProcedures();
  }, []);

  // Exporta la nueva función
  return { rolesProcedures, loading, fetchRolesProcedures, saveProcedures, removeProcedures };
}