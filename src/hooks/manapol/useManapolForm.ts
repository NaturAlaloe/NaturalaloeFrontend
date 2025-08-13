import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { createManapol } from "../../services/manapol/manapolService";
import { getResponsibles } from "../../services/responsibles/getResponsibles";
import { getAreas } from "../../services/manage/areaService";
import { getDepartments } from "../../services/manage/departmentService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

interface ManapolFormData {
  codigo: string;
  descripcion: string;
  id_area: string;
  departamento: string;
  id_responsable: string;
  version: string;
  fecha_creacion: string;
  fecha_vigencia: string;
}

interface ResponsibleOption {
  id_responsable: number;
  nombre_responsable: string;
}

interface AreaOption {
  id_area: string;
  nombre: string;
  codigo: string;
}

interface DepartmentOption {
  id_departamento: string;
  nombre: string;
  codigo_departamento: string;
}

export function useManapolForm() {
  const [formData, setFormData] = useState<ManapolFormData>({
    codigo: "",
    descripcion: "",
    id_area: "",
    departamento: "",
    id_responsable: "",
    version: "1",
    fecha_creacion: "",
    fecha_vigencia: "",
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Estados para las opciones de los selects
  const [responsables, setResponsables] = useState<ResponsibleOption[]>([]);
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  
  // Estados de carga
  const [loadingResponsables, setLoadingResponsables] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar responsables
  useEffect(() => {
    setLoadingResponsables(true);
    getResponsibles()
      .then((data) => {
        setResponsables(data || []);
      })
      .catch((error) => {
        console.error('Error loading responsables:', error);
        showCustomToast("Error", "No se pudieron cargar los responsables", "error");
        setResponsables([]);
      })
      .finally(() => setLoadingResponsables(false));
  }, []);

  // Cargar áreas
  useEffect(() => {
    setLoadingAreas(true);
    getAreas()
      .then((data) => {
        const mappedAreas = data.map((a: any) => ({
          id_area: a.id_area?.toString() || a.id || a.codigo || a.codigo_area || "",
          nombre: a.nombre || a.titulo || a.titulo_area || "",
          codigo: a.codigo_area?.toString() || a.codigo || a.id_area?.toString() || ""
        }));
        setAreas(mappedAreas);
      })
      .catch((error) => {
        console.error('Error loading areas:', error);
        showCustomToast("Error", "No se pudieron cargar las áreas", "error");
        setAreas([]);
      })
      .finally(() => setLoadingAreas(false));
  }, []);

  // Cargar departamentos
  useEffect(() => {
    setLoadingDepartments(true);
    getDepartments()
      .then((data) => {
        const mappedDepartments = data.map((d: any) => ({
          id_departamento: d.id_departamento?.toString() || "",
          nombre: d.titulo_departamento || d.nombre || d.titulo || "",
          codigo_departamento: d.codigo_departamento?.toString() || d.codigo_departamento || d.codigo || d.id_departamento?.toString() || ""
        }));
        setDepartments(mappedDepartments);
      })
      .catch((error) => {
        console.error('Error loading departments:', error);
        showCustomToast("Error", "No se pudieron cargar los departamentos", "error");
        setDepartments([]);
      })
      .finally(() => setLoadingDepartments(false));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAutocompleteChange = (fieldName: string, selected: any) => {
    if (!selected || Array.isArray(selected)) {
      setFormData((prev) => ({ ...prev, [fieldName]: "" }));
      return;
    }

    let value = "";
    switch (fieldName) {
      case "id_area":
        value = selected.id_area || "";
        break;
      case "departamento":
        value = selected.id_departamento || "";
        break;
      case "id_responsable":
        value = selected.id_responsable ? selected.id_responsable.toString() : "";
        break;
      default:
        value = selected.id || selected.value || "";
    }

    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      descripcion: "",
      id_area: "",
      departamento: "",
      id_responsable: "",
      version: "1",
      fecha_creacion: "",
      fecha_vigencia: "",
    });
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (
      !formData.descripcion.trim() ||
      !formData.id_area ||
      !formData.departamento ||
      !formData.id_responsable ||
      !formData.version ||
      !formData.fecha_creacion ||
      !formData.fecha_vigencia ||
      !pdfFile
    ) {
      showCustomToast("Atención", "Llena todos los campos obligatorios", "info");
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();
      data.append("descripcion", formData.descripcion.trim());
      data.append("id_area", formData.id_area);
      data.append("departamento", formData.departamento);
      data.append("id_responsable", formData.id_responsable);
      data.append("version", formData.version);
      data.append("fecha_creacion", formData.fecha_creacion);
      data.append("fecha_vigencia", formData.fecha_vigencia);
      data.append("documento", pdfFile);

      await createManapol(data);
      
      showCustomToast("Éxito", "Registro Manapol creado exitosamente", "success");
      
      // Resetear el formulario después del éxito
      resetForm();
      
    } catch (error: any) {
      console.error('Error creating Manapol:', error);
      showCustomToast(
        "Error",
        error?.response?.data?.message || "Ocurrió un error al crear el registro Manapol",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Valores seleccionados para los autocompletes
  const selectedArea = formData.id_area 
    ? areas.find(area => area.id_area === formData.id_area) || null
    : null;

  const selectedDepartment = formData.departamento 
    ? departments.find(dept => dept.id_departamento === formData.departamento) || null
    : null;

  const selectedResponsible = formData.id_responsable 
    ? responsables.find(resp => resp.id_responsable === Number(formData.id_responsable)) || null
    : null;

  return {
    formData,
    handleChange,
    handleAutocompleteChange,
    handleSubmit,
    pdfFile,
    setPdfFile,
    handlePdfChange,
    saving,
    // Opciones
    responsables,
    areas,
    departments,
    // Estados de carga
    loadingResponsables,
    loadingAreas,
    loadingDepartments,
    // Selecciones actuales
    selectedArea,
    selectedDepartment,
    selectedResponsible,
    // Utilidades
    fileInputRef,
    resetForm,
  };
}
