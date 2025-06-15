// src/components/ChartSelector.tsx
import  { useEffect, useState } from 'react';
import { Bar, Pie, Doughnut, Line, PolarArea } from 'react-chartjs-2';
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
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import api from '../../apiConfig/api';

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

const ChartSelector = () => {
  const [chartType, setChartType] = useState('bar');
  const [labels, setLabels] = useState<string[]>([]);
  const [capData, setCapData] = useState<number[]>([]);
  const [noCapData, setNoCapData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dataForGraphic');
        if (res.data.success) {
          const data = res.data.data;
          setLabels(data.map((item: any) => item.area));
          setCapData(data.map((item: any) => Number(item.capacitados)));
          setNoCapData(data.map((item: any) => Number(item.no_capacitados)));
        }
      } catch (error) {
        setLabels([]);
        setCapData([]);
        setNoCapData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Datos para gráficos comparativos (barras, líneas, polar)
  const comparativeData = {
    labels,
    datasets: [
      {
        label: 'Capacitados',
        data: capData,
        backgroundColor: '#4ade80',
        borderColor: '#16a34a',
        borderWidth: 1,
      },
      {
        label: 'No capacitados',
        data: noCapData,
        backgroundColor: '#f87171',
        borderColor: '#dc2626',
        borderWidth: 1,
      },
    ],
  };

  // Datos para gráficos individuales (pie/doughnut)
  const trainedData = {
    labels,
    datasets: [{
      label: 'Capacitados',
      data: capData,
      backgroundColor: ['#4ade80', '#86efac', '#16a34a'],
      borderWidth: 1,
    }]
  };

  const untrainedData = {
    labels,
    datasets: [{
      label: 'No capacitados',
      data: noCapData,
      backgroundColor: ['#f87171', '#fca5a5', '#dc2626'],
      borderWidth: 1,
    }]
  };

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
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const renderChart = () => {
    const options = {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: {
          display: true,
          text:
            chartType === 'bar'
              ? 'Personal Capacitado vs No Capacitado por Área'
              : chartType === 'line'
              ? 'Tendencia de Capacitación por Área'
              : chartType === 'pie'
              ? 'Personal Capacitado por Área'
              : chartType === 'doughnut'
              ? 'Personal No Capacitado por Área'
              : 'Distribución de Personal por Área',
          font: { size: 18 },
        },
      },
    };

    switch (chartType) {
      case 'bar':
        return <Bar data={comparativeData} options={options} />;
      case 'line':
        return <Line data={comparativeData} options={options} />;
      case 'polar':
        return <PolarArea data={comparativeData} options={options} />;
      case 'pie':
        return <Pie data={trainedData} options={options} />;
      case 'doughnut':
        return <Doughnut data={untrainedData} options={options} />;
      default:
        return <Bar data={comparativeData} options={options} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-center mb-8">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="chart-select-label">Tipo de Gráfico</InputLabel>
          <Select
            labelId="chart-select-label"
            value={chartType}
            label="Tipo de Gráfico"
            onChange={(e) => setChartType(e.target.value)}
          >
            <MenuItem value="bar">Barras</MenuItem>
            <MenuItem value="pie">Circular (Pie)</MenuItem>
            <MenuItem value="doughnut">Dona (Doughnut)</MenuItem>
            <MenuItem value="line">Líneas</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: '100%', height: '100%' }}>
          {loading ? 'Cargando...' : renderChart()}
        </Box>
      </div>
    </div>
  );
};

export default ChartSelector;