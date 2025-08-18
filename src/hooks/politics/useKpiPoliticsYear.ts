import { useState, useEffect } from 'react';
import api from '../../apiConfig/api';
import { createKpiPoliticsYear } from '../../services/politics/kpiPoliticsYearService';
import { useUserFromToken } from '../useUserFromToken';
import { showCustomToast } from '../../components/globalComponents/CustomToaster';

interface FormData {
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

export const useKpiPoliticsYear = () => {
  const { fullName } = useUserFromToken();
  
  const [formData, setFormData] = useState<FormData>({
    idResponsable: null,
    estado: "",
  });

  const [docs, setDocs] = useState<DocData[]>([]);
  const [availableDocs, setAvailableDocs] = useState<AvailableDoc[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [responsables, setResponsables] = useState<Responsable[]>([]);

  const estadoOptions = [
    { id: "actualizar", nombre: "Actualizar" },
    { id: "obsoleto", nombre: "Obsoletar" }, // Cambiado de "obsoletar" a "obsoleto"
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingData(true);
        
        // Cargar todos los responsables (sin filtrar por área)
        const responsablesResponse = await api.get('/responsible');
        if (responsablesResponse.data.data) {
          const mappedResponsables = responsablesResponse.data.data.map((resp: any) => ({
            id: resp.id_responsable,
            nombre: resp.nombre_responsable || resp.nombre
          }));
          setResponsables(mappedResponsables);
        }

        // Cargar políticas disponibles
        const politicsResponse = await api.get('/police');
        if (politicsResponse.data.success && politicsResponse.data.data) {
          const politicsDocs = politicsResponse.data.data.map((politic: any) => ({
            id_documento: politic.id_politica,
            codigo: politic.codigo,
            titulo: politic.descripcion || politic.titulo || `Política ${politic.codigo}`,
            tipo: 'POLITICA',
            area: politic.area || '',
            estado: 'activo'
          }));
          setAvailableDocs(politicsDocs);
        }

      } catch (error) {
        console.error('Error loading initial data:', error);
        showCustomToast('Error al cargar datos', 'No se pudieron cargar los datos iniciales', 'error');
      } finally {
        setLoadingData(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleResponsableChange = (selected: { id: number; nombre: string } | null) => {
    setFormData(prev => ({
      ...prev,
      idResponsable: selected?.id || null
    }));
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
    const newDocs = selectedIds
      .map(id => {
        const foundDoc = availableDocs.find(doc => doc.id_documento.toString() === id);
        if (foundDoc && !docs.some(existingDoc => existingDoc.id_documento === foundDoc.id_documento)) {
          return {
            id_documento: foundDoc.id_documento,
            codigo: foundDoc.codigo,
            titulo: foundDoc.titulo,
            tipo: foundDoc.tipo,
            razon: ""
          };
        }
        return null;
      })
      .filter(Boolean) as DocData[];

    setDocs(prev => [...prev, ...newDocs]);
    closeModal();
  };

  const removeDoc = (docId: number) => {
    setDocs(prev => prev.filter(doc => doc.id_documento !== docId));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validateForm = (): boolean => {
    if (!formData.idResponsable) {
      showCustomToast('Error de validación', 'Debe seleccionar un responsable', 'error');
      return false;
    }

    if (!formData.estado) {
      showCustomToast('Error de validación', 'Debe seleccionar un estado', 'error');
      return false;
    }

    if (docs.length === 0) {
      showCustomToast('Error de validación', 'Debe seleccionar al menos una política', 'error');
      return false;
    }

    const docsWithoutReason = docs.filter(doc => !doc.razon.trim());
    if (docsWithoutReason.length > 0) {
      showCustomToast('Error de validación', 'Todas las políticas deben tener una razón especificada', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const docsJson = docs.map(doc => ({
        codigo: doc.codigo,
        tipo: doc.tipo,
        razon: doc.razon
      }));

      const payload = {
        id_responsable: formData.idResponsable!,
        estado: formData.estado as "actualizar" | "obsoleto", // Cambiado tipo
        cantidad_planificada: docs.length,
        docs_json: JSON.stringify(docsJson),
        usuario: fullName || "Usuario no identificado"
      };

      const response = await createKpiPoliticsYear(payload);

      if (response.success) {
        showCustomToast(
          'KPIs creados exitosamente', 
          response.message || 'Lote de KPIs para políticas creado correctamente',
          'success'
        );
        
        // Resetear formulario
        setFormData({
          idResponsable: null,
          estado: "",
        });
        setDocs([]);
      } else {
        showCustomToast(
          'Error al crear KPIs', 
          response.message || 'Error al crear el lote de KPIs',
          'error'
        );
      }

    } catch (error: any) {
      console.error('Error creating KPI batch:', error);
      
      if (error.response?.data?.message) {
        showCustomToast('Error del servidor', error.response.data.message, 'error');
      } else if (error.response?.status === 422) {
        showCustomToast('Error de validación', 'La cantidad planificada no coincide con la cantidad de documentos', 'error');
      } else if (error.response?.status === 400) {
        showCustomToast('Error de validación', 'Error de validación en los datos enviados', 'error');
      } else {
        showCustomToast('Error', 'Error al crear el lote de KPIs para políticas', 'error');
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
    responsables,
    handleDocReasonChange,
    handleStateChange,
    handleResponsableChange,
    addSelectedDocs,
    removeDoc,
    openModal,
    closeModal,
    handleSubmit,
  };
};
