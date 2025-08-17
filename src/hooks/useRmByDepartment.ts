import { useState, useEffect } from 'react';
import api from '../apiConfig/api';

interface RmDepartmentData {
  id_departamento: number;
  departamento: string;
  total_rm: number;
  total_actualizados: number;
  no_actualizados: number;
  cumplimiento_pct: number;
  fecha_refresco: string;
}

interface UseRmByDepartmentReturn {
  departments: RmDepartmentData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalRm: number;
  totalActualizados: number;
  totalNoActualizados: number;
  overallPercentage: number;
}

export const useRmByDepartment = (): UseRmByDepartmentReturn => {
  const [departments, setDepartments] = useState<RmDepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRmByDepartment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/dataForGraphicPendingRMByDepartment');
      
      console.log('RM API Response:', response.data); // Para debugging
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Asegurar que todos los valores numéricos sean enteros
        const processedData = response.data.data.map((dept: { total_rm: any; total_actualizados: any; no_actualizados: any; cumplimiento_pct: any; }) => ({
          ...dept,
          total_rm: Number(dept.total_rm) || 0,
          total_actualizados: Number(dept.total_actualizados) || 0,
          no_actualizados: Number(dept.no_actualizados) || 0,
          cumplimiento_pct: Number(dept.cumplimiento_pct) || 0
        }));
        setDepartments(processedData);
      } else if (Array.isArray(response.data)) {
        // Asegurar que todos los valores numéricos sean enteros
        const processedData = response.data.map(dept => ({
          ...dept,
          total_rm: Number(dept.total_rm) || 0,
          total_actualizados: Number(dept.total_actualizados) || 0,
          no_actualizados: Number(dept.no_actualizados) || 0,
          cumplimiento_pct: Number(dept.cumplimiento_pct) || 0
        }));
        setDepartments(processedData);
      } else {
        console.error('Invalid response structure:', response.data);
        setError('No se encontraron datos de RM por departamento');
      }
    } catch (err: any) {
      console.error('Error fetching RM by department data:', err);
      setError(err.response?.data?.message || 'Error al obtener los datos de RM por departamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRmByDepartment();
  }, []);

  const refetch = async () => {
    await fetchRmByDepartment();
  };

  // Calcular totales
  const totalRm = departments.reduce((sum, dept) => sum + dept.total_rm, 0);
  const totalActualizados = departments.reduce((sum, dept) => sum + dept.total_actualizados, 0);
  const totalNoActualizados = departments.reduce((sum, dept) => sum + dept.no_actualizados, 0);
  const overallPercentage = totalRm > 0 ? Math.round((totalActualizados / totalRm) * 100) : 0;

  return {
    departments,
    loading,
    error,
    refetch,
    totalRm,
    totalActualizados,
    totalNoActualizados,
    overallPercentage,
  };
};