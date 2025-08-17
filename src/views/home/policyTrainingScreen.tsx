import { Typography, Card, CardContent, LinearProgress, Box, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PolicyIcon from '@mui/icons-material/Policy';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import { usePolicyTraining } from '../../hooks/usePolicyTraining';

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

export default function PolicyTrainingScreen() {
  const {
    policies,
    loading,
    error,
    totalPersonal,
    totalCapacitados,
    totalPendientes,
    overallPercentage,
  } = usePolicyTraining();

  if (loading) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#FFF] px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#2BAC67] text-center font-[Poppins]">
            Capacitación Pendientes por Política
          </h1>
        </div>
        
        {/* Resumen General */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{totalPersonal}</div>
              <div className="text-sm text-gray-600">Total Personal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalCapacitados}</div>
              <div className="text-sm text-gray-600">Capacitados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalPendientes}</div>
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

      {/* Cards por Política */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => {
          const policyPercentage = policy.total_personal > 0 
            ? (policy.capacitados / policy.total_personal) * 100 
            : 0;

          return (
            <Card key={policy.codigo} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                {/* Header de la Política */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PolicyIcon className="text-green-600" fontSize="small" />
                    <Typography variant="h6" className="text-green-800 font-bold">
                      {policy.codigo}
                    </Typography>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getProgressBgColor(policyPercentage)}`}>
                    {policyPercentage.toFixed(1)}%
                  </div>
                </div>

                {/* Barra de Progreso */}
                <Box className="mb-4">
                  <LinearProgress
                    variant="determinate"
                    value={policyPercentage}
                    color={getProgressColor(policyPercentage)}
                    className="h-2 rounded-full"
                  />
                </Box>

                {/* Estadísticas Principales */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircleIcon className="text-green-600" fontSize="small" />
                      <span className="text-lg font-bold text-green-600">{policy.capacitados}</span>
                    </div>
                    <div className="text-xs text-gray-600">Capacitados</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <WarningIcon className="text-yellow-600" fontSize="small" />
                      <span className="text-lg font-bold text-yellow-600">{policy.pendientes}</span>
                    </div>
                    <div className="text-xs text-gray-600">Pendientes</div>
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Total Personal:</span>
                    <span className="text-xs font-semibold">{policy.total_personal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Última Actualización:</span>
                    <span className="text-xs font-semibold text-green-600">
                      {policy.fecha_refresco 
                        ? new Date(policy.fecha_refresco).toLocaleDateString()
                        : "Sin fecha"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {policies.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Typography variant="h6" className="text-gray-500 mb-2">
            No hay datos disponibles
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            No se encontraron políticas con datos de capacitación
          </Typography>
        </div>
      )}
    </div>
  );
}