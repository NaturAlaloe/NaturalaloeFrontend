
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const StatsCards = () => {
  const statsData = [
    {
      title: 'Limpieza',
      trained: 42,
      untrained: 8,
      percentage: 84,
      trend: 'increase'
    },
    {
      title: 'Inspección',
      trained: 35,
      untrained: 15,
      percentage: 70,
      trend: 'increase'
    },
    {
      title: 'Recolección',
      trained: 28,
      untrained: 12,
      percentage: 56,
      trend: 'decrease'
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-4">{stat.title}</h3>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Capacitados</span>
            <span className="font-bold text-green-700">{stat.trained}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">No capacitados</span>
            <span className="font-bold text-red-600">{stat.untrained}</span>
          </div>
          
          <div className="flex items-center">
            {stat.trend === 'increase' ? (
              <ArrowUpward className="text-green-500" fontSize="small" />
            ) : (
              <ArrowDownward className="text-red-500" fontSize="small" />
            )}
            <span className={`text-sm font-medium ml-1 ${
              stat.trend === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.percentage}%
            </span>
            <span className="text-gray-500 text-sm ml-2">
              vs total
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;