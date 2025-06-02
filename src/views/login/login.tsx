// login.tsx
import "@fontsource/poppins";
import "@fontsource/poppins/700.css";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    contrasena: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí puedes enviar los datos al backend
    console.log("Datos ingresados:", formData);
  };

  return (
    <FormContainer title="Inicio de Sesión" onSubmit={handleSubmit}>
<div className="grid grid-cols-1 gap-6">
  
        <InputField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          type="text"
          required
        />
        <InputField
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          type="text"
          required
        />
        <InputField
          label="Contraseña"
          name="contrasena"
          value={formData.contrasena}
          onChange={handleChange}
          placeholder="********"
          type="password"
          required
        />
      </div>
    </FormContainer>
  );
}

