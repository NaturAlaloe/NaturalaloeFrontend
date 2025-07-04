import { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import api from "../../apiConfig/api";
import GlobalModal from "../../components/globalComponents/GlobalModal"; // Asegúrate de que la ruta sea correcta

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const areaOptions = [
  { value: 'todas', label: 'Todas las áreas' },
  { value: 'Gerente General', label: 'Gerente General' },
];

const kpiOptions = [
  { value: 'update', label: 'Actualización de Procedimientos' },
];

const chartOptions = [
  { value: 'bar', label: 'Barras' },
  { value: 'pie', label: 'Circular (Pie)' },
  { value: 'doughnut', label: 'Dona (Doughnut)' },
  { value: 'line', label: 'Líneas' },
];

interface POEData {
  id_lote: number;
  area: string;
  jefatura: string;
  estado: string;
  cantidad: number;
  actualizados: string;
  pendientes: string;
  lista_documentos: {
    tipo: string;
    razon: string;
    codigo: string;
    estado: string;
  }[];
}

interface DocumentoKPI {
  codigo: string;
  tipo: string;
  razon: string;
}

const ChartSelector = ({ initialKpi = 'update' }: { initialKpi?: 'update' }) => {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'doughnut' | 'line'>('bar');
  const [selectedArea, setSelectedArea] = useState<'todas' | string>('todas');
  const [selectedKpi, setSelectedKpi] = useState<'update'>(initialKpi);
  const [poeData, setPoeData] = useState<POEData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Estados para el modal y formulario de KPIs anuales
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_area: 1,
    id_responsable: 1,
    estado: "actualizar",
    cantidad_planificada: 1,
    docs_json: [] as DocumentoKPI[],
    usuario: "prueba usuario ver si se trae desde el jwt"
  });
  const [currentDoc, setCurrentDoc] = useState<DocumentoKPI>({
    codigo: "",
    tipo: "POE",
    razon: ""
  });
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dataForGraphicWithKPI');
        if (response.data.success) {
          setPoeData(response.data.data);
          setLastUpdated(new Date().toISOString().split('T')[0]);
        }
      } catch (error) {
        console.error('Error fetching POE data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
    setApiError("");
    setApiSuccess("");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      id_area: 1,
      id_responsable: 1,
      estado: "actualizar",
      cantidad_planificada: 1,
      docs_json: [],
      usuario: "prueba usuario ver si se trae desde el jwt"
    });
    setCurrentDoc({
      codigo: "",
      tipo: "POE",
      razon: ""
    });
  };

  const handleAddDocument = () => {
    if (!currentDoc.codigo || !currentDoc.razon) {
      setApiError("Código y razón son requeridos");
      return;
    }

    setFormData(prev => ({
      ...prev,
      docs_json: [...prev.docs_json, currentDoc],
      cantidad_planificada: prev.docs_json.length + 1
    }));

    setCurrentDoc({
      codigo: "",
      tipo: "POE",
      razon: ""
    });
    setApiError("");
  };

  const removeDocument = (index: number) => {
    const newDocs = [...formData.docs_json];
    newDocs.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      docs_json: newDocs,
      cantidad_planificada: newDocs.length
    }));
  };

  const handleSubmit = async () => {
    if (formData.docs_json.length === 0) {
      setApiError("Debe agregar al menos un documento");
      return;
    }

    try {
      setApiLoading(true);
      setApiError("");
      setApiSuccess("");

      const payload = {
        ...formData,
        docs_json: JSON.stringify(formData.docs_json)
      };

      const response = await api.post('/api/procedures/kpi/year', payload);

      if (response.data.success) {
        setApiSuccess("Lote de KPIs creado correctamente");
        // Actualizar los datos después de crear el lote
        const refreshResponse = await api.get('/dataForGraphicWithKPI');
        if (refreshResponse.data.success) {
          setPoeData(refreshResponse.data.data);
          setLastUpdated(new Date().toISOString().split('T')[0]);
        }
      } else {
        setApiError(response.data.message || "Error al crear lote de KPIs");
      }
    } catch (error: any) {
      console.error('Error creating KPI batch:', error);
      setApiError(error.response?.data?.message || "Error al crear lote de KPIs");
    } finally {
      setApiLoading(false);
    }
  };

  const getChartData = () => {
    if (loading || !poeData.length) {
      return {
        labels: ['Cargando datos...'],
        datasets: [{
          label: 'Datos',
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 1,
        }]
      };
    }

    const filteredData = selectedArea === 'todas' 
      ? poeData 
      : poeData.filter(item => item.area === selectedArea);

    const areaGroups = filteredData.reduce((acc: Record<string, {actualizados: number, pendientes: number}>, item) => {
      if (!acc[item.area]) {
        acc[item.area] = { actualizados: 0, pendientes: 0 };
      }
      acc[item.area].actualizados += parseInt(item.actualizados) || 0;
      acc[item.area].pendientes += parseInt(item.pendientes) || 0;
      return acc;
    }, {});

    const labels = Object.keys(areaGroups);
    const actualizadosData = Object.values(areaGroups).map(group => group.actualizados);
    const pendientesData = Object.values(areaGroups).map(group => group.pendientes);

    return {
      labels,
      datasets: [
        {
          label: 'Actualizados',
          data: actualizadosData,
          backgroundColor: '#4ade80',
          borderWidth: 1,
        },
        {
          label: 'Pendientes',
          data: pendientesData,
          backgroundColor: '#f87171',
          borderWidth: 1,
        }
      ]
    };
  };

  const selectedData = getChartData();

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${!isNaN(percentage) ? percentage : 0}%)`;
          }
        }
      },
      title: {
        display: true,
        text: kpiOptions.find(k => k.value === selectedKpi)?.label || 'Indicador',
        font: { size: 18 },
      },
    },
  };

  const renderChart = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full">Cargando datos...</div>;
    }

    if (!poeData.length) {
      return <div className="flex items-center justify-center h-full">No hay datos disponibles</div>;
    }

    switch (chartType) {
      case 'bar':
        return <Bar data={selectedData} options={commonOptions} />;
      case 'pie':
        return <Pie data={selectedData} options={commonOptions} />;
      case 'doughnut':
        return <Doughnut data={selectedData} options={commonOptions} />;
      case 'line':
        return <Line data={selectedData} options={commonOptions} />;
      default:
        return <Bar data={selectedData} options={commonOptions} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {kpiOptions.find(k => k.value === selectedKpi)?.label || 'Indicador'}
        </h2>
        <div className="flex gap-4 flex-wrap">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="kpi-select-label">Indicador</InputLabel>
            <Select
              labelId="kpi-select-label"
              value={selectedKpi}
              label="Indicador"
              onChange={(e) => setSelectedKpi(e.target.value as 'update')}
            >
              {kpiOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="area-select-label">Área</InputLabel>
            <Select
              labelId="area-select-label"
              value={selectedArea}
              label="Área"
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {areaOptions.map((area) => (
                <MenuItem key={area.value} value={area.value}>{area.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="chart-select-label">Tipo de Gráfico</InputLabel>
            <Select
              labelId="chart-select-label"
              value={chartType}
              label="Tipo de Gráfico"
              onChange={(e) => setChartType(e.target.value as any)}
            >
              {chartOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpenModal}
            sx={{ 
              backgroundColor: '#2AAC67',
              '&:hover': { backgroundColor: '#1e8a56' }
            }}
          >
            Crear Lote KPI Anual
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div style={{ height: '400px' }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            {renderChart()}
          </Box>
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-4">
        Última actualización: {lastUpdated}
      </div>

      {/* Modal para crear lote de KPIs anuales */}
      <GlobalModal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Crear Lote de KPIs Anuales"
        maxWidth="md"
      >
        <Box sx={{ p: 3 }}>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          
          {apiSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {apiSuccess}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Código del Documento"
                value={currentDoc.codigo}
                onChange={(e) => setCurrentDoc({...currentDoc, codigo: e.target.value})}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tipo de Documento"
                value={currentDoc.tipo}
                onChange={(e) => setCurrentDoc({...currentDoc, tipo: e.target.value})}
                margin="normal"
                disabled
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Razón de Actualización"
                value={currentDoc.razon}
                onChange={(e) => setCurrentDoc({...currentDoc, razon: e.target.value})}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleAddDocument}
              sx={{ 
                backgroundColor: '#2AAC67',
                '&:hover': { backgroundColor: '#1e8a56' }
              }}
            >
              Agregar Documento
            </Button>
          </Box>

          {formData.docs_json.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Documentos agregados ({formData.docs_json.length})
              </Typography>
              
              <Box sx={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                p: 1
              }}>
                {formData.docs_json.map((doc, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1,
                      mb: 1,
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px'
                    }}
                  >
                    <Typography>
                      {doc.codigo} - {doc.razon}
                    </Typography>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => removeDocument(index)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={apiLoading || formData.docs_json.length === 0}
              sx={{ 
                backgroundColor: '#2AAC67',
                '&:hover': { backgroundColor: '#1e8a56' },
                minWidth: '150px'
              }}
            >
              {apiLoading ? <CircularProgress size={24} color="inherit" /> : 'Crear Lote'}
            </Button>
          </Box>
        </Box>
      </GlobalModal>
    </div>
  );
};

export default ChartSelector;