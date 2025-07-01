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
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
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
      const prefix = `${departamentoSeleccionado.codigo_departamento}-${categoriaSeleccionada.numero_categoria}`;
      fetchLastConsecutive(prefix);
    }
  }, [departamentoSeleccionado, categoriaSeleccionada, fetchLastConsecutive]);

  // Código POE modularizado
  const { codeApi, codeVisual } = useProcedureCode(
    departamentoSeleccionado ? departamentoSeleccionado.id_departamento : null,
    categoriaSeleccionada ? categoriaSeleccionada.id_categoria : null,
    lastConsecutive
  );

  // PDF
  const { pdfFile, setPdfFile, handlePdfChange } = usePdfInput();

  // Reset
  const limpiarFormulario = useFormReset(initialState, setFormData, setPdfFile);

  // Submit
  const { submitProcedure, loading: loadingSubmit } =
    useCreateProcedureSubmit();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validación completa de campos requeridos
    if (!pdfFile) {
      showCustomToast("Campo requerido", "Por favor, carga un archivo PDF", "error");
      return;
    }
    if (!formData.titulo.trim()) {
      showCustomToast("Campo requerido", "Por favor, ingresa el título del procedimiento", "error");
      return;
    }
    if (!formData.area || !areaSeleccionada) {
      showCustomToast("Campo requerido", "Por favor, selecciona un área", "error");
      return;
    }
    if (!formData.departamento || !departamentoSeleccionado) {
      showCustomToast("Campo requerido", "Por favor, selecciona un departamento", "error");
      return;
    }
    if (!formData.categoria || !categoriaSeleccionada) {
      showCustomToast("Campo requerido", "Por favor, selecciona una categoría", "error");
      return;
    }
    if (!formData.responsable || !responsableSeleccionado) {
      showCustomToast("Campo requerido", "Por favor, selecciona un responsable", "error");
      return;
    }
    if (!formData.revision || Number(formData.revision) < 1) {
      showCustomToast("Campo requerido", "Por favor, ingresa un número de revisión válido (mayor a 0)", "error");
      return;
    }
    if (!formData.fechaCreacion) {
      showCustomToast("Campo requerido", "Por favor, selecciona la fecha de creación", "error");
      return;
    }
    if (!formData.fechaVigencia) {
      showCustomToast("Campo requerido", "Por favor, selecciona la fecha de vigencia", "error");
      return;
    }
    if (!codeApi) {
      showCustomToast("Código no generado", "Espera a que se genere el código del procedimiento automáticamente", "error");
      return;
    }
    
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
    departments,
    loadingDepartments,
    areas,
    loadingAreas,
    categorias,
    loadingCategorias,
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
  };
}
