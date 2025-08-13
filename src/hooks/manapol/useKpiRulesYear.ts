import { useState, useEffect } from 'react';
import api from '../../apiConfig/api';

interface FormData {
  idArea: number | null;
  idResponsable: number | null;
  estado: "actualizar" | "obsoletar" | "";
}

interface DocData {
  id_documento: number;
  codigo: string;
  titulo: string;
  tipo: string;
  razon: string;
}

interface Area {
  id: number;
  nombre: string;
}

interface Responsable {
  id: number;
  nombre: string;
}

interface AvailableDoc {
  id_documento: number;
  codigo: string;
  titulo: string;
  tipo: string;
  area: string;
  estado: string;
}

export const useKpiRulesYear = () => {
  const [formData, setFormData] = useState<FormData>({
    idArea: null,
    idResponsable: null,
    estado: "",
  });

  const [docs, setDocs] = useState<DocData[]>([]);
  const [availableDocs, setAvailableDocs] = useState<AvailableDoc[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const estadoOptions = [
    { id: "actualizar", nombre: "Actualizar" },
    { id: "obsoletar", nombre: "Obsoletar" },
  ];

  // Función para mostrar mensajes de error
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Función para mostrar mensajes de éxito
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingData(true);
        
        // Cargar áreas
        const areasResponse = await api.get('/areas');
        if (areasResponse.data.success) {
          setAreas(areasResponse.data.data);
        }

        // Cargar responsables
        const responsablesResponse = await api.get('/responsables');
        if (responsablesResponse.data.success) {
          setResponsables(responsablesResponse.data.data);
        }

        // Cargar documentos disponibles (mixtos: POE, Políticas, Registro MANAPOL)
        const docsResponse = await api.get('/procedimientos/available');
        if (docsResponse.data.success) {
          const mixedDocs = docsResponse.data.data.map((doc: any) => ({
            ...doc,
            tipo: doc.tipo || 'POE'
          }));
          setAvailableDocs(mixedDocs);
        }

      } catch (error) {
        console.error('Error loading initial data:', error);
        showError('Error al cargar los datos iniciales');
      } finally {
        setLoadingData(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleAreaChange = (area: { id: number; nombre: string } | null) => {
    setFormData(prev => ({ ...prev, idArea: area?.id || null }));
  };

  const handleResponsableChange = (responsable: { id: number; nombre: string } | null) => {
    setFormData(prev => ({ ...prev, idResponsable: responsable?.id || null }));
  };

  const handleStateChange = (estado: "actualizar" | "obsoletar") => {
    setFormData(prev => ({ ...prev, estado }));
  };

  const handleDocReasonChange = (docId: number, razon: string) => {
    setDocs(prev => prev.map(doc => 
      doc.id_documento === docId ? { ...doc, razon } : doc
    ));
  };

  const addSelectedDocs = (selectedIds: string[]) => {
    const selectedDocs = availableDocs.filter(doc => 
      selectedIds.includes(doc.id_documento.toString())
    );

    const newDocs: DocData[] = selectedDocs.map(doc => ({
      id_documento: doc.id_documento,
      codigo: doc.codigo,
      titulo: doc.titulo,
      tipo: doc.tipo,
      razon: "",
    }));

    // Evitar duplicados
    setDocs(prev => {
      const existingIds = prev.map(d => d.id_documento);
      const filteredNewDocs = newDocs.filter(d => !existingIds.includes(d.id_documento));
      return [...prev, ...filteredNewDocs];
    });

    closeModal();
    
    if (newDocs.length > 0) {
      showSuccess(`${newDocs.length} documento(s) agregado(s) exitosamente`);
    }
  };

  const removeDoc = (docId: number) => {
    setDocs(prev => prev.filter(doc => doc.id_documento !== docId));
    showSuccess('Documento eliminado de la selección');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.idResponsable) {
      showError('Debe seleccionar un responsable');
      return;
    }

    if (!formData.estado) {
      showError('Debe seleccionar un estado');
      return;
    }

    if (docs.length === 0) {
      showError('Debe seleccionar al menos un documento');
      return;
    }

    // Validar que todos los documentos tengan razón
    const docsWithoutReason = docs.filter(doc => !doc.razon.trim());
    if (docsWithoutReason.length > 0) {
      showError('Todos los documentos deben tener una razón especificada');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para enviar
      const docsJson = docs.map(doc => ({
        codigo: doc.codigo,
        tipo: doc.tipo,
        razon: doc.razon
      }));

      const requestData = {
        id_area: formData.idArea,
        id_responsable: formData.idResponsable,
        estado: formData.estado,
        cantidad_planificada: docs.length,
        docs_json: JSON.stringify(docsJson),
        usuario: "sistema"
      };

      console.log('Sending data to API:', requestData);

      const response = await api.post('/registerMan/kpi/rules/year', requestData);

      if (response.data.success) {
        showSuccess('Lote de KPIs para reglas anuales creado exitosamente');
        
        // Reset form
        setFormData({
          idArea: null,
          idResponsable: null,
          estado: "",
        });
        setDocs([]);
      } else {
        showError(response.data.message || 'Error al crear el lote de KPIs');
      }
    } catch (error: any) {
      console.error('Error creating KPI batch for rules:', error);
      
      if (error.response?.status === 422) {
        showError(error.response.data.message || 'Error de validación: Cantidad planificada no coincide');
      } else if (error.response?.status === 400) {
        showError(error.response.data.message || 'Faltan campos requeridos');
      } else if (error.response?.status === 500) {
        showError('Error interno del servidor');
      } else {
        showError('Error al crear el lote de KPIs para reglas anuales');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    docs,
    availableDocs,
    isModalOpen,
    loading,
    loadingData,
    estadoOptions,
    areas,
    responsables,
    error,
    success,
    handleDocReasonChange,
    handleStateChange,
    handleAreaChange,
    handleResponsableChange,
    addSelectedDocs,
    removeDoc,
    openModal,
    closeModal,
    handleSubmit,
  };
};