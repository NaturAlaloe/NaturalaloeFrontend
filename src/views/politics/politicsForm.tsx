import { usePoliticsForm } from "../../hooks/politics/usePoliticsForm";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import PoeSearchInput from "../../components/formComponents/PoeSearchInput";
import PuestosAutocomplete from "../../components/formComponents/JobsAutocomplete";
import SubmitButton from "../../components/formComponents/SubmitButton";

export default function PoliticsForm() {
  const {
    formData,
    setFormData,
    busqueda,
    setBusqueda,
    showSugerencias,
    setShowSugerencias,
    resultados,
    handleChange,
    handleSubmit,
    responsables,
    puestos,
    categorias,
  } = usePoliticsForm();

  return (
    <FormContainer title="Registro de Política" onSubmit={handleSubmit}>
      {/* Buscador de política existente */}
      <PoeSearchInput
        label="Buscar política existente"
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        showSugerencias={showSugerencias}
        setShowSugerencias={setShowSugerencias}
        resultados={resultados.map(pol => ({
          ...pol,
          titulo: pol.descripcion // agrega la propiedad 'titulo' usando 'descripcion'
        }))}
        onSelect={(pol: { codigo: string }) => setBusqueda(pol.codigo)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectField
          label="Categoría"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          options={categorias}
          required
          optionLabel="nombre"
          optionValue="nombre"
        />
        <InputField
          label="Código"
          name="codigo"
          value={formData.codigo}
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
        <PuestosAutocomplete
          puestos={puestos}
          value={formData.puestos}
          onChange={(newValue) =>
            setFormData((prev) => ({ ...prev, puestos: newValue }))
          }
        />
        <InputField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
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
