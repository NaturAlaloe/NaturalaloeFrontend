import { useAreas } from "./useAreas";
import { useDepartments } from "./useDepartments";
import { useCategories } from "./useCategories";
import { useResponsibles } from "./useResponsibles";
import { useSelectField } from "./useSelectField";
import { useLastConsecutive } from "./useLastConsecutive";
import { usePdfInput } from "./usePdfInput";
import { useFormReset } from "./useFormReset";
import { useCreateProcedureSubmit } from "./useCreateProcedures";
import { useProcedureCode } from "./useProcedureCode";
import { useProcedureFormState } from "./useProcedureFormState";
import { useProcedureFormHandlers } from "./useProcedureFormHandlers";
import { useEffect } from "react";

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
  // Estado y handlers del formulario
  const initialState: FormData = {
    titulo: "",
    area: "",
    departamento: "",
    categoria: "",
    responsable: "",
    revision: "",
    fechaCreacion: "",
    fechaVigencia: "",
  };

  const { formData, setFormData, handleChange } =
    useProcedureFormState(initialState);
  const { handleAutocompleteChange } = useProcedureFormHandlers(setFormData);

  // Hooks de selects
  const { departments, loading: loadingDepartments } = useDepartments();
  const { areas, loading: loadingAreas } = useAreas();
  const { categories: categorias, loading: loadingCategorias } =
    useCategories();
  const { responsibles, loading: loadingResponsibles } = useResponsibles();

  // SelectFields: buscan por ID
  const areaSeleccionada = useSelectField(areas, formData.area, "codigo");
  const departamentoSeleccionado = useSelectField(
    departments,
    formData.departamento,
    "id_departamento"
  );
  const categoriaSeleccionada = useSelectField(
    categorias,
    formData.categoria,
    "id_categoria"
  );
  const responsableSeleccionado = useSelectField(
    responsibles,
    formData.responsable,
    "id_responsable"
  );

  // Consecutivo
  const {
    lastConsecutive,
    loading: loadingConsecutivo,
    fetchLastConsecutive,
  } = useLastConsecutive();
  
  // Buscar consecutivo cuando cambian depto/cat
  useEffect(() => {
    if (departamentoSeleccionado && categoriaSeleccionada) {
      console.log("Departamento seleccionado:", departamentoSeleccionado);
      console.log("Categoría seleccionada:", categoriaSeleccionada);
      const prefix = `${departamentoSeleccionado.codigo_departamento}-${categoriaSeleccionada.numero_categoria}`;
      console.log("Prefijo construido:", prefix);
      fetchLastConsecutive(prefix);
    }
  }, [departamentoSeleccionado, categoriaSeleccionada, fetchLastConsecutive]);

  // Código POE modularizado
  const { codeApi, codeVisual } = useProcedureCode(
    departamentoSeleccionado,
    categoriaSeleccionada,
    lastConsecutive
  );

  // PDF
  const { pdfFile, setPdfFile, handlePdfChange, removePdf } = usePdfInput();

  // Reset
  const limpiarFormulario = useFormReset(initialState, setFormData, setPdfFile);

  // Submit
  const { submitProcedure, loading: loadingSubmit } =
    useCreateProcedureSubmit();
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
        codigo: codeApi, // Solo depto-categoria
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
    procedureCode: codeVisual,
    loadingConsecutivo,
    limpiarFormulario,
  };
}
