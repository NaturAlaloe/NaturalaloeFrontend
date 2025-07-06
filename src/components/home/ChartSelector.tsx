import { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  CircularProgress,
  Typography,
  TextField,
  Grid,
  Button,
  Alert
} from '@mui/material';
import api from "../../apiConfig/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = [
  { value: 'bar', label: 'Barras' },
  { value: 'pie', label: 'Circular (Pie)' },
  { value: 'doughnut', label: 'Dona (Doughnut)' },
  { value: 'line', label: 'Líneas' },
];

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

const ChartSelector = () => {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'doughnut' | 'line'>('bar');
  const [groupBy, setGroupBy] = useState<'area' | 'jefatura'>('area');
  const [poeData, setPoeData] = useState<POEData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'updated' | 'pending'>('all');
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await api.get('/dataForGraphicWithKPI'); // Nota: Quité el /api duplicado
      
      if (response.data.success) {
        setPoeData(response.data.data);
        setLastUpdated(new Date().toISOString().split('T')[0]);
      } else {
        setApiError('La API no devolvió datos válidos');
      }
    } catch (error: any) {
      console.error('Error fetching POE data:', error);
      setApiError('Error al cargar los datos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = poeData.filter(item => {
    // Verificar si lista_documentos existe y es un array
    if (!item.lista_documentos || !Array.isArray(item.lista_documentos)) {
      return false;
    }
    
    // Filtrar por término de búsqueda (código o razón)
    const matchesSearch = searchTerm === '' || 
      item.lista_documentos.some(doc => 
        doc?.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc?.razon?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Filtrar por estado (convertir a número)
    const actualizados = parseInt(item.actualizados) || 0;
    const pendientes = parseInt(item.pendientes) || 0;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'updated' && actualizados > 0) ||
      (statusFilter === 'pending' && pendientes > 0);
    
    return matchesSearch && matchesStatus;
  });

  const getChartData = () => {
    if (loading) {
      return {
        labels: ['Cargando datos...'],
        datasets: [{
          label: 'Datos',
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 1,
        }]
      };
    }

    if (apiError || !filteredData.length) {
      return {
        labels: ['Sin datos'],
        datasets: [{
          label: 'Datos',
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 1,
        }]
      };
    }

    // Agrupación dinámica
    const groupKey = groupBy === 'area' ? 'area' : 'jefatura';
    const groups = filteredData.reduce((acc: Record<string, {actualizados: number, pendientes: number}>, item) => {
      const key = item[groupKey] || 'Sin especificar';
      if (!acc[key]) {
        acc[key] = { actualizados: 0, pendientes: 0 };
      }
      acc[key].actualizados += parseInt(item.actualizados) || 0;
      acc[key].pendientes += parseInt(item.pendientes) || 0;
      return acc;
    }, {});

    const labels = Object.keys(groups);
    const actualizadosData = Object.values(groups).map(group => group.actualizados);
    const pendientesData = Object.values(groups).map(group => group.pendientes);

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
  };

  const selectedData = getChartData();

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${!isNaN(percentage) ? percentage : 0}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Actualización de Procedimientos',
        font: { size: 18 },
      },
    },
  };

  const renderChart = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full"><CircularProgress /></div>;
    }

    if (apiError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <Alert severity="error">{apiError}</Alert>
          <Button variant="contained" onClick={fetchData}>
            Reintentar
          </Button>
        </div>
      );
    }

    if (!filteredData.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <Typography variant="h6">No hay datos disponibles</Typography>
          {searchTerm && (
            <Typography variant="body2" color="textSecondary">
              No se encontraron resultados para "{searchTerm}"
            </Typography>
          )}
          <Button variant="outlined" onClick={fetchData}>
            Recargar datos
          </Button>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return <Bar data={selectedData} options={commonOptions} />;
      case 'pie':
        return <Pie data={selectedData} options={commonOptions} />;
      case 'doughnut':
        return <Doughnut data={selectedData} options={commonOptions} />;
      case 'line':
        return <Line data={selectedData} options={commonOptions} />;
      default:
        return <Bar data={selectedData} options={commonOptions} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <Typography variant="h5" className="text-gray-800 font-semibold">
            Actualización de Procedimientos Operativos Estándar (POE)
          </Typography>
          
          <div className="flex gap-4 flex-wrap">
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="groupby-select-label">Agrupar por</InputLabel>
              <Select
                labelId="groupby-select-label"
                value={groupBy}
                label="Agrupar por"
                onChange={(e) => setGroupBy(e.target.value as 'area' | 'jefatura')}
              >
                <MenuItem value="area">Área</MenuItem>
                <MenuItem value="jefatura">Jefatura</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="chart-select-label">Tipo de Gráfico</InputLabel>
              <Select
                labelId="chart-select-label"
                value={chartType}
                label="Tipo de Gráfico"
                onChange={(e) => setChartType(e.target.value as any)}
              >
                {chartOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar por código o razón"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Filtrar por estado</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Filtrar por estado"
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="updated">Actualizados</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div style={{ height: '500px' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              {renderChart()}
            </Box>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Typography variant="body2" color="textSecondary">
            Total registros: {filteredData.length}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Última actualización: {lastUpdated}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ChartSelector;