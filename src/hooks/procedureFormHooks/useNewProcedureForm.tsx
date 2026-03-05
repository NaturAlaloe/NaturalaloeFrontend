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
import { useEffect, useState, useCallback } from "react";
import { getActiveProcedures } from "../../services/procedures/procedureService";

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
  const areaSeleccionada = useSelectField(areas, formData.area, "id_area");
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
  const { codeVisual } = useProcedureCode(
    departamentoSeleccionado,
    categoriaSeleccionada,
    lastConsecutive
  );

  // Estado para código editable manualmente
  const [codigoOverride, setCodigoOverride] = useState("");
  const [isManualEdit, setIsManualEdit] = useState(false);

  // Regex formato: 3 dígitos - 2 dígitos - 3 dígitos (ej: 001-01-001)
  const CODE_REGEX = /^\d{3}-\d{2}-\d{3}$/;

  // Valor mostrado: si el usuario no ha editado, se usa el auto-generado directamente
  const codigoDisplay = isManualEdit ? codigoOverride : codeVisual;

  const handleCodigoChange = useCallback((value: string) => {
    setIsManualEdit(true);
    setCodigoOverride(value);
  }, []);

  // PDF
  const { pdfFile, setPdfFile, handlePdfChange, resetPdfInput, fileInputRef } =
    usePdfInput();

  // Reset
  const _limpiarBase = useFormReset(initialState, setFormData, resetPdfInput);
  const limpiarFormulario = useCallback(() => {
    _limpiarBase();
    setIsManualEdit(false);
    setCodigoOverride("");
  }, [_limpiarBase]);

  // Submit
  const { submitProcedure, loading: loadingSubmit } =
    useCreateProcedureSubmit();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación completa de campos requeridos
    if (!pdfFile) {
      showCustomToast(
        "Campo requerido",
        "Por favor, carga un archivo PDF",
        "error"
      );
      return;
    }
    if (!formData.titulo.trim()) {
      showCustomToast(
        "Campo requerido",
        "Por favor, ingresa el título del procedimiento",
        "error"
      );
      return;
    }
    if (!formData.area || !areaSeleccionada) {
      showCustomToast(
        "Campo requerido",
        "Por favor, selecciona un área",
        "error"
      );
      return;
    }
    if (!formData.departamento || !departamentoSeleccionado) {
      showCustomToast(
        "Campo requerido",
        "Por favor, selecciona un departamento",
        "error"
      );
      return;
    }
    if (!formData.categoria || !categoriaSeleccionada) {
      showCustomToast(
        "Campo requerido",
        "Por favor, selecciona una categoría",
        "error"
      );
      return;
    }
    if (!formData.responsable || !responsableSeleccionado) {
      showCustomToast(
        "Campo requerido",
        "Por favor, selecciona un responsable",
        "error"
      );
      return;
    }

    if (!formData.fechaCreacion) {
      showCustomToast(
        "Campo requerido",
        "Por favor, selecciona la fecha de creación",
        "error"
      );
      return;
    }
    if (!formData.fechaVigencia) {
      showCustomToast(
        "Campo requerido",
        "Por favor, selecciona la fecha de vigencia",
        "error"
      );
      return;
    }
    if (!codigoDisplay.trim()) {
      showCustomToast(
        "Código requerido",
        "Por favor, ingresa o espera a que se genere el código del procedimiento",
        "error"
      );
      return;
    }
    if (!CODE_REGEX.test(codigoDisplay)) {
      showCustomToast(
        "Código inválido",
        "El código debe seguir la estructura: 000-00-000",
        "error"
      );
      return;
    }

    // Verificar que el código no exista en los procedimientos activos
    try {
      const procedures = await getActiveProcedures();
      const exists = procedures.some(
        (p) => p.codigo?.toLowerCase() === codigoDisplay.toLowerCase()
      );
      if (exists) {
        showCustomToast(
          "Código duplicado",
          "Este código ya existe en los procedimientos activos.",
          "error"
        );
        return;
      }
    } catch {
      showCustomToast(
        "Error de verificación",
        "No se pudo verificar si el código ya existe. Intenta nuevamente.",
        "error"
      );
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
        codigo: codigoDisplay,
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
    fileInputRef,
    codigoDisplay,
    handleCodigoChange,
  };
}
