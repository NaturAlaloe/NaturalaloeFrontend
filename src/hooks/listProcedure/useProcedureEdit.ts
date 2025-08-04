import { useState } from "react";
import { type Procedure } from "../../services/procedures/procedureService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

interface ResponsibleOption {
  id_responsable: string;
  nombre_responsable: string;
}

export interface EditData {
  id_documento: number;
  descripcion?: string;
  id_responsable?: string;
  id_area?: number;
  id_departamento?: number;
  id_categoria?: number;
  path?: string;
  fecha_creacion?: string;
  fecha_vigencia?: string;
  revision?: string;
  codigo?: string;
  departamento?: string;
  categoria?: string;
  pdf?: File | null;
  es_vigente?: boolean;
  es_nueva_version?: boolean;
}

interface UseProcedureEditProps {
  responsibles: ResponsibleOption[];
  updateProcedure: (data: any) => Promise<{ success: boolean; error?: string }>;
  fetchProcedures: () => Promise<void>;
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

export function useProcedureEdit({
  responsibles,
  updateProcedure,
  fetchProcedures,
}: UseProcedureEditProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<EditData | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (procedure: Procedure) => {
    const responsableObj = responsibles.find(
      (r) => r.nombre_responsable === procedure.responsable
    );

    const editDataToSet = {
      id_documento: procedure.id_documento,
      descripcion: procedure.titulo,
      id_responsable: responsableObj ? responsableObj.id_responsable : "",
      id_area: (procedure as any).id_area,
      path: procedure.path || procedure.pdf || "",
      fecha_creacion: procedure.fecha_creacion?.split("T")[0] || "",
      fecha_vigencia: procedure.fecha_vigencia?.split("T")[0] || "",
      revision: procedure.revision || "",
      codigo: procedure.codigo || "",
      departamento: procedure.departamento || "",
      categoria: (procedure as any).categoria || "No disponible",
      pdf: null, // El archivo File para nuevos PDFs
      es_vigente: procedure.estado === 'activo',
      es_nueva_version: false,
    };
    
    setEditData(editDataToSet);
    setEditModalOpen(true);
    
    // Toast informativo al abrir el modal
    showCustomToast(
      "Editor de procedimiento",
      `Abriendo editor para: ${procedure.codigo || 'Procedimiento'}`,
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
      // Validación de campos obligatorios - SIEMPRE incluir revision
      if (
        !editData.descripcion ||
        !editData.id_responsable ||
        !editData.fecha_creacion ||
        !editData.fecha_vigencia ||
        editData.revision === undefined || editData.revision === null || editData.revision === ""
      ) {
        const missingFields = [];
        if (!editData.descripcion) missingFields.push("título");
        if (!editData.id_responsable) missingFields.push("responsable");
        if (!editData.fecha_creacion) missingFields.push("fecha de creación");
        if (!editData.fecha_vigencia) missingFields.push("fecha de vigencia");
        if (editData.revision === undefined || editData.revision === null || editData.revision === "") missingFields.push("número de revisión");

        showCustomToast(
          "Campos obligatorios incompletos", 
          `Por favor complete: ${missingFields.join(", ")}`, 
          "error"
        );
        return;
      }

      // Preparar datos para envío - mapear nombres de campos
      const dataToSend = {
        id_documento: editData.id_documento,
        descripcion: editData.descripcion,
        id_responsable: Number(editData.id_responsable),
        id_area: editData.id_area,
        fecha_creacion: formatDateToBackend(editData.fecha_creacion),
        fecha_vigencia: formatDateToBackend(editData.fecha_vigencia),
        version: Number(editData.revision), // API usa 'version', no 'revision'
        codigo: editData.codigo,
        vigente: editData.es_vigente ? 1 : 0, // API usa 'vigente', no 'es_vigente'
        es_nueva_version: editData.es_nueva_version,
        documento: editData.pdf, // API usa 'documento', no 'pdf'
      };

      const result = await updateProcedure(dataToSend);

      if (result.success) {
        const isNewVersion = editData.es_nueva_version;
        const actionText = isNewVersion ? "creado" : "actualizado";
        const versionText = isNewVersion ? ` - Nueva versión ${editData.revision}` : "";
        
        showCustomToast(
          `¡Procedimiento ${actionText}!`,
          `El procedimiento ${editData.codigo}${versionText} se ha ${actionText} correctamente`,
          "success"
        );
        setEditModalOpen(false);
        setEditData(null);
        await fetchProcedures();
      } else {
        showCustomToast(
          "Error en la actualización", 
          result.error || "No se pudo completar la actualización del procedimiento", 
          "error"
        );
      }
    } catch (err: any) {
      showCustomToast(
        "Error inesperado", 
        err?.message || "Ocurrió un problema durante la actualización. Intente nuevamente", 
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
    startEdit,
    closeEdit,
    handleSubmit,
    setEditData,
  };
}
