import { Link } from "react-router-dom";

type KpiData = {
  title: string;
  type: 'certification' | 'procedures' | 'training' | 'update';
  data: {
    area: string;
    metric1: number;
    metric2: number;
    percentage?: number;
    lastUpdate: string;
  }[];
};

const kpis: KpiData[] = [
  {
    title: "Certificación del Personal",
    type: 'certification',
    data: [
      {
        area: "Operaciones",
        metric1: 40,
        metric2: 5,
        percentage: 88.9,
        lastUpdate: "2023-11-15"
      },
      {
        area: "Logística",
        metric1: 32,
        metric2: 3,
        percentage: 91.4,
        lastUpdate: "2023-11-15"
      },
      {
        area: "Calidad",
        metric1: 28,
        metric2: 2,
        percentage: 93.3,
        lastUpdate: "2023-11-15"
      }
    ]
  },
  {
    title: "Estado de Procedimientos",
    type: 'procedures',
    data: [
      {
        area: "Operaciones",
        metric1: 20,
        metric2: 3,
        percentage: 87.0,
        lastUpdate: "2023-11-15"
      },
      {
        area: "Logística",
        metric1: 12,
        metric2: 2,
        percentage: 85.7,
        lastUpdate: "2023-11-15"
      },
      {
        area: "Calidad",
        metric1: 10,
        metric2: 3,
        percentage: 76.9,
        lastUpdate: "2023-11-15"
      }
    ]
  },
  {
    title: "Cumplimiento de Capacitaciones",
    type: 'training',
    data: [
      {
        area: "Operaciones",
        metric1: 85,
        metric2: 15,
        percentage: 85.0,
        lastUpdate: "2023-11-15"
      },
      {
        area: "Logística",
        metric1: 90,
        metric2: 10,
        percentage: 90.0,
        lastUpdate: "2023-11-15"
      },
      {
        area: "Calidad",
        metric1: 95,
        metric2: 5,
        percentage: 95.0,
        lastUpdate: "2023-11-15"
      }
    ]
  }
];

const getLabels = (type: string) => {
  switch(type) {
    case 'certification':
      return { metric1: 'Certificados', metric2: 'No certificados' };
    case 'procedures':
      return { metric1: 'Actualizados', metric2: 'Obsoletos' };
    case 'training':
      return { metric1: 'Completadas', metric2: 'Pendientes' };
    default:
      return { metric1: 'Metric 1', metric2: 'Metric 2' };
  }
};

const StatsCards = () => {
  return (
    <div className="flex flex-col items-center min-h-[60vh]">
      <h2 className="text-3xl font-bold text-green-800 mb-8 mt-4 text-center">
        Dashboard de Indicadores
      </h2>
      
      {kpis.map((kpi, kpiIndex) => (
        <div key={kpiIndex} className="w-full mb-12">
          <h3 className="text-2xl font-semibold text-green-700 mb-6 text-center">
            {kpi.title}
          </h3>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-8 p-4 w-full max-w-6xl">
            {kpi.data.map((stat, statIndex) => {
              const labels = getLabels(kpi.type);
              return (
                <div
                  key={statIndex}
                  className="bg-white rounded-2xl shadow-md p-8 w-full md:w-1/3 max-w-xs  flex flex-col justify-between transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:border-green-400"
                >
                  <h4 className="text-xl font-bold text-green-800 mb-4">{stat.area}</h4>
                  <div className="mb-2 flex justify-between">
                    <span className="text-base text-gray-700">{labels.metric1}</span>
                    <span className="font-bold text-green-700">{stat.metric1}</span>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-base text-gray-700">{labels.metric2}</span>
                    <span className="font-bold text-red-600">{stat.metric2}</span>
                  </div>
                  {stat.percentage && (
                    <div className="mb-2 flex justify-between">
                      <span className="text-base text-gray-700">Cumplimiento</span>
                      <span className="font-bold text-blue-700">
                        {stat.percentage}%
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-6">
                    Última actualización: {stat.lastUpdate}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <Link
          to="/estadisticas"
          className="px-8 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition text-lg"
        >
          Ver todas las estadísticas
        </Link>
      
      </div>
    </div>
  );
};

export default StatsCards;