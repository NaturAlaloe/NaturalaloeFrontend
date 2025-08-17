import { useState, useEffect } from "react";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { 
  kpiBatchYearService, 
  type Document, 
  type KpiBatchYearFormData,
  type Area,
  type Responsable,
  type POE
} from "../../services/kpiBatchYearService";

type StatusType = "actualizar" | "obsoleto";

export const useKpiBatchYear = () => {
  const [formData, setFormData] = useState<KpiBatchYearFormData>({
    idArea: null,
    idResponsable: null,
    estado: "actualizar",
  });
  
  const [docs, setDocs] = useState<Document[]>([]);
  const [availablePOEs, setAvailablePOEs] = useState<POE[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [responsables, setResponsables] = useState<Responsable[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        const [areasData, responsablesData, poesData] = await Promise.all([
          kpiBatchYearService.getAreas(),
          kpiBatchYearService.getResponsables(),
          kpiBatchYearService.getPOEs()
        ]);
        
        setAreas(areasData);
        setResponsables(responsablesData);
        setAvailablePOEs(poesData);
      } catch (error) {
        showCustomToast("Error", "Error al cargar datos iniciales", "error");
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  const handleDocReasonChange = (docId: number, razon: string) => {
    setDocs(prev => 
      prev.map(doc => 
        doc.id_documento === docId ? { ...doc, razon } : doc
      )
    );
  };

  const addSelectedPOEs = (selectedPOEIds: string[]) => {
    const selectedPOEs = availablePOEs.filter(poe => 
      selectedPOEIds.includes(poe.id_documento.toString())
    );
    
    const newDocs: Document[] = selectedPOEs.map(poe => ({
      id_documento: poe.id_documento,
      codigo: poe.codigo,
      titulo: poe.titulo,
      tipo: "POE",
      razon: ""
    }));
    
    // Evitar duplicados
    const existingIds = docs.map(doc => doc.id_documento);
    const uniqueNewDocs = newDocs.filter(doc => !existingIds.includes(doc.id_documento));
    
    setDocs(prev => [...prev, ...uniqueNewDocs]);
    setIsModalOpen(false);
  };
  
  const removeDoc = (docId: number) => {
    setDocs(docs.filter(doc => doc.id_documento !== docId));
  };

  const resetForm = () => {
    setFormData({
      idArea: null,
      idResponsable: null,
      estado: "actualizar",
    });
    setDocs([]);
  };

  const handleStateChange = (estado: StatusType) => {
    setFormData(prev => ({
      ...prev,
      estado
    }));
  };

  const handleAreaChange = (area: Area | null) => {
    setFormData(prev => ({
      ...prev,
      idArea: area?.id || null
    }));
  };

  const handleResponsableChange = (responsable: Responsable | null) => {
    setFormData(prev => ({
      ...prev,
      idResponsable: responsable?.id || null
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = kpiBatchYearService.validateFormData(formData, docs);
    if (!validation.isValid) {
      showCustomToast("Error", validation.errorMessage!, "error");
      return;
    }

    setLoading(true);
    try {
      const result = await kpiBatchYearService.createKpiBatch(formData, docs);
      
      if (result.success) {
        showCustomToast("Éxito", "Lote de KPIs creado correctamente", "success");
        resetForm();
      } else {
        throw new Error(result.message || "Error al crear lote de KPIs");
      }
    } catch (error: any) {
      const errorMessage = kpiBatchYearService.parseError(error);
      showCustomToast("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const estadoOptions = kpiBatchYearService.getEstadoOptions();

  return {
    // State
    formData,
    docs,
    availablePOEs,
    isModalOpen,
    loading,
    loadingData,
    estadoOptions,
    areas,
    responsables,
    
    // Actions
    handleDocReasonChange,
    handleStateChange,
    handleAreaChange,
    handleResponsableChange,
    addSelectedPOEs,
    removeDoc,
    openModal,
    closeModal,
    handleSubmit,
    resetForm,
  };
};