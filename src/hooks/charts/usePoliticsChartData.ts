import { useState, useEffect } from 'react';
import api from '../../apiConfig/api';

interface PoliticsData {
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

interface UsePoliticsChartDataReturn {
  data: PoliticsData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePoliticsChartData = (): UsePoliticsChartDataReturn => {
  const [data, setData] = useState<PoliticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/dataForGraphicWithKPI');
      
      if (response.data.success) {
        // Filtrar solo datos de POLITICA
        const politicsOnlyData = response.data.data.filter((item: any) => 
          item.lista_documentos.some((doc: any) => doc.tipo === 'POLITICA')
        );
        
        // Mapear y limpiar los datos para asegurar que no haya campos vacíos
        const cleanedData = politicsOnlyData.map((item: any) => ({
          ...item,
          area: item.area || item.nombre_area || 'Área no especificada',
          jefatura: item.jefatura || item.nombre_jefatura || 'Jefatura no especificada'
        }));
        
        setData(cleanedData);
      } else {
        throw new Error('La API no devolvió datos válidos para Políticas');
      }
    } catch (error: any) {
      console.error('Error fetching Politics data:', error);
      setError(error.response?.data?.message || 'Error al obtener los datos de políticas');
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