import { useState } from "react";
import { useEffect } from "react";
import { createManapol } from "../../services/manapol/manapolService";
import { getManapoolLastConsecutive } from "../../services/manapol/manapolService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { useAreas } from "../procedureFormHooks/useAreas";
import { useDepartments } from "../procedureFormHooks/useDepartments";
import { useResponsibles } from "../procedureFormHooks/useResponsibles";
import { usePdfInput } from "../procedureFormHooks/usePdfInput";

interface CreateManapolFormData {
  codigo: string;
  descripcion: string;
  id_area: string;
  departamento: string;
  id_responsable: string;
  version: string;
  fecha_creacion: string;
  fecha_vigencia: string;
}

const initialFormData: CreateManapolFormData = {
  codigo: "",
  descripcion: "",
  id_area: "",
  departamento: "",
  id_responsable: "",
  version: "0",
  fecha_creacion: "",
  fecha_vigencia: "",
};

export function useCreateManapol() {
  const [formData, setFormData] = useState<CreateManapolFormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  // Hooks para datos auxiliares
  const { areas, loading: loadingAreas } = useAreas();
  const { departments, loading: loadingDepartments } = useDepartments();
  const { responsibles, loading: loadingResponsibles } = useResponsibles();
  const { 
    pdfFile, 
    handlePdfChange, 
    removePdf, 
    resetPdfInput, 
    fileInputRef 
  } = usePdfInput();

  // Obtener código consecutivo al cargar el componente
  useEffect(() => {
    getManapoolLastConsecutive().then((codigo) => {
      setFormData((prev) => ({
        ...prev,
        codigo,
      }));
    }).catch((error) => {
      console.error("Error al obtener código consecutivo:", error);
      // No setear ningún código, dejar el campo vacío
      // El usuario verá que hay un problema y puede reintentar
      showCustomToast(
        "Advertencia", 
        "No se pudo cargar el código consecutivo. El código se asignará automáticamente al guardar.", 
        "info"
      );
    });
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutocompleteChange = (fieldName: string, selectedOption: any) => {
    if (!selectedOption) {
      setFormData(prev => ({ ...prev, [fieldName]: "" }));
      return;
    }

    let value = "";
    switch (fieldName) {
      case "id_area":
        value = selectedOption.id_area || "";
        break;
      case "departamento":
        value = selectedOption.id_departamento || "";
        break;
      case "id_responsable":
        value = selectedOption.id_responsable?.toString() || "";
        break;
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'descripcion',
      'id_area',
      'departamento',
      'id_responsable',
      'version',
      'fecha_creacion',
      'fecha_vigencia'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof CreateManapolFormData]?.toString().trim()) {
        showCustomToast(
          "Campo requerido",
          `El campo ${getFieldLabel(field)} es obligatorio`,
          "error"
        );
        return false;
      }
    }

    if (!pdfFile) {
      showCustomToast(
        "Documento requerido",
        "Debe seleccionar un archivo PDF",
        "error"
      );
      return false;
    }

    return true;
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      descripcion: "Descripción",
      id_area: "Área",
      departamento: "Departamento",
      id_responsable: "Responsable",
      version: "Versión",
      fecha_creacion: "Fecha de Creación",
      fecha_vigencia: "Fecha de Vigencia"
    };
    return labels[field] || field;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("descripcion", formData.descripcion.trim());
      formDataToSend.append("id_area", formData.id_area);
      formDataToSend.append("departamento", formData.departamento);
      formDataToSend.append("id_responsable", formData.id_responsable);
      formDataToSend.append("version", formData.version);
      formDataToSend.append("fecha_creacion", formData.fecha_creacion);
      formDataToSend.append("fecha_vigencia", formData.fecha_vigencia);
      
      if (pdfFile) {
        formDataToSend.append("documento", pdfFile);
      }

      await createManapol(formDataToSend);
      
      showCustomToast(
        "Éxito",
        "Registro Manapol creado exitosamente",
        "success"
      );

      // Resetear formulario
      setFormData(initialFormData);
      resetPdfInput();

      // Cuando se implemente getManapolConsecutive, obtener nuevo código consecutivo
      try {
        const nuevoCodigo = await getManapoolLastConsecutive();
        setFormData(prev => ({ ...prev, codigo: nuevoCodigo }));
      } catch (error) {
        console.error("Error al obtener nuevo código consecutivo:", error);
      }


    } catch (error: any) {
      console.error("Error al crear registro Manapol:", error);
      showCustomToast(
        "Error",
        error?.response?.data?.message || "Error al crear el registro Manapol",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    handleChange,
    handleAutocompleteChange,
    handleSubmit,
    saving,
    // Datos auxiliares
    areas,
    departments,
    responsibles,
    loadingAreas,
    loadingDepartments,
    loadingResponsibles,
    // PDF
    pdfFile,
    handlePdfChange,
    removePdf,
    fileInputRef,
  };
}
