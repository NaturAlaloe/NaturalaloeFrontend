import "@fontsource/poppins/700.css";
import InputField from "../../components/formComponents/InputField";
import { useState } from "react";
import { motion } from "framer-motion";
import LogoNaturaloe from "../../assets/img/Logo_Naturaloe.png";
import { Link } from "react-router-dom";

export default function Login({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    correo: "",
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
    console.log("Datos ingresados:", formData);
    // Aquí iría tu lógica real de autenticación
    // Si es exitosa:
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eafbf2] to-[#d6f5e3] flex items-center justify-center px-4 py-6 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] px-15 py-8"
      >
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex flex-col items-start">
            <h2 className="text-4xl font-bold text-[#2AAC67] mb-1">¡Bienvenido!</h2>
            <p className="text-gray-500 text-base">Por favor, inicia sesión para continuar</p>
          </div>
          <img src={LogoNaturaloe} alt="Natural Aloe Logo" className="w-46 h-46 ml-6 drop-shadow-md" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Correo Electrónico"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            type="email"
            required
            pattern={undefined}
          />
          <InputField
            label="Contraseña"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="********"
            type="password"
            required
            pattern={undefined}
          />

          <button
            type="submit"
            className="w-full bg-[#2AAC67] text-white font-semibold text-lg py-3 rounded-full shadow-md hover:bg-[#24965c] transition duration-200"
          >
            Iniciar Sesión
          </button>

          <div className="text-center mt-2">
            <div className="text-center mt-2">
              <Link to="/login/recoverPassword" className="text-sm text-[#2AAC67] hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
