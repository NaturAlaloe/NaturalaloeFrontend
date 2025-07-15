import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import { useHomeData } from '../../hooks/useHomeData';
import ChartSelector from '../../components/home/ChartSelector';
import { Typography } from '@mui/material';

const kpiList = [
  { label: 'Procedimientos Actualizados', value: '87.0%', trend: '+1.5%', color: 'bg-green-50 text-green-700' },
  { label: 'Políticas Actualizadas', value: '95.0%', trend: '+2.5%', color: 'bg-yellow-50 text-yellow-700' },
  { label: 'Certificación del Personal', value: '90.0%', trend: '+3.0%', color: 'bg-blue-50 text-blue-700' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { loading: homeLoading, topCollaborators, totalPending, handleCardClick } = useHomeData();

  if (homeLoading) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#FFF] px-6 py-8 rounded-xl">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 text-center">Dashboard de Indicadores</h1>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">

        <div className="lg:col-span-3">
          <ChartSelector />
        </div>

 
        <div className="flex flex-col gap-5">
          {kpiList.map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-xl shadow-gray-300 shadow p-6 flex flex-col justify-between items-start border-l-4 border-green-600 bg-white cursor-pointer transition hover:shadow-lg relative"
              onClick={() => {
                // Aquí puedes navegar o abrir el apartado correspondiente
              }}
            >
              <span className="text-gray-500 text-sm mb-2">{kpi.label}</span>
              <span className="text-2xl font-bold mb-1 text-green-800">{kpi.value}</span>
              <span className="text-xs text-gray-400 mb-2">
                Última actualización: Julio 2025
              </span>
              <div className="flex w-full justify-end mt-4">
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-semibold hover:bg-green-200 transition"
                  onClick={e => {
                    e.stopPropagation();
                    // Aquí puedes navegar o abrir el apartado correspondiente
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-gray-300 shadow p-4 transition hover:shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="text-green-800">
            Pendientes a Capacitaciones
          </Typography>
          <div className="flex items-center gap-2 bg-green-100 px-2 py-1 rounded-lg">
            <PersonIcon className="text-green-600" fontSize="small" />
            <span className="font-bold text-green-800 text-sm">{totalPending}</span>
            <span className="text-green-700 text-xs">Pendientes</span>
          </div>
        </div>

        {topCollaborators.length === 0 ? (
          <div className="text-center text-gray-400 text-sm font-semibold py-4">
            No hay capacitaciones pendientes
          </div>
        ) : (
          <div className="mb-4">
 
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-1 text-xs font-semibold text-gray-600">
              <div className="col-span-5">Colaborador</div>
              <div className="col-span-3">Área</div>
              <div className="col-span-2">Departamento</div>
              <div className="col-span-2 text-center">Pendientes</div>
            </div>
            
 
            {topCollaborators.slice(0, 3).map((col) => (
              <div
                key={col.id_colaborador}
                onClick={() => handleCardClick(col.id_colaborador)}
                className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group last:border-b-0"
              >

                <div className="col-span-5">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-800 text-sm truncate group-hover:text-green-700 transition-colors">
                        {col.nombre_completo}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {col.puesto}
                      </div>
                    </div>
                  </div>
                </div>
                
  
                <div className="col-span-3 flex items-center">
                  <span className="text-xs text-gray-700 truncate">{col.area}</span>
                </div>
                
   
                <div className="col-span-2 flex items-center">
                  <span className="text-xs text-gray-700 truncate">{col.departamento}</span>
                </div>
                
   
                <div className="col-span-2 flex justify-center items-center">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                    {col.pendingCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/home/pendingTrainingsScreen')}
            className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold hover:bg-green-200 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
          >
            Ver Todos
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}