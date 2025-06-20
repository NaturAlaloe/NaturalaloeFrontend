import { useMemo } from "react";

export function useProcedureFormSelects({
  formData,
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
}: any) {
  // Utilidad para extraer el valor del objeto seleccionado
  function getValueOrEmpty(newValue: any, key = "codigo") {
    if (newValue && !Array.isArray(newValue)) return newValue[key];
    return "";
  }

  // Filtrado de resultados basado en la búsqueda
  const resultadosBusqueda = useMemo(
    () =>
      (procedimientosActivos as any[]).filter(
        (item) =>
          (item.titulo?.toLowerCase().includes(busqueda.toLowerCase()) || "") ||
          (item.departamento && item.departamento.toLowerCase().includes(busqueda.toLowerCase())) ||
          (item.responsable && item.responsable.toLowerCase().includes(busqueda.toLowerCase()))
      ),
    [procedimientosActivos, busqueda]
  );

  // Seleccionados actuales
  const categoriaSeleccionada = categorias.find((c: any) => c.codigo === formData.categoria) || null;
  const departamentoSeleccionado = departments.find((d: any) => d.codigo === formData.departamento) || null;
  const responsableSeleccionado = responsibles.find((r: any) => r.id_responsable === Number(formData.responsable)) || null;
  const areaSeleccionada = areas.find((a: any) => a.codigo === formData.area) || null;

  // Handler para autocomplete/select
  const handleAutocompleteChange = (name: string, value: any, key = "codigo") => {
    handleChange({
      target: { name, value: getValueOrEmpty(value, key) },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Handler para cargar datos del procedimiento seleccionado
  const handleSelectProcedimiento = (item: any) => {
    setBusqueda(item.titulo);
    setShowSugerencias(false);
    handleChange({ target: { name: "titulo", value: item.titulo } } as any);
    // Normalización para comparar nombres ignorando mayúsculas/tildes/espacios
    const normalize = (str: string) => (str || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
    const areaObj = areas.find((a: any) => normalize(a.nombre || a.titulo) === normalize(item.area));
    const departamentoObj = departments.find((d: any) => normalize(d.nombre) === normalize(item.departamento));
    const categoriaObj = categorias.find((c: any) => normalize(c.nombre || c.nombre_categoria) === normalize(item.categoria));
    const responsableObj = (responsibles as any[]).find((r: any) => normalize(r.nombre_responsable) === normalize(item.responsable));
    if (areaObj) handleChange({ target: { name: "area", value: areaObj.codigo || areaObj.id_area } } as any);
    if (departamentoObj) handleChange({ target: { name: "departamento", value: departamentoObj.codigo || departamentoObj.id_departamento } } as any);
    if (categoriaObj) handleChange({ target: { name: "categoria", value: categoriaObj.codigo || categoriaObj.id_categoria } } as any);
    if (responsableObj) handleChange({ target: { name: "responsable", value: responsableObj.id_responsable } } as any);
    handleChange({ target: { name: "revision", value: item.revision } } as any);
    handleChange({ target: { name: "fechaCreacion", value: item.fecha_creacion?.slice(0, 10) || "" } } as any);
    handleChange({ target: { name: "fechaVigencia", value: item.fecha_vigencia?.slice(0, 10) || "" } } as any);
    setPdfFile && setPdfFile(null);
  };

  return {
    categoriaSeleccionada,
    departamentoSeleccionado,
    responsableSeleccionado,
    areaSeleccionada,
    handleAutocompleteChange,
    handleSelectProcedimiento,
    resultadosBusqueda,
  };
}
