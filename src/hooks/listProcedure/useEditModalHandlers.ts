import { useCallback } from "react";

interface EditData {
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

interface UseEditModalHandlersProps {
  editData: EditData | null;
  onDataChange: (data: EditData | null) => void;
}

export function useEditModalHandlers({ editData, onDataChange }: UseEditModalHandlersProps) {
  const updateField = useCallback((field: keyof Omit<EditData, 'id_documento'>, value: any) => {
    if (!editData) return;
    
    onDataChange({
      ...editData,
      [field]: value,
    });
  }, [editData, onDataChange]);

  const handleCheckboxChange = useCallback((field: 'es_vigente' | 'es_nueva_version', checked: boolean) => {
    updateField(field, checked);
  }, [updateField]);

  const handleInputChange = useCallback((field: Exclude<keyof EditData, 'id_documento'>, value: string) => {
    updateField(field, value);
  }, [updateField]);

  const handleFileChange = useCallback((file: File | null) => {
    updateField('pdf', file);
  }, [updateField]);

  return {
    handleCheckboxChange,
    handleInputChange,
    handleFileChange,
  };
}

export type { EditData };
