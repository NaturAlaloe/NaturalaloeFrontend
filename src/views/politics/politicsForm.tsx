import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import SelectAutocomplete from "../../components/formComponents/SelectAutocomplete";
import PdfInput from "../../components/formComponents/PdfInput";
import { usePolitics } from "../../hooks/politics/usePolitics";

export default function PoliticsForm() {
  const {
    formData,
    handleChange,
    handleSubmit,
    pdfFile,
    setPdfFile,
    handlePdfChange,
    responsables,
    loadingResponsables,
  } = usePolitics();

  return (
    <FormContainer title="Registro de Política" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Código"
          name="codigo"
          value={formData.codigo}
          onChange={() => { }}
          disabled
  
        />
        <InputField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Ingrese la descripción"
          required
        />

        <SelectAutocomplete
          label="Responsable"
          options={responsables}
          optionLabel="nombre_responsable"
          optionValue="id_responsable"
          
          value={
            responsables.find(r => r.id_responsable === Number(formData.id_responsable)) || null
          }
          onChange={(selected) => {
            // selected puede ser null o un objeto
            handleChange({
              target: {
                name: "id_responsable",
                value: selected && !Array.isArray(selected) ? selected.id_responsable : "",
              },
            });
          }}
          placeholder="Selecciona un responsable"
          disabled={loadingResponsables}
          fullWidth
          
        />
        <InputField
          label="Versión"
          name="version"
          type="number"
          value={formData.version}
          onChange={handleChange}
          placeholder="0"
          required
        />
        <InputField
          label="Fecha de Creación"
          name="fecha_creacion"
          value={formData.fecha_creacion}
          onChange={handleChange}
          type="date"
          required
        />
        <InputField
          label="Fecha de Vigencia"
          name="fecha_vigencia"
          value={formData.fecha_vigencia}
          onChange={handleChange}
          type="date"
          required
        />
     
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <PdfInput
          pdfFile={pdfFile}
          onChange={handlePdfChange}
          onRemove={() => setPdfFile(null)}
          required={!pdfFile}
        />
    
      </div>
      <div className="text-center mt-8">
        <SubmitButton width="">
          Guardar
        </SubmitButton>
      </div>
    </FormContainer>
  );
}