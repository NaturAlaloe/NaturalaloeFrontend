import { useState, useEffect } from 'react';
import api from '../apiConfig/api';

interface PolicyTrainingData {
  codigo: string;
  total_personal: number;
  capacitados: number;
  pendientes: number;
  fecha_refresco: string;
}

interface PolicyTrainingResponse {
  success: boolean;
  message: string;
  data: PolicyTrainingData[];
}

interface UsePolicyTrainingReturn {
  policies: PolicyTrainingData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalPersonal: number;
  totalCapacitados: number;
  totalPendientes: number;
  overallPercentage: number;
}

export const usePolicyTraining = (): UsePolicyTrainingReturn => {
  const [policies, setPolicies] = useState<PolicyTrainingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicyTraining = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<PolicyTrainingResponse>('/getDataForGraphicCapacitatedByPolicy');
      
      if (response.data.success) {
        setPolicies(response.data.data);
      } else {
        setError('No se encontraron datos de capacitación por política');
      }
    } catch (err: any) {
      console.error('Error fetching policy training data:', err);
      setError(err.response?.data?.message || 'Error al obtener los datos de capacitación por política');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicyTraining();
  }, []);

  const refetch = async () => {
    await fetchPolicyTraining();
  };

  // Calcular totales
  const totalPersonal = policies.reduce((sum, policy) => sum + policy.total_personal, 0);
  const totalCapacitados = policies.reduce((sum, policy) => sum + policy.capacitados, 0);
  const totalPendientes = policies.reduce((sum, policy) => sum + policy.pendientes, 0);
  const overallPercentage = totalPersonal > 0 ? Math.round((totalCapacitados / totalPersonal) * 100) : 0;

  return {
    policies,
    loading,
    error,
    refetch,
    totalPersonal,
    totalCapacitados,
    totalPendientes,
    overallPercentage,
  };
};