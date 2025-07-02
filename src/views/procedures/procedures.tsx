import "@fontsource/poppins/700.css";
import { useNewProcedureForm } from "../../hooks/procedureFormHooks/useNewProcedureForm";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import SelectAutocomplete from "../../components/formComponents/SelectAutocomplete";
import PdfInput from "../../components/formComponents/PdfInput";
import CustomToaster from "../../components/globalComponents/CustomToaster";

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
    handleAutocompleteChange,
    categoriaSeleccionada,
    departamentoSeleccionado,
    responsableSeleccionado,
    areaSeleccionada,
    handleSubmit,
    procedureCode,
    loadingConsecutivo,
  } = useNewProcedureForm();

  return (
    <>
      <CustomToaster />
      <FormContainer title="Registro de Procedimiento" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ingrese título"
            required
            maxLength={75}
          />
          <SelectAutocomplete
            label="Área"
            options={areas}
            optionLabel="nombre"
            optionValue="id_area"
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
            optionValue="id_departamento"
            value={departamentoSeleccionado}
            onChange={(newValue) =>
              handleAutocompleteChange("departamento", newValue, "id_departamento")
            }
            placeholder="Buscar o seleccionar departamento..."
            disabled={loadingDepartments}
          />
          <SelectAutocomplete
            label="Categoría"
            options={categorias}
            optionLabel="nombre"
            optionValue="id_categoria"
            value={categoriaSeleccionada}
            onChange={(newValue) =>
              handleAutocompleteChange("categoria", newValue, "id_categoria")
            }
            placeholder="Buscar o seleccionar categoría..."
            disabled={loadingCategorias}
          />
          <div>
            <InputField
              label="Código del Procedimiento"
              name="codigo"
              value={procedureCode}
              readOnly
              placeholder="Se generará automáticamente"
              required
              endAdornment={
                loadingConsecutivo ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 text-[#2AAC67]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  </span>
                ) : null
              }
            />
            {/* Aviso cuando está generando código */}
            {departamentoSeleccionado && categoriaSeleccionada && !procedureCode && !loadingConsecutivo && (
              <div className="mt-1 text-sm text-orange-600">
                ⚠️ Generando código...
              </div>
            )}
          </div>
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
            placeholder="1"
            type="number"
            min="1"
            step="1"
            pattern="^[0-9]+$"
            required
            maxLength={75}
          />
          <InputField
            label="Fecha de Creación"
            name="fechaCreacion"
            value={formData.fechaCreacion}
            onChange={handleChange}
            type="date"
            required
            maxLength={75}
          />
          <InputField
            label="Fecha de Vigencia"
            name="fechaVigencia"
            value={formData.fechaVigencia}
            onChange={handleChange}
            type="date"
            required
            maxLength={75}
          />
        </div>
        <div className="col-span-1 md:col-span-3 mt-2">
          <PdfInput
            pdfFile={pdfFile}
            onChange={handlePdfChange}
            onRemove={() => setPdfFile(null)}
            required={!pdfFile}
          />
        </div>
        
        <div className="text-center mt-8">
          <SubmitButton 
            width="" 
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Guardando..." : "Guardar Procedimiento"}
          </SubmitButton>
        </div>
      </FormContainer>
    </>
  );
}