import { useState, useEffect } from 'react';
import api from '../apiConfig/api';

interface GlobalKpiData {
  total_empleados: number;
  total_certificados: number | null;
  pendientes: number | null;
  cobertura_pct: number | null;
  fecha_actualizacion: string;
}

interface GlobalKpiResponse {
  success: boolean;
  data: GlobalKpiData[];
  message: string;
}

interface UseGlobalTrainingKpiReturn {
  totalEmployees: number;
  totalCertified: number;
  totalPending: number;
  overallPercentage: number;
  lastUpdate: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGlobalTrainingKpi = (): UseGlobalTrainingKpiReturn => {
  const [data, setData] = useState<GlobalKpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalKpi = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<GlobalKpiResponse>('/getDataKpiCapGlobal');
      
      if (response.data.success && response.data.data.length > 0) {
        setData(response.data.data[0]);
      } else {
        setError('No se encontraron datos de KPI global');
      }
    } catch (err: any) {
      console.error('Error fetching global KPI data:', err);
      setError(err.response?.data?.message || 'Error al obtener los datos de KPI global');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalKpi();
  }, []);

  const refetch = async () => {
    await fetchGlobalKpi();
  };

  return {
    totalEmployees: data?.total_empleados || 0,
    totalCertified: data?.total_certificados || 0,
    totalPending: data?.pendientes || 0,
    overallPercentage: Math.round(data?.cobertura_pct || 0),
    lastUpdate: data?.fecha_actualizacion || '',
    loading,
    error,
    refetch,
  };
};
