import { useState } from "react";
import { useProceduresForm } from "./useFormUtilities";
import { useAreas } from "./useAreas";
import { useCreateProcedureSubmit } from "./useCreateProcedures";
import { useDepartments } from "./useDepartments";
import { useCategories } from "./useCategories";
import { useSearchProcedures } from "./useSearchProcedures";
import { useResponsibles } from "./useResponsibles";
import { useProcedureFormSelects } from "./useProcedureFormSelects";

export function useProcedureFormLogic() {
  const {
    formData,
    handleChange,
    handlePdfChange,
    pdfFile,
    setPdfFile,
    setFormData,
  } = useProceduresForm();

  const { departments, loading: loadingDepartments } = useDepartments();
  const { areas, loading: loadingAreas } = useAreas();
  const { categories: categorias, loading: loadingCategorias } = useCategories();
  const { submitProcedure, loading: loadingSubmit } = useCreateProcedureSubmit();
  const { procedures: procedimientosActivos } = useSearchProcedures();
  const { responsibles, loading: loadingResponsibles } = useResponsibles();

  const [enVigencia, setEnVigencia] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [poeSeleccionado, setPoeSeleccionado] = useState<any>(null);

  const {
    categoriaSeleccionada,
    departamentoSeleccionado,
    responsableSeleccionado,
    areaSeleccionada,
    handleAutocompleteChange,
    handleSelectProcedimiento,
    resultadosBusqueda,
  } = useProcedureFormSelects({
    formData,
    setFormData,
    areas,
    departments,
    categorias,
    responsibles,
    procedimientosActivos,
    busqueda,
    setBusqueda,
    setShowSugerencias,
    handleChange,
    setPdfFile,
    setPoeSeleccionado,
  });

  const limpiarFormulario = () => {
    setFormData({
      titulo: "",
      area: "",
      departamento: "",
      categoria: "",
      responsable: "",
      revision: "",
      fechaCreacion: "",
      fechaVigencia: "",
    });
    setPdfFile(null);
    setPoeSeleccionado(null);
    setBusqueda("");
    setShowSugerencias(false);
    setEnVigencia(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pdfFile) return;
    if (!formData.area) return;
    try {
      if (poeSeleccionado) {
        // TODO: lógica de actualización (PUT/PATCH)
        alert("Actualizar procedimiento: " + poeSeleccionado.titulo);
      } else {
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
        });
      }
      limpiarFormulario();
    } catch {
      // El error ya se muestra en el hook
    }
  };

  const handleBusquedaChange = (value: string | ((prev: string) => string)) => {
    if (typeof value === "string") {
      setBusqueda(value);
      if (!value) {
        limpiarFormulario();
      }
    } else {
      setBusqueda((prev) => {
        const newValue = value(prev);
        if (!newValue) limpiarFormulario();
        return newValue;
      });
    }
  };

  return {
    formData,
    handleChange,
    handlePdfChange,
    pdfFile,
    setPdfFile,
    setFormData,
    departments,
    loadingDepartments,
    areas,
    loadingAreas,
    categorias,
    loadingCategorias,
    submitProcedure,
    loadingSubmit,
    procedimientosActivos,
    responsibles,
    loadingResponsibles,
    enVigencia,
    setEnVigencia,
    busqueda,
    setBusqueda: handleBusquedaChange,
    showSugerencias,
    setShowSugerencias,
    poeSeleccionado,
    setPoeSeleccionado,
    categoriaSeleccionada,
    departamentoSeleccionado,
    responsableSeleccionado,
    areaSeleccionada,
    handleAutocompleteChange,
    handleSelectProcedimiento,
    resultadosBusqueda,
    limpiarFormulario,
    handleSubmit,
  };
}
