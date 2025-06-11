// userAssignment.tsx
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

 

  return (
    <FormContainer title="Asignación de Usuario" onSubmit={handleSubmit}>
<div className="grid grid-cols-1 gap-6">
        <SelectField
          label="Área"
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
          optionLabel="1"
          optionValue="2"
        />
        <SelectField
          label="Departamento"
          name="departamento"
          value={formData.departamento}
          onChange={handleChange}
          required
          optionLabel="5"
          optionValue="6"
        />
        <SelectField
          label="Puesto"
          name="puesto"
          value={formData.puesto}
          onChange={handleChange}

          required
          optionLabel="1"
          optionValue="2"
        />
        <SelectField
          label="Colaborador"
          name="colaborador"
          value={formData.colaborador}
          onChange={handleChange}
          required
          optionLabel="Juan"
          optionValue="Pedro"
        />
      </div>
    </FormContainer>
  );
}
