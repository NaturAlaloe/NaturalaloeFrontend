import { useFacilitatorForm } from "../../hooks/trainings/useAddFacilitator";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import SubmitButton from "../../components/formComponents/SubmitButton";

export default function FacilitatorTraining() {
  const {
    tipo,
    internoSeleccionado,
    cedula,
    nombre,
    apellido1,
    apellido2,
    handleTipoChange,
    handleInternoChange,
    setNombre,
    setApellido1,
    setApellido2,
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
              nombre: `${f.nombre} ${f.apellido1} ${f.apellido2}`,
              value: f.id_facilitador.toString(),
            }))}
            required
            optionLabel="nombre"
            optionValue="value"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {tipo === "Interno" && (
          <InputField
            label="Identificación"
            name="identificacion"
            value={cedula}
            onChange={(e) => setIdentificacion(e.target.value)}
            required
            readOnly
            placeholder="Identificación"
          />
        )}

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
          label="Primer Apellido"
          name="apellido1"
          value={apellido1}
          onChange={(e) => setApellido1(e.target.value)}
          required
          readOnly={tipo === "Interno"}
          placeholder="Primer Apellido"
        />

        <InputField
          label="Segundo Apellido"
          name="apellido2"
          value={apellido2}
          onChange={(e) => setApellido2(e.target.value)}
          required
          readOnly={tipo === "Interno"}
          placeholder="Segundo Apellido"
        />
      </div>

      <div className="text-center mt-8">
        <SubmitButton>Guardar</SubmitButton>
      </div>
    </FormContainer>
  );
}
