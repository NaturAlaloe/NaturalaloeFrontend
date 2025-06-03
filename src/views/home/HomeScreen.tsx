// src/views/home/HomeScreen.tsx
import { Home as HomeIcon } from '@mui/icons-material';
import StatsCards from '../../components/StatsCards';
import ChartSelector from '../../components/ChartSelector';

export default function HomeScreen() {
  return (
    <div className="min-h-[80vh] bg-[#f4fcec] p-4">
  

      {/* Sección de estadísticas */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Estadísticas de Capacitación
        </h2>
        <StatsCards />
      </div>

      {/* Selector de gráficos */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Visualización de Datos
        </h2>
        <ChartSelector />
      </div>
    </div>
  );
}