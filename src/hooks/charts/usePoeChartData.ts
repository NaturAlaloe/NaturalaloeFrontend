import { useState, useEffect } from 'react';
import api from '../../apiConfig/api';

interface POEData {
  id_lote: number;
  area: string;
  jefatura: string;
  estado: string;
  cantidad: number;
  actualizados: string;
  pendientes: string;
  lista_documentos: {
    tipo: string;
    razon: string;
    codigo: string;
    estado: string;
  }[];
}

interface UsePoeChartDataReturn {
  data: POEData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePoeChartData = (): UsePoeChartDataReturn => {
  const [data, setData] = useState<POEData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/dataForGraphicWithKPI');
      
      if (response.data.success) {
        // Filtrar solo datos de POE
        const poeOnlyData = response.data.data.filter((item: any) => 
          item.lista_documentos.some((doc: any) => doc.tipo === 'POE')
        );
        setData(poeOnlyData);
      } else {
        throw new Error('La API no devolvió datos válidos para POE');
      }
    } catch (error: any) {
      console.error('Error fetching POE data:', error);
      setError(error.response?.data?.message || 'Error al obtener los datos de POE');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => {
    await fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};