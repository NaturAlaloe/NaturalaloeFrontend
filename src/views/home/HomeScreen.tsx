// src/views/home/HomeScreen.tsx
import { Home as HomeIcon } from '@mui/icons-material';
import StatsCards from '../../components/StatsCards';
import ChartSelector from '../../components/ChartSelector';

export default function HomeScreen() {
  return (
    <div className="min-h-[80vh] bg-[#f4fcec] p-4">
      {/* Sección de bienvenida */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="bg-[#ccc] rounded-2xl shadow-xl px-8 py-10 min-w-[340px] max-w-[420px] text-center flex flex-col items-center">
          <HomeIcon className="text-green-600 mb-4" style={{ fontSize: 60 }} />
          <h1 className="text-3xl font-bold text-green-800 mb-2">¡Bienvenido!</h1>
          <p className="text-base text-[#304328] mb-6">
            Este es el inicio de tu aplicación Natural Aloe. <br />
            Usa el menú lateral para navegar por las diferentes secciones.
          </p>
          <a
            href="https://naturalaloe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-800 text-white font-bold tracking-wide px-8 py-3 rounded-lg transition-colors duration-200"
          >
            Ir al sitio web
          </a>
        </div>
      </div>

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