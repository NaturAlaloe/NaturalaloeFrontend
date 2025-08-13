import { useState } from "react";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { useCreateNewManapolVersion } from "./useCreateNewManapolVersion";
import type { CreateNewManapolVersionData } from "./useCreateNewManapolVersion";

interface ResponsibleOption {
  id_responsable: string;
  nombre_responsable: string;
}

export interface EditManapolData {
  id_documento: number;
  descripcion?: string;
  codigo?: string;
  id_area?: number;
  id_departamento?: number;
  id_responsable?: string;
  fecha_creacion?: string;
  fecha_vigencia?: string;
  version?: string;
  departamento?: string;
  area?: string;
  pdf?: File | null;
  es_vigente?: boolean;
  es_nueva_version?: boolean;
  ruta_documento?: string;
}

interface ManapolVersion {
  titulo: string;
  vigente: number;
  revision: number;
  responsable: string;
  id_documento: number;
  fecha_vigencia: string;
  ruta_documento: string;
}

interface RegistroManapol {
  codigo_rm: string;
  titulo: string;
  fecha_creacion: string;
  id_area: number;
  area: string;
  departamento: string;
  versiones: ManapolVersion[];
}

interface UseEditManapolProps {
  responsibles: ResponsibleOption[];
  updateManapol: (data: any) => Promise<{ success: boolean; error?: string }>;
  fetchRegistros: () => Promise<void>;
}

const formatDateToBackend = (dateString: string | Date | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      if (
        typeof dateString === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ) {
        return dateString;
      }
      throw new Error("Fecha inválida");
    }
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export function useEditManapol({
  responsibles,
  updateManapol,
  fetchRegistros,
}: UseEditManapolProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<EditManapolData | null>(null);
  const [saving, setSaving] = useState(false);
  const [originalVersion, setOriginalVersion] = useState<string>(""); // Guardar versión original

  // Hook para crear nueva versión
  const newVersionHook = useCreateNewManapolVersion({
    onSuccess: fetchRegistros,
  });

  const startEdit = (registro: RegistroManapol, selectedVersion: ManapolVersion) => {
    const responsableObj = responsibles.find(
      (r) => r.nombre_responsable === selectedVersion.responsable
    );

    const editDataToSet = {
      id_documento: selectedVersion.id_documento,
      descripcion: selectedVersion.titulo,
      codigo: registro.codigo_rm,
      id_area: registro.id_area,
      id_responsable: responsableObj ? responsableObj.id_responsable : "",
      fecha_creacion: registro.fecha_creacion?.split("T")[0] || "",
      fecha_vigencia: selectedVersion.fecha_vigencia?.split("T")[0] || "",
      version: selectedVersion.revision?.toString() || "",
      departamento: registro.departamento || "",
      area: registro.area || "",
      ruta_documento: selectedVersion.ruta_documento || "",
      pdf: null, // El archivo File para nuevos PDFs
      es_vigente: selectedVersion.vigente === 1,
      es_nueva_version: false,
    };
    
    // Guardar la versión original
    setOriginalVersion(selectedVersion.revision?.toString() || "");
    
    setEditData(editDataToSet);
    setEditModalOpen(true);
    
    // Toast informativo al abrir el modal
    showCustomToast(
      "Editor de registro Manapol",
      `Abriendo editor para: ${registro.codigo_rm || 'Registro'}`,
      "info"
    );
  };

  const closeEdit = () => {
    if (!saving) {
      setEditModalOpen(false);
      setEditData(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;

    setSaving(true);
    try {
      // Validación de campos obligatorios
      if (
        !editData.descripcion ||
        !editData.id_responsable ||
        !editData.fecha_creacion ||
        !editData.fecha_vigencia ||
        editData.version === undefined || editData.version === null || editData.version === ""
      ) {
        showCustomToast(
          "Error de validación",
          "Todos los campos obligatorios deben estar completos",
          "error"
        );
        setSaving(false);
        return;
      }

      // Si es una nueva versión, usar el hook de crear nueva versión
      if (editData.es_nueva_version) {
        const newVersionData: CreateNewManapolVersionData = {
          codigo: editData.codigo || "",
          descripcion: editData.descripcion,
          id_responsable: editData.id_responsable,
          nueva_version: parseFloat(editData.version),
          fecha_creacion: formatDateToBackend(editData.fecha_creacion),
          fecha_vigencia: formatDateToBackend(editData.fecha_vigencia),
          vigente: editData.es_vigente || false,
          documento: editData.pdf,
        };

        const success = await newVersionHook.createNewVersion(newVersionData);
        if (success) {
          closeEdit();
        }
        return;
      }

      // Edición normal (código existente)
      const formData = new FormData();
      formData.append("id_documento", editData.id_documento.toString());
      formData.append("descripcion", editData.descripcion);
      formData.append("codigo", editData.codigo || "");
      formData.append("id_area", editData.id_area?.toString() || "");
      formData.append("id_responsable", editData.id_responsable);
      formData.append("fecha_creacion", formatDateToBackend(editData.fecha_creacion));
      formData.append("fecha_vigencia", formatDateToBackend(editData.fecha_vigencia));
      formData.append("version", editData.version);
      formData.append("set_vigente", editData.es_vigente ? "1" : "0");
      
      if (editData.pdf) {
        formData.append("documento", editData.pdf);
      }

      const result = await updateManapol(formData);

      if (result.success) {
        showCustomToast(
          "Éxito",
          "Registro Manapol actualizado correctamente",
          "success"
        );
        closeEdit();
        await fetchRegistros();
      } else {
        showCustomToast(
          "Error",
          result.error || "Error al actualizar el registro",
          "error"
        );
      }
    } catch (err: any) {
      console.error("Error al actualizar registro:", err);
      showCustomToast(
        "Error",
        err.response?.data?.message || "Error inesperado al actualizar el registro",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    editModalOpen,
    editData,
    saving,
    originalVersion,
    startEdit,
    closeEdit,
    handleSubmit,
    setEditData,
  };
}