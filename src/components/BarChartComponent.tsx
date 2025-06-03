// src/components/BarChartComponent.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartComponent = () => {
  const data = {
    labels: ['Limpieza', 'Inspección', 'Recolección'],
    datasets: [
      {
        label: 'Capacitados',
        data: [42, 35, 28],
        backgroundColor: '#4ade80',
        borderRadius: 4,
      },
      {
        label: 'No capacitados',
        data: [8, 15, 12],
        backgroundColor: '#f87171',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Personal Capacitado vs No Capacitado por Área',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartComponent;