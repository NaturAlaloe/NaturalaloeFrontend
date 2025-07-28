import { useEffect, useState } from "react";
import api from "../apiConfig/api";

export type TrainingDepartment = {
  id_departamento: number | string;
  departamento: string;
  total_empleados: number;
  total_certificados: string;
  pendientes: string;
  cobertura_pct: string;
  fehcha_actualizacion: string;
};

export function useTrainingDepartments() {
  const [departments, setDepartments] = useState<TrainingDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrainingDepartments() {
      setLoading(true);
      try {
        const response = await api.get('/dataForGraphicTrainingPendings');
        
        if (response.data.success) {
          setDepartments(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || 'Error al obtener datos');
        }
      } catch (error) {
        console.error('Error fetching training departments:', error);
        setError('Error al obtener datos de capacitaciones');
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrainingDepartments();
  }, []);

  // Cálculos derivados
  const totalEmployees = departments.reduce((sum, dept) => sum + Number(dept.total_empleados), 0);
  const totalCertified = departments.reduce((sum, dept) => sum + Number(dept.total_certificados), 0);
  const totalPending = departments.reduce((sum, dept) => sum + Number(dept.pendientes), 0);
  const overallPercentage = totalEmployees ? ((totalCertified / totalEmployees) * 100).toFixed(1) : "0";

  return {
    departments,
    loading,
    error,
    totalEmployees,
    totalCertified,
    totalPending,
    overallPercentage,
  };
}