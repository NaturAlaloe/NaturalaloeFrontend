import React, { useState } from 'react';
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
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

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

const areaOptions = [
  { value: 'todas', label: 'Todas las áreas' },
  { value: 'operaciones', label: 'Operaciones' },
  { value: 'logistica', label: 'Logística' },
  { value: 'calidad', label: 'Calidad' },
];

const kpiOptions = [
  { value: 'certification', label: 'Certificación del Personal' },
  { value: 'procedures', label: 'Estado de Procedimientos' },
  { value: 'training', label: 'Cumplimiento de Capacitaciones' },
  { value: 'update', label: 'Actualización de Procedimientos' },
];

const chartOptions = [
  { value: 'bar', label: 'Barras' },
  { value: 'pie', label: 'Circular (Pie)' },
  { value: 'doughnut', label: 'Dona (Doughnut)' },
  { value: 'line', label: 'Líneas' },
];

const kpiData = {
  certification: {
    todas: {
      labels: ['Certificados', 'No certificados'],
      datasets: [{
        label: 'Personal',
        data: [120, 15],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    },
    operaciones: {
      labels: ['Certificados', 'No certificados'],
      datasets: [{
        label: 'Operaciones',
        data: [40, 5],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    },
    logistica: {
      labels: ['Certificados', 'No certificados'],
      datasets: [{
        label: 'Logística',
        data: [32, 3],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    },
    calidad: {
      labels: ['Certificados', 'No certificados'],
      datasets: [{
        label: 'Calidad',
        data: [28, 2],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    },
  },
  procedures: {
    todas: {
      labels: ['Actualizados', 'Obsoletos', 'Sin cambios'],
      datasets: [{
        label: 'Procedimientos',
        data: [42, 8, 15],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
        borderWidth: 1,
      }]
    },
    operaciones: {
      labels: ['Actualizados', 'Obsoletos', 'Sin cambios'],
      datasets: [{
        label: 'Operaciones',
        data: [20, 3, 5],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
        borderWidth: 1,
      }]
    },
    logistica: {
      labels: ['Actualizados', 'Obsoletos', 'Sin cambios'],
      datasets: [{
        label: 'Logística',
        data: [12, 2, 6],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
        borderWidth: 1,
      }]
    },
    calidad: {
      labels: ['Actualizados', 'Obsoletos', 'Sin cambios'],
      datasets: [{
        label: 'Calidad',
        data: [10, 3, 4],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
        borderWidth: 1,
      }]
    },
  },
  training: {
    todas: {
      labels: ['Completadas', 'Pendientes'],
      datasets: [{
        label: 'Capacitaciones',
        data: [85, 15],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    },
    operaciones: {
      labels: ['Completadas', 'Pendientes'],
      datasets: [{
        label: 'Operaciones',
        data: [40, 5],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    },
    logistica: {
      labels: ['Completadas', 'Pendientes'],
      datasets: [{
        label: 'Logística',
        data: [28, 4],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    },
    calidad: {
      labels: ['Completadas', 'Pendientes'],
      datasets: [{
        label: 'Calidad',
        data: [17, 6],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    },
  },
  update: {
    todas: {
      labels: ['A tiempo', 'Atrasados'],
      datasets: [{
        label: 'Actualizaciones',
        data: [42, 8],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      }]
    }
  }
};

const ChartSelector = ({ initialKpi = 'certification' }: { initialKpi?: keyof typeof kpiData }) => {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'doughnut' | 'line'>('bar');
  const [selectedArea, setSelectedArea] = useState('todas');
  const [selectedKpi, setSelectedKpi] = useState<keyof typeof kpiData>(initialKpi);

  const selectedData = kpiData[selectedKpi][selectedArea] || kpiData[selectedKpi]['todas'];

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
      },
      title: {
        display: true,
        text: kpiOptions.find(k => k.value === selectedKpi)?.label || 'Indicador',
        font: { size: 18 },
      },
    },
  };

  const renderChart = () => {
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {kpiOptions.find(k => k.value === selectedKpi)?.label || 'Indicador'}
        </h2>
        <div className="flex gap-4 flex-wrap">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="kpi-select-label">Indicador</InputLabel>
            <Select
              labelId="kpi-select-label"
              value={selectedKpi}
              label="Indicador"
              onChange={(e) => setSelectedKpi(e.target.value as keyof typeof kpiData)}
            >
              {kpiOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedKpi !== 'update' && (
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="area-select-label">Área</InputLabel>
              <Select
                labelId="area-select-label"
                value={selectedArea}
                label="Área"
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                {areaOptions.map((area) => (
                  <MenuItem key={area.value} value={area.value}>{area.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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

      <div className="p-4 bg-gray-50 rounded-lg">
        <div style={{ height: '400px' }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            {renderChart()}
          </Box>
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-4">
        Última actualización: 2023-11-15
      </div>
    </div>
  );
};

export default ChartSelector;