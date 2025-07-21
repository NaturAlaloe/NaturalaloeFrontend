import { useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, LinearProgress, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

// Datos quemados por departamento
const departmentData = [
  {
    id: 1,
    name: 'Recursos Humanos',
    totalEmployees: 45,
    certified: 42,
    pending: 3,
    percentage: 93.3,
    lastUpdate: '15 Jul 2025',
    criticalTrainings: 1,
    expiringCertifications: 5
  },
  {
    id: 2,
    name: 'Producción',
    totalEmployees: 120,
    certified: 102,
    pending: 18,
    percentage: 85.0,
    lastUpdate: '12 Jul 2025',
    criticalTrainings: 8,
    expiringCertifications: 12
  },
  {
    id: 3,
    name: 'Calidad',
    totalEmployees: 28,
    certified: 27,
    pending: 1,
    percentage: 96.4,
    lastUpdate: '18 Jul 2025',
    criticalTrainings: 0,
    expiringCertifications: 3
  },
  {
    id: 4,
    name: 'Logística',
    totalEmployees: 35,
    certified: 30,
    pending: 5,
    percentage: 85.7,
    lastUpdate: '14 Jul 2025',
    criticalTrainings: 2,
    expiringCertifications: 4
  },
  {
    id: 5,
    name: 'Administración',
    totalEmployees: 22,
    certified: 20,
    pending: 2,
    percentage: 90.9,
    lastUpdate: '16 Jul 2025',
    criticalTrainings: 1,
    expiringCertifications: 2
  },
  {
    id: 6,
    name: 'Ventas',
    totalEmployees: 18,
    certified: 1,
    pending: 2,
    percentage: 8.9,
    lastUpdate: '13 Jul 2025',
    criticalTrainings: 0,
    expiringCertifications: 1
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

export default function CertificationScreen() {
  const navigate = useNavigate();

  const totalEmployees = departmentData.reduce((sum, dept) => sum + dept.totalEmployees, 0);
  const totalCertified = departmentData.reduce((sum, dept) => sum + dept.certified, 0);
  const totalPending = departmentData.reduce((sum, dept) => sum + dept.pending, 0);
  const overallPercentage = ((totalCertified / totalEmployees) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#FFF] px-6 py-8">
      {/* Header */}
      <div className="mb-8">
       
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#2BAC67] text-center font-[Poppins]">
                        Pendientes de Capacitación
                    </h1>
        </div>
        
        {/* Resumen General */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{totalEmployees}</div>
              <div className="text-sm text-gray-600">Total Empleados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalCertified}</div>
              <div className="text-sm text-gray-600">Certificados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">{overallPercentage}%</div>
              <div className="text-sm text-gray-600">Cobertura General</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards por Departamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentData.map((dept) => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              {/* Header del Departamento */}
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="text-green-800 font-bold">
                  {dept.name}
                </Typography>
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
                    <span className="text-lg font-bold text-green-600">{dept.certified}</span>
                  </div>
                  <div className="text-xs text-gray-600">Certificados</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <WarningIcon className="text-yellow-600" fontSize="small" />
                    <span className="text-lg font-bold text-yellow-600">{dept.pending}</span>
                  </div>
                  <div className="text-xs text-gray-600">Pendientes</div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Empleados:</span>
                  <span className="text-xs font-semibold">{dept.totalEmployees}</span>
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