import { Typography, Card, CardContent, LinearProgress, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

// Datos quemados de procedimientos por departamento
const proceduresData = [
  {
    id: 1,
    departmentName: 'Recursos Humanos',
    totalProcedures: 25,
    updated: 23,
    outdated: 2,
    percentage: 92.0,
    lastUpdate: '10 Jul 2025'
  },
  {
    id: 2,
    departmentName: 'Producción',
    totalProcedures: 45,
    updated: 38,
    outdated: 7,
    percentage: 84.4,
    lastUpdate: '08 Jul 2025'
  },
  {
    id: 3,
    departmentName: 'Calidad',
    totalProcedures: 18,
    updated: 17,
    outdated: 1,
    percentage: 94.4,
    lastUpdate: '12 Jul 2025'
  },
  {
    id: 4,
    departmentName: 'Logística',
    totalProcedures: 22,
    updated: 19,
    outdated: 3,
    percentage: 86.4,
    lastUpdate: '06 Jul 2025'
  },
  {
    id: 5,
    departmentName: 'Administración',
    totalProcedures: 15,
    updated: 14,
    outdated: 1,
    percentage: 93.3,
    lastUpdate: '14 Jul 2025'
  },
  {
    id: 6,
    departmentName: 'Ventas',
    totalProcedures: 12,
    updated: 10,
    outdated: 2,
    percentage: 83.3,
    lastUpdate: '09 Jul 2025'
  }
];

const getProgressColor = (percentage: number) => {
  if (percentage >= 95) return 'success';
  if (percentage >= 85) return 'warning';
  return 'error';
};

const getProgressBgColor = (percentage: number) => {
  if (percentage >= 95) return 'bg-green-50';
  if (percentage >= 85) return 'bg-yellow-50';
  return 'bg-red-50';
};

export default function ProceduresScreen() {

  const totalProcedures = proceduresData.reduce((sum, dept) => sum + dept.totalProcedures, 0);
  const totalUpdated = proceduresData.reduce((sum, dept) => sum + dept.updated, 0);
  const totalOutdated = proceduresData.reduce((sum, dept) => sum + dept.outdated, 0);
  const overallPercentage = ((totalUpdated / totalProcedures) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#FFF] px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-10 text-center">
            
          <h1 className="text-4xl font-black text-[#2BAC67] text-center font-[Poppins]">
            Procedimientos Actualizados
          </h1>
        </div>
        
        {/* Resumen General */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{totalProcedures}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalUpdated}</div>
              <div className="text-sm text-gray-600">Actualizados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalOutdated}</div>
              <div className="text-sm text-gray-600">No Actualizados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">{overallPercentage}%</div>
              <div className="text-sm text-gray-600">Cumplimiento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards por Departamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proceduresData.map((dept) => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              {/* Header del Departamento */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
               
                  <Typography variant="h6" className="text-green-800 font-bold">
                    {dept.departmentName}
                  </Typography>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getProgressBgColor(dept.percentage)}`}>
                  {dept.percentage}%
                </div>
              </div>

              {/* Barra de Progreso */}
              <Box className="mb-4">
                <LinearProgress
                  variant="determinate"
                  value={dept.percentage}
                  color={getProgressColor(dept.percentage)}
                  className="h-2 rounded-full"
                />
              </Box>

              {/* Estadísticas Principales */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircleIcon className="text-green-600" fontSize="small" />
                    <span className="text-lg font-bold text-green-600">{dept.updated}</span>
                  </div>
                  <div className="text-xs text-gray-600">Actualizados</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <WarningIcon className="text-yellow-600" fontSize="small" />
                    <span className="text-lg font-bold text-yellow-600">{dept.outdated}</span>
                  </div>
                  <div className="text-xs text-gray-600">Pendientes</div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Procedimientos:</span>
                  <span className="text-xs font-semibold">{dept.totalProcedures}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Última Actualización:</span>
                  <span className="text-xs font-semibold text-green-600">{dept.lastUpdate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}