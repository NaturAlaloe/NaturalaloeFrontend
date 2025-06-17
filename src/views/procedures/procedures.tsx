import { useState } from "react";
import "@fontsource/poppins/700.css";
import { useProceduresForm } from "../../hooks/procedureFormHooks/useFormUtilities";
import { useAreas } from "../../hooks/procedureFormHooks/useAreas";
import { useCreateProcedureSubmit } from "../../hooks/procedureFormHooks/useCreateProcedures";
import { useDepartments } from "../../hooks/procedureFormHooks/useDepartments";
import { useCategories } from "../../hooks/procedureFormHooks/useCategories";
import { useSearchProcedures } from "../../hooks/procedureFormHooks/useSearchProcedures";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import SelectAutocomplete from "../../components/formComponents/SelectAutocomplete";
import StyledCheckbox from "../../components/formComponents/StyledCheckbox";
import SearchAutocompleteInput from "../../components/formComponents/SearchAutocompleteInput";

export default function Procedures() {
  const {
    formData,
    handleChange,
    handlePdfChange,
    pdfFile,
    setPdfFile,
    responsables,
  } = useProceduresForm();

  const { departments, loading: loadingDepartments } = useDepartments();
  const { areas, loading: loadingAreas } = useAreas();
  const { categories: categorias, loading: loadingCategorias } = useCategories();
  const { submitProcedure, loading: loadingSubmit } = useCreateProcedureSubmit();
  const { procedures: procedimientosActivos } = useSearchProcedures();

  // Estado para el checkbox de vigencia
  const [enVigencia, setEnVigencia] = useState(true);
  // Estado para la barra de búsqueda de procedimientos (ejemplo de uso genérico)
  const [busqueda, setBusqueda] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);

  // Utilidad para extraer el valor del objeto seleccionado
  function getValueOrEmpty(newValue: any, key = "codigo") {
    if (newValue && !Array.isArray(newValue)) return newValue[key];
    return "";
  }

  // Filtrado de resultados basado en la búsqueda
  const resultadosBusqueda = (procedimientosActivos as any[]).filter(
    (item) =>
      (item.titulo?.toLowerCase().includes(busqueda.toLowerCase()) || "") ||
      (item.departamento && item.departamento.toLowerCase().includes(busqueda.toLowerCase())) ||
      (item.responsable && item.responsable.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Seleccionados actuales
  const categoriaSeleccionada = categorias.find((c) => c.codigo === formData.categoria) || null;
  const departamentoSeleccionado = departments.find((d) => d.codigo === formData.departamento) || null;
  const responsableSeleccionado = responsables.map((r) => ({ nombre: r })).find((r) => r.nombre === formData.responsable) || null;
  const areaSeleccionada = areas.find((a) => a.codigo === formData.area) || null;

  // Handler para autocomplete/select
  const handleAutocompleteChange = (name: string, value: any) => {
    handleChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Handler para cargar datos del procedimiento seleccionado
  const handleSelectProcedimiento = (item: any) => {
    setBusqueda(item.titulo);
    setShowSugerencias(false);
    handleChange({ target: { name: "titulo", value: item.titulo } } as any);
    // Buscar y seleccionar área, departamento, categoría y responsable por nombre
    const areaObj = areas.find((a) => a.nombre === item.area || a.nombre === item.departamento || a.nombre === item.departamento_area);
    const departamentoObj = departments.find((d) => d.nombre === item.departamento);
    const categoriaObj = categorias.find((c) => c.nombre === item.categoria);
    const responsableObj = responsables.find((r) => r === item.responsable);
    if (areaObj) handleChange({ target: { name: "area", value: areaObj.codigo } } as any);
    if (departamentoObj) handleChange({ target: { name: "departamento", value: departamentoObj.codigo } } as any);
    if (categoriaObj) handleChange({ target: { name: "categoria", value: categoriaObj.codigo } } as any);
    if (responsableObj) handleChange({ target: { name: "responsable", value: responsableObj } } as any);
    handleChange({ target: { name: "revision", value: item.revision } } as any);
    handleChange({ target: { name: "fechaVigencia", value: item.fecha_vigencia?.slice(0, 10) } } as any);
  };

  // Submit handler para POST con multipart/form-data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pdfFile) {
      console.log("Debes adjuntar un PDF");
      return;
    }
    if (!formData.area) {
      console.log("Debes seleccionar un área");
      return;
    }
    try {
      const response = await submitProcedure({
        descripcion: formData.titulo,
        id_area: Number(formData.area),
        id_departamento: Number(formData.departamento),
        id_categoria: Number(formData.categoria),
        id_responsable: 1, // TODO: reemplazar por el id real del responsable cuando esté disponible
        version: Number(formData.revision),
        fecha_creacion: formData.fechaCreacion,
        fecha_vigencia: formData.fechaVigencia,
        documento: pdfFile,
      });
      // Mostrar el código generado si está disponible
      const codigoGenerado = response?.data?.[0]?.[0]?.codigo_generado;
      if (codigoGenerado) {
        console.log(`Procedimiento creado. Código generado: ${codigoGenerado}`);
      }
      // Opcional: limpiar formulario aquí
    } catch {
      // El error ya se muestra en el hook
    }
  };

  return (
    <FormContainer title="Registro de Procedimiento" onSubmit={handleSubmit}>
      {/* Barra de búsqueda reutilizable para procedimientos o cualquier entidad */}
      <SearchAutocompleteInput
        label="Buscar procedimiento existente"
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        showSugerencias={showSugerencias}
        setShowSugerencias={setShowSugerencias}
        resultados={resultadosBusqueda}
        onSelect={handleSelectProcedimiento}
        optionLabelKeys={["titulo", "departamento", "responsable"]}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Título"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Ingrese título"
          required
        />
        <SelectAutocomplete
          label="Área"
          options={areas}
          optionLabel="nombre"
          optionValue="codigo"
          value={areaSeleccionada}
          onChange={(newValue) =>
            handleAutocompleteChange("area", getValueOrEmpty(newValue, "codigo"))
          }
          placeholder="Buscar o seleccionar área..."
          disabled={loadingAreas}
        />
        <SelectAutocomplete
          label="Departamento"
          options={departments}
          optionLabel="nombre"
          optionValue="codigo"
          value={departamentoSeleccionado}
          onChange={(newValue) =>
            handleAutocompleteChange("departamento", getValueOrEmpty(newValue, "codigo"))
          }
          placeholder="Buscar o seleccionar departamento..."
          disabled={loadingDepartments}
        />
        <SelectAutocomplete
          label="Categoría"
          options={categorias}
          optionLabel="nombre"
          optionValue="codigo"
          value={categoriaSeleccionada}
          onChange={(newValue) =>
            handleAutocompleteChange("categoria", getValueOrEmpty(newValue, "codigo"))
          }
          placeholder="Buscar o seleccionar categoría..."
          disabled={loadingCategorias}
        />
        <SelectAutocomplete
          label="Responsable"
          options={responsables.map((r) => ({ nombre: r }))}
          optionLabel="nombre"
          optionValue="nombre"
          value={responsableSeleccionado}
          onChange={(newValue) =>
            handleAutocompleteChange("responsable", getValueOrEmpty(newValue, "nombre"))
          }
          placeholder="Buscar o seleccionar responsable..."
        />
        <InputField
          label="Revisión"
          name="revision"
          value={formData.revision}
          onChange={handleChange}
          placeholder="1.0"
          pattern="^\d+(\.\d+)?$"
          required
        />
        <InputField
          label="Fecha de Creación"
          name="fechaCreacion"
          value={formData.fechaCreacion}
          onChange={handleChange}
          type="date"
          required
        />
        <InputField
          label="Fecha de Vigencia"
          name="fechaVigencia"
          value={formData.fechaVigencia}
          onChange={handleChange}
          type="date"
          required
        />
        <div>
          <InputField
            label="Seleccionar PDF"
            name="pdfFile"
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            required={!pdfFile}
          />
          {pdfFile && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-[#2AAC67] font-medium">
                Archivo seleccionado: {pdfFile.name}
              </p>
              <button
                type="button"
                className="text-red-600 underline text-xs"
                onClick={() => setPdfFile(null)}
              >
                Quitar
              </button>
            </div>
          )}
        </div>
        <StyledCheckbox
          label="En vigencia"
          checked={enVigencia}
          onChange={setEnVigencia}
        />
      </div>
      <div className="text-center mt-8">
        <SubmitButton width="" disabled={loadingSubmit}>
          {loadingSubmit ? "Guardando..." : "Guardar"}
        </SubmitButton>
      </div>
    </FormContainer>
  );
}