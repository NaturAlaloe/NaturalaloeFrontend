import { useState, useEffect } from 'react';
import api from '../apiConfig/api';

interface GlobalPoeKpiData {
  total_poes: number;
  total_actualizados: number | null;
  no_actualizados: number | null;
  cumplimiento_pct: number | null;
  fecha_actualizacion: string;
}

interface GlobalPoeKpiResponse {
  success: boolean;
  data: GlobalPoeKpiData[];
  message: string;
}

interface UseGlobalPoeKpiReturn {
  totalProcedures: number;
  totalUpdated: number;
  totalPending: number;
  overallPercentage: number;
  lastUpdate: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGlobalPoeKpi = (): UseGlobalPoeKpiReturn => {
  const [data, setData] = useState<GlobalPoeKpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalPoeKpi = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<GlobalPoeKpiResponse>('/kpiPoeGlobal');
      
      if (response.data.success && response.data.data.length > 0) {
        setData(response.data.data[0]);
      } else {
        setError('No se encontraron datos de KPI global de POEs');
      }
    } catch (err: any) {
      console.error('Error fetching global POE KPI data:', err);
      setError(err.response?.data?.message || 'Error al obtener los datos de KPI global de POEs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalPoeKpi();
  }, []);

  const refetch = async () => {
    await fetchGlobalPoeKpi();
  };

  return {
    totalProcedures: data?.total_poes || 0,
    totalUpdated: data?.total_actualizados || 0,
    totalPending: data?.no_actualizados || 0,
    overallPercentage: Math.round(data?.cumplimiento_pct || 0),
    lastUpdate: data?.fecha_actualizacion || '',
    loading,
    error,
    refetch,
  };
};
