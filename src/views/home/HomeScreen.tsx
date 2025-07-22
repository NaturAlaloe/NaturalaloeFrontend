import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import { useHomeData } from '../../hooks/useHomeData';
import ChartSelector from '../../components/home/ChartSelector';
import { Typography } from '@mui/material';
import api from '../../apiConfig/api';

type PendingDepartment = {
  id_departamento: number | string;
  departamento: string;
  total_empleados: number;
  total_certificados: string;
  pendientes: string;
  cobertura_pct: string;
  fehcha_actualizacion: string;
};

type ProcedureDepartment = {
  id_departamento: number;
  departamento: string;
  total_poes: number;
  total_actualizados: string;
  no_actualizados: string;
  cumplimiento_pct: string;
  fecha_actualizacion: string;
};

// Componente reutilizable para las secciones de pendientes
const PendingSection = ({ 
  title, 
  data, 
  loading, 
  columns, 
  renderRow, 
  totalPending, 
  onViewAll 
}: any) => (
  <div className="bg-white rounded-xl shadow-gray-300 shadow p-4 mb-8 transition hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <Typography variant="h6" className="text-green-800">{title}</Typography>
      <div className="flex items-center gap-2 bg-green-100 px-2 py-1 rounded-lg">
        <PersonIcon className="text-green-600" fontSize="small" />
        <span className="font-bold text-green-800 text-sm">{totalPending}</span>
        <span className="text-green-700 text-xs">Pendientes</span>
      </div>
    </div>

    <div className="mb-4">
      <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-1 text-xs font-semibold text-gray-600">
        {columns.map((col: any, idx: number) => (
          <div key={idx} className={col.className}>{col.label}</div>
        ))}
      </div>
      
      {loading ? (
        <div className="text-center text-gray-400 text-sm font-semibold py-4">Cargando...</div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-400 text-sm font-semibold py-4">No hay pendientes de capacitación</div>
      ) : (
        data.slice(0, 3).map(renderRow)
      )}
    </div>
    
    <div className="flex justify-end">
      <button
        onClick={onViewAll}
        className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold hover:bg-green-200 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
      >
        Ver Todos
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
);

export default function HomeScreen() {
  const navigate = useNavigate();
  const { loading: homeLoading } = useHomeData();
  const [pendingDepartments, setPendingDepartments] = useState<PendingDepartment[]>([]);
  const [loadingPendings, setLoadingPendings] = useState(true);
  const [proceduresData, setProceduresData] = useState<ProcedureDepartment[]>([]);
  const [loadingProcedures, setLoadingProcedures] = useState(true);

  useEffect(() => {
    // Cargar datos de capacitaciones pendientes
    api.get('/dataForGraphicTrainingPendings')
      .then(res => {
        console.log('API Response:', res.data);
        if (res.data.success) {
          console.log('Departments found:', res.data.data);
          setPendingDepartments(res.data.data.slice(0, 3));
        } else {
          console.log('API returned success: false');
        }
      })
      .catch(error => console.error('Error fetching training pendings:', error))
      .finally(() => setLoadingPendings(false));

    // Cargar datos de procedimientos pendientes
    api.get('/dataForGraphicPendingProceduresByDepartment')
      .then(res => {
        if (res.data.success) {
          setProceduresData(res.data.data);
        }
      })
      .catch(error => console.error('Error fetching procedures pendings:', error))
      .finally(() => setLoadingProcedures(false));
  }, []);

  // Calcular el porcentaje promedio de cumplimiento de procedimientos
  const averageProceduresPercentage = proceduresData.length > 0 
    ? (proceduresData.reduce((sum, dept) => sum + Number(dept.cumplimiento_pct), 0) / proceduresData.length).toFixed(1)
    : "0.0";

  // Obtener la fecha más reciente de actualización
  const latestProcedureUpdate = proceduresData.length > 0
    ? proceduresData.reduce((latest, dept) => {
        const deptDate = new Date(dept.fecha_actualizacion);
        const latestDate = new Date(latest);
        return deptDate > latestDate ? dept.fecha_actualizacion : latest;
      }, proceduresData[0].fecha_actualizacion)
    : null;

  const formattedProcedureDate = latestProcedureUpdate 
    ? new Date(latestProcedureUpdate).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      })
    : "Julio 2025";

  const kpiList = [
    { 
      label: 'Certificación del Personal', 
      value: loadingProcedures ? "..." : `${averageProceduresPercentage}%`, 
      trend: '+3.0%', 
      route: '/home/trainingScreen',
      isRealTime: true 
    },
    { 
      label: 'Procedimientos Actualizados', 
      value: '87.0%', 
      trend: '+1.5%', 
      route: '/home/proceduresScreen'
    },
    { label: 'Políticas Actualizadas', value: '95.0%', trend: '+2.5%', route: null },
  ];

  const handleKpiClick = (route: string | null) => {
    if (route) navigate(route);
  };

  if (homeLoading) return <FullScreenSpinner />;

  const departmentColumns = [
    { label: "Departamento", className: "col-span-4" },
    { label: "Total Empleados", className: "col-span-3" },
    { label: "Certificados", className: "col-span-3" },
    { label: "Pendientes", className: "col-span-2 text-center" }
  ];

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
              className={`rounded-xl shadow-gray-300 shadow p-6 flex flex-col justify-between items-start border-l-4 border-green-600 bg-white transition hover:shadow-lg relative ${
                kpi.route ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => handleKpiClick(kpi.route)}
            >
              <span className="text-gray-500 text-sm mb-2">{kpi.label}</span>
              <span className="text-2xl font-bold mb-1 text-green-800">{kpi.value}</span>
              <span className="text-xs text-gray-400 mb-2">
                Última actualización: {kpi.isRealTime ? formattedProcedureDate : "Julio 2025"}
              </span>
              
              {kpi.route && (
                <div className="flex w-full justify-end mt-4">
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-semibold hover:bg-green-200 transition"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(kpi.route!);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Solo mantén esta sección de departamentos */}
        <PendingSection
          title="Pendientes a Capacitaciones"
          data={pendingDepartments}
          loading={loadingPendings}
          columns={departmentColumns}
          totalPending={pendingDepartments.reduce((sum, d) => sum + Number(d.pendientes), 0)}
          onViewAll={() => navigate('/home/pendingTrainingsScreen')}
          renderRow={(dept: PendingDepartment) => (
            <div key={dept.id_departamento} className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0">
              <div className="col-span-4">
                <span className="font-medium text-gray-800 text-sm truncate">{dept.departamento}</span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="text-xs text-gray-700 truncate">{dept.total_empleados}</span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="text-xs text-gray-700 truncate">{Number(dept.total_certificados)}</span>
              </div>
              <div className="col-span-2 flex justify-center items-center">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                  {Number(dept.pendientes)}
                </span>
              </div>
            </div>
          )}
        />
      </div>
  )
}