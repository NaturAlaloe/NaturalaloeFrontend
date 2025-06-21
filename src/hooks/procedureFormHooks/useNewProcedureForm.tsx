import { useState, type ChangeEvent } from "react";
import { useAreas } from "./useAreas";
import { useCreateProcedureSubmit } from "./useCreateProcedures";
import { useDepartments } from "./useDepartments";
import { useCategories } from "./useCategories";
import { useResponsibles } from "./useResponsibles";
import { useSelectField } from "./useSelectField";
import { useProcedureCode } from "./useProcedureCode";
import { usePdfInput } from "./usePdfInput";
import { useFormReset } from "./useFormReset";

interface FormData {
  titulo: string;
  area: string;
  departamento: string;
  categoria: string;
  responsable: string;
  revision: string;
  fechaCreacion: string;
  fechaVigencia: string;
}

export function useNewProcedureForm() {
  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    area: "",
    departamento: "",
    categoria: "",
    responsable: "",
    revision: "",
    fechaCreacion: "",
    fechaVigencia: "",
  });

  // Hooks de selects
  const { departments, loading: loadingDepartments } = useDepartments();
  const { areas, loading: loadingAreas } = useAreas();
  const { categories: categorias, loading: loadingCategorias } = useCategories();
  const { responsibles, loading: loadingResponsibles } = useResponsibles();

  // SelectFields
  const areaSeleccionada = useSelectField(areas, formData.area, "codigo");
  const departamentoSeleccionado = useSelectField(departments, formData.departamento, "codigo_departamento");
  const categoriaSeleccionada = useSelectField(categorias, formData.categoria, "numero_categoria");
  const responsableSeleccionado = useSelectField(responsibles, formData.responsable, "id_responsable");

  // Código POE
  const procedureCode = useProcedureCode(departamentoSeleccionado, categoriaSeleccionada);

  // PDF
  const { pdfFile, setPdfFile, handlePdfChange, removePdf } = usePdfInput();

  // Reset
  const limpiarFormulario = useFormReset({
    titulo: "",
    area: "",
    departamento: "",
    categoria: "",
    responsable: "",
    revision: "",
    fechaCreacion: "",
    fechaVigencia: "",
  }, setFormData, setPdfFile);

  // Handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function getValueOrEmpty(newValue: any, key = "codigo") {
    if (newValue && !Array.isArray(newValue)) return newValue[key];
    return "";
  }

  const handleAutocompleteChange = (name: string, value: any, key = "codigo") => {
    handleChange({
      target: { name, value: getValueOrEmpty(value, key) },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Submit
  const { submitProcedure, loading: loadingSubmit } = useCreateProcedureSubmit();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pdfFile) return;
    if (!formData.area) return;
    try {
      await submitProcedure({
        descripcion: formData.titulo,
        id_area: Number(formData.area),
        id_departamento: Number(formData.departamento),
        id_categoria: Number(formData.categoria),
        id_responsable: Number(formData.responsable),
        version: Number(formData.revision),
        fecha_creacion: formData.fechaCreacion,
        fecha_vigencia: formData.fechaVigencia,
        documento: pdfFile,
        codigo: procedureCode,
      });
      limpiarFormulario();
    } catch {
      // El error ya se muestra en el hook
    }
  };

  return {
    formData,
    handleChange,
    handlePdfChange,
    pdfFile,
    setPdfFile,
    removePdf,
    setFormData,
    departments,
    loadingDepartments,
    areas,
    loadingAreas,
    categorias,
    loadingCategorias,
    submitProcedure,
    loadingSubmit,
    responsibles,
    loadingResponsibles,
    handleAutocompleteChange,
    categoriaSeleccionada,
    departamentoSeleccionado,
    responsableSeleccionado,
    areaSeleccionada,
    handleSubmit,
    procedureCode,
    limpiarFormulario,
  };
}
