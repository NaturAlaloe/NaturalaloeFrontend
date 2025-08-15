import { useMemo } from 'react';

interface KpiDataItem {
  id_lote: number;
  area: string;
  jefatura: string;
  actualizados: string;
  pendientes: string;
  estado: string;
  lista_documentos: {
    tipo: string;
    razon: string;
    codigo: string;
    estado: string;
  }[];
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderWidth: number;
  borderColor?: string | string[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export const useChartData = () => {
  const processKpiData = useMemo(() => 
    (data: KpiDataItem[], groupBy: 'area' | 'jefatura'): ChartData | null => {
      if (!data.length) return null;

      const groupKey = groupBy === 'area' ? 'area' : 'jefatura';
      const groups = data.reduce((acc: Record<string, { actualizados: number, pendientes: number }>, item) => {
        // Mejorar la obtención de la clave de agrupación
        let key = item[groupKey];
        
        // Limpiar y validar la clave
        if (!key || key.trim() === '' || key.toLowerCase() === 'n/a' || key === 'null' || key === 'undefined') {
          key = groupBy === 'area' ? 'Área no especificada' : 'Jefatura no especificada';
        }
        
        key = key.trim();
        
        if (!acc[key]) {
          acc[key] = { actualizados: 0, pendientes: 0 };
        }
        acc[key].actualizados += parseInt(item.actualizados) || 0;
        acc[key].pendientes += parseInt(item.pendientes) || 0;
        return acc;
      }, {});

      // Ordenar las etiquetas alfabéticamente
      const labels = Object.keys(groups).sort();
      const actualizadosData = labels.map(label => groups[label].actualizados);
      const pendientesData = labels.map(label => groups[label].pendientes);

      return {
        labels,
        datasets: [
          {
            label: 'Actualizados',
            data: actualizadosData,
            backgroundColor: '#4ade80',
            borderWidth: 1,
          },
          {
            label: 'Pendientes',
            data: pendientesData,
            backgroundColor: '#f87171',
            borderWidth: 1,
          }
        ]
      };
    }, []
  );

  // Función para datos circulares de KPI (POE y MANAPOL)
  const processKpiDataForCircular = useMemo(() => 
    (data: KpiDataItem[]): ChartData | null => {
      if (!data.length) return null;

      const totals = data.reduce((acc, item) => {
        acc.actualizados += parseInt(item.actualizados) || 0;
        acc.pendientes += parseInt(item.pendientes) || 0;
        return acc;
      }, { actualizados: 0, pendientes: 0 });

      return {
        labels: ['Actualizados', 'Pendientes'],
        datasets: [{
          label: 'Documentos',
          data: [totals.actualizados, totals.pendientes],
          backgroundColor: ['#4ade80', '#f87171'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 2,
        }]
      };
    }, []
  );

  // Función específica para políticas (agrupa por responsable y estado)
  const processPoliticsData = useMemo(() => 
    (data: KpiDataItem[]): ChartData | null => {
      if (!data.length) return null;

      const groups = data.reduce((acc: Record<string, { actualizados: number, pendientes: number }>, item) => {
        // Para políticas, usar responsable y estado en lugar de área
        const responsable = item.jefatura || 'Responsable no especificado';
        const estado = item.estado || 'Estado no especificado';
        const key = `${responsable} - ${estado}`;
        
        if (!acc[key]) {
          acc[key] = { actualizados: 0, pendientes: 0 };
        }
        acc[key].actualizados += parseInt(item.actualizados) || 0;
        acc[key].pendientes += parseInt(item.pendientes) || 0;
        return acc;
      }, {});

      const labels = Object.keys(groups).sort();
      const actualizadosData = labels.map(label => groups[label].actualizados);
      const pendientesData = labels.map(label => groups[label].pendientes);

      return {
        labels,
        datasets: [
          {
            label: 'Actualizados',
            data: actualizadosData,
            backgroundColor: '#4ade80',
            borderWidth: 1,
          },
          {
            label: 'Pendientes',
            data: pendientesData,
            backgroundColor: '#f87171',
            borderWidth: 1,
          }
        ]
      };
    }, []
  );

  // Función para datos circulares de políticas
  const processPoliticsDataForCircular = useMemo(() => 
    (data: KpiDataItem[]): ChartData | null => {
      if (!data.length) return null;

      const totals = data.reduce((acc, item) => {
        acc.actualizados += parseInt(item.actualizados) || 0;
        acc.pendientes += parseInt(item.pendientes) || 0;
        return acc;
      }, { actualizados: 0, pendientes: 0 });

      return {
        labels: ['Actualizados', 'Pendientes'],
        datasets: [{
          label: 'Políticas',
          data: [totals.actualizados, totals.pendientes],
          backgroundColor: ['#4ade80', '#f87171'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 2,
        }]
      };
    }, []
  );

  const getEmptyChartData = useMemo(() => 
    (message: string): ChartData => ({
      labels: [message],
      datasets: [{
        label: 'Datos',
        data: [1],
        backgroundColor: '#e5e7eb',
        borderWidth: 1,
      }]
    }), []
  );

  return {
    processKpiData,
    processKpiDataForCircular,
    processPoliticsData,
    processPoliticsDataForCircular,
    getEmptyChartData,
  };
};