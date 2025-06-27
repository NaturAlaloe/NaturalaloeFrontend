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
  path?: string;
  fecha_creacion?: string;
  fecha_vigencia?: string;
  revision?: string;
  codigo?: string;
  area?: string;
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

    setEditData({
      id_documento: procedure.id_documento,
      descripcion: procedure.titulo,
      id_responsable: responsableObj ? responsableObj.id_responsable : "",
      path: procedure.path || procedure.pdf || "",
      fecha_creacion: procedure.fecha_creacion?.split("T")[0] || "",
      fecha_vigencia: procedure.fecha_vigencia?.split("T")[0] || "",
      revision: procedure.revision || "",
      codigo: procedure.codigo || "",
      area: "No disponible",
      departamento: procedure.departamento || "",
      categoria: "No disponible",
      pdf: null,
      es_vigente: true,
      es_nueva_version: false,
    });
    setEditModalOpen(true);
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
      if (
        !editData.descripcion ||
        !editData.id_responsable ||
        !editData.fecha_creacion ||
        !editData.fecha_vigencia
      ) {
        showCustomToast("Todos los campos obligatorios son requeridos", "", "error");
        return;
      }

      const result = await updateProcedure({
        id_documento: editData.id_documento,
        descripcion: editData.descripcion,
        id_responsable: Number(editData.id_responsable),
        fecha_creacion: formatDateToBackend(editData.fecha_creacion),
        fecha_vigencia: formatDateToBackend(editData.fecha_vigencia),
        path: editData.path || "",
      });

      if (result.success) {
        showCustomToast(
          "Procedimiento actualizado correctamente",
          "",
          "success"
        );
        setEditModalOpen(false);
        setEditData(null);
        await fetchProcedures();
      } else {
        showCustomToast("Error al actualizar el procedimiento", "", "error");
      }
    } catch (err: any) {
      showCustomToast("Error inesperado", err?.message || "", "error");
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
