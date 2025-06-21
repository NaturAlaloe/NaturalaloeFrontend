import { usePoliticsForm } from "../../hooks/politics/usePoliticsForm";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import SelectField from "../../components/formComponents/SelectField";

export default function PoliticsForm() {
  const {
    formData,
    handleChange,
    handleSubmit,
    responsables,
  } = usePoliticsForm();

  return (
    <FormContainer title="Registro de Política" onSubmit={handleSubmit}>

   
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       
        <InputField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          pattern=""
        />
   
        <SelectField
          label="Responsable"
          name="responsable"
          value={formData.responsable}
          onChange={handleChange}
          options={responsables}
          required
          optionLabel="nombre"
          optionValue="nombre"
        />
         <InputField
          label="Codigo"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          required
          pattern=""
        />
      </div>
      <div className="text-center mt-8">
        <SubmitButton width="">{"Guardar"}</SubmitButton>
      </div>
    </FormContainer>
  );
}
