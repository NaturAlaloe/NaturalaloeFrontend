import { useFacilitatorForm } from "../../hooks/capacitations/useAddFacilitator";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import SubmitButton from "../../components/formComponents/SubmitButton";

export default function FacilitatorTraining() {
  const {
    tipo,
    internoSeleccionado,
    nombre,
    apellido,
    identificacion,
    handleTipoChange,
    handleInternoChange,
    setNombre,
    setApellido,
    setIdentificacion,
    handleSubmit,
    facilitadoresInternos,
  } = useFacilitatorForm();

  return (
    <FormContainer title="Registro de Facilitador" onSubmit={handleSubmit}>
      <SelectField
        label="Tipo de Facilitador"
        name="tipo"
        value={tipo}
        onChange={handleTipoChange}
        options={[
          { nombre: "Interno", value: "Interno" },
          { nombre: "Externo", value: "Externo" },
        ]}
        required
        optionLabel="nombre"
        optionValue="value"
      />

      {tipo === "Interno" && (
        <div className="mt-4">
          <SelectField
            label="Facilitador Interno"
            name="interno"
            value={internoSeleccionado}
            onChange={handleInternoChange}
            options={facilitadoresInternos.map((f) => ({
              nombre: `${f.nombre} ${f.apellido}`,
              value: f.id,
            }))}
            required
            optionLabel="nombre"
            optionValue="value"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <InputField
          label="Identificación"
          name="identificacion"
          value={identificacion}
          onChange={(e) => setIdentificacion(e.target.value)}
          required
          readOnly={tipo === "Interno"}
          placeholder="Identificación"
        />

        <InputField
          label="Nombre"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          readOnly={tipo === "Interno"}
          placeholder="Nombre del facilitador"
        />

        <InputField
          label="Apellido"
          name="apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          readOnly={tipo === "Interno"}
          placeholder="Apellido del facilitador"
        />
      </div>

      <div className="text-center mt-8">
        <SubmitButton>{"Guardar"}</SubmitButton>
      </div>
    </FormContainer>
  );
}
