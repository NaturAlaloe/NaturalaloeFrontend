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

  const areas = [
    { codigo: "1", nombre: "Administración" },
    { codigo: "2", nombre: "Finanzas" },
    { codigo: "3", nombre: "Operaciones" },
  ];

  const departamentos = [
    { codigo: "5", nombre: "Contabilidad" },
    { codigo: "6", nombre: "Recursos Humanos" },
    { codigo: "7", nombre: "Tecnología" },
  ];

  const puestos = [
    { codigo: "10", nombre: "Gerente" },
    { codigo: "11", nombre: "Analista" },
    { codigo: "12", nombre: "Asistente" },
  ];

  const colaboradores = [
    { codigo: "20", nombre: "Juan Pérez" },
    { codigo: "21", nombre: "María Gómez" },
    { codigo: "22", nombre: "Carlos Rodríguez" },
  ];

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
