import { useState, useEffect } from 'react';
import api from '../../apiConfig/api';
import { getAreas, type Area as AreaType } from '../../services/manage/areaService';
import { getResponsibles } from '../../services/responsibles/getResponsibles';
import { showCustomToast } from '../../components/globalComponents/CustomToaster';

interface FormData {
  idArea: number | null;
  idResponsable: number | null;
  estado: "actualizar" | "obsoleto" | ""; // Cambiado de "obsoletar" a "obsoleto"
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
  departamento: string;
  responsable: string;
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
    { id: "obsoleto", nombre: "Obsoletar" }, // Cambiado de "obsoletar" a "obsoleto"
  ];

  // Función para mostrar mensajes de error
  const showError = (message: string) => {
    setError(message);
    showCustomToast('Error', message, 'error');
    setTimeout(() => setError(null), 5000);
  };

  // Función para mostrar mensajes de éxito
  const showSuccess = (message: string) => {
    setSuccess(message);
    showCustomToast('Éxito', message, 'success');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingData(true);
        
        // Cargar áreas usando el servicio existente
        const areasData = await getAreas();
        const formattedAreas = areasData
          .filter((area: AreaType) => area.id_area && area.id_area > 0)
          .map((area: AreaType) => ({
            id: area.id_area!,
            nombre: area.titulo
          }));
        setAreas(formattedAreas);

        // Cargar responsables usando el servicio existente
        const responsablesData = await getResponsibles();
        const formattedResponsables = responsablesData.map((resp: any) => ({
          id: resp.id_responsable,
          nombre: resp.nombre_responsable,
        }));
        setResponsables(formattedResponsables);

        // Cargar documentos MANAPOL disponibles
        const docsResponse = await api.get('/registerMan/available');
        console.log('MANAPOL API Response:', docsResponse.data);
        
        // Handle different possible response structures
        let docsData = [];
        if (docsResponse.data) {
          if (Array.isArray(docsResponse.data)) {
            docsData = docsResponse.data;
          } else if (docsResponse.data.data && Array.isArray(docsResponse.data.data)) {
            docsData = docsResponse.data.data;
          } else if (docsResponse.data.message && docsResponse.data.data) {
            docsData = docsResponse.data.data;
          }
        }
        
        console.log('Extracted docs data:', docsData);
        console.log('First document raw data:', docsData[0]);
        console.log('First document keys:', docsData[0] ? Object.keys(docsData[0]) : 'No documents');
        
        if (docsData.length > 0) {
          const manapols = docsData.map((doc: any, index: number) => {
            console.log(`Mapping MANAPOL doc ${index}:`, doc);
            console.log(`Available fields in doc ${index}:`, Object.keys(doc));
            console.log(`Doc codigo field value:`, doc.codigo);
            console.log(`Doc codigo_rm field value:`, doc.codigo_rm);
            console.log(`Doc all field values:`, {
              id_documento: doc.id_documento,
              codigo: doc.codigo,
              codigo_rm: doc.codigo_rm,
              titulo: doc.titulo,
              departamento: doc.departamento,
              responsable: doc.responsable,
              estado: doc.estado
            });
            
            // Ensure we have a valid id_documento, or create a fallback
            let documentId = doc.id_documento;
            if (!documentId || documentId === null || documentId === undefined) {
              console.warn(`Document at index ${index} has no id_documento, using fallback`);
              documentId = `manapol_${index}_${doc.codigo || 'unknown'}`;
            }
            
            const mapped = {
              id_documento: documentId,
              codigo: doc.codigo_rm || doc.codigo || doc.code || doc.cod || doc.rm || '', // Try codigo_rm first (MANAPOL field)
              titulo: doc.titulo || doc.title || '',
              tipo: 'REGISTRO MANAPOL',
              departamento: doc.departamento || doc.department || '',
              responsable: doc.responsable || doc.responsible || '',
              estado: doc.estado || doc.status || ''
            };
            console.log(`Mapped result ${index}:`, mapped);
            return mapped;
          });
          
          // Verify all IDs are unique
          const ids = manapols.map((doc: any) => doc.id_documento);
          const uniqueIds = new Set(ids);
          if (ids.length !== uniqueIds.size) {
            console.error('Found duplicate IDs in MANAPOL documents:', ids);
            // Add unique suffix to duplicates
            const seen = new Set();
            manapols.forEach((doc: any, index: number) => {
              if (seen.has(doc.id_documento)) {
                doc.id_documento = `${doc.id_documento}_dup_${index}`;
                console.warn(`Added unique suffix to duplicate ID: ${doc.id_documento}`);
              }
              seen.add(doc.id_documento);
            });
          }
          
          console.log('All formatted MANAPOL docs:', manapols);
          setAvailableDocs(manapols);
        } else {
          console.warn('No MANAPOL documents found in response');
          setAvailableDocs([]);
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

  const handleStateChange = (estado: "actualizar" | "obsoleto") => { // Cambiado tipo
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

      // Debug: Check docs before mapping
      console.log('Documents before mapping:', docs);

      // Validar que todos los documentos tengan codigo
      const docsWithoutCodigo = docs.filter(doc => !doc.codigo || doc.codigo.trim() === '');
      if (docsWithoutCodigo.length > 0) {
        console.error('Documents without codigo:', docsWithoutCodigo);
        showError('Algunos documentos no tienen código válido');
        return;
      }

      // Preparar datos para enviar
      const docsJson = docs.map(doc => {
        console.log('Mapping document:', doc);
        const mapped = {
          codigo: doc.codigo,
          tipo: doc.tipo,
          razon: doc.razon
        };
        console.log('Mapped to:', mapped);
        return mapped;
      });

      console.log('Final docsJson:', docsJson);

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

      console.log('API Response:', response);
      console.log('API Response data:', response.data);
      console.log('API Response status:', response.status);

      if (response.data.success) {
        showSuccess('Lote de KPIs para Manapol creado exitosamente');
        
        // Reset form
        setFormData({
          idArea: null,
          idResponsable: null,
          estado: "",
        });
        setDocs([]);
      } else {
        console.warn('API returned success=false:', response.data);
        showError(response.data.message || 'Error al crear el lote de KPIs');
      }
    } catch (error: any) {
      console.error('Error creating KPI batch for rules:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
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