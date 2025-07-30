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

  return {
    departments,
    loading,
    error,
  };
}