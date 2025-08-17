import { useState, useEffect } from 'react';
import api from '../../apiConfig/api';

interface MannapolData {
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

interface UseMannapolChartDataReturn {
  data: MannapolData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMannapolChartData = (): UseMannapolChartDataReturn => {
  const [data, setData] = useState<MannapolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/dataForGraphicWithKPI');
      
      if (response.data.success) {
        // Filtrar solo datos de MANAPOL
        const mannapolOnlyData = response.data.data.filter((item: any) => 
          item.lista_documentos.some((doc: any) => doc.tipo === 'REGISTRO MANAPOL')
        );
        setData(mannapolOnlyData);
      } else {
        throw new Error('La API no devolvió datos válidos para MANAPOL');
      }
    } catch (error: any) {
      console.error('Error fetching MANAPOL data:', error);
      setError(error.response?.data?.message || 'Error al obtener los datos de MANAPOL');
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