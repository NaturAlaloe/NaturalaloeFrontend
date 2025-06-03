// userAssignment.tsx
import "@fontsource/poppins";
import "@fontsource/poppins/700.css";
import FormContainer from "../../components/formComponents/FormContainer";
import SelectField from "../../components/formComponents/SelectField";
import { useState } from "react";

export default function UserAssignment() {
  const [formData, setFormData] = useState({
    area: "",
    departamento: "",
    puesto: "",
    colaborador: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  const areas = [
    { nombre: "Administración" },
    { nombre: "Finanzas" },
    { nombre: "Operaciones" },
  ];

  const departamentos = [
    { nombre: "Contabilidad" },
    { nombre: "Recursos Humanos" },
    { nombre: "Tecnología" },
  ];

  const puestos = [
    { nombre: "Gerente" },
    { nombre: "Analista" },
    { nombre: "Asistente" },
  ];

  const colaboradores = [
    { nombre: "Juan Pérez" },
    { nombre: "María Gómez" },
    { nombre: "Carlos Rodríguez" },
  ];

  return (
    <FormContainer title="Asignación de Usuario" onSubmit={handleSubmit}>
<div className="grid grid-cols-1 gap-6">
        <SelectField
          label="Área"
          name="area"
          value={formData.area}
          onChange={handleChange}
          options={areas}
          required
          optionLabel="1"
          optionValue="2"
        />
        <SelectField
          label="Departamento"
          name="departamento"
          value={formData.departamento}
          onChange={handleChange}
          options={departamentos}
          required
          optionLabel="5"
          optionValue="6"
        />
        <SelectField
          label="Puesto"
          name="puesto"
          value={formData.puesto}
          onChange={handleChange}
          options={puestos}
          required
          optionLabel="1"
          optionValue="2"
        />
        <SelectField
          label="Colaborador"
          name="colaborador"
          value={formData.colaborador}
          onChange={handleChange}
          options={colaboradores}
          required
          optionLabel="Juan"
          optionValue="Pedro"
        />
      </div>
    </FormContainer>
  );
}
