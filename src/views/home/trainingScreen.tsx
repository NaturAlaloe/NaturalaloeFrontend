import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import { Card, CardContent, Box, Alert, Typography, LinearProgress } from "@mui/material";
import { useTrainingDepartments } from "../../hooks/useTrainingDepartments";

const getProgressColor = (percentage: number) => {
  if (percentage >= 95) return "success";
  if (percentage >= 85) return "warning";
  return "error";
};

export default function TrainingScreen() {
  const {
    departments,
    loading,
    error,
    totalEmployees,
    totalCertified,
    totalPending,
    overallPercentage,
  } = useTrainingDepartments();

  if (loading) return <FullScreenSpinner />;

  return (
    <div className="min-h-screen bg-[#FFF] px-6 py-8">
      <div className="mb-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#2BAC67] text-center font-[Poppins]">
            Pendientes de Capacitación por Departamento
          </h1>
        </div>
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

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id_departamento} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="text-green-800 font-bold">
                  {dept.departamento}
                </Typography>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-50">
                  {Number(dept.cobertura_pct).toFixed(1)}%
                </div>
              </div>
              <Box className="mb-4">
                <LinearProgress
                  variant="determinate"
                  value={Number(dept.cobertura_pct)}
                  color={getProgressColor(Number(dept.cobertura_pct))}
                  className="h-2 rounded-full"
                />
              </Box>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <PersonRoundedIcon className="text-green-600" fontSize="small" />
                    <span className="text-lg font-bold text-green-600">{dept.total_certificados}</span>
                  </div>
                  <div className="text-xs text-gray-600">Certificados</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <PersonRoundedIcon className="text-yellow-600" fontSize="small" />
                    <span className="text-lg font-bold text-yellow-600">{dept.pendientes}</span>
                  </div>
                  <div className="text-xs text-gray-600">Pendientes</div>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Empleados:</span>
                  <span className="text-xs font-semibold">{dept.total_empleados}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Última Actualización:</span>
                  <span className="text-xs font-semibold text-green-600">
                    {dept.fehcha_actualizacion
                      ? new Date(dept.fehcha_actualizacion).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}