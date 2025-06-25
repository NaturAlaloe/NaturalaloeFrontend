
import StatsCards from '../../components/home/StatsCards';
import ChartSelector from '../../components/home/ChartSelector';

export default function HomeScreen() {
  return (
    <div className="min-h-[80vh] bg-[#f4fcec] p-4">
      <div className="max-w-6xl mx-auto mb-12">
    
        <StatsCards />
      </div>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Visualización de Datos
        </h2>
        <ChartSelector initialKpi="procedures" />
      </div>
    </div>
  );
}