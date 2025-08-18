import { Typography, Card, CardContent, LinearProgress, Box, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import { useRmByDepartment } from '../../hooks/useRmByDepartment';

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

export default function RmDepartmentScreen() {
  const {
    departments,
    loading,
    error,
    totalRm,
    totalActualizados,
    totalNoActualizados,
    overallPercentage,
  } = useRmByDepartment();

  if (loading) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#FFF] px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#2BAC67] text-center font-[Poppins]">
            Registros MANAPOL Pendientes por Departamento
          </h1>
        </div>
        
        {/* Resumen General */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{totalRm}</div>
              <div className="text-sm text-gray-600">Total RM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalActualizados}</div>
              <div className="text-sm text-gray-600">Actualizados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalNoActualizados}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">{overallPercentage}%</div>
              <div className="text-sm text-gray-600">Cumplimiento General</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Cards por Departamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          // Asegurar que los valores sean números enteros
          const totalRm = Number(dept.total_rm) || 0;
          const actualizados = Number(dept.total_actualizados) || 0;
          const pendientes = Number(dept.no_actualizados) || 0;
          
          const deptPercentage = totalRm > 0 ? (actualizados / totalRm) * 100 : 0;

          return (
            <Card key={dept.id_departamento} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                {/* Header del Departamento */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Typography variant="h6" className="text-green-800 font-bold truncate">
                      {dept.departamento}
                    </Typography>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getProgressBgColor(deptPercentage)}`}>
                    {Math.round(deptPercentage)}%
                  </div>
                </div>

                {/* Barra de Progreso */}
                <Box className="mb-4">
                  <LinearProgress
                    variant="determinate"
                    value={deptPercentage}
                    color={getProgressColor(deptPercentage)}
                    className="h-2 rounded-full"
                  />
                </Box>

                {/* Estadísticas Principales */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircleIcon className="text-green-600" fontSize="small" />
                      <span className="text-lg font-bold text-green-600">{actualizados}</span>
                    </div>
                    <div className="text-xs text-gray-600">Actualizados</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <WarningIcon className="text-red-600" fontSize="small" />
                      <span className="text-lg font-bold text-red-600">{pendientes}</span>
                    </div>
                    <div className="text-xs text-gray-600">Pendientes</div>
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Total RM:</span>
                    <span className="text-xs font-semibold">{totalRm}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Última Actualización:</span>
                    <span className="text-xs font-semibold text-green-600">
                      {dept.fecha_refresco 
                        ? new Date(dept.fecha_refresco).toLocaleDateString()
                        : "Sin fecha"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {departments.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Typography variant="h6" className="text-gray-500 mb-2">
            No hay datos disponibles
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            No se encontraron departamentos con datos de RM
          </Typography>
        </div>
      )}
    </div>
  );
}