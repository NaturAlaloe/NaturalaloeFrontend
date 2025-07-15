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
  // Chart state
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'doughnut' | 'line'>('bar');
  const [groupBy, setGroupBy] = useState<'area' | 'jefatura'>('area');
  const [poeData, setPoeData] = useState<POEData[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      setApiError(null);
      const response = await api.get('/dataForGraphicWithKPI');

      if (response.data.success) {
        setPoeData(response.data.data);
      } else {
        setApiError('La API no devolvió datos válidos');
      }
    } catch (error: any) {
      console.error('Error fetching POE data:', error);
      setApiError('Error al cargar los datos. Intente nuevamente.');
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const getChartData = () => {
    if (chartLoading) {
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

    if (apiError || !poeData.length) {
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

    const groupKey = groupBy === 'area' ? 'area' : 'jefatura';
    const groups = poeData.reduce((acc: Record<string, { actualizados: number, pendientes: number }>, item) => {
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

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 20,
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
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
        font: { size: 16 },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    }
  };

  const renderChart = () => {
    if (chartLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <CircularProgress />
        </div>
      );
    }

    if (apiError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Alert severity="error" className="w-full max-w-md">
            {apiError}
          </Alert>
          <Button variant="contained" onClick={fetchChartData}>
            Reintentar
          </Button>
        </div>
      );
    }

    if (!poeData.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Typography variant="h6" className="text-gray-500">
            No hay datos disponibles
          </Typography>
          <Button variant="outlined" onClick={fetchChartData}>
            Recargar datos
          </Button>
        </div>
      );
    }

    const selectedData = getChartData();

    // Wrapper div with proper centering
    const ChartWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full max-w-full max-h-full">
          {children}
        </div>
      </div>
    );

    switch (chartType) {
      case 'bar':
        return (
          <ChartWrapper>
            <Bar data={selectedData} options={commonOptions} />
          </ChartWrapper>
        );
      case 'pie':
        return (
          <ChartWrapper>
            <Pie data={selectedData} options={commonOptions} />
          </ChartWrapper>
        );
      case 'doughnut':
        return (
          <ChartWrapper>
            <Doughnut data={selectedData} options={commonOptions} />
          </ChartWrapper>
        );
      case 'line':
        return (
          <ChartWrapper>
            <Line data={selectedData} options={commonOptions} />
          </ChartWrapper>
        );
      default:
        return (
          <ChartWrapper>
            <Bar data={selectedData} options={commonOptions} />
          </ChartWrapper>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-gray-300 shadow p-6 flex flex-col transition hover:shadow-lg h-full">
      {/* Chart Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <Typography variant="h6" className="text-green-800">
          Actualización de Procedimientos Operativos Estándar (POE)
        </Typography>

        <div className="flex gap-4 flex-wrap">
          <FormControl
            size="small"
            sx={{
              minWidth: 140,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#2AAC67',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#2AAC67',
                },
              },
            }}
          >
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

          <FormControl
            size="small"
            sx={{
              minWidth: 140,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#2AAC67',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#2AAC67',
                },
              },
            }}
          >
            <InputLabel id="chart-select-label">Gráfico</InputLabel>
            <Select
              labelId="chart-select-label"
              value={chartType}
              label="Gráfico"
              onChange={(e) => setChartType(e.target.value as any)}
            >
              <MenuItem value="bar">Barras</MenuItem>
              <MenuItem value="pie">Circular</MenuItem>
              <MenuItem value="doughnut">Dona</MenuItem>
              <MenuItem value="line">Líneas</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Chart Container - Properly centered */}
      <div className="flex-1 bg-gray-50 rounded-lg p-4" style={{ minHeight: '450px' }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {renderChart()}
        </Box>
      </div>

      {/* Chart Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t">
        <span>Total registros: {poeData.length}</span>
        <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
      </div>
    </div>
  );
};

export default ChartSelector;