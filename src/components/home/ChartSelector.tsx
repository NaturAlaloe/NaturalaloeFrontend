import { useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
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
  Alert,
  Tabs,
  Tab
} from '@mui/material';

// Hooks
import { usePoeChartData } from '../../hooks/charts/usePoeChartData';
import { useMannapolChartData } from '../../hooks/charts/useMannapolChartData';
import { usePoliticsChartData } from '../../hooks/charts/usePoliticsChartData';
import { useChartData } from '../../hooks/charts/useChartData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type DataSource = 'poe' | 'manapol' | 'politics';
type ChartType = 'bar' | 'pie' | 'doughnut';
type GroupBy = 'area' | 'jefatura';

const ChartSelector = () => {
  // Chart configuration state
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [groupBy, setGroupBy] = useState<GroupBy>('area');
  const [dataSource, setDataSource] = useState<DataSource>('poe');

  // Data hooks
  const { data: poeData, loading: poeLoading, error: poeError, refetch: refetchPoe } = usePoeChartData();
  const { data: mannapolData, loading: mannapolLoading, error: mannapolError, refetch: refetchMannapol } = useMannapolChartData();
  const { data: politicsData, loading: politicsLoading, error: politicsError, refetch: refetchPolitics } = usePoliticsChartData();

  // Chart data processing hook
  const { 
    processKpiData, 
    processKpiDataForCircular,
    processPoliticsData, 
    processPoliticsDataForCircular,
    getEmptyChartData 
  } = useChartData();

  // Computed values
  const isLoading = poeLoading || mannapolLoading || politicsLoading;
  const hasError = poeError || mannapolError || politicsError;

  const getCurrentData = () => {
    switch (dataSource) {
      case 'poe': return { data: poeData, error: poeError };
      case 'manapol': return { data: mannapolData, error: mannapolError };
      case 'politics': return { data: politicsData, error: politicsError };
      default: return { data: [], error: null };
    }
  };

  const getChartData = () => {
    if (isLoading) {
      return getEmptyChartData('Cargando datos...');
    }

    if (hasError) {
      return getEmptyChartData('Sin datos');
    }

    const { data, error } = getCurrentData();
    
    if (error || !data.length) {
      return getEmptyChartData(`Sin datos para ${getChartTitle()}`);
    }

    // Determinar si es gráfico circular
    const isCircularChart = chartType === 'pie' || chartType === 'doughnut';

    switch (dataSource) {
      case 'poe':
      case 'manapol':
        if (isCircularChart) {
          return processKpiDataForCircular(data as any) || getEmptyChartData('Sin datos disponibles');
        } else {
          return processKpiData(data as any, groupBy) || getEmptyChartData('Sin datos disponibles');
        }
      case 'politics':
        if (isCircularChart) {
          return processPoliticsDataForCircular(data as any) || getEmptyChartData('Sin datos de políticas');
        } else {
          return processPoliticsData(data as any) || getEmptyChartData('Sin datos de políticas');
        }
      default:
        return getEmptyChartData('Sin datos');
    }
  };

  const getChartTitle = () => {
    switch (dataSource) {
      case 'poe': return 'KPI Anual - Procedimientos Operativos Estándar (POE)';
      case 'manapol': return 'KPI Anual - Registros MANAPOL';
      case 'politics': return 'KPI Anual - Políticas Empresariales';
      default: return 'KPI Anual - Datos del Sistema';
    }
  };

  const getDataCount = () => {
    const { data } = getCurrentData();
    return data.length;
  };

  const handleRefresh = () => {
    switch (dataSource) {
      case 'poe': refetchPoe(); break;
      case 'manapol': refetchMannapol(); break;
      case 'politics': refetchPolitics(); break;
    }
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 20,
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          color: '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            
            // Para gráficos circulares
            if (chartType === 'pie' || chartType === 'doughnut') {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${context.label}: ${value} (${!isNaN(percentage) ? percentage : 0}%)`;
            }
            
            // Para gráficos de barras
            return `${label}: ${value}`;
          }
        }
      },
      title: {
        display: true,
        text: getChartTitle(),
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

  // Opciones específicas para gráficos circulares
  const getCircularChartOptions = () => ({
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 20,
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          color: '#374151',
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.datasets.length > 0) {
              // Para POE y MANAPOL (estados: actualizar/obsoleto)
              if (dataSource === 'poe' || dataSource === 'manapol') {
                if (data.labels.includes('Actualizar') && data.labels.includes('Obsoleto')) {
                  return [
                    {
                      text: 'Actualizar',
                      fillStyle: '#f87171',
                      strokeStyle: '#fff',
                      lineWidth: 2,
                      hidden: false,
                      index: 0
                    },
                    {
                      text: 'Obsoleto',
                      fillStyle: '#94a3b8',
                      strokeStyle: '#fff',
                      lineWidth: 2,
                      hidden: false,
                      index: 1
                    }
                  ];
                }
              }
              
              // Para políticas (manejo dinámico de estados)
              if (dataSource === 'politics') {
                return data.labels.map((label: string, index: number) => ({
                  text: label,
                  fillStyle: data.datasets[0].backgroundColor[index],
                  strokeStyle: '#fff',
                  lineWidth: 2,
                  hidden: false,
                  index: index
                }));
              }
            }
            
            // Fallback para casos sin datos
            return [{
              text: 'Sin datos',
              fillStyle: '#e5e7eb',
              strokeStyle: '#fff',
              lineWidth: 2,
              hidden: false,
              index: 0
            }];
          }
        },
      },
    }
  });

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <CircularProgress />
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Alert severity="error" className="w-full max-w-md">
            {hasError}
          </Alert>
          <Button variant="contained" onClick={handleRefresh}>
            Reintentar
          </Button>
        </div>
      );
    }

    const { data } = getCurrentData();
    if (!data.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Typography variant="h6" className="text-gray-500">
            No hay datos disponibles para {getChartTitle()}
          </Typography>
          <Button variant="outlined" onClick={handleRefresh}>
            Recargar datos
          </Button>
        </div>
      );
    }

    const selectedData = getChartData();

    const ChartWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full max-w-full max-h-full">
          {children}
        </div>
      </div>
    );

    // Usar opciones específicas según el tipo de gráfico
    const barChartProps = { data: selectedData, options: commonOptions };
    const circularChartProps = { data: selectedData, options: getCircularChartOptions() };

    switch (chartType) {
      case 'bar': 
        return <ChartWrapper><Bar {...barChartProps} /></ChartWrapper>;
      case 'pie': 
        return <ChartWrapper><Pie {...circularChartProps} /></ChartWrapper>;
      case 'doughnut': 
        return <ChartWrapper><Doughnut {...circularChartProps} /></ChartWrapper>;
      default: 
        return <ChartWrapper><Bar {...barChartProps} /></ChartWrapper>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-gray-300 shadow p-6 flex flex-col transition hover:shadow-lg h-full">
      {/* Data Source Tabs */}
      <div className="mb-4">
        <Tabs 
          value={dataSource} 
          onChange={(_e, newValue) => setDataSource(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: '#6b7280',
              fontSize: '0.875rem',
              minWidth: 'auto',
              padding: '6px 12px',
              '&.Mui-selected': {
                color: '#2AAC67',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2AAC67',
            },
          }}
        >
          <Tab label="POE" value="poe" />
          <Tab label="MANAPOL" value="manapol" />
          <Tab label="Políticas" value="politics" />
        </Tabs>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <Typography variant="h6" className="text-green-800 text-sm md:text-base">
          {getChartTitle()}
        </Typography>

        <div className="flex gap-4 flex-wrap">
          {/* Selector de agrupación solo para POE y MANAPOL (que sí tienen área) */}
          {(dataSource === 'poe' || dataSource === 'manapol') && (
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
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              >
                <MenuItem value="area">Área</MenuItem>
                <MenuItem value="jefatura">Jefatura</MenuItem>
              </Select>
            </FormControl>
          )}

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
              onChange={(e) => setChartType(e.target.value as ChartType)}
            >
              <MenuItem value="bar">Barras</MenuItem>
              <MenuItem value="pie">Circular</MenuItem>
              <MenuItem value="doughnut">Dona</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Chart Container */}
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
        <span>Total lotes de KPIs: {getDataCount()}</span>
        <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
      </div>
    </div>
  );
};

export default ChartSelector;