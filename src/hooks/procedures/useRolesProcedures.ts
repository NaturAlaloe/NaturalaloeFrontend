import { useEffect, useState } from "react";
import {
  getRolesWithProcedures,
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
    const data = await getRolesWithProcedures();
    // Agrupa procedimientos por rol
    const agrupados: { [id_rol: number]: RoleProcedures } = {};
    data.forEach((item: any) => {
      if (!agrupados[item.id_rol]) {
        agrupados[item.id_rol] = {
          id_rol: item.id_rol,
          nombre_rol: item.nombre_rol,
          procedimientos: [],
        };
      }
      agrupados[item.id_rol].procedimientos.push({
        id_documento: item.id_documento,
        codigo: item.codigo,
        descripcion: item.descripcion,
      });
    });
    setRolesProcedures(Object.values(agrupados));
  
    setLoading(false);
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