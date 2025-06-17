import "@fontsource/poppins/700.css";
import { useProcedureFormLogic } from "../../hooks/procedureFormHooks/useProcedureFormLogic";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import SelectAutocomplete from "../../components/formComponents/SelectAutocomplete";
import StyledCheckbox from "../../components/formComponents/StyledCheckbox";
import SearchAutocompleteInput from "../../components/formComponents/SearchAutocompleteInput";
import PdfInput from "../../components/formComponents/PdfInput";

export default function Procedures() {
  const {
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
    enVigencia,
    setEnVigencia,
    busqueda,
    setBusqueda,
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
    handleSubmit,
  } = useProcedureFormLogic();

  return (
    <FormContainer title="Registro de Procedimiento" onSubmit={handleSubmit}>
      <SearchAutocompleteInput
        label="Buscar procedimiento existente"
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        showSugerencias={showSugerencias}
        setShowSugerencias={setShowSugerencias}
        resultados={resultadosBusqueda}
        onSelect={(item) => {
          handleSelectProcedimiento(item);
          setPoeSeleccionado(item);
        }}
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
            handleAutocompleteChange("area", newValue, "codigo")
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
            handleAutocompleteChange("departamento", newValue, "codigo")
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
            handleAutocompleteChange("categoria", newValue, "codigo")
          }
          placeholder="Buscar o seleccionar categoría..."
          disabled={loadingCategorias}
        />
        <SelectAutocomplete
          label="Responsable"
          options={responsibles}
          optionLabel="nombre_responsable"
          optionValue="id_responsable"
          value={responsableSeleccionado}
          onChange={(newValue) =>
            handleAutocompleteChange("responsable", newValue, "id_responsable")
          }
          placeholder="Buscar o seleccionar responsable..."
          disabled={loadingResponsibles}
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
        <PdfInput
          pdfFile={pdfFile}
          onChange={handlePdfChange}
          onRemove={() => setPdfFile(null)}
          required={!pdfFile}
        />
        {/* Mostrar el checkbox solo si hay un POE seleccionado */}
        {poeSeleccionado && (
          <StyledCheckbox
            label="En vigencia"
            checked={enVigencia}
            onChange={setEnVigencia}
          />
        )}
      </div>
      <div className="text-center mt-8">
        <SubmitButton width="" disabled={loadingSubmit}>
          {poeSeleccionado
            ? "Actualizar"
            : loadingSubmit
            ? "Guardando..."
            : "Guardar"}
        </SubmitButton>
      </div>
    </FormContainer>
  );
}
