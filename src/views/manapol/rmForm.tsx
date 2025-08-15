import FormContainer from '../../components/formComponents/FormContainer';
import InputField from '../../components/formComponents/InputField';
import SelectAutocomplete from '../../components/formComponents/SelectAutocomplete';
import PdfInput from '../../components/formComponents/PdfInput';
import SubmitButton from '../../components/formComponents/SubmitButton';
import CustomToaster from '../../components/globalComponents/CustomToaster';
import { useCreateManapol } from '../../hooks/manapol/useCreateManapol';

const RmForm = () => {
  const {
    formData,
    handleChange,
    handleAutocompleteChange,
    handleSubmit,
    saving,
    // Datos auxiliares
    areas,
    departments,
    responsibles,
    loadingAreas,
    loadingDepartments,
    loadingResponsibles,
    // PDF
    pdfFile,
    handlePdfChange,
    removePdf,
    fileInputRef,
  } = useCreateManapol();

  return (
    <>
      <CustomToaster />
      <FormContainer
        title="Crear Nuevo Registro Manapol"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Código (solo lectura, preparado para futura implementación) */}
          <InputField
            label="Código"
            name="codigo"
            value={formData.codigo}
            readOnly
            disabled
            placeholder="Se generará automáticamente"
          />

          {/* Descripción */}
          <InputField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Ingrese la descripción del registro"
            required
            disabled={saving}
          />

          {/* Responsable */}
          <SelectAutocomplete
            label="Responsable"
            options={responsibles}
            optionLabel="nombre_responsable"
            optionValue="id_responsable"
            value={
              formData.id_responsable
                ? responsibles.find((resp: any) => resp.id_responsable === Number(formData.id_responsable)) || null
                : null
            }
            onChange={(selected) => handleAutocompleteChange("id_responsable", selected)}
            placeholder="Selecciona un responsable"
            disabled={loadingResponsibles || saving}
            fullWidth
          />

          {/* Área */}
          <SelectAutocomplete
            label="Área"
            options={areas}
            optionLabel="nombre"
            optionValue="id_area"
            value={
              formData.id_area
                ? areas.find(area => area.id_area === formData.id_area) || null
                : null
            }
            onChange={(selected) => handleAutocompleteChange("id_area", selected)}
            placeholder="Selecciona un área"
            disabled={loadingAreas || saving}
            fullWidth
          />

          {/* Departamento */}
          <SelectAutocomplete
            label="Departamento"
            options={departments}
            optionLabel="nombre"
            optionValue="id_departamento"
            value={
              formData.departamento
                ? departments.find(dept => dept.id_departamento === formData.departamento) || null
                : null
            }
            onChange={(selected) => handleAutocompleteChange("departamento", selected)}
            placeholder="Selecciona un departamento"
            disabled={loadingDepartments || saving}
            fullWidth
          />

          {/* Versión */}
          <InputField
            label="Versión"
            name="version"
            type="number"
            min="0"
            step="1"
            value={formData.version}
            onChange={handleChange}
            placeholder="0"
            required
            disabled={saving}
          />

          {/* Fecha de Creación */}
          <InputField
            label="Fecha de Creación"
            name="fecha_creacion"
            type="date"
            value={formData.fecha_creacion}
            onChange={handleChange}
            required
            disabled={saving}
          />

          {/* Fecha de Vigencia */}
          <InputField
            label="Fecha de Vigencia"
            name="fecha_vigencia"
            type="date"
            value={formData.fecha_vigencia}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        {/* Sección del PDF */}
        <div className="grid grid-cols-1 gap-6">
          <PdfInput
            label="Documento PDF"
            pdfFile={pdfFile}
            onChange={handlePdfChange}
            onRemove={removePdf}
            required
            fileInputRef={fileInputRef}
            helperText="Seleccione el archivo PDF del registro Manapol (obligatorio)"
          />
        </div>

        {/* Botón de envío */}
        <div className="text-center mt-8">
          <SubmitButton width="" loading={saving} disabled={saving}>
            {saving ? "Creando..." : "Guardar"}
          </SubmitButton>
        </div>
      </FormContainer>
    </>
  );
};

export default RmForm;