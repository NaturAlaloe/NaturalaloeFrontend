import { useEffect, useState } from "react";
import api from "../apiConfig/api";

export type ProcedureDepartment = {
  id_departamento: number;
  departamento: string;
  total_poes: number;
  total_actualizados: string;
  no_actualizados: string;
  cumplimiento_pct: string;
  fecha_actualizacion: string;
};

export function useProceduresDepartments() {
  const [departments, setDepartments] = useState<ProcedureDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProceduresDepartments() {
      setLoading(true);
      try {
        const response = await api.get('/dataForGraphicPendingProceduresByDepartment');
        
        if (response.data.success) {
          setDepartments(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || 'Error al obtener datos');
        }
      } catch (error) {
        console.error('Error fetching procedures departments:', error);
        setError('Error al obtener datos de procedimientos');
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProceduresDepartments();
  }, []);

  // Cálculos derivados
  const totalProcedures = departments.reduce((sum, dept) => sum + Number(dept.total_poes), 0);
  const totalUpdated = departments.reduce((sum, dept) => sum + Number(dept.total_actualizados), 0);
  const totalPending = departments.reduce((sum, dept) => sum + Number(dept.no_actualizados), 0);
  const overallPercentage = totalProcedures ? ((totalUpdated / totalProcedures) * 100).toFixed(1) : "0";

  return {
    departments,
    loading,
    error,
    totalProcedures,
    totalUpdated,
    totalPending,
    overallPercentage,
  };
}